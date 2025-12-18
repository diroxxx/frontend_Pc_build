import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../features/auth/atoms/userAtom.tsx';
import { LoadingSpinner } from '../../assets/components/ui/LoadingSpinner';

interface AuthRedirectProps {
    redirectTo: string;
    children: React.ReactNode;
}

export const AuthRedirect = ({ redirectTo, children }: AuthRedirectProps) => {
    const user = useAtomValue(userAtom);
    const navigate = useNavigate();
    const location = useLocation();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (user && (location.pathname === '/login' || location.pathname === '/admin/login')) {
            setIsRedirecting(true);
            const timer = setTimeout(() => {
                navigate(redirectTo, { replace: true });
            }, 700);

            return () => clearTimeout(timer);
        } else {
            setIsRedirecting(false);
        }
    }, [user, navigate, redirectTo, location.pathname]);

    if (isRedirecting) {
        return (
            <div className="min-h-screen bg-ocean-white flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner />
                    <h1 className="mt-4 text-2xl font-semibold text-midnight-dark">
                        Jesteś już zalogowany
                    </h1>
                    <p className="mt-4 text-ocean-dark-blue">
                        Przekierowywanie...
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};