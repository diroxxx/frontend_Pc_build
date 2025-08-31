import { useState, useEffect } from 'react';

interface Shop {
    id: number;
    name: string;
    url: string;
    isActive: boolean;
    lastUpdate: string;
    status: 'active' | 'error' | 'disabled';
}

const OffersComponent = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'update' | 'shops'>('overview');
    
    // Update section states
    const [isAutoUpdate, setIsAutoUpdate] = useState(false);
    const [updateInterval, setUpdateInterval] = useState<'6h' | '12h' | '24h'>('12h');
    const [selectedShops, setSelectedShops] = useState<number[]>([]);
    const [isSelectAll, setIsSelectAll] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Mock shops data
    const [shops] = useState<Shop[]>([
        { id: 1, name: 'Allegro', url: 'allegro.pl', isActive: true, lastUpdate: '2024-01-15 14:30', status: 'active' },
        { id: 2, name: 'X-kom', url: 'x-kom.pl', isActive: true, lastUpdate: '2024-01-15 14:25', status: 'active' },
        { id: 3, name: 'Morele', url: 'morele.net', isActive: true, lastUpdate: '2024-01-15 14:20', status: 'active' },
        { id: 4, name: 'Komputronik', url: 'komputronik.pl', isActive: false, lastUpdate: '2024-01-14 10:15', status: 'disabled' },
        { id: 5, name: 'Media Expert', url: 'mediaexpert.pl', isActive: true, lastUpdate: '2024-01-15 13:45', status: 'error' },
    ]);

    const activeShops = shops.filter(shop => shop.isActive);

    // Initialize selected shops with all active shops
    useEffect(() => {
        if (isSelectAll) {
            setSelectedShops(activeShops.map(shop => shop.id));
        }
    }, [isSelectAll]);

    const handleShopSelection = (shopId: number) => {
        if (isAutoUpdate) return; // Disabled in auto mode
        
        setSelectedShops(prev => {
            const newSelection = prev.includes(shopId) 
                ? prev.filter(id => id !== shopId)
                : [...prev, shopId];
            
            setIsSelectAll(newSelection.length === activeShops.length);
            return newSelection;
        });
    };

    const handleSelectAllToggle = () => {
        if (isAutoUpdate) return; // Disabled in auto mode
        
        if (isSelectAll) {
            setSelectedShops([]);
        } else {
            setSelectedShops(activeShops.map(shop => shop.id));
        }
        setIsSelectAll(!isSelectAll);
    };

    const handleAutoUpdateToggle = (enabled: boolean) => {
        setIsAutoUpdate(enabled);
        if (enabled) {
            // In auto mode, always select all active shops
            setSelectedShops(activeShops.map(shop => shop.id));
            setIsSelectAll(true);
        }
        setHasUnsavedChanges(true);
    };

    const handleIntervalChange = (interval: '6h' | '12h' | '24h') => {
        setUpdateInterval(interval);
        setHasUnsavedChanges(true);
    };

    const handleManualUpdate = () => {
        if (selectedShops.length === 0) return;
        
        setIsUpdating(true);
        // Simulate update process
        setTimeout(() => {
            setIsUpdating(false);
            console.log('Manual update completed for shops:', selectedShops);
        }, 3000);
    };

    const handleSaveAutoSettings = () => {
        setHasUnsavedChanges(false);
        console.log('Auto update settings saved:', { isAutoUpdate, updateInterval });
        // TODO: Save to backend
    };

    const getIntervalText = (interval: string) => {
        switch (interval) {
            case '6h': return 'Co 6 godzin';
            case '12h': return 'Co 12 godzin';
            case '24h': return 'Co 24 godziny';
            default: return interval;
        }
    };

    const getShopStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <div className="w-2 h-2 bg-green-400 rounded-full"></div>;
            case 'error':
                return <div className="w-2 h-2 bg-red-400 rounded-full"></div>;
            case 'disabled':
                return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
            default:
                return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
        }
    };

    return (
        <div className="flex gap-4">
            {/* Left navigation */}
            <div className="w-64 flex-shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-6">    
                    <nav className="p-2 space-y-1">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                                activeTab === 'overview'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <div className="font-medium">Informacje ogólne</div>
                                <div className="text-xs opacity-75">Statystyki i przegląd</div>
                            </div>
                        </button>
                        
                        <button
                            onClick={() => setActiveTab('update')}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                                activeTab === 'update'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <div>
                                <div className="font-medium">Aktualizacja</div>
                                <div className="text-xs opacity-75">Pobieranie ofert</div>
                            </div>
                        </button>
                        
                        <button
                            onClick={() => setActiveTab('shops')}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                                activeTab === 'shops'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <div>
                                <div className="font-medium">Sklepy</div>
                                <div className="text-xs opacity-75">Konfiguracja źródeł</div>
                            </div>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 space-y-6">
                {/* General information */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Last update info bar */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-blue-900">
                                        Ostatnia aktualizacja ofert
                                    </h3>
                                    <div className="mt-1 text-sm text-blue-700">
                                        <span className="font-medium">15 stycznia 2024, 14:30</span>
                                        <span className="mx-2">•</span>
                                        <span className="text-green-700">+23 dodane</span>
                                        <span className="mx-2">•</span>
                                        <span className="text-red-700">-8 usunięte</span>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <button 
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        onClick={() => {/* TODO: Navigate to details */}}
                                    >
                                        Zobacz szczegóły →
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Informacje ogólne
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Przegląd statystyk i informacji o ofertach w systemie.
                            </p>

                            {/* Statistics cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* All offers */}
                                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Wszystkie oferty</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-2">1,247</p>
                                            <p className="text-sm text-green-600 mt-1">
                                                <span className="font-medium">+23</span> od ostatniej aktualizacji
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Active offers */}
                                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Aktywne oferty</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-2">1,198</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                96% wszystkich ofert
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* All shops */}
                                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Wszystkie sklepy</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                10 aktywnych
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>                            
                            </div>
                        </div>
                    </div>
                )}

                {/* Offers update */}
                {activeTab === 'update' && (
                    <div className="space-y-6">
                        {/* Update mode selection */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tryb aktualizacji</h3>
                            
                            <div className="space-y-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="updateMode"
                                        checked={!isAutoUpdate}
                                        onChange={() => handleAutoUpdateToggle(false)}
                                        className="mr-3 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">Aktualizacja ręczna</span>
                                        <p className="text-sm text-gray-500">Uruchamiaj aktualizacje gdy potrzebujesz</p>
                                    </div>
                                </label>
                                
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="updateMode"
                                        checked={isAutoUpdate}
                                        onChange={() => handleAutoUpdateToggle(true)}
                                        className="mr-3 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">Aktualizacja automatyczna</span>
                                        <p className="text-sm text-gray-500">System będzie automatycznie pobierał nowe oferty</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Auto update settings */}
                        {isAutoUpdate && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Ustawienia automatycznej aktualizacji
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Częstotliwość aktualizacji
                                        </label>
                                        <div className="space-y-2">
                                            {(['6h', '12h', '24h'] as const).map((interval) => (
                                                <label key={interval} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="updateInterval"
                                                        value={interval}
                                                        checked={updateInterval === interval}
                                                        onChange={(e) => handleIntervalChange(e.target.value as typeof interval)}
                                                        className="mr-2 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {getIntervalText(interval)}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {hasUnsavedChanges && (
                                        <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            <span className="text-sm text-yellow-800">Masz niezapisane zmiany</span>
                                        </div>
                                    )}
                                    
                                    <button
                                        onClick={handleSaveAutoSettings}
                                        disabled={!hasUnsavedChanges}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            hasUnsavedChanges
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        Zatwierdź ustawienia automatyczne
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Shop selection */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Wybór sklepów</h3>
                                {!isAutoUpdate && (
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={isSelectAll}
                                            onChange={handleSelectAllToggle}
                                            className="mr-2 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Zaznacz wszystkie</span>
                                    </label>
                                )}
                            </div>
                            
                            {isAutoUpdate && (
                                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        W trybie automatycznym wszystkie aktywne sklepy są wybrane domyślnie.
                                    </p>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {activeShops.map((shop) => (
                                    <label
                                        key={shop.id}
                                        className={`flex items-center p-3 border rounded-lg transition-colors ${
                                            isAutoUpdate 
                                                ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                                                : selectedShops.includes(shop.id)
                                                    ? 'bg-indigo-50 border-indigo-200'
                                                    : 'bg-white border-gray-200 hover:bg-gray-50 cursor-pointer'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedShops.includes(shop.id)}
                                            onChange={() => handleShopSelection(shop.id)}
                                            disabled={isAutoUpdate}
                                            className="mr-3 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                {getShopStatusIcon(shop.status)}
                                                <span className="font-medium text-gray-900">{shop.name}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                Ostatnia aktualizacja: {shop.lastUpdate}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            
                            <div className="mt-4 text-sm text-gray-600">
                                Wybrano: <span className="font-medium">{selectedShops.length}</span> z {activeShops.length} sklepów
                            </div>
                        </div>

                        {/* Manual update button */}
                        {!isAutoUpdate && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <button
                                    onClick={handleManualUpdate}
                                    disabled={isUpdating || selectedShops.length === 0}
                                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
                                        isUpdating || selectedShops.length === 0
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                                    }`}
                                >
                                    {isUpdating ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Aktualizowanie ofert...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Rozpocznij aktualizację
                                            {selectedShops.length > 0 && (
                                                <span className="text-sm opacity-75">
                                                    ({selectedShops.length} sklepów)
                                                </span>
                                            )}
                                        </>
                                    )}
                                </button>
                                
                                {selectedShops.length === 0 && (
                                    <p className="text-center text-sm text-red-600 mt-2">
                                        Wybierz przynajmniej jeden sklep aby rozpocząć aktualizację
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Shops */}
                {activeTab === 'shops' && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Sklepy</h2>
                            <p className="text-gray-600 mt-1">Konfiguracja i zarządzanie sklepami internetowymi</p>
                        </div>
                        
                        <div className="p-6">
                            {/* TODO: Add shop management */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OffersComponent;