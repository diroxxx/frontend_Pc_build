import { useNavigate } from "react-router-dom";
import SidePanelBuilds from "../../features/computers/components/SidePanelBuilds.tsx";
import { usePrefetchComputers } from "../../features/computers/user/hooks/usePrefetchComputers.ts";
import CompoenentsPcStats from "../../shared/components/CompoenentsPcStats.tsx";
import { ShoppingBag, Cpu, Gamepad2, Users, ChevronRight, Zap, RefreshCw, Store } from "lucide-react";

const FEATURES = [
    {
        icon: ShoppingBag,
        color: "text-dark-accent",
        bg: "bg-dark-accent/10",
        title: "Oferty w czasie rzeczywistym",
        desc: "Przeglądaj tysiące ofert CPU, GPU, RAM i innych podzespołów z Allegro, OLX i Allegro Lokalnie.",
        action: "/offers",
        label: "Przeglądaj oferty",
    },
    {
        icon: Cpu,
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        title: "Konfigurator zestawu",
        desc: "Buduj własny zestaw komputerowy, porównuj koszty i śledź podział budżetu na wykresie.",
        action: "/builds",
        label: "Złóż zestaw",
    },
    {
        icon: Gamepad2,
        color: "text-green-400",
        bg: "bg-green-400/10",
        title: "Rekomendacje dla graczy",
        desc: "Wybierz grę i sprawdź jakie podzespoły kupić. Oglądaj filmy FPS dopasowane do twojego sprzętu.",
        action: "/check-games",
        label: "Sprawdź gry",
    },
    {
        icon: Users,
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        title: "Społeczność",
        desc: "Dziel się swoimi zestawami, pytaj o porady i komentuj posty innych użytkowników.",
        action: "/community",
        label: "Dołącz do dyskusji",
    },
];

const HIGHLIGHTS = [
    { icon: Store, label: "Obsługiwane sklepy", value: "3" },
    { icon: Cpu, label: "Kategorie podzespołów", value: "8" },
    { icon: RefreshCw, label: "Aktualizacje cen", value: "Co dzień" },
    { icon: Zap, label: "Porównanie ofert", value: "Bez rejestracji" },
];

function MainPage() {
    const navigate = useNavigate();
    usePrefetchComputers();

    const partnerStores = [
        { name: "Allegro", logo: "/allegro.png", website: "https://allegro.pl" },
        { name: "Allegro Lokalnie", logo: "/Allegro-Lokalnie.png", website: "https://allegrolokalnie.pl" },
        { name: "OLX", logo: "/olx.png", website: "https://olx.pl" },
    ];

    return (
        <div className="bg-dark-bg">
            <SidePanelBuilds />

            {/* Hero */}
            <div className="pt-20 pb-14 px-6 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-accent/10 border border-dark-accent/20 text-dark-accent text-xs font-semibold mb-6">
                                <Zap size={12} />
                                Ceny aktualizowane każdego dnia
                            </div>

                            <h1 className="text-5xl md:text-6xl font-black text-dark-text leading-tight mb-6">
                                Składasz komputer?
                                <br />
                                <span className="text-dark-accent">Masz tu wszystko.</span>
                            </h1>

                            <p className="text-base text-dark-muted mb-8 max-w-xl leading-relaxed">
                                Oferty z Allegro, OLX i Allegro Lokalnie w jednym miejscu.
                                Konfigurator zestawów, rekomendacje dla graczy i aktywna społeczność.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => navigate("/builds")}
                                    className="px-7 py-3.5 bg-dark-accent text-white font-bold text-sm rounded-xl hover:bg-dark-accent-hover transition-all hover:-translate-y-0.5 shadow-lg shadow-dark-accent/20"
                                >
                                    Złóż swój zestaw
                                </button>
                                <button
                                    onClick={() => navigate("/offers")}
                                    className="px-7 py-3.5 border border-dark-border bg-dark-surface text-dark-text font-bold text-sm rounded-xl hover:border-dark-accent hover:text-dark-accent transition-all"
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

            {/* Highlights strip */}
            <div className="border-y border-dark-border bg-dark-surface">
                <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {HIGHLIGHTS.map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-dark-surface2 border border-dark-border flex items-center justify-center flex-shrink-0">
                                <Icon size={16} className="text-dark-accent" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-dark-text leading-tight">{value}</p>
                                <p className="text-[11px] text-dark-muted">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div className="py-16 px-6 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-dark-text mb-2">Co znajdziesz w aplikacji?</h2>
                        <p className="text-dark-muted text-sm">Wszystkie narzędzia do świadomego zakupu podzespołów</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {FEATURES.map(({ icon: Icon, color, bg, title, desc, action, label }) => (
                            <div
                                key={title}
                                className="group bg-dark-surface border border-dark-border rounded-xl p-5 hover:border-dark-accent/40 transition-all duration-200 flex flex-col"
                            >
                                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4 flex-shrink-0`}>
                                    <Icon size={20} className={color} />
                                </div>
                                <h3 className="text-sm font-bold text-dark-text mb-2">{title}</h3>
                                <p className="text-xs text-dark-muted leading-relaxed flex-1">{desc}</p>
                                <button
                                    onClick={() => navigate(action)}
                                    className={`mt-4 flex items-center gap-1 text-xs font-semibold ${color} hover:underline`}
                                >
                                    {label}
                                    <ChevronRight size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Partner stores */}
            <div className="border-t border-dark-border py-14">
                <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
                    <h2 className="text-xl font-bold text-dark-text text-center mb-1">Obsługiwane sklepy</h2>
                    <p className="text-dark-muted text-center text-xs mb-8">
                        Kolejne sklepy będą dodawane w przyszłości
                    </p>

                    <div className="flex justify-center gap-6 flex-wrap">
                        {partnerStores.map((store) => (
                            <a
                                key={store.name}
                                href={store.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-center gap-3"
                            >
                                <div className="w-36 h-24 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-dark-accent/50 transition-all duration-200 shadow-md group-hover:shadow-dark-accent/20 group-hover:scale-105">
                                    <img
                                        src={store.logo}
                                        alt={store.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-sm text-dark-muted font-semibold group-hover:text-dark-accent transition-colors">
                                    {store.name}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
