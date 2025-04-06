import { motion } from 'framer-motion';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import { CheckmarkAnimation } from '~/components/ui/checkmark-animation';

const StripeRedirectPage = () => {
    const [searchParams] = useSearchParams();
    const threadId = searchParams.get('utm_source');
    const messageId = searchParams.get('utm_content');
    const navigate = useNavigate();

    if (!threadId || !messageId) {
        return <Navigate to={'/'} />;
    }

    setTimeout(() => {
        navigate(`/chats/${threadId}?message=${messageId}`);
    }, 5000);

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="p-8 bg-background-tertiary rounded-lg shadow-md text-center w-80">
                <CheckmarkAnimation
                    message="Payment Successful!
                    
                    Thank You for Your Purchase!"
                />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="font-poppins-light pt-6 text-xs text-text-primary"
                >
                    You will be redirected to the chat in 5 seconds...
                </motion.div>
            </div>
        </div>
    );
};

export default StripeRedirectPage;
