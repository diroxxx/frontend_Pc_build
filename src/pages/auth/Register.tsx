<<<<<<< HEAD
import {useState} from "react";
import {type NavigateFunction, useNavigate} from "react-router-dom";
=======
import React, { useEffect } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import FormField from '../../components/auth/FormField';
import PasswordField from '../../components/auth/PasswordField';
import Button from '../../components/ui/Button';
import ErrorMessage from '../../components/ui/ErrorMessage';
import AuthNavigation from '../../components/auth/AuthNavigation';
import useFormValidation, { validationRules } from '../../hooks/useFormValidation';
import useAuth from '../../hooks/useAuth';
>>>>>>> 2fbe6434b8a1b02c3c553533a2d447d07526bd54

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
            title="Create Account" 
            subtitle="Join the PC Build community today"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                    label="Username"
                    type="text"
                    name="username"
                    value={data.username}
                    onChange={(value) => handleChange('username', value)}
                    onBlur={() => handleBlur('username')}
                    error={errors.username}
                    required
                    placeholder="Choose a username"
                    autoComplete="username"
                />

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
                    placeholder="Create a secure password"
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
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
            </form>

            <AuthNavigation type="register" />
        </AuthLayout>
    );
}

export default Register;