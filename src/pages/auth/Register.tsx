import './App.css'
import {useState} from "react";
import {type NavigateFunction, useNavigate} from "react-router-dom";

function Register() {

    const navigate: NavigateFunction = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({username: username,  email: email, password: password})
        }).then(response => {
            if (response.status == 201) {
                navigate("/login")
            } else {
                // warto dodac przechwycenie błedów
                return null;
            }
        }).then(data => {
            console.log(data);
            if (data !== null) {
                navigate("/login")

            }
        });
    }
    return (
        <form onSubmit={onSubmit} className="min-h-screen flex flex-col items-center bg-gray-200">
            <h1 className="text-5xl font-black my-4">Pc-Build</h1>
            <header className="w-full bg-red-600 py-4 flex justify-between px-4">
                <span className="text-white text-2xl">📧</span>
                <span className="text-white text-2xl">🔗</span>
            </header>
            <div className="bg-white p-6 rounded-md shadow-md w-80">
                <label className="block mb-2">Username</label>
                <input
                    name="username"
                    type="text"
                    className="w-full mb-4 px-3 py-2 border rounded"
                    placeholder="Enter your username"
                    onChange={(event) => setUsername(event.target.value)}
                />
                <label className="block mb-2">Password</label>

                <label className="block mb-2">Email</label>
                <input
                    name="login"
                    type="email"
                    className="w-full mb-4 px-3 py-2 border rounded"
                    placeholder="Enter your email"
                    onChange={(event) => setEmail(event.target.value)}
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
                    Register
                </button>
            </div>
        </form>
    );
}

export default Register;