import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import FormField from '../../components/auth/FormField';
import PasswordField from '../../components/auth/PasswordField';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/ui/ErrorMessage';
import AuthNavigation from '../../components/auth/AuthNavigation';
import useFormValidation, { validationRules } from '../../hooks/useFormValidation';
import useAuth from '../../hooks/useAuth';

function Login() {
    const location = useLocation();
    const successMessage = location.state?.message;

    const { data, errors, handleChange, handleBlur, validateAllFields } = useFormValidation(
        { email: '', password: '' },
        {
            email: validationRules.email,
            password: validationRules.password
        }
    );

    const { isLoading, error, login, clearError } = useAuth();

    // Clear auth error when user starts typing
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [data.email, data.password]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!validateAllFields()) {
            return;
        }

        await login({
            email: data.email,
            password: data.password
        });
    };

    return (
        <AuthLayout 
            title="Welcome Back" 
            subtitle="Sign in to your account to continue"
        >
            {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">{successMessage}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                    label="Email Address"
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={(value) => handleChange('email', value)}
                    onBlur={() => handleBlur('email')}
                    error={errors.email}
                    required
                    placeholder="Enter your email address"
                    autoComplete="email"
                />

                <PasswordField
                    label="Password"
                    name="password"
                    value={data.password}
                    onChange={(value) => handleChange('password', value)}
                    onBlur={() => handleBlur('password')}
                    error={errors.password}
                    required
                    placeholder="Enter your password"
                    autoComplete="current-password"
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
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                <div className="text-center">
                    <a 
                        href="#" 
                        className="text-sm text-purple-600 hover:text-purple-500 transition-colors duration-200"
                    >
                        Forgot your password?
                    </a>
                </div>
            </form>

            <AuthNavigation type="login" />
        </AuthLayout>
    );
}
export default Login;