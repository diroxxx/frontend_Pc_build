import {useEffect} from "react";
import {useFetchOffersSpecs} from "../../../atomContext/componentAtom.tsx";
import {useFetchComponents} from "../hooks/useFetchComponents.ts";
import {useOffersCount} from "../../../hooks/useOffersCount.ts";
import OfferUpdateChart from "../components/OfferUpdateChart.tsx";
import ShopOffersShareChart from "../components/ShopOffersShareChart.tsx";
import {useAllUsers} from "../UsersManage/useAllUsers.ts";

interface GeneralInfoProps {
    onNavigate: (tab: string) => void;
}

const GeneralPage = ({ onNavigate }: GeneralInfoProps) => {
    const {data} = useAllUsers();
    const fetchOffersSpecs = useFetchOffersSpecs();
    const { data: components} = useFetchComponents(0);
    const {data: offersCount} = useOffersCount();


    useEffect(() => {
        fetchOffersSpecs();
    }, [fetchOffersSpecs]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-admin-info rounded-xl shadow-lg p-5 flex flex-col items-center justify-center hover:shadow-xl transition-shadow">
                    <svg className="w-10 h-10 text-ocean-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-ocean-white text-sm font-semibold">Użytkownicy</h3>
                    <p className="text-ocean-white text-2xl font-bold">{data?.length}</p>
                    <button onClick={() => onNavigate("users")} className="text-ocean-light-blue text-xs mt-1 hover:underline">
                        Zobacz →
                    </button>
                </div>

                <div className="bg-gradient-admin-info rounded-xl shadow-lg p-5 flex flex-col items-center justify-center hover:shadow-xl transition-shadow">
                    <svg className="w-10 h-10 text-ocean-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <h3 className="text-ocean-white text-sm font-semibold">Komponenty</h3>
                    <p className="text-ocean-white text-2xl font-bold">{components?.totalElements ?? 0}</p>
                    <button onClick={() => onNavigate("components")} className="text-ocean-light-blue text-xs mt-1 hover:underline">
                        Zobacz →
                    </button>
                </div>

                <div className="bg-gradient-admin-info rounded-xl shadow-lg p-5 flex flex-col items-center justify-center hover:shadow-xl transition-shadow">
                    <svg className="w-10 h-10 text-ocean-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <h3 className="text-ocean-white text-sm font-semibold">Oferty</h3>
                    <p className="text-ocean-white text-2xl font-bold">{offersCount?.toLocaleString() ?? 0}</p>
                    <button onClick={() => onNavigate("offers")} className="text-ocean-light-blue text-xs mt-1 hover:underline">
                        Zobacz →
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-admin-info rounded-xl shadow-lg p-6 min-h-96">
                    <h3 className="text-ocean-white text-lg font-semibold mb-4">Liczba dodanych ofert (30 dni)</h3>
                    <OfferUpdateChart />
                </div>

                <div className="bg-gradient-admin-info rounded-xl shadow-lg p-6 min-h-96">
                    <h3 className="text-ocean-white text-lg font-semibold mb-4">Udział sklepów w ofertach</h3>
                    <ShopOffersShareChart />
                </div>
            </div>
        </div>
    );
}

export default GeneralPage;