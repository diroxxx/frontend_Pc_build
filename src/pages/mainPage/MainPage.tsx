import { useNavigate } from "react-router-dom";
import SidePanelBuilds from "../Builds/SidePanelBuilds.tsx";

function mainPage() {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-100 font-sans">

            <SidePanelBuilds />
            {/* Ikony - grid */}
            <div className="flex justify-center gap-8 px-6 py-8">
                <div
                    className="flex flex-col items-center text-gray-800 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate("/components")}>
                    <div className="w-20 h-20">
                        <img
                            src="/components_mainPage.png"
                            alt="Components"
                            className="w-full h-full object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-200"
                        />
                        <p className="mt-2 text-sm font-medium">Components</p>
                    </div>
                </div>

                <div
                    className="flex flex-col items-center text-gray-800 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate("/builds")}>
                    <div className="w-20 h-20">
                        <img
                            src="/build_pc_main.png"
                            alt="Tools"
                            className="w-full h-full object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-200"
                        />
                        <p className="mt-2 text-sm font-medium">Builds</p>
                    </div>
                </div>

                <div
                    className="flex flex-col items-center text-gray-800 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate("/community")}>
                    <div className="w-20 h-20">
                        <img
                            src="/community_main.png"
                            alt="Community"
                            className="w-full h-full object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-200"
                        />
                        <p className="mt-2 text-sm font-medium">Community</p>
                    </div>
                </div>

                <div
                    className="flex flex-col items-center text-gray-800 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate("/check-games")}>
                    <div className="w-20 h-20">
                        <img
                            src="/check-games.png"
                            alt="Check Games"
                            className="w-full h-full object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-200"
                        />
                        <p className="mt-2 text-sm font-medium">Check Games</p>
                    </div>
                </div>

                <div
                    className="flex flex-col items-center text-gray-800 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate("/recommendations")}>
                    <div className="w-20 h-20">
                        <img
                            src="/recommendations.png"
                            alt="Recommendations"
                            className="w-full h-full object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-200"
                        />
                        <p className="mt-2 text-sm font-medium">Recommendations</p>
                    </div>
                </div>
            </div>

            {/* Sekcja promocyjna */}
            <div className="flex flex-col md:flex-row items-stretch justify-center px-6 py-8">
                <img
                    src="/pc_photo_mainPage.png"
                    alt="Komputer"
                    className="w-full md:w-80 h-auto md:h-full object-cover rounded-l shadow-md"
                />
                <div
                    className="bg-slate-800 text-white p-8 rounded-r w-full md:w-96 text-center flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Stwórz idealny zestaw komputerowy i dziel się z innymi!
                    </h2>
                    <p className="mb-6 text-gray-300">
                        Dołącz do społeczności, porównuj zestawy, komentuj i ulepszaj sprzęt – wszystko w jednym
                        miejscu.
                    </p>
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200">
                        Sprawdź
                    </button>
                </div>
            </div>
        </div>
    )
}

export default mainPage;