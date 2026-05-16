import {useAtom} from 'jotai';
import {useNavigate} from 'react-router-dom';
import {userAtom} from "../../../auth/atoms/userAtom.tsx";
import {useFetchComputersByEmail} from "../hooks/useFetchComputersByEmail.ts";
import {useEffect} from "react";
import BuildList from "../../components/BuildList.tsx";
import BuildConfiguration from "../../components/BuildConfiguration.tsx";
import BudgetBreakdown from "../../components/BudgetBreakdown.tsx";
import {useSaveComputerByUserEmail} from "../hooks/useSaveComputersByUserEmail.ts";
import type {ComputerDto} from "../../../../shared/dtos/ComputerDto.ts";
import {ComponentTypeEnum} from "../../../../shared/dtos/BaseItemDto.ts";
import {selectedComputerAtom} from "../../atoms/computerAtom.tsx";
import {LoadingSpinner} from "../../../../assets/components/ui/LoadingSpinner.tsx";
import {guestComputersAtom} from "../../atoms/guestComputersAtom.ts";
import { Info } from "lucide-react";
import {selectedCategoryAtom} from "../../atoms/selectedCategoryAtom.ts";
import { offerLeftPanelFiltersAtom } from '../../../../shared/atoms/OfferLeftPanelFiltersAtom.ts';
import { SortByOffersEnum } from '../../../../shared/dtos/SortByOffersEnum.ts';

