import React, { useEffect, useState } from "react";
import useFormValidation, { validationRules } from "./hooks/useFormValidation.tsx";
import useAuth from "./hooks/useAuth.tsx";
import { Eye, EyeOff } from "lucide-react";

function Register() {
    const { data, errors, handleChange, handleBlur, validateAllFields } = useFormValidation(
        { username: "", email: "", password: "" },
        {
            username: validationRules.username,
            email: validationRules.email,
            password: validationRules.password,
        }
    );

    const { isLoading, error, register, clearError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (error) clearError();
    }, [data.username, data.email, data.password]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateAllFields()) return;
        await register({ username: data.username, email: data.email, password: data.password });
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

            <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8">
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
                                className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean-blue transition-colors duration-200 ${
                                    errors.username ? "border-ocean-red focus:border-ocean-red" : "border-ocean-light-blue focus:border-ocean-blue"
                                }`}
                                placeholder="Wpisz swoją nazwę"
                                value={data.username}
                                onChange={(e) => handleChange("username", e.target.value)}
                                onBlur={() => handleBlur("username")}
                                autoComplete="username"
                            />
                            {errors.username && <p className="mt-1 text-sm text-ocean-red">{errors.username}</p>}
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
                                className={`w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean-blue transition-colors duration-200 ${
                                    errors.email ? "border-ocean-red focus:border-ocean-red" : "border-ocean-light-blue focus:border-ocean-blue"
                                }`}
                                placeholder="Adres Email"
                                value={data.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                onBlur={() => handleBlur("email")}
                                autoComplete="email"
                            />
                            {errors.email && <p className="mt-1 text-sm text-ocean-red">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-midnight-dark mb-2">
                                Hasło
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className={`w-full px-3 py-2 pr-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean-blue transition-colors duration-200 ${
                                        errors.password ? "border-ocean-red focus:border-ocean-red" : "border-ocean-light-blue focus:border-ocean-blue"
                                    }`}
                                    placeholder="Wpisz bezpieczne hasło"
                                    value={data.password}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                    onBlur={() => handleBlur("password")}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-ocean-red">{errors.password}</p>}
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-ocean-dark hover:bg-gradient-ocean-dark-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Tworzę konto..." : "Stwórz konto"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-sm text-gray-600">
                            Masz już konto?{" "}
                            <a href="/login" className="font-medium text-ocean-blue hover:text-ocean-dark-blue transition-colors duration-200">
                                Zaloguj się
                            </a>
                        </span>
                    </div>
                    <div className="text-center mt-4">
                        <a href="/" className="text-sm text-ocean-blue hover:text-ocean-dark-blue transition-colors duration-200">
                            Wróć na stronę główną
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
