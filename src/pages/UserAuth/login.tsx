import {use, useState} from "react";
import {setAuthToken, setRefreshToken} from "../../components/Auth.tsx";
import {type NavigateFunction, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { useAtom } from 'jotai';
import { loginUserAtom } from '../../atomContext/userAtom.tsx';
import { migrateGuestDataAtom } from '../../atomContext/computer.tsx';
import { retriveComputersFromDbAtom } from "../../atomContext/computer.tsx";

function Login() {
    const navigate: NavigateFunction = useNavigate();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [, loginUser] = useAtom(loginUserAtom);
    const [, migrateGuestData] = useAtom(migrateGuestDataAtom);
    const [,retriveComputersFromDb] = useAtom(retriveComputersFromDbAtom);

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
                setRefreshToken(data["refreshToken"]);
                loginUser(data["accessToken"]);
                navigate("/")

            }
        }).catch((error) => {
            console.error("Error during login:", error);
            setAuthToken(null);
        })
    }
return (
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
                            onChange={(event) => setLogin(event.target.value)}
                        />
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
                            placeholder="Wprowadź swoje hasło"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    <div>
                        <button 
                            type="submit" 
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-ocean-dark hover:bg-gradient-ocean-dark-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-blue "
                        >
                            Zaloguj się
                        </button>
                    </div>

                    <div className="text-center">
                        <a 
                            href="#" 
                            className="text-sm text-ocean-blue hover:text-ocean-dark-blue transition-colors duration-200"
                        >
                            Zapomniałeś swojego hasła?
                        </a>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="text-center">
                        <span className="text-sm text-gray-600">
                            Nie masz jeszcze konta?{' '}
                            <a 
                                href="/register" 
                                className="font-medium text-ocean-blue hover:text-ocean-dark-blue transition-colors duration-200"
                            >
                                Zarejestruj się
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