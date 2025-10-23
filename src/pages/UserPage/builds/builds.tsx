import React from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { 
  listOfComputers, 
  selectedComputerIdAtom, 
  createNewEmptyComputerAtom,
  selectComputerAtom,
  deleteComputerAtom,
  removeComponentFromBuildAtom,
  type CompatibilityIssue
} from '../../../atomContext/computerAtom.tsx';
import {categoriesAtom, selectedCategoryAtom} from '../../../atomContext/offerAtom.tsx';
import type {ComponentOffer,} from "../../../atomContext/offerAtom.tsx";
import {isCaseOffer, isProcessorOffer, isMotherboardOffer, isCoolerOffer, isMemoryOffer, isGraphicsCardOffer,isPowerSupplyOffer} from "../../../atomContext/offerAtom.tsx";

const checkSocketCompatibility = (offers: ComponentOffer[]): CompatibilityIssue[] => {
    const issues: CompatibilityIssue[] = [];

    const cpu = offers.find(isProcessorOffer);
    const motherboard = offers.find(isMotherboardOffer);
    const cooler = offers.find(isCoolerOffer);

    // CPU-Motherboard
    if (cpu && motherboard) {
        if (isProcessorOffer(cpu)) {
            if (motherboard && isMotherboardOffer(motherboard)) {
                if (motherboard.socketType !== cpu.socketType) {
                    issues.push({
                        type: 'error',
                        message: `Procesor (${cpu.socketType}) nie jest kompatybilny z płytą główną (${motherboard.socketType})`,
                        affectedComponents: ['processor', 'motherboard']
                    });
                }
            }
        }
        if (isMotherboardOffer(motherboard)) {
            if (cpu && isProcessorOffer(cpu)) {
                if (cpu.socketType !== motherboard.socketType) {
                    issues.push({
                        type: 'error',
                        message: `Płyta główna (${motherboard.socketType}) nie jest kompatybilna z procesorem (${cpu.socketType})`,
                        affectedComponents: ['motherboard', 'processor']
                    });
                }
            }
        }
    }

    // Cooler-CPU
    if (isCoolerOffer(cooler)) {
        if (cpu && isProcessorOffer(cpu)) {
            if (!cooler.coolerSocketsType.includes(cpu.socketType)) {
                issues.push({
                    type: 'error',
                    message: `Chłodzenie nie obsługuje socketu procesora (${cpu.socketType})`,
                    affectedComponents: ['cooler', 'processor']
                });
            }
        }
    }
    return issues;
};
const checkMemoryCompatibility = (components: ComponentOffer[]): CompatibilityIssue[] => {
  const issues: CompatibilityIssue[] = [];
  
  const motherboard = components.find(isMotherboardOffer);
  const memory = components.find(isMemoryOffer);
  
  if (motherboard && memory) {
    if (motherboard.memoryType !== memory.type) {
      issues.push({
        type: 'error',
        message: `Pamięć RAM (${memory.type}) nie jest kompatybilna z płytą główną (${motherboard.memoryType})`,
        affectedComponents: ['memory', 'motherboard']
      });
    }
  }
  
  return issues;
};

const checkPowerRequirements = (components: ComponentOffer[]): CompatibilityIssue[] => {
  const issues: CompatibilityIssue[] = [];
  
  const psu = components.find(isPowerSupplyOffer);
  
  if (psu) {
    let estimatedPower = 0;
    
    components.forEach(comp => {
        const gpu = components.find(isGraphicsCardOffer);
      if (gpu) {
        estimatedPower += gpu.powerDraw || 200;
      }
      // else if (comp.componentType.toLowerCase().includes('processor') || comp.componentType.toLowerCase().includes('cpu')) {
      //   estimatedPower += 100;
      // }
    });
    
    estimatedPower += 150;
    
    if (estimatedPower > psu.maxPowerWatt) {
      issues.push({
        type: 'error',
        message: `Zasilacz (${psu.maxPowerWatt}W) może być za słaby. Szacowane zapotrzebowanie: ${estimatedPower}W`,
        affectedComponents: ['power_supply']
      });
    } else if (estimatedPower > psu.maxPowerWatt * 0.8) {
      issues.push({
        type: 'warning',
        message: `Zasilacz będzie mocno obciążony. Szacowane zapotrzebowanie: ${estimatedPower}W z ${psu.maxPowerWatt}W`,
        affectedComponents: ['power_supply']
      });
    }
  }
  
  return issues;
};

