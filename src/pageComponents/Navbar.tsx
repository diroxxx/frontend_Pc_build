import {useNavigate, useLocation} from "react-router-dom";
import {useUser} from "../components/UserContext.tsx";
import {setAuthToken} from "../components/Auth.tsx";
import {useState} from "react";


export default function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useUser();
    const [showDropdown, setShowDropdown] = useState(false);

const logout = () => {
    setAuthToken(null);
    setUser(null);
    navigate("/login");
};

return (
    <header className="bg-slate-800 text-white px-6 pt-3 pb-0 flex flex-col justify-between min-h-[120px]">
        <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">Pc-Build</div>
        {/* <img src="pc_build_logo.svg" width="1024" height="1024" alt="Logo" className="h-10" /> */}
        <div className="flex gap-2 relative">
            {user ? (
                <div className="relative flex items-center gap-3">
                    <span className="text-sm font-medium">{user.nickname}</span>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="focus:outline-none"
                    >
                        <img src="user.png" alt="Logo_user" className="h-10 hover:opacity-80 transition-opacity duration-200" />
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 top-12 w-32 bg-white rounded-md shadow-lg z-50">
                            <button
                                onClick={() => {
                                    navigate("/userInfo");
                                    setShowDropdown(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-slate-800 hover:bg-gray-100 transition-colors duration-200"
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => {
                                    logout();
                                    setShowDropdown(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-slate-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-white text-slate-800 px-4 py-1 rounded-full hover:bg-gray-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all duration-200"
                        >
                        Log In
                    </button>
                    <button className="bg-white text-slate-800 px-4 py-1 rounded-full hover:bg-gray-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all duration-200">
                        Register
                    </button>
                </>
            )}
        </div>
        </div>
        {location.pathname !== "/" && (
            <div className="bg-indigo-600 px-4 py-2 rounded-t mb-0">
                <nav className="flex gap-4 justify-center">
                    <button onClick={() => navigate("/")} className="hover:bg-indigo-700 hover:text-gray-100 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200">Home</button>
                    <button onClick={() => navigate("/components")} className="hover:bg-indigo-700 hover:text-gray-100 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200">Components</button>
                </nav>
            </div>
        )}

    </header>
);
}