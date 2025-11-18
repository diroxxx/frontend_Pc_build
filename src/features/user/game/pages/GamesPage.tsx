import { useState } from "react";
import GameCard from "../components/GameCard.tsx";
import { useGetAllGamesApi } from "../hooks/useAllGames.ts";
import type { GameDto } from "../types/GameDto.ts";
import { Cpu, Gpu, Search } from "lucide-react";

const GamesPage = () => {
    const { data, isLoading, isError } = useGetAllGamesApi();
    const [selectedGame, setSelectedGame] = useState<GameDto | null>(null);
    const [processorType, setProcessorType] = useState<string>("");
    const [gpuType, setGpuType] = useState<string>("");
    const [budget, setBudget] = useState<string>("");

    const processorTypes = ["Intel", "AMD"];
    const gpuTypes = ["NVIDIA", "AMD"];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Ładowanie gier...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-ocean-red">Błąd podczas pobierania gier</p>
            </div>
        );
    }

    const canSearch = selectedGame && processorType && gpuType;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 sticky top-6">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-midnight-dark">Konfiguracja</h2>
                                <p className="text-sm text-gray-600 mt-1">Wybierz parametry zestawu</p>
                            </div>

                            <div className="p-6 space-y-5">

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-midnight-dark mb-2">
                                        <Cpu className="w-4 h-4 text-ocean-blue" />
                                        Procesor
                                    </label>
                                    <select
                                        value={processorType}
                                        onChange={(e) => setProcessorType(e.target.value)}
                                        className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-all"
                                    >
                                        <option value="">Wybierz typ procesora</option>
                                        {processorTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>


                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-midnight-dark mb-2">
                                        <Gpu className="w-4 h-4 text-ocean-blue" />
                                        Karta Graficzna
                                    </label>
                                    <select
                                        value={gpuType}
                                        onChange={(e) => setGpuType(e.target.value)}
                                        className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-all"
                                    >
                                        <option value="">Wybierz typ GPU</option>
                                        {gpuTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>


                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-midnight-dark mb-2">
                                        Budżet na ulepszenie
                                    </label>
                                    <input
                                        type="number"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        placeholder="np. 4500"
                                        className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-all"
                                    />
                                </div>


                                {selectedGame && (
                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-xs font-semibold text-gray-500 mb-2">WYBRANA GRA</p>
                                        <div className="flex items-center gap-3 p-3 bg-ocean-light-blue/10 rounded-lg border border-ocean-light-blue">
                                            <img
                                                src={`data:image/png;base64,${selectedGame.imageBase64}`}
                                                alt={selectedGame.title}
                                                className="w-12 h-12 rounded object-cover"
                                            />
                                            <p className="text-sm font-medium text-midnight-dark flex-1">
                                                {selectedGame.title}
                                            </p>
                                        </div>
                                    </div>
                                )}


                                <button
                                    disabled={!canSearch}
                                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                                        canSearch
                                            ? 'bg-ocean-blue text-white hover:bg-ocean-dark-blue shadow-md hover:shadow-lg'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <Search className="w-5 h-5" />
                                    Szukaj
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-midnight-dark mb-2">
                                Wybierz grę
                            </h2>
                            <p className="text-gray-600">
                                Kliknij na grę, aby dodać ją do konfiguracji
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {data?.map((game: GameDto) => (
                                <div
                                    key={game.id}
                                    onClick={() => setSelectedGame(game)}
                                    className={`cursor-pointer transition-all ${
                                        selectedGame?.id === game.id
                                            ? ' ring-2 ring-ocean-blue ring-offset-2 scale-100'
                                            : 'hover:scale-100'
                                    }`}
                                >
                                    <GameCard game={game} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamesPage;