import { useState, useEffect } from 'react';
import { userApi, ProfessionalRole, UserData as ApiUserData } from '~/utils/api';
import { getUserId } from '~/utils/jwt';

interface UserData extends Omit<ApiUserData, 'userAttributes'> {
    _id?: string;
    professionalRoles?: ProfessionalRole[];
    genres?: string[];
    mostInterestedIn?: string[];
    isOnboarded?: boolean;
}

export const useUser = () => {
    const [userData, setUserData] = useState<UserData>({
        _id: undefined,
        descopeId: '',
        descopeLoginIds: [],
        uploadsRemaining: undefined,
        isSuperUser: undefined,
        professionalRoles: undefined,
        genres: undefined,
        mostInterestedIn: undefined,
        isOnboarded: undefined,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = async () => {
        const userId = getUserId();
        if (!userId) {
            setIsLoading(false);
            return;
        }

        try {
            const userResponse = await userApi.get();

            const userDataFromApi = userResponse.data;
            const isOnboarded = userDataFromApi.isOnboarded;

            // Extract and flatten userAttributes for component usage
            setUserData((prev) => ({
                ...prev,
                ...userDataFromApi,
                professionalRoles: userDataFromApi.userAttributes?.professionalRoles || [],
                genres: userDataFromApi.userAttributes?.genres || [],
                mostInterestedIn: userDataFromApi.userAttributes?.mostInterestedIn || [],
                isOnboarded,
            }));
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const updateUserData = async (data: Partial<UserData>) => {
        const userId = getUserId();
        if (!userId) return;

        try {
            // Convert flattened structure back to nested for API
            await userApi.update({
                userAttributes: {
                    professionalRoles: data.professionalRoles,
                    genres: data.genres,
                    mostInterestedIn: data.mostInterestedIn,
                },
            });
            await fetchUserData();
        } catch (error) {
            console.error('Failed to update user data:', error);
            throw error;
        }
    };

    const setOnboardingComplete = async () => {
        try {
            await userApi.setOnboardingStatus();
            setUserData((prev) => ({ ...prev, isOnboarded: true }));
        } catch (error) {
            console.error('Failed to set onboarding status:', error);
        }
    };

    return {
        ...userData,
        isLoading,
        refreshUserData: fetchUserData,
        updateUserData,
        setOnboardingComplete,
    };
};
