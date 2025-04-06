import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronRight, ChevronLeft, Loader2, Plus, Check, Music } from 'lucide-react';
import { userApi, UserData, ProfessionalRole } from '../../utils/api';
import { useUser } from '../../hooks/use-user';
import { Mixpanel } from '../../utils/mixpanelService';
import Portal from '../ui/portal';

interface OnboardingDialogProps {
    userId: string;
}

type FormField = 'role' | 'roleOther' | 'experience' | 'genre' | 'genreOther' | 'interest';

interface Step {
    type: 'welcome' | 'question';
    title: string;
    subtitle: string;
    field?: FormField;
    options?: string[];
    multiSelect?: boolean;
    maxSelections?: number;
}

interface RoleWithLevel {
    role: string;
    level: string;
    isOther?: boolean;
    order?: number; // Order is used for numbered selection UI
}

interface FormData {
    roles: RoleWithLevel[];
    roleOther: string;
    experience: string;
    genre: string[];
    genreOther: string;
    interest: string[];
}

const OnboardingDialog = ({ userId }: OnboardingDialogProps) => {
    const { isOnboarded, setOnboardingComplete } = useUser();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        roles: [],
        roleOther: '',
        experience: '',
        genre: [],
        genreOther: '',
        interest: [],
    });

    // Track Onboarding Start event when component mounts
    useEffect(() => {
        if (!isOnboarded) {
            Mixpanel.track(userId, 'Onboarding Start', {
                timestamp: new Date().toISOString(),
            });
        }
    }, [userId, isOnboarded]);

    const steps: Step[] = [
        {
            type: 'question',
            title: 'Welcome to HitCraft',
            subtitle: "Let's start your journey in creating amazing music together!",
            field: 'role',
            options: ['Music Producer / Arranger', 'Songwriter', 'Composer', 'Other'],
            multiSelect: true,
            maxSelections: 3,
        },
        {
            type: 'question',
            title: "What's your level of experience in Music Creation?",
            subtitle: 'Select the option that best describes you',
            field: 'experience',
            options: ['Beginner', 'Intermediate', 'Professional'],
            multiSelect: false,
        },
        {
            type: 'question',
            title: 'What style of music do you mostly create?',
            subtitle: 'Select all that apply',
            field: 'genre',
            options: ['Pop', 'Hip-Hop or R&B', 'Electronic or Dance', 'Rock', 'Other'],
            multiSelect: true,
        },
        {
            type: 'question',
            title: 'How can HitCraft support your music creation?',
            subtitle: 'Select up to 3 options',
            field: 'interest',
            options: [
                'Song Creation',
                'Music Production',
                'Career Growth',
                'Industry Knowledge',
                'Release Strategy',
                'Business Help',
                'Creative Inspiration',
                'DAW Mastery',
                'Marketing Help',
                'Track Feedback',
            ],
            multiSelect: true,
            maxSelections: 3,
        },
    ];

    // Process question data before sending to API
    const getCurrentQuestionData = (field: FormField, formData: FormData): Partial<UserData> => {
        const userData: Partial<UserData> = {
            userAttributes: {
                professionalRoles: [],
                genres: [],
                mostInterestedIn: [],
            },
        };

        switch (field) {
            case 'role':
                userData.userAttributes!.professionalRoles = formData.roles
                    .map((roleData): ProfessionalRole | null => {
                        if (roleData.isOther && !formData.roleOther) return null;
                        return {
                            description: roleData.isOther ? formData.roleOther : roleData.role,
                            level: formData.experience || 'Intermediate', // Default to Intermediate if no experience selected
                        };
                    })
                    .filter((role): role is ProfessionalRole => role !== null);
                break;

            case 'experience':
                // Instead of storing the experience level separately, update all roles
                if (formData.roles.length > 0) {
                    userData.userAttributes!.professionalRoles = formData.roles
                        .map((roleData): ProfessionalRole | null => {
                            if (roleData.isOther && !formData.roleOther) return null;
                            return {
                                description: roleData.isOther ? formData.roleOther : roleData.role,
                                level: formData.experience,
                            };
                        })
                        .filter((role): role is ProfessionalRole => role !== null);
                }
                break;

            case 'genre':
                userData.userAttributes!.genres = [
                    ...formData.genre.filter((genre) => genre !== 'Other'),
                    ...(formData.genre.includes('Other') && formData.genreOther
                        ? [formData.genreOther]
                        : []),
                ];
                break;

            case 'interest':
                userData.userAttributes!.mostInterestedIn = formData.interest;
                break;
        }

        // Ensure we're returning a structure that matches UpdateUserProfileRequest
        return {
            userAttributes: {
                professionalRoles: userData.userAttributes?.professionalRoles || [],
                genres: userData.userAttributes?.genres || [],
                mostInterestedIn: userData.userAttributes?.mostInterestedIn || [],
            },
        };
    };

    // Handle toggle for role selection with ordering
    const handleRoleToggle = (role: string, checked: boolean) => {
        setFormData((prev) => {
            if (checked) {
                // Check if we're at the max selections for roles
                if (prev.roles.length >= 3) {
                    return prev; // Don't add more if we've reached the limit
                }

                // Get the next order number
                const nextOrder = prev.roles.length + 1;

                return {
                    ...prev,
                    roles: [
                        ...prev.roles,
                        {
                            role,
                            level: 'Intermediate',
                            isOther: role === 'Other',
                            order: nextOrder,
                        },
                    ],
                };
            } else {
                // When removing a role, we need to reorder all roles
                const removedRoleOrder = prev.roles.find((r) => r.role === role)?.order;
                const filteredRoles = prev.roles.filter((r) => r.role !== role);

                // Recalculate orders for remaining roles
                const reorderedRoles = filteredRoles.map((r) => {
                    if (removedRoleOrder && r.order && r.order > removedRoleOrder) {
                        return { ...r, order: r.order - 1 };
                    }
                    return r;
                });

                return {
                    ...prev,
                    roles: reorderedRoles,
                    ...(role === 'Other' && { roleOther: '' }),
                };
            }
        });
    };

    // Handle input changes for all form fields
    const handleInputChange = (field: FormField, value: string, checked: boolean) => {
        if (field === 'role') {
            handleRoleToggle(value, checked);
            return;
        }

        if (field === 'experience') {
            setFormData((prev) => ({
                ...prev,
                experience: value,
            }));
            return;
        }

        setFormData((prev) => {
            if (!steps.find((s) => s.field === field)?.multiSelect) {
                return { ...prev, [field]: checked ? [value] : [] };
            }

            const currentValues = prev[field as 'genre' | 'interest'];
            let updatedValues = [...currentValues];
            const currentStep = steps.find((s) => s.field === field);
            const maxSelections = currentStep?.maxSelections || Infinity;

            if (checked) {
                if (!updatedValues.includes(value)) {
                    // Check if we're at the max selections for interests
                    if (field === 'interest' && updatedValues.length >= maxSelections) {
                        return prev; // Don't add more if we've reached the limit
                    }
                    updatedValues.push(value);
                }
            } else {
                updatedValues = updatedValues.filter((v) => v !== value);
                if (field === 'genre' && value === 'Other') {
                    return { ...prev, [field]: updatedValues, genreOther: '' };
                }
            }

            return { ...prev, [field]: updatedValues };
        });
    };

    // Validate current step before proceeding
    const isStepValid = () => {
        const currentStep = steps[currentStepIndex];
        if (currentStep.type === 'welcome') return true;

        const currentField = currentStep.field;
        if (!currentField) return true;

        switch (currentField) {
            case 'role':
                if (formData.roles.length === 0) return false;
                if (formData.roles.some((r) => r.isOther) && !formData.roleOther) return false;
                return true;
            case 'experience':
                return formData.experience !== '';
            case 'genre':
                if (formData.genre.length === 0) return false;
                if (formData.genre.includes('Other') && !formData.genreOther) return false;
                return true;
            case 'interest':
                return formData.interest.length > 0;
            default:
                return false;
        }
    };

    // Handle next button clicks and API updates
    const handleNext = async () => {
        if (!isStepValid()) return;

        const currentStep = steps[currentStepIndex];
        const isLastStep = currentStepIndex === steps.length - 1;

        Mixpanel.track(userId, 'Onboarding Next Step', {
            currentStepIndex,
            nextStepIndex: currentStepIndex + 1,
            stepType: currentStep.type,
            stepTitle: currentStep.title,
            isLastStep,
            isValid: isStepValid(),
        });

        setIsUpdating(true);
        try {
            // If we're on the last step, we run the complete process
            // This will send all data as one comprehensive update
            if (isLastStep) {
                await handleComplete();
                return;
            }

            // For non-final steps, update data incrementally as before
            if (currentStep.field) {
                const userData = getCurrentQuestionData(currentStep.field, formData);
                if (Object.keys(userData).length > 0 && userData.userAttributes) {
                    await userApi.update(userData);
                }
            }

            // Move to the next step
            setCurrentStepIndex((prev) => prev + 1);
        } catch (error) {
            console.error('Failed to update user data:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle back button clicks
    const handleBack = () => {
        const currentStep = steps[currentStepIndex];

        Mixpanel.track(userId, 'Onboarding Back Step', {
            currentStepIndex,
            previousStepIndex: currentStepIndex - 1,
            stepType: currentStep.type,
            stepTitle: currentStep.title,
        });

        setCurrentStepIndex((prev) => prev - 1);
    };

    // Complete onboarding process with one comprehensive API call for data
    const handleComplete = async () => {
        try {
            // Process roles to include custom "other" values
            const processedRoles = formData.roles.map((role) => {
                if (role.isOther && formData.roleOther) {
                    return {
                        ...role,
                        role: formData.roleOther, // Replace "Other" with the actual custom value
                    };
                }
                return role;
            });

            // Process genres to include custom "other" value
            const processedGenres = [...formData.genre];
            if (formData.genre.includes('Other') && formData.genreOther) {
                // Remove the generic "Other" option and add the specific value
                const otherIndex = processedGenres.indexOf('Other');
                if (otherIndex !== -1) {
                    processedGenres.splice(otherIndex, 1, formData.genreOther);
                }
            }

            // Create a flag to track if we need to update user data
            let needsDataUpdate = false;

            // Step 1: Create the final comprehensive user data only if we have real content
            const finalUserData: Partial<UserData> = {
                userAttributes: {
                    professionalRoles: processedRoles.map((role) => ({
                        description: role.role,
                        level: role.level || formData.experience || 'Intermediate',
                    })),
                    genres: processedGenres,
                    mostInterestedIn: formData.interest,
                },
            };

            // Check if the final data has any actual content to avoid empty requests
            const professionalRoles = finalUserData.userAttributes?.professionalRoles || [];
            const genres = finalUserData.userAttributes?.genres || [];
            const interests = finalUserData.userAttributes?.mostInterestedIn || [];

            const hasRoles = professionalRoles.length > 0;
            const hasGenres = genres.length > 0;
            const hasInterests = interests.length > 0;

            // Only send a user data update if we have actual data to update
            if (hasRoles || hasGenres || hasInterests) {
                await userApi.update(finalUserData);
                needsDataUpdate = true;
            } else {
                // No data to update, continue with onboarding completion
            }

            // Step 2: Mark onboarding as complete with a single API call
            await userApi.setOnboardingStatus();

            // Step 3: Update Mixpanel analytics before page refresh (no server impact)
            Mixpanel.track(userId, 'Onboarding Completed');
            Mixpanel.set({
                roles: professionalRoles.map((role) => ({
                    role: role.description,
                    level: role.level,
                })),
                genres: genres,
                interests: interests,
            });

            // Show success message before refreshing
            setShowSuccessMessage(true);

            // Add a delay before refresh to show success message
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            console.error('Failed to complete onboarding:', error);
        } finally {
            // Make sure to reset updating state
            setIsUpdating(false);
        }
    };

    if (isOnboarded === undefined || isOnboarded) return null;

    const currentStep = steps[currentStepIndex];
    // Show "Other" input field when relevant option is selected
    const showOtherInput =
        currentStep.type === 'question' &&
        ((currentStep.field === 'role' && formData.roles.some((r) => r.isOther)) ||
            (currentStep.field === 'genre' && formData.genre.includes('Other')));

    // The dialog content - now wrapped in Portal component
    const dialogContent = (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-2 sm:p-4 z-[100] overflow-y-auto">
            <AnimatePresence mode="wait">
                {showSuccessMessage ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-background-tertiary rounded-3xl shadow-2xl w-full sm:w-[500px] mx-auto my-2 sm:my-4 border border-border-secondary dark:border-border-hover flex flex-col overflow-hidden"
                    >
                        <div className="p-6 flex flex-col items-center text-center">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6"
                            >
                                <Music className="w-10 h-10 text-accent" />
                            </motion.div>

                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl font-semibold text-accent mb-2"
                            >
                                Welcome to HitCraft!
                            </motion.h2>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-text-secondary font-primary text-lg mb-6"
                            >
                                Your profile is all set up and ready to go.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5, duration: 2.5 }}
                            className="h-1 bg-accent origin-left"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="dialog"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`bg-background-tertiary rounded-3xl shadow-2xl w-full sm:w-[550px] ${
                            currentStepIndex === 0
                                ? 'max-h-fit h-auto sm:h-auto'
                                : 'h-[65vh] sm:h-[600px]'
                        } mx-auto my-2 sm:my-4 border border-border-secondary dark:border-border-hover flex flex-col`}
                    >
                        {/* Header section with title and subtitle - only shown on first step */}
                        {currentStepIndex === 0 && (
                            <div className="p-6 border-b border-border-secondary dark:border-border-hover">
                                <div className="space-y-5">
                                    <h2 className="text-3xl font-semibold text-center text-accent">
                                        {currentStep.title}
                                    </h2>
                                    <p className="text-center text-text-secondary font-primary text-md">
                                        {currentStep.subtitle}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Content section */}
                        <div
                            className={`overflow-y-auto flex-grow ${
                                currentStepIndex === 0
                                    ? 'max-h-[500px] sm:max-h-[550px]'
                                    : 'h-[calc(65vh-80px)] sm:h-[520px]'
                            } scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStepIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="p-3 sm:p-6"
                                >
                                    <div className="space-y-3">
                                        {/* Instructions/questions for each step */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mb-6 bg-accent/10 p-4 rounded-lg"
                                        >
                                            {currentStepIndex === 0 ? (
                                                <>
                                                    <p className="text-xl text-center text-text-secondary font-semibold mb-2">
                                                        {formData.roles.length === 0
                                                            ? "What's your primary role in music creation?"
                                                            : "What's your primary role in music creation?"}
                                                    </p>
                                                    <AnimatePresence>
                                                        <motion.p
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="text-center text-text-secondary font-primary text-sm"
                                                        >
                                                            You can also select secondary and third
                                                            roles
                                                        </motion.p>
                                                    </AnimatePresence>
                                                </>
                                            ) : currentStepIndex === 1 ? (
                                                <p className="text-xl text-center text-text-secondary font-semibold">
                                                    What's your level of experience in Music
                                                    Creation?
                                                </p>
                                            ) : currentStepIndex === 2 ? (
                                                <p className="text-xl text-center text-text-secondary font-semibold">
                                                    What style of music do you mostly create?
                                                </p>
                                            ) : (
                                                <>
                                                    <p className="text-xl text-center text-text-secondary font-semibold mb-2">
                                                        How can HitCraft support your music
                                                        creation?
                                                    </p>
                                                    <p className="text-sm text-center text-text-secondary font-primary">
                                                        Select up to 3 options
                                                    </p>
                                                </>
                                            )}
                                        </motion.div>

                                        {/* Options for the current step - Cloud view for step 4, regular list for other steps */}
                                        {currentStepIndex === 3 ? (
                                            <div className="flex flex-wrap gap-2 justify-center my-4">
                                                {currentStep.options?.map((option, index) => {
                                                    const isSelected =
                                                        formData.interest.includes(option);
                                                    const isDisabled =
                                                        !isSelected &&
                                                        formData.interest.length >=
                                                            (currentStep.maxSelections || Infinity);

                                                    return (
                                                        <div
                                                            key={option}
                                                            className={`${
                                                                isSelected
                                                                    ? 'bg-background-primary text-accent'
                                                                    : isDisabled
                                                                      ? 'bg-background-primary text-text-secondary cursor-not-allowed'
                                                                      : 'bg-background-primary text-text-secondary'
                                                            } py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium flex items-center gap-2 inline-flex opacity-0 animate-fade-in-delayed`}
                                                            style={{
                                                                animationDelay: `${index * 50}ms`,
                                                                animationFillMode: 'forwards',
                                                            }}
                                                            onClick={() => {
                                                                if (isDisabled) return;
                                                                handleInputChange(
                                                                    'interest',
                                                                    option,
                                                                    !isSelected
                                                                );
                                                            }}
                                                            role="button"
                                                            tabIndex={0}
                                                            aria-pressed={isSelected}
                                                            aria-disabled={isDisabled}
                                                            onKeyDown={(e) => {
                                                                if (isDisabled) return;
                                                                if (
                                                                    e.key === 'Enter' ||
                                                                    e.key === ' '
                                                                ) {
                                                                    e.preventDefault();
                                                                    handleInputChange(
                                                                        'interest',
                                                                        option,
                                                                        !isSelected
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            {isSelected ? (
                                                                <Check
                                                                    className="w-4 h-4 flex-shrink-0"
                                                                    strokeWidth={3}
                                                                />
                                                            ) : (
                                                                <span
                                                                    className={`text-base font-primary flex-shrink-0 leading-none ${
                                                                        isDisabled
                                                                            ? 'text-gray-400'
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    +
                                                                </span>
                                                            )}
                                                            <span className="text-sm md:text-md font-primary">
                                                                {option}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            currentStep.options?.map((option, index) => {
                                                const isSelected =
                                                    currentStep.field === 'role'
                                                        ? formData.roles.some(
                                                              (r) => r.role === option
                                                          )
                                                        : currentStep.field === 'experience'
                                                          ? formData.experience === option
                                                          : formData[
                                                                currentStep.field as
                                                                    | 'genre'
                                                                    | 'interest'
                                                            ].includes(option);

                                                const selectedRoleOrder =
                                                    currentStep.field === 'role'
                                                        ? formData.roles.find(
                                                              (r) => r.role === option
                                                          )?.order
                                                        : undefined;

                                                return (
                                                    <motion.div
                                                        key={option}
                                                        initial={{ opacity: 0, translateY: 10 }}
                                                        animate={{ opacity: 1, translateY: 0 }}
                                                        transition={{
                                                            delay: index * 0.05,
                                                            duration: 0.2,
                                                        }}
                                                    >
                                                        <div
                                                            className={`group flex items-center p-2 sm:p-2.5 rounded-lg cursor-pointer transition-all duration-200 border ${
                                                                isSelected
                                                                    ? 'border-accent bg-accent/10'
                                                                    : currentStep.field ===
                                                                            'role' &&
                                                                        formData.roles.length >=
                                                                            (currentStep.maxSelections ||
                                                                                Infinity)
                                                                      ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                                                                      : 'border-border-secondary dark:border-border-hover dark:border-border-hover'
                                                            }`}
                                                            onClick={() => {
                                                                // For roles, prevent clicks if we've reached the max and trying to add another
                                                                if (
                                                                    currentStep.field === 'role' &&
                                                                    !isSelected &&
                                                                    formData.roles.length >=
                                                                        (currentStep.maxSelections ||
                                                                            Infinity)
                                                                ) {
                                                                    return; // Don't do anything if we're at the max
                                                                }

                                                                handleInputChange(
                                                                    currentStep.field!,
                                                                    option,
                                                                    !isSelected
                                                                );
                                                            }}
                                                            role="button"
                                                            tabIndex={0}
                                                            aria-pressed={isSelected}
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key === 'Enter' ||
                                                                    e.key === ' '
                                                                ) {
                                                                    e.preventDefault();

                                                                    // For roles, prevent keyboard actions if we've reached the max and trying to add another
                                                                    if (
                                                                        currentStep.field ===
                                                                            'role' &&
                                                                        !isSelected &&
                                                                        formData.roles.length >=
                                                                            (currentStep.maxSelections ||
                                                                                Infinity)
                                                                    ) {
                                                                        return; // Don't do anything if we're at the max
                                                                    }

                                                                    handleInputChange(
                                                                        currentStep.field!,
                                                                        option,
                                                                        !isSelected
                                                                    );
                                                                }
                                                            }}
                                                            aria-disabled={
                                                                currentStep.field === 'role' &&
                                                                !isSelected &&
                                                                formData.roles.length >=
                                                                    (currentStep.maxSelections ||
                                                                        Infinity)
                                                            }
                                                        >
                                                            {currentStep.field === 'role' ? (
                                                                <div
                                                                    className={`flex items-center justify-center w-[17px] h-[17px] rounded-full text-xs font-medium ${
                                                                        isSelected
                                                                            ? 'bg-accent text-white'
                                                                            : 'bg-gray-200 text-gray-600'
                                                                    }`}
                                                                    aria-hidden="true"
                                                                >
                                                                    {isSelected
                                                                        ? selectedRoleOrder
                                                                        : ''}
                                                                </div>
                                                            ) : (
                                                                <input
                                                                    type={
                                                                        currentStep.multiSelect
                                                                            ? 'checkbox'
                                                                            : 'radio'
                                                                    }
                                                                    name={currentStep.field}
                                                                    value={option}
                                                                    checked={isSelected}
                                                                    onChange={(e) =>
                                                                        handleInputChange(
                                                                            currentStep.field!,
                                                                            option,
                                                                            e.target.checked
                                                                        )
                                                                    }
                                                                    className="w-4 h-4 text-accent focus:ring-accent rounded-md"
                                                                    disabled={
                                                                        currentStep.field ===
                                                                            'interest' &&
                                                                        !formData.interest.includes(
                                                                            option
                                                                        ) &&
                                                                        formData.interest.length >=
                                                                            (currentStep.maxSelections ||
                                                                                Infinity)
                                                                    }
                                                                />
                                                            )}
                                                            <span
                                                                className={`ml-2 text-md transition-colors font-primary ${
                                                                    isSelected
                                                                        ? 'text-accent'
                                                                        : 'text-text-primary'
                                                                }`}
                                                            >
                                                                {option}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* Input field for "Other" options when selected */}
                                    {showOtherInput && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="mt-3"
                                        >
                                            <input
                                                type="text"
                                                className="w-full p-2.5 border border-border-secondary dark:border-border-hover rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-background-tertiary/50 transition-all duration-200 text-text-invert"
                                                placeholder="Please specify..."
                                                value={
                                                    currentStep.field === 'role'
                                                        ? formData.roleOther
                                                        : formData.genreOther
                                                }
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        [currentStep.field === 'role'
                                                            ? 'roleOther'
                                                            : 'genreOther']: e.target.value,
                                                    }))
                                                }
                                                required
                                            />
                                        </motion.div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer with navigation buttons */}
                        <div className="flex items-center justify-between p-3 sm:p-4 border-t border-border-secondary dark:border-border-hover bg-background-tertiary rounded-b-3xl gap-1">
                            {/* Back button - only shown after first step */}
                            <div className="w-[80px] sm:w-[110px] flex">
                                {currentStepIndex > 0 && (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onClick={handleBack}
                                        disabled={isUpdating}
                                        className="flex items-center justify-center h-9 sm:h-10 gap-1 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 min-w-[70px] sm:min-w-[90px] border border-border-secondary dark:border-border-hover rounded-lg dark:border-border-hover/50 disabled:opacity-50 transition-all duration-200 font-primary"
                                    >
                                        <ChevronLeft className="w-4 h-4 sm:w-4 sm:h-4" />
                                        <span className="text-md">Back</span>
                                    </motion.button>
                                )}
                            </div>

                            {/* Progress indicators - centered */}
                            <div className="flex-1 flex justify-center items-center">
                                <div className="flex gap-1 sm:gap-1 justify-center">
                                    {steps.map((_, index) => (
                                        <motion.div
                                            key={index}
                                            className={`h-1.5 sm:h-1.5 w-5 sm:w-6 rounded-full ${
                                                index === currentStepIndex
                                                    ? 'bg-accent'
                                                    : index < currentStepIndex
                                                      ? 'bg-accent'
                                                      : 'bg-gray-200'
                                            }`}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Next/Complete button */}
                            <div className="w-[80px] sm:w-[110px] flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleNext}
                                    disabled={!isStepValid() || isUpdating}
                                    className="flex items-center justify-center font-primary h-9 sm:h-10 gap-1 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 min-w-[70px] sm:min-w-[90px] bg-accent text-text-invert rounded-lg disabled:opacity-50 transition-all duration-200 font-medium"
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                            <span className="text-sm sm:text-sm truncate">
                                                Processing
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            {currentStepIndex === steps.length - 1 ? (
                                                <>
                                                    <span className="text-sm">Complete</span>
                                                    <CheckCircle className="w-4 h-4 sm:w-4 sm:h-4" />
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-md">Next</span>
                                                    <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4" />
                                                </>
                                            )}
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    // Render the dialog content inside a Portal to fix z-index issues
    return <Portal>{dialogContent}</Portal>;
};

const styles = `
@keyframes fadeInDelayed {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-delayed {
  animation: fadeInDelayed 0.2s ease-out forwards;
}
`;

if (typeof document !== 'undefined') {
    // Check if we've already added the style
    if (!document.querySelector('#onboarding-animation-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'onboarding-animation-styles';
        styleElement.innerHTML = styles;
        document.head.appendChild(styleElement);
    }
}

export default OnboardingDialog;
