import React, { useEffect } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import FormField from '../../components/auth/FormField';
import PasswordField from '../../components/auth/PasswordField';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/ui/ErrorMessage';
import AuthNavigation from '../../components/auth/AuthNavigation';
import useFormValidation, { validationRules } from '../../hooks/useFormValidation';
import useAuth from '../../hooks/useAuth';

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

    // Clear auth error when user starts typing
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
        <AuthLayout
            title="Stwórz swoje konto"
            subtitle="Dołącz do PC-Build dzisiaj!"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                    label="Nazwa użytkownika"
                    type="text"
                    name="username"
                    value={data.username}
                    onChange={(value) => handleChange('username', value)}
                    onBlur={() => handleBlur('username')}
                    error={errors.username}
                    required
                    placeholder="Wpisz swoją nazwę"
                    autoComplete="username"
                />

                <FormField
                    label="Adres Email"
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={(value) => handleChange('email', value)}
                    onBlur={() => handleBlur('email')}
                    error={errors.email}
                    required
                    placeholder="Adres Email"
                    autoComplete="email"
                />

                <PasswordField
                    label="Hasło"
                    name="password"
                    value={data.password}
                    onChange={(value) => handleChange('password', value)}
                    onBlur={() => handleBlur('password')}
                    error={errors.password}
                    required
                    placeholder="Wpisz bezpieczne hasło"
                    autoComplete="new-password"
                />

                {error && (
                    <ErrorMessage message={error} />
                )}

                <Button
                    type="submit"
                    loading={isLoading}
                    fullWidth
                    disabled={isLoading}
                >
                    {isLoading ? 'Tworzę konto...' : 'Stwórz konto'}
                </Button>
            </form>

            <AuthNavigation type="register" />
        </AuthLayout>
    );
}

export default Register;