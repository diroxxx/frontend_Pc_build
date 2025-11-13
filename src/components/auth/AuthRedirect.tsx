import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../atomContext/userAtom';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AuthRedirectProps {
    requiredRole?: 'ADMIN' | 'USER';
    redirectTo: string;
    forbiddenRedirectTo?: string;
    children: React.ReactNode;
}

export const AuthRedirect = ({ 
    requiredRole, 
    redirectTo, 
    forbiddenRedirectTo,
    children 
}: AuthRedirectProps) => {
    const user = useAtomValue(userAtom);
    const navigate = useNavigate();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [showForbidden, setShowForbidden] = useState(false);

    useEffect(() => {
        if (!user) return;

        if (requiredRole && user.role === requiredRole) {
            setShowForbidden(true);
            return;
        }

        // Jeśli user jest zalogowany i nie ma required role -> redirect
        if (user && !requiredRole) {
            setIsRedirecting(true);
            const timer = setTimeout(() => {
                navigate(redirectTo);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [user, navigate, requiredRole, redirectTo]);

    if (showForbidden) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-ocean-white">
                <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center border border-ocean-light-blue">
                    <h1 className="text-5xl font-bold text-ocean-red mb-4">403</h1>
                    <h2 className="text-2xl font-semibold text-midnight-dark mb-2">Brak dostępu</h2>
                    <p className="text-midnight-dark/70 mb-6">
                        {requiredRole === 'ADMIN' 
                            ? 'To strona użytkownika. Wyloguj się z konta administratora.'
                            : 'To panel administratora. Zaloguj się na konto administratora.'
                        }
                    </p>
                    <a 
                        href={forbiddenRedirectTo || (requiredRole === 'ADMIN' ? '/admin/controlPanel' : '/')}
                        className="text-ocean-blue hover:text-ocean-dark-blue transition-colors duration-200 font-medium underline"
                    >
                        {requiredRole === 'ADMIN' ? 'Wróć do panelu administratora' : 'Wróć do strony głównej'}
                    </a>
                </div>
            </div>
        );
    }

    // Ekran przekierowania
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