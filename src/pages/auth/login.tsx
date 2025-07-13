import './App.css'
import {useState} from "react";
import {setAuthToken, setRefreshToken} from "../../components/Auth.tsx";
import {type NavigateFunction, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { useUser } from "../../components/UserContext.tsx";

function Login() {

    const navigate: NavigateFunction = useNavigate();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useUser();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({login: login, password: password})
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
                });
                navigate("/")

            }
        }).catch((error) => {
            console.error("Error during login:", error);
            setAuthToken(null);
        })
    }
    return (
        <form onSubmit={onSubmit} className="min-h-screen flex flex-col items-center bg-gray-200">
            <h1 className="text-5xl font-black my-4">Pc-Build</h1>
            <header className="w-full bg-red-600 py-4 flex justify-between px-4">
                <span className="text-white text-2xl">📧</span>
                <span className="text-white text-2xl">🔗</span>
            </header>
            <div className="bg-white p-6 rounded-md shadow-md w-80">
                <label className="block mb-2">Email</label>
                <input
                    name="login"
                    type="email"
                    className="w-full mb-4 px-3 py-2 border rounded"
                    placeholder="Enter your email"
                    onChange={(event) => setLogin(event.target.value)}
                />
                <label className="block mb-2">Password</label>
                <input
                    name={"password"}
                    type="password"
                    className="w-full mb-4 px-3 py-2 border rounded"
                    placeholder="Enter your password"
                    onChange={(event) => setPassword(event.target.value)}
                />
                <button type={"submit"} className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                    Sign In
                </button>
                <div className="text-sm mt-2 text-right">
                    <a href="#" className="text-blue-500 hover:underline">
                        Forgot password?
                    </a>
                </div>
            </div>
        </form>
    );
}
export default Login;