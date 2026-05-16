import { type FormEvent, useState } from "react";
import { setAuthToken } from "../hooks/Auth.tsx";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { type CustomJwtPayload, loginUserAtom } from "../atoms/userAtom.tsx";
import { AuthRedirect } from "../../../components/auth/AuthRedirect.tsx";
import { postMigrateComputersFromGuestToUserApi } from "../../computers/user/api/postMigrateComputersFromGuestToUserApi.ts";
import { guestComputersAtom } from "../../computers/atoms/guestComputersAtom.ts";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";

function Login() {
    const navigate: NavigateFunction = useNavigate();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [, loginUser] = useAtom(loginUserAtom);
    const [errorMessage, setErrorMessage] = useState<string[] | null>(null);
    const guestComputers = useAtomValue(guestComputersAtom);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);

        fetch("http://localhost:8080/auth/login/user", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ login, password }),
            credentials: "include",
        })
            .then((r) => r.json())
            .then((data) => {
                if (data?.accessToken) {
                    loginUser(data.accessToken);
                    const decoded = jwtDecode<CustomJwtPayload>(data.accessToken);
                    const email = decoded.sub;
                    if (email) postMigrateComputersFromGuestToUserApi(email, guestComputers);
                    navigate("/");
                }
                if (data?.errors && typeof data.errors === "object") {
                    setErrorMessage(Object.values(data.errors) as string[]);
                } else if (data?.message) {
                    setErrorMessage([data.message]);
                }
            })
            .catch((err) => {
                console.error("Error during login:", err);
                setAuthToken(null);
                setErrorMessage(["Wystąpił błąd połączenia. Spróbuj ponownie."]);
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <AuthRedirect redirectTo="/login">
            <div className="min-h-screen bg-ocean-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h1 className="text-center text-4xl font-bold text-midnight-dark mb-2">Pc-Build</h1>
                    <h2 className="text-center text-2xl font-semibold text-midnight-dark mb-8">
                        Zaloguj się do swojego konta
                    </h2>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-ocean-light-blue">
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="login" className="block text-sm font-medium text-midnight-dark mb-2">
                                    Adres Email
                                </label>
                                <input
                                    id="login"
                                    name="login"
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 border border-ocean-light-blue rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-colors duration-200"
                                    placeholder="Wprowadź swój adres email"
                                    onChange={(e) => setLogin(e.target.value)}
                                />
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
                                        className="w-full px-3 py-2 pr-10 border border-ocean-light-blue rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-colors duration-200"
                                        placeholder="Wprowadź swoje hasło"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-ocean-dark hover:bg-gradient-ocean-dark-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {isLoading ? "Logowanie..." : "Zaloguj się"}
                            </button>
                        </form>

                        <div className="mt-3 min-h-[60px]">
                            {errorMessage && errorMessage.length > 0 && (
                                <div className="rounded-lg bg-ocean-red/5 p-3 border border-ocean-red/20">
                                    {errorMessage.map((error, index) => (
                                        <p key={index} className="text-sm text-ocean-red font-medium">{error}</p>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-2 text-center">
                            <span className="text-sm text-gray-600">
                                Nie masz jeszcze konta?{" "}
                                <a href="/Register" className="font-medium text-ocean-blue hover:text-ocean-dark-blue transition-colors duration-200">
                                    Zarejestruj się
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
        </AuthRedirect>
    );
}

export default Login;
