import { useNavigate } from "react-router-dom";
import SidePanelBuilds from "../features/user/computers/components/SidePanelBuilds.tsx";
import {usePrefetchComputers} from "../hooks/usePrefetchComputers.ts";

function MainPage() {
    const navigate = useNavigate();

    usePrefetchComputers()


    const partnerStores = [
        {
            name: "Allegro",
            logo: "../../allegro.png",
            website: "https://www.allegro.pl"
        },
        {
            name: "Allegro lokalnie",
            logo: "../../Allegro-Lokalnie.png",
            website: "https://allegrolokalnie.pl"
        },
        {
            name: "Olx",
            logo: "../../olx.png",
            website: "https://www.olx.pl"
        }
    ];

    return (
        <div className="bg-gray-100">

            <SidePanelBuilds />

            <div className="flex justify-center gap-8 px-6 py-8">
                <div
                    className="flex flex-col items-center  hover:text-ocean-blue transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate("/offers")}>
                    <div className="w-20 h-20">
                        <img
                            src="/components_mainPage.png"
                            alt="OffersUserPage"
                            className="w-full h-full object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-200"
                        />
                        <p className="mt-2 text-sm font-medium">Oferty</p>
                    </div>
                </div>

                <div
                    className="flex flex-col items-center text-gray-800 hover:text-ocean-blue transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate("/builds")}>
                    <div className="w-20 h-20">
                        <img
                            src="/build_pc_main.png"
                            alt="Tools"
                            className="w-full h-full object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-200"
                        />
                        <p className="mt-2 text-sm font-medium">Konfigurator</p>
                    </div>
                </div>

                <div
                    className="flex flex-col items-center text-gray-800 hover:text-ocean-blue transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate("/community")}>
                    <div className="w-20 h-20">
                        <img
                            src="/community_main.png"
                            alt="Community"
                            className="w-full h-full object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-200"
                        />
                        <p className="mt-2 text-sm font-medium">Forum</p>
                    </div>
                </div>

                <div
                    className="flex flex-col items-center text-gray-800 hover:text-ocean-blue transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate("/check-games")}>
                    <div className="w-20 h-20">
                        <img
                            src="/check-games.png"
                            alt="Check Games"
                            className="w-full h-full object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-200"
                        />
                        <p className="mt-2 text-sm font-medium">Sprawdz gry</p>
                    </div>
                </div>

                <div
                    className="flex flex-col items-center text-gray-800 hover:text-ocean-blue transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate("/recommendations")}>
                    <div className="w-20 h-20">
                        <img
                            src="/recommendations.png"
                            alt="Recommendations"
                            className="w-full h-full object-cover rounded shadow-md hover:shadow-lg transition-shadow duration-200"
                        />
                        <p className="mt-2 text-sm font-medium">Rekomendaje</p>
                    </div>
                </div>
            </div>

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
                        className="bg-ocean-blue hover:bg-ocean-dark-blue text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200">
                        Sprawdź
                    </button>
                </div>
            </div>

            
            <div className="bg-white py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Monitorowane sklepy
                        </h2>
                        <p className="text-gray-600">
                            Automatycznie zbieramy oferty z popularnych platform sprzedażowych
                        </p>
                    </div>
                    <div className="w-full px-4">
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-136 w-full">
                            {partnerStores.map((store, index) => (
                                <div
                                    key={index}
                                    className="group flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                    onClick={() => window.open(store.website, '_blank')}
                                >
                                    <div className="w-32 h-20 mb-3 flex items-center justify-center">
                                        <img
                                            src={store.logo}
                                            alt={`${store.name} logo`}
                                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
                                        />
                                    </div>
                                    <p className="text-xs font-medium text-gray-700 text-center">
                                        {store.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-center mt-8">
                        <p className="text-sm text-gray-500">
                            * Oferty aktualizowane są na bieżąco
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;