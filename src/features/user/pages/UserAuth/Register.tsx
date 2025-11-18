import React, { useEffect } from 'react';
import useFormValidation, { validationRules } from '../../../../hooks/useFormValidation.tsx';
import useAuth from '../../../../hooks/useAuth.tsx';

function Register() {
    const { data, errors, handleChange, handleBlur, validateAllFields } = useFormValidation(
        { username: '', email: '', password: '' },
        {
            username: validationRules.username,
            email: validationRules.email,
            password: validationRules.password
        }
    );

    const { isLoading, error, register, clearError } = useAuth();

    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [data.username, data.email, data.password]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!validateAllFields()) {
            return;
        }

        await register({
            username: data.username,
            email: data.email,
            password: data.password
        });
    };

return (
    <div className="min-h-screen bg-ocean-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h1 className="text-center text-4xl font-bold text-midnight-dark mb-2">Pc-Build</h1>
            <h2 className="text-center text-2xl font-semibold text-midnight-dark mb-8">
                Stwórz swoje konto
            </h2>
            <p className="text-center text-ocean-blue">Dołącz do PC-Build dzisiaj!</p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-ocean-light-blue">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-midnight-dark mb-2">
                            Nazwa użytkownika
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-ocean-light-blue rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-colors duration-200"
                            placeholder="Wpisz swoją nazwę"
                            value={data.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                            onBlur={() => handleBlur('username')}
                            autoComplete="username"
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-midnight-dark mb-2">
                            Adres Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-ocean-light-blue rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-colors duration-200"
                            placeholder="Adres Email"
                            value={data.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-midnight-dark mb-2">
                            Hasło
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-ocean-light-blue rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-colors duration-200"
                            placeholder="Wpisz bezpieczne hasło"
                            value={data.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            onBlur={() => handleBlur('password')}
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-ocean-dark hover:bg-gradient-ocean-dark-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Tworzę konto...' : 'Stwórz konto'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="text-center">
                        <span className="text-sm text-gray-600">
                            Masz już konto?{' '}
                            <a
                                href="/login"
                                className="font-medium text-ocean-blue hover:text-ocean-dark-blue transition-colors duration-200"
                            >
                                Zaloguj się
                            </a>
                        </span>
                    </div>
                </div>
                <div className="text-center mt-6">
                    <a
                        href="/public"
                        className="text-sm text-ocean-blue hover:text-ocean-dark-blue transition-colors duration-200"
                    >
                        Wróć na strone główną
                    </a>
                </div>
            </div>
        </div>
    </div>
);
}

export default Register;