export default function ConfiguratorPcPage() {
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
    const [offerLeftPanelFilters, setOfferLeftPanelFilters] = useAtom(offerLeftPanelFiltersAtom);
    

    useEffect(() => {
        if (!selectedComputer || fetchedComputers.length === 0) return;
        const fresh = fetchedComputers.find(c => c.id === selectedComputer.id);
        if (fresh && fresh !== selectedComputer) {
            setSelectedComputer(fresh);
        }
    }, [fetchedComputers, selectedComputer, setSelectedComputer]);


const handleAddComponent = (category: ComponentTypeEnum) => {
    setSelectedCategory(category);
    
    const newFilters: any = {
        componentType: category,
        brand: "",
        minPrize: 0,
        maxPrize: 99999,
        itemCondition: undefined,
        shopName: "",
        query: undefined,
        sortBy: offerLeftPanelFilters.sortBy || SortByOffersEnum.NEWEST
    };

    if (selectedComputer?.offers) {
        const processor = selectedComputer.offers.find(o => o.componentType === ComponentTypeEnum.PROCESSOR);
        const motherboard = selectedComputer.offers.find(o => o.componentType === ComponentTypeEnum.MOTHERBOARD);
        const graphicsCard = selectedComputer.offers.find(o => o.componentType === ComponentTypeEnum.GRAPHICS_CARD);

        const compatibilityData: any = {};

        switch (category) {
            case ComponentTypeEnum.MOTHERBOARD:
                if (processor && 'socketType' in processor) {
                    compatibilityData.socketType = processor.socketType;
                }
                break;

            case ComponentTypeEnum.CPU_COOLER:
                if (processor && 'socketType' in processor) {
                    compatibilityData.socketType = processor.socketType;
                }
                break;

            case ComponentTypeEnum.MEMORY:
                if (motherboard && 'memoryType' in motherboard) {
                    compatibilityData.memoryType = motherboard.memoryType;
                }
                break;

            case ComponentTypeEnum.PROCESSOR:
                if (motherboard && 'socketType' in motherboard) {
                    compatibilityData.socketType = motherboard.socketType;
                }
                break;

            case ComponentTypeEnum.CASE_PC:
                if (motherboard && 'format' in motherboard) {
                    compatibilityData.format = motherboard.format;
                }
                break;

            case ComponentTypeEnum.POWER_SUPPLY:
                let totalPowerDraw = 0;
                
                if (processor && 'tdp' in processor) {
                    totalPowerDraw += processor.tdp || 0;
                }
                
                if (graphicsCard && 'powerDraw' in graphicsCard) {
                    totalPowerDraw += graphicsCard.powerDraw || 0;
                }
                
                if (totalPowerDraw > 0) {
                    const recommendedPower = Math.ceil(totalPowerDraw * 1.3);
                    compatibilityData.minPowerWatt = recommendedPower;
                    newFilters.minPrize = recommendedPower;
                }
                break;
        }

        if (Object.keys(compatibilityData).length > 0) {
            sessionStorage.setItem('compatibilityFilter', JSON.stringify(compatibilityData));
        } else {
            sessionStorage.removeItem('compatibilityFilter');
        }
    } else {
        sessionStorage.removeItem('compatibilityFilter');
    }

    setOfferLeftPanelFilters(newFilters);
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

        const existingNumbers = fetchedComputers
        .map(c => {
            const match = c.name.match(/Zestaw (\d+)$/);
            return match ? parseInt(match[1]) : 0;
        })
        .filter(n => n > 0)

        const nextNumber = existingNumbers.length > 0
        ? Math.max(...existingNumbers) + 1 
        : 1;

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
         const existingNumbers = guestcomputers
        .map(c => {
            const match = c.name.match(/Zestaw (\d+)$/);
            return match ? parseInt(match[1]) : 0;
        })
        .filter(n => n > 0)

        const nextNumber = existingNumbers.length > 0
        ? Math.max(...existingNumbers) + 1 
        : 1;

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
        <div className="bg-dark-bg">
            <div className="max-w-7xl mx-auto px-4 py-6">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-dark-text">Konfigurator PC</h1>
                    <p className="text-sm text-dark-muted mt-1">Zbuduj swój zestaw komputerowy</p>
                </div>

                {saveMutation.isPending && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-dark-accent">
                        <LoadingSpinner/>
                        <span>Tworzenie nowego zestawu...</span>
                    </div>
                )}

                {saveMutation.isError && (
                    <p className="text-sm text-ocean-red mb-4">Nie udało się utworzyć zestawu</p>
                )}

                {!user && (
                    <div className="bg-dark-surface border border-dark-accent/20 rounded-xl p-4 flex gap-3 items-start mb-6">
                        <div className="flex-shrink-0 bg-dark-accent/10 text-dark-accent rounded-lg p-2.5">
                            <Info size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-dark-text">Tryb gościa</h3>
                            <p className="mt-1 text-xs text-dark-muted leading-relaxed">
                                Twoje konfiguracje są przechowywane tylko lokalnie w przeglądarce. Zaloguj się lub zarejestruj, aby zachować zestawy na stałe.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-6 items-start">
                    {/* Lewa kolumna — lista zestawów */}
                    <div className="lg:sticky lg:top-6">
                        <BuildList
                            computers={user ? fetchedComputers : guestcomputers}
                            onSelectBuild={user ? handleSelectBuild : handleSelectGuestBuild}
                            onCreateNew={user ? handleCreateNewBuild : handleCreateNewGuestBuild}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Środkowa kolumna — lista komponentów */}
                    <BuildConfiguration
                        categories={categories}
                        onAddComponent={handleAddComponent}
                    />

                    {/* Prawa kolumna — wykres budżetu */}
                    <div className="lg:sticky lg:top-6">
                        {selectedComputer && selectedComputer.offers?.length > 0 ? (
                            <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
                                <div className="px-5 py-4 border-b border-dark-border">
                                    <h2 className="text-xs font-bold text-dark-muted uppercase tracking-widest">Podział budżetu</h2>
                                </div>
                                <BudgetBreakdown
                                    offers={selectedComputer.offers}
                                    totalPrice={selectedComputer.price}
                                />
                            </div>
                        ) : (
                            <div className="bg-dark-surface border border-dark-border rounded-xl p-5 text-center text-dark-muted text-sm">
                                Dodaj komponenty, aby zobaczyć podział budżetu.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

