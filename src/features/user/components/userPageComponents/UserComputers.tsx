import { useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import { 
  listOfComputers, 
  deleteComputerAtom,
  renameComputerAtom,
  toggleComputerVisibilityAtom,
  type CompatibilityIssue
} from '../../../../atomContext/computerAtom.tsx';
import type { computerAtom } from '../../../../atomContext/computerAtom.tsx';
import type { ComponentDto } from '../../../../atomContext/offerAtom.tsx';

// Import compatibility checking functions
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

function UserComputers() {
  const [computers] = useAtom(listOfComputers);
  const [, deleteComputer] = useAtom(deleteComputerAtom);
  const [, renameComputer] = useAtom(renameComputerAtom);
  const [, toggleVisibilityAtom] = useAtom(toggleComputerVisibilityAtom);
  const [selectedComputer, setSelectedComputer] = useState<computerAtom | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleViewDetails = (computer: computerAtom) => {
    setSelectedComputer(computer);
  };

  const handleCloseModal = () => {
    setSelectedComputer(null);
  };

  const handleStartRename = (computerIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(computerIndex);
    setEditingName(computers[computerIndex].name);
  };

  const handleSaveRename = () => {
    if (editingIndex !== null && editingName.trim()) {
      renameComputer(editingIndex, editingName.trim());
    }
    setEditingIndex(null);
    setEditingName('');
  };

  const handleCancelRename = () => {
    setEditingIndex(null);
    setEditingName('');
  };

  const handleDeleteComputer = (computerIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć ten zestaw?')) {
      deleteComputer(computerIndex);
      setSelectedComputer(null);
    }
  };

  const toggleVisibility = (computerIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleVisibilityAtom(computerIndex);
  };

  // Calculate compatibility issues for each computerAtom
  const computersWithCompatibility = useMemo(() => {
    return computers.map(computer => ({
      ...computer,
      compatibilityIssues: checkAllCompatibility(computer.offers)
    }));
  }, [computers]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Moje zestawy komputerowe</h2>
        <span className="text-sm text-gray-600">
          {computers.length} {computers.length === 1 ? 'zestaw' : 'zestawów'}
        </span>
      </div>

      {computersWithCompatibility.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-gray-500 text-lg mb-2">Brak zestawów komputerowych</div>
          <p className="text-gray-400">Stwórz swój pierwszy zestaw komputerowy używając naszego konfiguratora.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {computersWithCompatibility.map((computer, index) => (
            <div
              key={index}
              onClick={() => handleViewDetails(computer)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={handleSaveRename}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSaveRename();
                        if (e.key === 'Escape') handleCancelRename();
                      }}
                      className="text-lg font-semibold bg-white border border-gray-300 rounded px-2 py-1"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-gray-900">{computer.name}</h3>
                  )}
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                        />
                      </svg>
                      {computer.offers.length} komponentów
                    </span>
                    
                    <span className="flex items-center gap-1 font-medium text-green-600">
                      {computer.price.toLocaleString('pl-PL')} zł
                    </span>
                    
                    <span className={`flex items-center gap-1 ${computer.isVisible ? 'text-blue-600' : 'text-gray-500'}`}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={computer.isVisible 
                            ? "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          }
                        />
                      </svg>
                      {computer.isVisible ? 'Publiczny' : 'Prywatny'}
                    </span>
                  </div>

                  {/* Compatibility Issues Display */}
                  {computer.compatibilityIssues.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center gap-1 text-xs font-medium text-red-600">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        Problemy z kompatybilnością ({computer.compatibilityIssues.length})
                      </div>
                      
                      <div className="space-y-1 max-h-20 overflow-y-auto">
                        {computer.compatibilityIssues.slice(0, 2).map((issue, index) => (
                          <div
                            key={index}
                            className={`px-2 py-1 rounded text-xs border ${
                              issue.type === 'error'
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                            }`}
                          >
                            <div className="flex items-start gap-1">
                              {issue.type === 'error' ? (
                                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5 text-red-600">
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              ) : (
                                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5 text-yellow-600">
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                  />
                                </svg>
                              )}
                              <span className="leading-tight">{issue.message}</span>
                            </div>
                          </div>
                        ))}
                        {computer.compatibilityIssues.length > 2 && (
                          <div className="text-xs text-gray-500 px-2">
                            i {computer.compatibilityIssues.length - 2} więcej...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleVisibility(index, e)}
                    className={`p-2 rounded-lg transition-colors ${
                      computer.isVisible 
                        ? 'text-blue-600 hover:bg-blue-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={computer.isVisible ? 'Ukryj na forum' : 'Pokaż na forum'}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={computer.isVisible 
                          ? "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        }/>
                    </svg>
                  </button>

                  <button
                    onClick={(e) => handleStartRename(index, e)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Zmień nazwę"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => handleDeleteComputer(index, e)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Usuń zestaw"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedComputer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedComputer.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedComputer.offers.length} komponentów • {selectedComputer.price.toLocaleString('pl-PL')} zł
                </p>
                
                {/* Show compatibility issues in modal header */}
                {(() => {
                  const issues = checkAllCompatibility(selectedComputer.offers);
                  if (issues.length > 0) {
                    return (
                      <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {issues.length} {issues.length === 1 ? 'problem' : 'problemów'} z kompatybilnością
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              <button 
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={handleCloseModal}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Show detailed compatibility issues in modal */}
              {(() => {
                const issues = checkAllCompatibility(selectedComputer.offers);
                if (issues.length > 0) {
                  return (
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="mr-2 text-red-500">
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        Problemy z kompatybilnością
                      </h4>
                      
                      <div className="space-y-2 mb-6">
                        {issues.map((issue, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${
                              issue.type === 'error'
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : 'bg-yellow-50 text-yellow-800 border-yellow-200'
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
                  );
                }
                return null;
              })()}

              {selectedComputer.offers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Ten zestaw nie zawiera żadnych komponentów
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="grid grid-cols-4 bg-gray-100 border-b border-gray-200 font-bold p-4">
                    <div>Komponent</div>
                    <div>Nazwa</div>
                    <div>Cena</div>
                    <div>Sklep</div>
                  </div>

                  {selectedComputer.offers.map((component, index) => (
                    <div key={index} className="grid grid-cols-4 border-b border-gray-200 p-4 items-center last:border-b-0">
                      <div className="font-medium text-gray-700">{component.componentType}</div>
                      
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
                      
                      <div className="text-center">
                        <div className="flex justify-center">
                          {component.shop === 'allegro' && (
                            <img src="allegro.png" alt="Allegro" className="w-8 h-8 object-contain" />
                          )}
                          {component.shop === 'olx' && (
                            <img src="olx.png" alt="OLX" className="w-8 h-8 object-contain" />
                          )}
                          {component.shop === 'allegro_lokalnie' && (
                            <img src="Allegro-Lokalnie.png" alt="Allegro Lokalnie" className="w-8 h-8 object-contain" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserComputers;