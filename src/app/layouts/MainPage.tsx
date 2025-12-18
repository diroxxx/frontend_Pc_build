import { useNavigate } from "react-router-dom";
import SidePanelBuilds from "../../features/computers/components/SidePanelBuilds.tsx";
import { usePrefetchComputers } from "../../features/computers/user/hooks/usePrefetchComputers.ts";

function MainPage() {
    const navigate = useNavigate();
    usePrefetchComputers();

    const partnerStores = [
        { name: "Allegro", logo: "/allegro.png", website: "https://allegro.pl" },
        { name: "Allegro Lokalnie", logo: "/Allegro-Lokalnie.png", website: "https://allegrolokalnie.pl" },
        { name: "OLX", logo: "/olx.png", website: "https://olx.pl" },
        { name: "X-kom", logo: "/x-kom.png", website: "https://x-kom.pl" },
    ];

    return (
        <div className="min-h-screen bg-ocean-white">
            <SidePanelBuilds />

            <div className="pt-24 pb-16 px-6 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">

                            <h1 className="text-5xl md:text-6xl font-black text-ocean-dark-blue leading-tight mb-8">
                                Składasz peceta?
                                <br />
                                <span className="text-ocean-blue">Masz tu wszystko.</span>
                            </h1>

                            <p className="text-xl text-gray-700 mb-10 max-w-xl">
                                Oferty aktualizowane co chwilę.
                                Konfigurator, społeczność, testy w grach.s
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <button
                                    onClick={() => navigate("/builds")}
                                    className="px-10 py-5 bg-ocean-blue text-white font-bold text-xl rounded-xl shadow-lg hover:bg-ocean-dark-blue transition-all hover:-translate-y-1"
                                >
                                    Złóż swój zestaw
                                </button>

                                <button
                                    onClick={() => navigate("/offers")}
                                    className="px-10 py-5 border-4 border-ocean-blue text-ocean-blue font-bold text-xl rounded-xl bg-white hover:bg-ocean-blue hover:text-white transition-all"
                                >
                                    Zobacz aktualne ceny
                                </button>
                            </div>
                        </div>

                        <div className="order-1 md:order-2">
                            <div className="relative">
                                <img
                                    src="/pc_photo_mainPage.png"
                                    alt="Składanie peceta"
                                    className="relative z-10 rounded-2xl shadow-2xl border-8 border-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-ocean-dark-blue py-20">
                <div className="min-h-96 flex flex-col items-center justify-center px-6">

                    <h2 className="text-4xl md:text-5xl font-black text-center text-ocean-white mb-4">
                        Obsługiwane sklepy
                    </h2>
                    <p className="text-ocean-light-blue text-center text-lg mb-12">
                        kolejne sklepy będą dodawane w przyszłości
                    </p>

                    <div className="flex justify-center gap-2 max-w-5xl w-full">
                        {partnerStores.map((store) => (
                            <a
                                key={store.name}
                                href={store.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-center"
                            >
                                <div className="bg-white p-6 rounded-2xl shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                                    <img
                                        src={store.logo}
                                        alt={store.name}
                                        className="h-16 object-contain"
                                    />
                                </div>
                                <span className="mt-4 text-ocean-light-blue font-medium group-hover:text-white transition-colors">
            {store.name}
          </span>
                            </a>
                        ))}
                    </div>
                    <p className="mt-12 text-center text-ocean-light-blue/70 text-sm">
                        Aktualizacje automatycznie w ciągu dnia
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MainPage;