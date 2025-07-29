<<<<<<< HEAD
import {useState} from "react";
import {setAuthToken, setRefreshToken} from "../../components/Auth.tsx";
import {type NavigateFunction, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { useUser } from "../../components/UserContext.tsx";
=======
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
>>>>>>> 2fbe6434b8a1b02c3c553533a2d447d07526bd54

function Login() {
    const location = useLocation();
    const successMessage = location.state?.message;

<<<<<<< HEAD
    const navigate: NavigateFunction = useNavigate();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const { setUser } = useUser();
=======
    const { data, errors, handleChange, handleBlur, validateAllFields } = useFormValidation(
        { email: '', password: '' },
        {
            email: validationRules.email,
            password: validationRules.password
        }
    );
>>>>>>> 2fbe6434b8a1b02c3c553533a2d447d07526bd54

    const { isLoading, error, login, clearError } = useAuth();

    // Clear auth error when user starts typing
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [data.email, data.password]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
<<<<<<< HEAD
        fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({
                login: login,
                password: password
                })
        }).then(response => {
            if (response.status == 200) {
                return response.json();

            } else {
                return null;
            }
        }).then(data => {
            console.log(data);
            if (data !== null) {
                setAuthToken(data["accessToken"]);
                setRefreshToken(data["refreshToken"]);
                const decoded: any = jwtDecode(data.accessToken);
                setUser({
                    email: decoded.sub,
                    role: decoded.role,
                    nickname: decoded.username
                });
                navigate("/")
=======
        
        if (!validateAllFields()) {
            return;
        }

        await login({
            email: data.email,
            password: data.password
        });
    };
>>>>>>> 2fbe6434b8a1b02c3c553533a2d447d07526bd54

    return (
<<<<<<< HEAD
        <form onSubmit={onSubmit} className="min-h-screen flex flex-col items-center bg-gray-200">
            <h1 className="text-5xl font-black my-4">Pc-Build</h1>
            <header className="w-full bg-red-600 py-4 flex justify-between px-4">
                {/* <span className="text-white text-2xl">📧</span>
                <span className="text-white text-2xl">🔗</span> */}
            </header>
            <div className="bg-white p-6 rounded-md shadow-md w-80">
                <label className="block mb-2">Email</label>
                <input
                    name="login"
=======
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
>>>>>>> 2fbe6434b8a1b02c3c553533a2d447d07526bd54
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