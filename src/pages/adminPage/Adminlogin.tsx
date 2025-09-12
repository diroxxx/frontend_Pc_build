import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {setAuthToken} from "../../components/Auth.tsx";
import { useAtom } from 'jotai';
import { loginAdminAtom, loginUserAtom } from '../../atomContext/userAtom';

const AdminLogin = () => {

    const [, loginUser] = useAtom(loginUserAtom);
    const [, loginAdmin] = useAtom(loginAdminAtom);

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
                   loginAdmin(data["accessToken"]);
                   navigate("/admin/controlPanel");

               }
           }).catch((error) => {
               console.error("Error during login:", error);
               setAuthToken(null);
           })
       }

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Header w stylu forum */}
            <div className="bg-ocean-dark-blue text-white py-12 mb-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-text-ocean-white text-4xl md:text-5xl font-bold text-center">
                        PANEL ADMINISTRATORA
                    </h1>
                    <p className="text-center text-gray-300 mt-3 text-lg">
                        Zaloguj się aby uzyskać dostęp do panelu zarządzania
                    </p>
                </div>
            </div>

            {/* Formularz logowania */}
            <div className="max-w-md mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email administratora
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Hasło
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                                />
                            </div>
                        </div>
                        
                        <button 
                            type="submit"
                            className="w-full bg-ocean-blue hover:bg-ocean-dark-blue text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                        >
                            Zaloguj jako Administrator
                        </button>
                    </form>
                    
                    <div className="text-center mt-6 pt-6 border-t border-gray-200">
                        <a 
                            href="/login" 
                            className="text-sm text-gray-600 hover:text-ocean-blue transition-colors duration-200"
                        >
                            ← Powrót do logowania użytkownika
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;