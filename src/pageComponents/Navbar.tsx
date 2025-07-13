import {useNavigate} from "react-router-dom";
import {useUser} from "../components/UserContext.tsx";
import {setAuthToken} from "../components/Auth.tsx";

export default function Navbar() {

    const navigate = useNavigate();
    const { user, setUser } = useUser();

const logout = () => {
    setAuthToken(null);
    setUser(null);
    navigate("/login");
};

return (
    <header className="bg-red-600 text-white px-6 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">Pc-Build</div>
        <div className="flex gap-2">
            {user ? (
                <button
                    onClick={logout}
                    className="bg-white text-red-600 px-4 py-1 rounded-full"
                >
                    Log out
                </button>
            ) : (
                <>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-white text-red-600 px-4 py-1 rounded-full"
                    >
                        Log In
                    </button>
                    <button className="bg-white text-red-600 px-4 py-1 rounded-full">
                        Register
                    </button>
                </>
            )}
        </div>
    </header>
);
}