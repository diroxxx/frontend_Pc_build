import { useState, useEffect } from 'react';
import instance from '../../../components/instance';

interface AutoUpdateSettings {
    enabled: boolean;
    interval: number; // w minutach
    shops: string[];
}

const OffersComponent = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [offersUpdateMessage, setOffersUpdateMessage] = useState<string | null>(null);
    const [updateMode, setUpdateMode] = useState<'manual' | 'automatic'>('manual');
    
    // Auto update settings
    const [autoSettings, setAutoSettings] = useState<AutoUpdateSettings>({
        enabled: false,
        interval: 60, // domyślnie 60 minut
        shops: ['wszystkie']
    });
    
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [nextUpdateTime, setNextUpdateTime] = useState<Date | null>(null);

    // Dostępne opcje interwałów (w minutach)
    const intervalOptions = [
        { value: 15, label: '15 minut' },
        { value: 30, label: '30 minut' },
        { value: 60, label: '1 godzina' },
        { value: 120, label: '2 godziny' },
        { value: 240, label: '4 godziny' },
        { value: 480, label: '8 godzin' },
        { value: 720, label: '12 godzin' },
        { value: 1440, label: '24 godziny' }
    ];

    // Dostępne sklepy
    const shopOptions = [
        { value: 'wszystkie', label: 'Wszystkie sklepy' },
        { value: 'morele', label: 'Morele' },
        { value: 'komputronik', label: 'Komputronik' },
        { value: 'xkom', label: 'X-kom' },
        { value: 'allegro', label: 'Allegro' }
    ];

    const handleFetchOffers = () => {
        setIsUpdating(true);
        setOffersUpdateMessage(null);
        
        instance.get('admin/fetch-offers')
            .then(response => {
                console.log('Offers fetched successfully:', response.data);
                setOffersUpdateMessage('Oferty zostały pomyślnie pobrane.');
            })
            .catch(error => {
                console.error('Error fetching offers:', error);
                setOffersUpdateMessage('Błąd podczas pobierania ofert.');
            })
            .finally(() => {
                setIsUpdating(false);
            });
    };

    const handleSaveAutoSettings = () => {
        setIsSavingSettings(true);
        setOffersUpdateMessage(null);

        const settingsToSave = {
            ...autoSettings,
            enabled: updateMode === 'automatic'
        };

        instance.post('admin/auto-update-settings', settingsToSave)
            .then(response => {
                console.log('Auto-update settings saved:', response.data);
                setOffersUpdateMessage('Ustawienia automatycznej aktualizacji zostały zapisane.');
                
                if (updateMode === 'automatic') {
                    // Oblicz następny czas aktualizacji
                    const nextUpdate = new Date();
                    nextUpdate.setMinutes(nextUpdate.getMinutes() + autoSettings.interval);
                    setNextUpdateTime(nextUpdate);
                }
            })
            .catch(error => {
                console.error('Error saving auto-update settings:', error);
                setOffersUpdateMessage('Błąd podczas zapisywania ustawień.');
            })
            .finally(() => {
                setIsSavingSettings(false);
            });
    };

    const handleModeChange = (mode: 'manual' | 'automatic') => {
        setUpdateMode(mode);
        setOffersUpdateMessage(null);
        
        if (mode === 'manual') {
            setNextUpdateTime(null);
        }
    };

    const handleShopChange = (shopValue: string) => {
        if (shopValue === 'wszystkie') {
            setAutoSettings(prev => ({ ...prev, shops: ['wszystkie'] }));
        } else {
            setAutoSettings(prev => {
                const newShops = prev.shops.includes('wszystkie') 
                    ? [shopValue] 
                    : prev.shops.includes(shopValue)
                        ? prev.shops.filter(s => s !== shopValue)
                        : [...prev.shops, shopValue];
                
                return { ...prev, shops: newShops.length > 0 ? newShops : ['wszystkie'] };
            });
        }
    };

    // Formatowanie czasu do następnej aktualizacji
    const formatNextUpdate = (date: Date) => {
        return date.toLocaleString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Mode Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-midnight-dark mb-6">Aktualizacja ofert</h2>
                
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => handleModeChange('manual')}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                            updateMode === 'manual'
                                ? 'bg-ocean-blue text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Ręczna aktualizacja
                    </button>
                    <button
                        onClick={() => handleModeChange('automatic')}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                            updateMode === 'automatic'
                                ? 'bg-ocean-blue text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Automatyczna aktualizacja
                    </button>
                </div>

                {/* Manual Mode */}
                {updateMode === 'manual' && (
                    <div>
                        <button
                            onClick={handleFetchOffers}
                            disabled={isUpdating}
                            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
                                isUpdating
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-ocean-blue hover:bg-ocean-dark-blue hover:shadow-lg'
                            }`}
                        >
                            {isUpdating ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Pobieranie ofert...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Pobierz oferty
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Automatic Mode */}
                {updateMode === 'automatic' && (
                    <div className="space-y-6">
                        {/* Interval Selection */}
                        <div>
                            <label className="block text-sm font-medium text-midnight-dark mb-2">
                                Częstotliwość aktualizacji
                            </label>
                            <select
                                value={autoSettings.interval}
                                onChange={(e) => setAutoSettings(prev => ({ ...prev, interval: Number(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue"
                            >
                                {intervalOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Shop Selection */}
                        <div>
                            <label className="block text-sm font-medium text-midnight-dark mb-2">
                                Sklepy do aktualizacji
                            </label>
                            <div className="space-y-2">
                                {shopOptions.map(shop => (
                                    <label key={shop.value} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={autoSettings.shops.includes(shop.value)}
                                            onChange={() => handleShopChange(shop.value)}
                                            className="mr-2 h-4 w-4 text-ocean-blue focus:ring-ocean-blue border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">{shop.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Next Update Info */}
                        {nextUpdateTime && (
                            <div className="bg-ocean-light-blue bg-opacity-20 border border-ocean-light-blue rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-ocean-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-medium text-ocean-dark-blue">
                                        Następna aktualizacja: {formatNextUpdate(nextUpdateTime)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <button
                            onClick={handleSaveAutoSettings}
                            disabled={isSavingSettings}
                            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
                                isSavingSettings
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-ocean-dark-blue hover:bg-ocean-blue hover:shadow-lg'
                            }`}
                        >
                            {isSavingSettings ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Zapisywanie...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Zapisz ustawienia automatycznej aktualizacji
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Message Display */}
                {offersUpdateMessage && (
                    <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
                        offersUpdateMessage.includes('Błąd') 
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                        {offersUpdateMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OffersComponent;