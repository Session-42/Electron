import { useUser } from '~/hooks/use-user';
import { ProfessionalRole } from '~/utils/api';
import InfoDisplay from '../components/profile/info-display';
import { LoadingSpinner } from '~/components/ui/loading-spinner';

interface ProfilePageProps {
    userName: string;
    userImage: string;
    userEmail: string;
}

const formatRole = (role: ProfessionalRole): string => `${role.description} - ${role.level}`;

export default function ProfilePage({ userName, userImage, userEmail }: ProfilePageProps) {
    const { professionalRoles, genres, mostInterestedIn, uploadsRemaining, isLoading } = useUser();

    return (
        <div className="flex-1 min-h-screen bg-background-primary overflow-y-auto">
            <div className="w-full max-w-6xl px-4 py-12 mt-safe">
                {/* Centered User Info with improved spacing */}
                <div className="flex flex-col items-center mb-8">
                    <div className="mb-6">
                        <img
                            src={userImage || '/assets/default-avatar.svg'}
                            alt={userName}
                            className="w-20 h-20 rounded-full object-cover shadow-lg"
                        />
                    </div>
                    <h1 className="text-2xl font-semibold text-center text-text-primary">
                        Welcome back,{' '}
                        <span className="text-transparent bg-clip-text bg-accent">{userName}</span>
                    </h1>
                </div>

                {/* Content Grid with improved spacing and alignment */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto min-h-[400px]">
                    {isLoading ? (
                        <div className="col-span-3 flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            {/* Personal Info Section */}
                            <div className="bg-background-secondary text-lg font-poppins-semibold rounded-lg shadow-[0_2px_4px_0_rgba(0,0,0,0.07)] px-4">
                                <InfoDisplay
                                    title="Personal Info"
                                    fields={[
                                        { label: 'Name', value: userName },
                                        { label: 'Email', value: userEmail },
                                    ]}
                                />
                            </div>

                            {/* Professional Info Section */}
                            <div className="bg-background-secondary rounded-lg shadow-[0_2px_4px_0_rgba(0,0,0,0.07)] px-4">
                                <InfoDisplay
                                    title="Professional Info"
                                    fields={[
                                        {
                                            label: 'Professional Roles',
                                            value: professionalRoles?.length
                                                ? professionalRoles.map(formatRole).join(', ')
                                                : 'Not set',
                                        },
                                    ]}
                                />
                            </div>

                            {/* Interests Section */}
                            <div className="bg-background-secondary rounded-lg shadow-[0_2px_4px_0_rgba(0,0,0,0.07)] px-4">
                                <InfoDisplay
                                    title="Interests"
                                    fields={[
                                        {
                                            label: 'Main Interest',
                                            value: mostInterestedIn?.length
                                                ? mostInterestedIn.join(', ')
                                                : 'Not set',
                                        },
                                        {
                                            label: 'Genres',
                                            value: (
                                                <div className="flex flex-wrap gap-2">
                                                    {genres?.length
                                                        ? genres.map((genre, index) => (
                                                              <span
                                                                  key={index}
                                                                  className="px-3 py-1 bg-[#efe9f4] text-[#8a44c8] rounded-full text-sm font-poppins-light"
                                                              >
                                                                  {genre}
                                                              </span>
                                                          ))
                                                        : 'Not set'}
                                                </div>
                                            ),
                                        },
                                        {
                                            label: 'Uploads Remaining',
                                            value: uploadsRemaining || 0,
                                        },
                                    ]}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
