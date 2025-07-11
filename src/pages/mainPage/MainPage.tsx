import {useNavigate} from "react-router-dom";
import {setAuthToken} from "../../components/Auth.tsx";


function mainPage() {
    const navigate = useNavigate();

    const logout = () => {
        setAuthToken(null); // usuń token
        navigate("/login");
    };
    return (
        <div>
            <h1>Zalogowany!</h1>
            <button onClick={logout}>Wyloguj</button>
        </div>
    )
}

export default mainPage;