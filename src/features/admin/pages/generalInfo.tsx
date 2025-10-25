import {useFetchAllUsers, usersListAtom} from "../atoms/adminAtom.tsx";
import { useAtomValue } from "jotai";
import {useEffect} from "react";
import {useFetchOffersSpecs} from "../../../atomContext/componentAtom.tsx";
import {useFetchComponents} from "../hooks/useFetchComponents.ts";

interface GeneralInfoProps {
    onNavigate: (tab: string) => void;
}

const GeneralInfo = ({ onNavigate }: GeneralInfoProps) => {
    const users = useAtomValue(usersListAtom);
    const fetchAllUsers = useFetchAllUsers();
    const fetchOffersSpecs = useFetchOffersSpecs();
    const { data: components = [], isLoading, error } = useFetchComponents();


    useFetchComponents();

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    useEffect(() => {
        fetchOffersSpecs();
    }, [fetchOffersSpecs]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-admin-info rounded-xl shadow-lg p-8 flex flex-col items-center justify-center">
                <svg className="w-12 h-12 text-ocean-white mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 className="text-text-ocean-white text-lg font-semibold mb-2">
                    Użytkownicy
                </h2>
                <span className="text-text-ocean-white text-4xl font-bold mb-2">{users.length}</span>
                <p
                    onClick={() => onNavigate("users")}
                    className="text-text-ocean-white text-sm cursor-pointer hover:underline hover:text-ocean-light-blue transition-colors"
                >
                    Zobacz więcej
                </p>
            </div>

            <div className="bg-gradient-admin-info rounded-xl shadow-lg p-8 flex flex-col items-center justify-center">
                <svg className="w-12 h-12 text-ocean-white mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <h2 className="text-text-ocean-white text-lg font-semibold mb-2">
                    Komponenty
                </h2>
                <span className="text-text-ocean-white text-4xl font-bold mb-2">{components.length}</span>
                <p
                    onClick={() => onNavigate("components")}
                    className="text-text-ocean-white text-sm cursor-pointer hover:underline hover:text-ocean-light-blue transition-colors"
                >
                    Zobacz więcej
                </p>
            </div>

            <div className="bg-gradient-admin-info rounded-xl shadow-lg p-8 flex flex-col items-center justify-center">
                <svg className="w-12 h-12 text-ocean-white mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <h2 className="text-text-ocean-white text-lg font-semibold mb-2">
                    Oferty
                </h2>
                <span className="text-text-ocean-white text-4xl font-bold mb-2">0</span>
                <p
                    onClick={() => onNavigate("offers")}
                    className="text-text-ocean-white text-sm cursor-pointer hover:underline hover:text-ocean-light-blue transition-colors"
                >
                    Zobacz więcej
                </p>
            </div>
        </div>
    );
}

export default GeneralInfo;