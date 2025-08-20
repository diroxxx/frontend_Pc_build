import React, { useState } from 'react';
import Components from '../componentsPage/Components.tsx';

function Builds() {
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<{[key: string]: any}>({});

    const componentCategories = [
        { key: 'cpu', label: 'CPU' },
        { key: 'gpu', label: 'GPU' },
        { key: 'motherboard', label: 'Motherboard' },
        { key: 'cooling', label: 'Cooling' },
        { key: 'case', label: 'Case' },
        { key: 'ram', label: 'RAM' },
        { key: 'psu', label: 'PSU' }
    ];

    const handleAddComponent = (category: string) => {
        setSelectedComponent(category);
    };

    const handleSelectComponent = (component: any) => {
        if (selectedComponent) {
            setSelectedItems(prev => ({
                ...prev,
                [selectedComponent]: component
            }));
            setSelectedComponent(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-5 bg-gray-50 min-h-screen">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">PC Configurator</h1>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="grid grid-cols-4 bg-gray-100 border-b border-gray-200 font-bold p-4">
                    <div>Component</div>
                    <div>Name</div>
                    <div>Price</div>
                    <div>Shop</div>
                </div>

                {componentCategories.map((category) => (
                    <div key={category.key} className="grid grid-cols-4 border-b border-gray-200 p-4 items-center last:border-b-0">
                        <div className="font-medium text-gray-700">{category.label}</div>
                        {selectedItems[category.key] ? (
                            <>
                                <div className="flex items-center gap-3">
                                    {selectedItems[category.key].image && (
                                        <img 
                                            src={selectedItems[category.key].image} 
                                            alt={selectedItems[category.key].name}
                                            className="w-15 h-15 object-cover rounded"
                                        />
                                    )}
                                    <div>
                                        <div className="font-medium text-gray-900">{selectedItems[category.key].name}</div>
                                        <div className="text-xs text-gray-500">
                                            {selectedItems[category.key].specs}
                                        </div>
                                    </div>
                                </div>
                                <div className="font-semibold text-green-600 text-right">
                                    {selectedItems[category.key].price}zł
                                </div>
                                <div className="text-center text-sm text-gray-700">
                                    {selectedItems[category.key].shop}
                                </div>
                            </>
                        ) : (
                            <>
                                <button 
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 w-fit"
                                    onClick={() => handleAddComponent(category.key)}
                                >
                                    + Add
                                </button>
                                <div></div>
                                <div></div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {selectedComponent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-5xl max-h-[90vh] overflow-auto relative w-full mx-4">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white sticky top-0">
                            <h3 className="text-xl font-semibold">
                                Select {componentCategories.find(c => c.key === selectedComponent)?.label}
                            </h3>
                            <button 
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                onClick={() => setSelectedComponent(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <Components />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Builds;