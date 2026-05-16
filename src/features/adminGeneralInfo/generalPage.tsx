import { useEffect } from "react";
import { useFetchOffersSpecs } from "./atoms/componentAtom.tsx";
import { useOffersCount } from "../offers/Admin/hooks/useOffersCount.ts";
import OfferUpdateChart from "../offersUpdates/admin/components/OfferUpdateChart.tsx";
import ShopOffersShareChart from "../offersUpdates/admin/components/ShopOffersShareChart.tsx";
import { useAllUsers } from "../usersManagment/admin/hooks/useAllUsers.ts";
import { useComponentsAmount } from "./hooks/useComponentsAmount.ts";
import { Users, Cpu, Tag, ArrowRight } from "lucide-react";

interface GeneralInfoProps {
    onNavigate: (tab: string) => void;
}

const STAT_CARDS = (
    users: number | undefined,
    components: number | undefined,
    offersCount: number | undefined,
    onNavigate: (tab: string) => void
) => [
    {
        icon: Users,
        label: "Użytkownicy",
        value: users ?? "—",
        tab: "users",
        color: "text-blue-300",
    },
    {
        icon: Cpu,
        label: "Komponenty",
        value: components ?? "—",
        tab: "components",
        color: "text-purple-300",
    },
    {
        icon: Tag,
        label: "Oferty",
        value: offersCount?.toLocaleString() ?? "—",
        tab: "offers",
        color: "text-green-300",
    },
];

const GeneralPage = ({ onNavigate }: GeneralInfoProps) => {
    const { data: users } = useAllUsers();
    const fetchOffersSpecs = useFetchOffersSpecs();
    const { data: components } = useComponentsAmount();
    const { data: offersCount } = useOffersCount();

    useEffect(() => {
        fetchOffersSpecs();
    }, [fetchOffersSpecs]);

    const cards = STAT_CARDS(users?.length, components, offersCount, onNavigate);

    return (
        <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {cards.map(({ icon: Icon, label, value, tab, color }) => (
                    <div
                        key={tab}
                        className="bg-gradient-admin-info rounded-xl shadow-lg p-5 flex items-center gap-4 hover:shadow-xl transition-shadow"
                    >
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                            <Icon size={24} className={color} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{label}</p>
                            <p className="text-white text-2xl font-black leading-tight">{value}</p>
                        </div>
                        <button
                            onClick={() => onNavigate(tab)}
                            className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            title={`Przejdź do ${label}`}
                        >
                            <ArrowRight size={14} className="text-white" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-admin-info rounded-xl shadow-lg p-6">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-4 rounded-full bg-white/40 inline-block" />
                        Liczba dodanych ofert (30 dni)
                    </h3>
                    <OfferUpdateChart />
                </div>

                <div className="bg-gradient-admin-info rounded-xl shadow-lg p-6">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-4 rounded-full bg-white/40 inline-block" />
                        Udział sklepów w ofertach
                    </h3>
                    <ShopOffersShareChart />
                </div>
            </div>
        </div>
    );
};

export default GeneralPage;
