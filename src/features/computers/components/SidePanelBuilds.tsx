import {useEffect, useState} from "react";
import type {ComponentOffer} from "../../../shared/dtos/OfferBase.ts";

import {useAtom} from "jotai";
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
                className="fixed top-1/2 right-0 -translate-y-1/2 z-50 bg-white border border-gray-200 shadow-xl
                   overflow-hidden flex flex-col justify-between transition-transform duration-500 ease-in-out"
                style={{
                    width: "340px",
                    height: "480px",
                    borderRadius: "12px 0 0 12px",
                    transform: hovered ? "translateX(0)" : "translateX(340px)",
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="p-4 overflow-y-auto flex-1">
                    <h3 className="text-sm font-medium text-midnight-dark mb-2">
                        Twoje zestawy ({computers?.length || 0})
                    </h3>

                    {(!computers || computers.length === 0) ? (
                        <p className="text-xs text-gray-500">
                            Brak zestawów — utwórz nowy w konfiguratorze.
                        </p>
                    ) : (
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                            {computers.map((computer, index) => (
                                <div
                                    key={index}
                                    onClick={() => user ? handleSelectBuild(computer.id) : handleSelectGuestBuild(computer.id)}
                                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                                        selectedComputer?.id === computer.id
                                            ? "bg-ocean-light-blue bg-opacity-30 border border-ocean-blue"
                                            : "bg-gray-50 hover:bg-gray-100"
                                    }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-midnight-dark truncate">
                                            {computer.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(computer.offers?.length || 0)} komponentów - {" "}
                                            {(computer.price ?? 0).toLocaleString("pl-PL")} zł
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedComputer && (
                        <div className="mt-4 border-t border-gray-200 pt-3">
                            <h3 className="text-sm font-medium text-midnight-dark mb-2">
                                {selectedComputer.name}
                            </h3>

                            {selectedComputer.offers?.length ? (
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                    {selectedComputer.offers.map((offer: ComponentOffer, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-midnight-dark truncate">
                                                    {offer.brand} {offer.model}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {offer.componentType} •{" "}
                                                    {offer.price.toLocaleString("pl-PL")} zł
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 italic">
                                    Brak dodanych komponentów.
                                </p>
                            )}

                            <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-xs font-medium text-midnight-dark">Łącznie:</span>
                                <span className="text-xs font-bold text-ocean-dark-blue">
                  {selectedComputer.price?.toLocaleString("pl-PL")} zł
                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}