const checkAllCompatibility = (components: ComponentOffer[]): CompatibilityIssue[] => {
  const issues: CompatibilityIssue[] = [];
  
  issues.push(...checkSocketCompatibility(components));
  issues.push(...checkMemoryCompatibility(components));
  issues.push(...checkPowerRequirements(components));
  
  return issues;
};

function Builds() {


    const [computers] = useAtom(listOfComputers);
    const [selectedComputerIndex] = useAtom(selectedComputerIdAtom);
    const [, selectComputer] = useAtom(selectComputerAtom);
    const [, createNewEmptyComputer] = useAtom(createNewEmptyComputerAtom);
    const [, deleteComputer] = useAtom(deleteComputerAtom);
    // const [, renameComputer] = useAtom(renameComputerAtom);
    const [, removeComponentFromBuild] = useAtom(removeComponentFromBuildAtom);
    const [categories] = useAtom(categoriesAtom);
    const [, setSelectedCategory] = useAtom(selectedCategoryAtom);
    
    const navigate = useNavigate();
    const selectedComputer = selectedComputerIndex !== null ? computers[selectedComputerIndex] : null;

    // Calculate compatibility issues for selected computerAtom
    const compatibilityIssues = selectedComputer ? checkAllCompatibility(selectedComputer.offers) : [];

    const categoryLabels: { [key: string]: string } = {
        'processor': 'CPU',
        'graphicsCard': 'GPU', 
        'motherboard': 'Płyta główna',
        'cooler': 'Chłodzenie',
        'casePc': 'Obudowa',
        'memory': 'RAM',
        'powerSupply': 'Zasilacz',
        'ssd': 'Dysk SSD',
        'hdd': 'Dysk HDD',
        'storage': 'Pamięć'
    };

    const componentCategories = categories.map(category => ({
        key: category,
        label: categoryLabels[category] || category
    }));

    const handleAddComponent = (category: string) => {
        console.log('Ustawianie kategorii:', category);
        setSelectedCategory(category);
        navigate('/components');
    };

    const handleCreateNewBuild = () => {
        createNewEmptyComputer();
    };

    const handleSelectBuild = (computerIndex: number) => {
        selectComputer(computerIndex);
    };

    const getComponentForCategory = (category: string) => {
        if (!selectedComputer) return null;
        console.log('Komponenty dla kategorii:', category);
        return selectedComputer.offers.find(c =>
            c.componentType === category
        );
    };




return (
    <div className="max-w-7xl mx-auto p-5  min-h-screen">            

        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-midnight-dark mb-4">Konfigurator PC</h1>
            <p className="text-text-midnight-dark">Stwórz swój wymarzony zestaw komputerowy</p>
        </div>

        {/* Build Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-ocean-light-blue">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-midnight-dark">Twoje zestawy</h2>
                <button
                    onClick={handleCreateNewBuild}
                    className="bg-gradient-ocean hover:bg-gradient-ocean-hover text-white px-4 py-2 rounded-lg font-medium"
                >
                    + Nowy zestaw
                </button>
            </div>

            {computers.length === 0 ? (
                <div className="text-center py-8 text-ocean-blue">
                    <p>Brak zestawów. Utwórz swój pierwszy zestaw!</p>
                </div>
            ) : (
                <div className="grid gap-3 max-h-48 overflow-y-auto">
                    {computers.map((computer, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelectBuild(index)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                selectedComputerIndex === index
                                    ? 'border-ocean-blue bg-ocean-light-blue bg-opacity-20 shadow-md'
                                    : 'border-ocean-light-blue hover:border-ocean-blue hover:bg-ocean-light-blue hover:bg-opacity-10'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium text-midnight-dark">{computer.name}</h3>
                                    <p className="text-sm text-ocean-blue">
                                        {(computer.offers || []).length} komponentów • {computer.price.toLocaleString('pl-PL')} zł
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteComputer(index);
                                        }}
                                        className="text-ocean-red hover:text-red-600 p-1 transition-colors duration-200"
                                        title="Usuń zestaw"
                                    >
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Component Configuration */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-ocean-light-blue">
            <div className="bg-gradient-ocean-dark text-white p-4">
                <h2 className="text-xl font-bold">
                    {selectedComputer ? selectedComputer.name : 'Wybierz lub utwórz zestaw'}
                </h2>
                {selectedComputer && (
                    <p className="text-ocean-light-blue text-sm">
                        Łączna cena: {selectedComputer.price.toLocaleString('pl-PL')} zł
                    </p>
                )}
            </div>

            {/* Compatibility Issues Section */}
            {selectedComputer && compatibilityIssues.length > 0 && (
                <div className="bg-red-50 border-b border-red-200 p-4">
                    <h3 className="text-sm font-medium text-ocean-red mb-2 flex items-center">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="mr-1 text-ocean-red">
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        Problemy z kompatybilnością ({compatibilityIssues.length})
                    </h3>
                    
                    <div className="space-y-2">
                        {compatibilityIssues.map((issue, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${
                                    issue.type === 'error'
                                        ? 'bg-red-100 text-ocean-red border-red-300'
                                        : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                }`}
                            >
                                <div className="flex items-start gap-2">
                                    {issue.type === 'error' ? (
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5 text-ocean-red">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5 text-yellow-600">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    )}
                                    <span className="text-sm">{issue.message}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-4 bg-gradient-gray border-b border-ocean-light-blue font-bold p-4 text-midnight-dark">
                <div>Komponent</div>
                <div>Nazwa</div>
                <div>Cena</div>
                <div>Akcje</div>
            </div>

            {componentCategories.map((category) => {
                const component = getComponentForCategory(category.key);
                
                return (
                    <div key={category.key} className="grid grid-cols-4 border-b border-ocean-light-blue p-4 items-center last:border-b-0 hover:bg-ocean-light-blue hover:bg-opacity-10 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                            <div>
                                <div className="font-medium text-midnight-dark">{category.label}</div>
                            </div>
                        </div>
                        
                        {component ? (
                            <>
                                <div className="flex items-center gap-3">
                                    {component.photoUrl && (
                                        <img 
                                            src={component.photoUrl}
                                            alt={`${component.brand} ${component.model}`}
                                            className="w-12 h-12 object-contain rounded border border-ocean-light-blue"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <div>
                                        <div className="font-medium text-midnight-dark">
                                            {component.brand} {component.model}
                                        </div>
                                        <div className="text-xs text-ocean-blue">
                                            {component.condition}
                                        </div>
                                    </div>
                                </div>
                                <div className="font-semibold text-ocean-blue">
                                    {component.price.toLocaleString('pl-PL')} zł
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        className="bg-gradient-warning hover:bg-gradient-warning-hover text-white px-3 py-1 rounded text-sm font-medium transition-all duration-300 transform hover:scale-105"
                                        onClick={() => handleAddComponent(category.key)}
                                        disabled={!selectedComputer}
                                    >
                                        Zmień
                                    </button>
                                    <button
                                        onClick={() => removeComponentFromBuild(component.componentType)}
                                        className="bg-ocean-red hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-all duration-300 transform hover:scale-105"
                                        disabled={!selectedComputer}
                                    >
                                        Usuń
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-ocean-blue italic">Nie wybrano</div>
                                <div></div>
                                <div>
                                    <button 
                                        className="bg-gradient-ocean hover:bg-gradient-ocean-hover text-white px-4 py-2 rounded-md font-medium transition-all duration-300 disabled:bg-ocean-light-blue disabled:cursor-not-allowed transform hover:scale-105"
                                        onClick={() => handleAddComponent(category.key)}
                                        disabled={!selectedComputer}
                                    >
                                        + Dodaj
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}

            {/* Total Price Section */}
            {selectedComputer && selectedComputer.offers.length > 0 && (
                <div className="bg-gradient-gray border-t-2 border-ocean-blue p-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-midnight-dark">Łączna cena zestawu:</span>
                        <span className="text-xl font-bold text-ocean-dark-blue">
                            {selectedComputer.price.toLocaleString('pl-PL')} zł
                        </span>
                    </div>
                </div>
            )}
        </div>

        {!selectedComputer && (
            <div className="mt-6 text-center p-8 bg-ocean-light-blue bg-opacity-20 border border-ocean-light-blue rounded-lg">
                <p className="text-ocean-dark-blue">
                    Wybierz istniejący zestaw lub utwórz nowy, aby rozpocząć konfigurację
                </p>
            </div>
        )}

        </div>
);
}
export default Builds;
