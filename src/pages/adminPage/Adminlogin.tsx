import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {setAuthToken, setRefreshToken} from "../../components/Auth.tsx";
import { useAtom } from 'jotai';
import { loginUserAtom } from '../../atomContext/userAtom';

const AdminLogin = () => {

    const [, loginUser] = useAtom(loginUserAtom);

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
           event.preventDefault();
           fetch("http://localhost:8080/auth/login", {
               method: "POST",
               headers: {"content-type": "application/json"},
               body: JSON.stringify({
                   login: credentials.email,
                   password: credentials.password
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
                   navigate("/admin/controlPanel");

               }
           }).catch((error) => {
               console.error("Error during login:", error);
               setAuthToken(null);
           })
       }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-red-500 mb-2">
                        Panel Administratora
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Zaloguj się aby uzyskać dostęp do panelu administracyjnego
                    </p>
                </div>
                
                <form className="mt-8 space-y-6 bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email administratora
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={credentials.email}
                                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                                required
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Hasło
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                required
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        Zaloguj jako Admin
                    </button>
                    
                    <div className="text-center">
                        <a 
                            href="/login" 
                            className="text-sm text-gray-400 hover:text-gray-300 transition duration-200"
                        >
                            Powrót do logowania użytkownika
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;