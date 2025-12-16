import {useAtom} from 'jotai';
import {useNavigate} from 'react-router-dom';
import {selectedCategoryAtom} from '../../../../atomContext/offerAtom.tsx';
import {userAtom} from "../../../../atomContext/userAtom.tsx";
import {useFetchComputersByEmail} from "../../../../hooks/useFetchComputersByEmail.ts";
import {useEffect} from "react";
import BuildList from "../components/BuildList.tsx";
import BuildConfiguration from "../components/BuildConfiguration.tsx";
import {useSaveComputerByUserEmail} from "../../../../hooks/useSaveComputersByUserEmail.ts";
import type {ComputerDto} from "../../../../types/ComputerDto.ts";
import {ComponentTypeEnum} from "../../../../types/BaseItemDto.ts";
import {selectedComputerAtom} from "../../../../atomContext/computerAtom.tsx";
import {LoadingSpinner} from "../../../../assets/components/ui/LoadingSpinner.tsx";
import {guestComputersAtom} from "../../atoms/guestComputersAtom.ts";
import { Info } from "lucide-react";

export default function Builds() {
    const navigate = useNavigate();
    const [user] = useAtom(userAtom);
    const categories:ComponentTypeEnum[] = [
        ComponentTypeEnum.PROCESSOR,
        ComponentTypeEnum.CASE_PC,
        ComponentTypeEnum.GRAPHICS_CARD,
        ComponentTypeEnum.MOTHERBOARD,
        ComponentTypeEnum.MEMORY,
        ComponentTypeEnum.POWER_SUPPLY,
        ComponentTypeEnum.STORAGE,
        ComponentTypeEnum.CPU_COOLER

    ]
    const [, setSelectedCategory] = useAtom(selectedCategoryAtom);
    const saveMutation = useSaveComputerByUserEmail();
    const [guestcomputers, setGuestComputers] = useAtom(guestComputersAtom);
    const { data: fetchedComputers = [], isLoading } = useFetchComputersByEmail(user?.email);
    const [selectedComputer, setSelectedComputer] = useAtom(selectedComputerAtom);

    useEffect(() => {
        if (!selectedComputer || fetchedComputers.length === 0) return;
        const fresh = fetchedComputers.find(c => c.id === selectedComputer.id);
        if (fresh && fresh !== selectedComputer) {
            setSelectedComputer(fresh);
        }
    }, [fetchedComputers, selectedComputer, setSelectedComputer]);


    const handleAddComponent = (category: ComponentTypeEnum) => {
        setSelectedCategory(category);
        navigate(`/offers?category=${category}`);
    };

    const handleSelectBuild = (id: number) => {
        const computer = fetchedComputers.find(c => c.id === id) || null;
        setSelectedComputer(computer);
    };


    const handleSelectGuestBuild = (id: number) => {
        const computer = guestcomputers.find(c => c.id === id) || null;
        setSelectedComputer(computer);
    }

    const handleCreateNewBuild = () => {

        if (!user?.email){
            // showToast.error()
            return;
        }

        const nextNumber = fetchedComputers.length + 1;

        const newComputer: ComputerDto = {
            id: 0,
            name: `Zestaw ${nextNumber}`,
            isVisible: false,
            price: 0,
            offers: [],
        };

        saveMutation.mutate({
            email: user.email,
            computer: newComputer,
        });

    };


    const handleCreateNewGuestBuild = () => {
        const nextNumber = guestcomputers.length + 1;

        const newComputer: ComputerDto = {
            id: Date.now(),
            name: `Zestaw ${nextNumber}`,
            isVisible: false,
            price: 0,
            offers: [],
        };

        setGuestComputers([...guestcomputers, newComputer]);
    }

    return (
        <div className="max-w-7xl mx-auto p-5 min-h-screen">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-midnight-dark mb-4">Konfigurator PC</h1>
            </div>

            {saveMutation.isPending && (
                <>
                    <p className="text-sm text-ocean-blue mt-2">Tworzenie nowego zestawu...</p>
                    <LoadingSpinner/>
                </>
            )}

            {saveMutation.isError && (
                <p className="text-sm text-ocean-red mt-2">Nie udało się utworzyć zestawu</p>
            )}

                <div className={"relative"}>

                    {user && (
                        <div>

                            <BuildList
                                computers={fetchedComputers}
                                onSelectBuild={handleSelectBuild}
                                onCreateNew={handleCreateNewBuild}
                                isLoading={isLoading}
                            />

                            <BuildConfiguration
                                categories={categories}
                                onAddComponent={handleAddComponent}
                            />

                        </div>
                    )}

                    {!user && (

                        <div className=" mx-auto mb-6">
                            <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-6 flex gap-4 items-start">
                                <div className="flex-shrink-0 bg-ocean-blue/10 text-ocean-blue rounded-full p-3">
                                    <Info/>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-ocean-light-blue">Przypomnienie</h3>
                                    <p className="mt-2 text-sm text-ocean-blue leading-relaxed">
                                        Jako gość Twoje konfiguracje są przechowywane tylko lokalnie w przeglądarce. Jeśli wyczyścisz dane przeglądarki lub zmienisz urządzenie, stracisz swoje zestawy. Aby zachować swoje konfiguracje na stałe, zaloguj się lub zarejestruj konto.
                                    </p>

                                </div>
                            </div>

                            <div className="mt-6">
                                <BuildList
                                    computers={guestcomputers}
                                    onSelectBuild={handleSelectGuestBuild}
                                    onCreateNew={handleCreateNewGuestBuild}
                                    isLoading={isLoading}
                                />

                                <BuildConfiguration
                                    categories={categories}
                                    onAddComponent={handleAddComponent}
                                />
                            </div>
                        </div>
                    )}
                </div>

        </div>
    );
}

