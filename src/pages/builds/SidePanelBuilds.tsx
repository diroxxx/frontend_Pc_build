import { useState } from "react";
import { useAtom } from 'jotai';
import { 
  listOfComputers, 
  selectedComputerIdAtom, 
  createNewEmptyComputerAtom, 
  selectComputerAtom,
  deleteComputerAtom,
  renameComputerAtom,
  removeComponentFromBuildAtom,
  compatibilityIssuesAtom
} from '../../atomContext/computer';

export default function EdgeExpandButton() {
  const [hovered, setHovered] = useState(false);
  const [computers] = useAtom(listOfComputers);
  const [selectedComputerId] = useAtom(selectedComputerIdAtom);
  const [compatibilityIssues] = useAtom(compatibilityIssuesAtom);
  const selectedComputer = computers.find(c => c.id === selectedComputerId);
  const [, selectComputer] = useAtom(selectComputerAtom);
  const [, deleteComputer] = useAtom(deleteComputerAtom);
  const [, renameComputer] = useAtom(renameComputerAtom);
  const [, removeComponentFromBuild] = useAtom(removeComponentFromBuildAtom);
  const [, createNewEmptyComputer] = useAtom(createNewEmptyComputerAtom);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreateNewComputer = () => {
    createNewEmptyComputer();
  };

  const handleSelectComputer = (computerId: string) => {
    selectComputer(computerId);
  };

  const handleDeleteComputer = (computerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteComputer(computerId);
  };

  const handleStartRename = (computer: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNameId(computer.id);
    setEditingName(computer.name);
  };

  const handleSaveRename = () => {
    if (editingNameId && editingName.trim()) {
      renameComputer(editingNameId, editingName.trim());
    }
    setEditingNameId(null);
    setEditingName('');
  };

  const handleCancelRename = () => {
    setEditingNameId(null);
    setEditingName('');
  };

  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ 
        paddingLeft: hovered ? '20px' : '0px',
        transition: 'padding-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div 
        className="bg-white shadow-lg border border-gray-200 overflow-hidden"
        style={{
          width: hovered ? '380px' : '56px',
          borderRadius: hovered ? '12px 0 0 12px' : '28px 0 0 28px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header button */}
        <button
          onClick={handleCreateNewComputer}
          className="h-14 w-full flex items-center text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
          style={{
            borderRadius: hovered ? '12px 0 0 0' : '28px 0 0 28px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Icon */}
          <span className="w-14 flex justify-center items-center text-2xl flex-shrink-0">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 4a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H5a1 1 0 110-2h6V5a1 1 0 011-1z"
              />
            </svg>
          </span>
          
          {/* Text */}
          <div 
            className="overflow-hidden whitespace-nowrap"
            style={{
              width: hovered ? '300px' : '0px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <span
              className="ml-2 text-sm font-medium"
              style={{
                opacity: hovered ? 1 : 0,
                transform: `translateX(${hovered ? '0px' : '-20px'})`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: hovered ? '0.1s' : '0s'
              }}
            >
              Utwórz nowy komputer
            </span>
          </div>
        </button>

        {/* Computer list and selected computer details */}
        <div 
          style={{
            height: hovered ? 'auto' : '0px',
            maxHeight: hovered ? '600px' : '0px',
            opacity: hovered ? 1 : 0,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: hovered ? '0.1s' : '0s'
          }}
          className="bg-white overflow-hidden"
        >
          <div className="p-4">
            {/* Computer selection */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Wybierz komputer ({computers.length})
              </h3>
              
              {computers.length === 0 ? (
                <p className="text-xs text-gray-500">Brak komputerów. Utwórz nowy powyżej.</p>
              ) : (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {computers.map((computer) => (
                    <div
                      key={computer.id}
                      onClick={() => handleSelectComputer(computer.id)}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                        selectedComputerId === computer.id
                          ? 'bg-blue-100 border border-blue-300'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        {editingNameId === computer.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={handleSaveRename}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleSaveRename();
                              if (e.key === 'Escape') handleCancelRename();
                            }}
                            className="text-xs font-medium bg-white border border-gray-300 rounded px-1 py-0.5 w-full"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {computer.name}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {computer.components.length} komponentów • {computer.price.toLocaleString('pl-PL')}zł
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={(e) => handleStartRename(computer, e)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                          title="Zmień nazwę"
                        >
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
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
                          onClick={(e) => handleDeleteComputer(computer.id, e)}
                          className="text-red-400 hover:text-red-600 p-1"
                          title="Usuń komputer"
                        >
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
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
                  ))}
                </div>
              )}
            </div>

            {/* Compatibility Issues Section */}
            {selectedComputer && compatibilityIssues.length > 0 && (
              <div className="mb-4 border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="mr-1 text-red-500">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Problemy z kompatybilnością
                </h3>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {compatibilityIssues.map((issue, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-xs border ${
                        issue.type === 'error'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-start gap-1">
                        {issue.type === 'error' ? (
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5 text-red-600">
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        ) : (
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5 text-yellow-600">
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
                </div>
              </div>
            )}

            {/* Selected computer details */}
            {selectedComputer && selectedComputer.components.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  {selectedComputer.name} - Komponenty
                </h3>
                
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {selectedComputer.components.map((component, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {component.brand} {component.model}
                        </p>
                        <p className="text-xs text-gray-500">
                          {component.componentType} • {component.price.toLocaleString('pl-PL')}zł
                        </p>
                      </div>
                      <button
                        onClick={() => removeComponentFromBuild(component.componentType)}
                        className="ml-2 text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                      >
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
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
                  ))}
                </div>
                
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-900">Łącznie:</span>
                    <span className="text-xs font-bold text-blue-600">
                      {selectedComputer.price.toLocaleString('pl-PL')}zł
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}