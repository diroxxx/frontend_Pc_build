import {useEffect, useState} from "react";
import type {ComponentOffer} from "../../../shared/dtos/OfferBase.ts";

import {useAtom} from "jotai";

const CATEGORY_LABELS: Record<string, string> = {
    PROCESSOR: "CPU",
    GRAPHICS_CARD: "GPU",
    MOTHERBOARD: "Płyta główna",
    CPU_COOLER: "Chłodzenie",
    CASE_PC: "Obudowa",
    MEMORY: "RAM",
    POWER_SUPPLY: "Zasilacz",
    STORAGE: "Pamięć",
};
import {useFetchComputersByEmail} from "../user/hooks/useFetchComputersByEmail.ts";
import {userAtom} from "../../auth/atoms/userAtom.tsx";
import {selectedComputerAtom} from "../atoms/computerAtom.tsx";
import {guestComputersAtom} from "../atoms/guestComputersAtom.ts";

export default function SidePanelBuilds() {
    const [hovered, setHovered] = useState(false);
    const [user] = useAtom(userAtom);
    const { data: fetchedComputers = []} = useFetchComputersByEmail(user?.email);
    const [selectedComputer, setSelectedComputer] = useAtom(selectedComputerAtom);
    const [guestcomputers,] = useAtom(guestComputersAtom);

    const computers = user ? fetchedComputers : guestcomputers || [];


    const handleSelectBuild = (id: number) => {
        const computer = computers.find(c => c.id === id) || null;
        setSelectedComputer(computer);
    };

    const handleSelectGuestBuild = (id: number) => {
        const computer = guestcomputers?.find(c => c.id === id) || null;
        setSelectedComputer(computer);
    }


    useEffect(() => {
        if (!selectedComputer || computers.length === 0) return;
        const fresh = computers.find(c => c.id === selectedComputer.id);
        if (fresh) setSelectedComputer(fresh);
    }, [computers]);


    return (
        <>
            <div
                className={`fixed top-1/2 right-0 -translate-y-1/2 z-[60] bg-gradient-ocean text-white 
                   w-14 h-14 rounded-l-full shadow-lg flex items-center justify-center cursor-pointer
                   transition-all duration-500 ease-in-out ${
                    hovered ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
                onMouseEnter={() => setHovered(true)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </div>

            <div
                className="fixed top-1/2 right-0 -translate-y-1/2 z-50 bg-dark-surface border border-dark-border shadow-2xl
                   overflow-hidden flex flex-col transition-transform duration-500 ease-in-out"
                style={{
                    width: "320px",
                    height: "500px",
                    borderRadius: "14px 0 0 14px",
                    transform: hovered ? "translateX(0)" : "translateX(320px)",
                    boxShadow: "-8px 0 32px rgba(0,0,0,0.4)",
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Header */}
                <div className="px-4 py-3 border-b border-dark-border flex-shrink-0">
                    <h3 className="text-xs font-bold text-dark-muted uppercase tracking-widest">
                        Twoje zestawy ({computers?.length || 0})
                    </h3>
                </div>

                <div className="p-3 overflow-y-auto flex-1 space-y-3">
                    {(!computers || computers.length === 0) ? (
                        <p className="text-xs text-dark-muted py-2">
                            Brak zestawów — utwórz nowy w konfiguratorze.
                        </p>
                    ) : (
                        <div className="space-y-1">
                            {computers.map((computer, index) => (
                                <div
                                    key={index}
                                    onClick={() => user ? handleSelectBuild(computer.id) : handleSelectGuestBuild(computer.id)}
                                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                                        selectedComputer?.id === computer.id
                                            ? "bg-dark-accent/15 border border-dark-accent/40 text-dark-accent"
                                            : "bg-dark-surface2 border border-transparent hover:border-dark-border"
                                    }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-semibold truncate ${selectedComputer?.id === computer.id ? "text-dark-accent" : "text-dark-text"}`}>
                                            {computer.name}
                                        </p>
                                        <p className="text-[11px] text-dark-muted mt-0.5">
                                            {(computer.offers?.length || 0)} komponentów · {(computer.price ?? 0).toLocaleString("pl-PL")} zł
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedComputer && (
                        <div className="border-t border-dark-border pt-3">
                            <h4 className="text-xs font-bold text-dark-text mb-2 truncate">
                                {selectedComputer.name}
                            </h4>

                            {selectedComputer.offers?.length ? (
                                <div className="space-y-1">
                                    {selectedComputer.offers.map((offer: ComponentOffer, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-2 bg-dark-surface2 rounded-lg hover:border-dark-border border border-transparent transition-colors"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-dark-text truncate">
                                                    {offer.brand} {offer.model}
                                                </p>
                                                <p className="text-[11px] text-dark-muted mt-0.5">
                                                    {CATEGORY_LABELS[offer.componentType] ?? offer.componentType} · {offer.price.toLocaleString("pl-PL")} zł
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-dark-muted italic">
                                    Brak dodanych komponentów.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer – total */}
                {selectedComputer && (
                    <div className="px-4 py-3 border-t border-dark-border flex-shrink-0 flex justify-between items-center">
                        <span className="text-xs font-medium text-dark-muted">Łącznie:</span>
                        <span className="text-sm font-extrabold text-dark-text">
                            {selectedComputer.price?.toLocaleString("pl-PL")} zł
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}