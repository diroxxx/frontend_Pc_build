import { useNavigate } from "react-router-dom";
import SidePanelBuilds from "../../features/computers/components/SidePanelBuilds.tsx";
import { usePrefetchComputers } from "../../features/computers/user/hooks/usePrefetchComputers.ts";
import CompoenentsPcStats from "../../shared/components/CompoenentsPcStats.tsx";

function MainPage() {
    const navigate = useNavigate();
    usePrefetchComputers();

    const partnerStores = [
        { name: "Allegro", logo: "/allegro.png", website: "https://allegro.pl" },
        { name: "Allegro Lokalnie", logo: "/Allegro-Lokalnie.png", website: "https://allegrolokalnie.pl" },
        { name: "OLX", logo: "/olx.png", website: "https://olx.pl" }
    ];

    return (
        <div className="min-h-screen bg-dark-bg">
            <SidePanelBuilds />

            {/* Hero */}
            <div className="pt-24 pb-16 px-6 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h1 className="text-5xl md:text-6xl font-black text-dark-text leading-tight mb-8">
                                Składasz komputer?
                                <br />
                                <span className="text-dark-accent">Masz tu wszystko.</span>
                            </h1>

                            <p className="text-lg text-dark-muted mb-10 max-w-xl leading-relaxed">
                                Oferty aktualizowane co chwilę.
                                Konfigurator, społeczność, rekomendacja podzespołów na podstawie gier komputerowych.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate("/builds")}
                                    className="px-8 py-4 bg-dark-accent text-white font-bold text-base rounded-xl hover:bg-dark-accent-hover transition-all hover:-translate-y-0.5 shadow-lg shadow-dark-accent/20"
                                >
                                    Złóż swój zestaw
                                </button>

                                <button
                                    onClick={() => navigate("/offers")}
                                    className="px-8 py-4 border border-dark-border bg-dark-surface text-dark-text font-bold text-base rounded-xl hover:border-dark-accent hover:text-dark-accent transition-all"
                                >
                                    Zobacz aktualne ceny
                                </button>
                            </div>
                        </div>

                        <div className="order-1 md:order-2">
                            <CompoenentsPcStats />
                        </div>
                    </div>
                </div>
            </div>

            {/* Partner stores */}
            <div className="border-t border-dark-border py-16">
                <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-dark-text text-center mb-2">
                        Obsługiwane sklepy
                    </h2>
                    <p className="text-dark-muted text-center text-sm mb-10">
                        kolejne sklepy będą dodawane w przyszłości
                    </p>

                    <div className="flex justify-center gap-6 flex-wrap">
                        {partnerStores.map((store) => (
                            <a
                                key={store.name}
                                href={store.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-center gap-2"
                            >
                                <div className="w-24 h-14 flex items-center justify-center rounded-xl bg-white/90 group-hover:bg-white transition-all shadow-sm">
                                    <img
                                        src={store.logo}
                                        alt={store.name}
                                        className="h-8 object-contain"
                                    />
                                </div>
                                <span className="text-xs text-dark-muted font-medium group-hover:text-dark-accent transition-colors">
                                    {store.name}
                                </span>
                            </a>
                        ))}
                    </div>

                    <p className="mt-10 text-center text-dark-muted/60 text-xs">
                        Aktualizacje automatycznie w ciągu dnia
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
