import React from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { 
  listOfComputers, 
  selectedComputerIdAtom, 
  createNewEmptyComputerAtom,
  selectComputerAtom,
  deleteComputerAtom,
  renameComputerAtom,
  removeComponentFromBuildAtom,
  compatibilityIssuesAtom,
  type CompatibilityIssue
} from '../../atomContext/computer';
import { categoriesAtom, selectedCategoryAtom } from '../../atomContext/offerAtom';
import type { ComponentDto } from '../../atomContext/offerAtom';
import ToastContainer from '../../components/ui/ToastProvider/ToastContainer';

// Import compatibility checking functions (same as in UserComputers)
const checkSocketCompatibility = (components: ComponentDto[]): CompatibilityIssue[] => {
  const issues: CompatibilityIssue[] = [];
  
  const cpu = components.find(c => c.componentType.toLowerCase().includes('processor') || c.componentType.toLowerCase().includes('cpu'));
  const motherboard = components.find(c => c.componentType.toLowerCase().includes('motherboard'));
  const cooler = components.find(c => c.componentType.toLowerCase().includes('cooler') || c.componentType.toLowerCase().includes('chlodzenie'));
  
  // Check CPU-Motherboard compatibility
  if (cpu && motherboard && cpu.cpuSocketType && motherboard.boardSocketType) {
    if (cpu.cpuSocketType !== motherboard.boardSocketType) {
      issues.push({
        type: 'error',
        message: `Procesor (${cpu.cpuSocketType}) nie jest kompatybilny z płytą główną (${motherboard.boardSocketType})`,
        affectedComponents: ['processor', 'motherboard']
      });
    }
  }
  
  // Check Cooler-CPU compatibility
  if (cooler && cpu && cooler.coolerSocketsType && cpu.cpuSocketType) {
    if (!cooler.coolerSocketsType.includes(cpu.cpuSocketType)) {
      issues.push({
        type: 'error',
        message: `Chłodzenie nie obsługuje socketu procesora (${cpu.cpuSocketType})`,
        affectedComponents: ['cooler', 'processor']
      });
    }
  }
  
  return issues;
};

const checkMemoryCompatibility = (components: ComponentDto[]): CompatibilityIssue[] => {
  const issues: CompatibilityIssue[] = [];
  
  const motherboard = components.find(c => c.componentType.toLowerCase().includes('motherboard'));
  const ram = components.find(c => c.componentType.toLowerCase().includes('memory') || c.componentType.toLowerCase().includes('ram'));
  
  if (motherboard && ram && motherboard.boardMemoryType && ram.ramType) {
    if (motherboard.boardMemoryType !== ram.ramType) {
      issues.push({
        type: 'error',
        message: `Pamięć RAM (${ram.ramType}) nie jest kompatybilna z płytą główną (${motherboard.boardMemoryType})`,
        affectedComponents: ['memory', 'motherboard']
      });
    }
  }
  
  return issues;
};

const checkPowerRequirements = (components: ComponentDto[]): CompatibilityIssue[] => {
  const issues: CompatibilityIssue[] = [];
  
  const psu = components.find(c => c.componentType.toLowerCase().includes('power') || c.componentType.toLowerCase().includes('psu'));
  
  if (psu && psu.powerSupplyMaxPowerWatt) {
    let estimatedPower = 0;
    
    components.forEach(comp => {
      if (comp.componentType.toLowerCase().includes('graphics') || comp.componentType.toLowerCase().includes('gpu')) {
        estimatedPower += comp.gpuPowerDraw || 200;
      } else if (comp.componentType.toLowerCase().includes('processor') || comp.componentType.toLowerCase().includes('cpu')) {
        estimatedPower += 100;
      }
    });
    
    estimatedPower += 150; // Base system power
    
    if (estimatedPower > psu.powerSupplyMaxPowerWatt) {
      issues.push({
        type: 'error',
        message: `Zasilacz (${psu.powerSupplyMaxPowerWatt}W) może być za słaby. Szacowane zapotrzebowanie: ${estimatedPower}W`,
        affectedComponents: ['power_supply']
      });
    } else if (estimatedPower > psu.powerSupplyMaxPowerWatt * 0.8) {
      issues.push({
        type: 'warning',
        message: `Zasilacz będzie mocno obciążony. Szacowane zapotrzebowanie: ${estimatedPower}W z ${psu.powerSupplyMaxPowerWatt}W`,
        affectedComponents: ['power_supply']
      });
    }
  }
  
  return issues;
};

