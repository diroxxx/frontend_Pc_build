import {useState} from "react";
import {setAuthToken, setRefreshToken} from "../../components/Auth.tsx";
import {type NavigateFunction, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { useUser } from "../../components/UserContext.tsx";

function Login() {

    const navigate: NavigateFunction = useNavigate();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const { setUser } = useUser();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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

            }
        }).catch((error) => {
            console.error("Error during login:", error);
            setAuthToken(null);
        })
    }
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-4xl font-bold text-slate-800 mb-2">Pc-Build</h1>
                <h2 className="text-center text-2xl font-semibold text-gray-900 mb-8">
                    Sign in to your account
                </h2>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="login"
                                name="login"
                                type="email"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                placeholder="Enter your email address"
                                onChange={(event) => setLogin(event.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                placeholder="Enter your password"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>

                        <div>
                            <button 
                                type="submit" 
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                Sign In
                            </button>
                        </div>

                        <div className="text-center">
                            <a 
                                href="#" 
                                className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                            >
                                Forgot your password?
                            </a>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <a 
                                    href="/register" 
                                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                                >
                                    Sign up
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;