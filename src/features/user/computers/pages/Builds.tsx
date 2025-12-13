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

                    <div  className={user ? 'blur-none': 'blur-sm'} >
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

                    {!user && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center ">
                            <div className="bg-white/80 border-4 border-ocean-dark-blue  rounded px-8 py-7 text-center">
                                <p className="text-midnight-dark mb-2">Aby korzystać z konfiguratora, musisz być zalogowany.</p>
                                <button
                                    className="px-4 py-2 bg-ocean-blue text-white rounded hover:bg-ocean-dark-blue transition-colors cursor-pointer "
                                    onClick={() => navigate('/login')}
                                >
                                    Zaloguj się
                                </button>
                            </div>
                        </div>
                    )}


                </div>

        </div>
    );
}