const checkAllCompatibility = (components: ComponentDto[]): CompatibilityIssue[] => {
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
    const [, renameComputer] = useAtom(renameComputerAtom);
    const [, removeComponentFromBuild] = useAtom(removeComponentFromBuildAtom);
    const [categories] = useAtom(categoriesAtom);
    const [, setSelectedCategory] = useAtom(selectedCategoryAtom);
    
    const navigate = useNavigate();
    const selectedComputer = selectedComputerIndex !== null ? computers[selectedComputerIndex] : null;

    // Calculate compatibility issues for selected computer
    const compatibilityIssues = selectedComputer ? checkAllCompatibility(selectedComputer.components) : [];

    // Mapowanie nazw kategorii na polskie etykiety
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
        'storage': 'Pamięć masowa'
    };

    // Użyj rzeczywistych kategorii z API
    const componentCategories = categories.map(category => ({
        key: category,
        label: categoryLabels[category] || category // Fallback to original name if no mapping
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
        return selectedComputer.components.find(c => 
            c.componentType === category
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-5 bg-gray-50 min-h-screen">
            <ToastContainer />
            
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Konfigurator PC</h1>
                <p className="text-gray-600">Stwórz swój wymarzony zestaw komputerowy</p>
            </div>

            {/* Build Selection */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Twoje zestawy</h2>
                    <button
                        onClick={handleCreateNewBuild}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        + Nowy zestaw
                    </button>
                </div>

                {computers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Brak zestawów. Utwórz swój pierwszy zestaw!</p>
                    </div>
                ) : (
                    <div className="grid gap-3 max-h-48 overflow-y-auto">
                        {computers.map((computer, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelectBuild(index)}
                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                    selectedComputerIndex === index
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{computer.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {computer.components.length} komponentów • {computer.price.toLocaleString('pl-PL')} zł
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteComputer(index);
                                            }}
                                            className="text-red-400 hover:text-red-600 p-1"
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                    <h2 className="text-xl font-bold">
                        {selectedComputer ? selectedComputer.name : 'Wybierz lub utwórz zestaw'}
                    </h2>
                    {selectedComputer && (
                        <p className="text-blue-100 text-sm">
                            Łączna cena: {selectedComputer.price.toLocaleString('pl-PL')} zł
                        </p>
                    )}
                </div>

                {/* Compatibility Issues Section */}
                {selectedComputer && compatibilityIssues.length > 0 && (
                    <div className="bg-red-50 border-b border-red-200 p-4">
                        <h3 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="mr-1 text-red-600">
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
                                            ? 'bg-red-100 text-red-800 border-red-300'
                                            : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        {issue.type === 'error' ? (
                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5 text-red-600">
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

                <div className="grid grid-cols-4 bg-gray-100 border-b border-gray-200 font-bold p-4">
                    <div>Komponent</div>
                    <div>Nazwa</div>
                    <div>Cena</div>
                    <div>Akcje</div>
                </div>

                {componentCategories.map((category) => {
                    const component = getComponentForCategory(category.key);
                    
                    return (
                        <div key={category.key} className="grid grid-cols-4 border-b border-gray-200 p-4 items-center last:border-b-0 hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div>
                                    <div className="font-medium text-gray-700">{category.label}</div>
                                </div>
                            </div>
                            
                            {component ? (
                                <>
                                    <div className="flex items-center gap-3">
                                        {component.photo_url && (
                                            <img 
                                                src={component.photo_url} 
                                                alt={`${component.brand} ${component.model}`}
                                                className="w-12 h-12 object-contain rounded"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {component.brand} {component.model}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {component.condition}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-semibold text-green-600">
                                        {component.price.toLocaleString('pl-PL')} zł
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                            onClick={() => handleAddComponent(category.key)}
                                            disabled={!selectedComputer}
                                        >
                                            Zmień
                                        </button>
                                        <button
                                            onClick={() => removeComponentFromBuild(component.componentType)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                            disabled={!selectedComputer}
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-gray-400 italic">Nie wybrano</div>
                                    <div></div>
                                    <div>
                                        <button 
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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
                {selectedComputer && selectedComputer.components.length > 0 && (
                    <div className="bg-gray-50 border-t-2 border-gray-300 p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium text-gray-900">Łączna cena zestawu:</span>
                            <span className="text-xl font-bold text-blue-600">
                                {selectedComputer.price.toLocaleString('pl-PL')} zł
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {!selectedComputer && (
                <div className="mt-6 text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">
                        Wybierz istniejący zestaw lub utwórz nowy, aby rozpocząć konfigurację
                    </p>
                </div>
            )}
        </div>
    );
}

export default Builds;
