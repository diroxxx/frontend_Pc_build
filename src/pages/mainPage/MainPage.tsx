import {type NavigateFunction, useNavigate} from "react-router-dom";
import {setAuthToken} from "../../components/Auth.tsx";
import {useUser} from "../../components/UserContext.tsx";

function mainPage() {
    const navigate: NavigateFunction = useNavigate();
    const { user, setUser } = useUser();

    const logout = () => {
        setAuthToken(null); // usuń token
        navigate("/login");
    };
    return (
        <div className=" bg-gray-100 font-sans">
            {/* Ikony - grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 px-6 pb-6 text-center">
                <div  className="flex flex-col items-center text-gray-800">
                    <div className="text-4xl">
                        <a href={"/components"}>
                            <img
                                src="/components_mainPage.png"
                                alt="Komputer"
                                className="w-full  h-full object-cover rounded shadow-md"
                            />
                            <p className="mt-2 text-sm">Components</p>
                        </a>

                    </div>

                </div>

            </div>

            {/* Sekcja promocyjna */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 px-6 min-h-[400px]">
                <img
                    src="/pc_photo_mainPage.png"
                        alt="Komputer"
                        className="w-full md:w-1/3 h-full object-cover rounded shadow-md"
                    />
                <div className="bg-gray-900 text-white p-6 rounded-lg w-full md:w-1/2 text-center">
                    <h2 className="text-2xl font-bold mb-2">
                        Stwórz idealny zestaw komputerowy i dziel się z innymi!
                    </h2>
                    <p className="mb-4">
                        Dołącz do społeczności, porównuj zestawy, komentuj i ulepszaj sprzęt – wszystko w jednym
                        miejscu.
                    </p>
                    <button
                        className="bg-purple-400 hover:bg-purple-500 text-black font-semibold px-6 py-2 rounded-full">
                        Sprawdź
                    </button>
                </div>
            </div>
        </div>
    )
}

export default mainPage;