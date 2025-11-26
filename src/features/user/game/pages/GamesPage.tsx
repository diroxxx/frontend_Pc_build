import {useState } from "react";
import GameCard from "../components/GameCard.tsx";
import { useGetAllGamesApi } from "../hooks/useAllGames.ts";
import type { GameDto } from "../types/GameDto.ts";
import { Cpu, Gpu, Search } from "lucide-react";
import { useFpsComponents } from "../hooks/useFpsComponents.ts";
import type { GameFpsConfigDto } from "../types/GameFpsConfigDto.ts";
import { resolutionList, graphicsPresetList, technologyList } from "../types/GameFpsConfigDto.ts";
import { useReccommendedVideo } from "../hooks/useReccommendedVideo.ts";
import {LoadingSpinner} from "../../../../assets/components/ui/LoadingSpinner.tsx";

const GamesPage = () => {
    const { data: games, isLoading, isError } = useGetAllGamesApi();
    const [selectedGame, setSelectedGame] = useState<GameDto | null>(null);
    const { data: fpsComponentsData } = useFpsComponents();
    const [gameFpsConfig, setGameFpsConfig] = useState<GameFpsConfigDto>({
        cpu: "",
        gpu: "",
        resolution: "" as typeof resolutionList[number],
        technology: "" as typeof technologyList[number],
        graphicsPreset: "" as typeof graphicsPresetList[number],
        gameTitle: ""
    });    
    
    const processorTypes = fpsComponentsData?.cpusModels || [];
    const gpuTypes = fpsComponentsData?.gpusModels || [];

const isConfigComplete = (config: GameFpsConfigDto | null): config is GameFpsConfigDto => {
    return config !== null && 
           !!selectedGame;
};

const completeConfig = isConfigComplete(gameFpsConfig) ? gameFpsConfig : null;

const {data: recommendedVideoData, refetch, isError:videoError,isLoading:videoLoading, isFetching:videoFetching} = useReccommendedVideo(completeConfig || undefined);
const canSearch = isConfigComplete(gameFpsConfig);


    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-ocean-red">Błąd podczas pobierania gier</p>
            </div>
        );
    }

return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg font-bold">Konfiguracja</h2>
                            </div>
                            <div className="p-4 space-y-3">
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-midnight-dark mb-1.5">
                                        <Cpu className="w-3.5 h-3.5 text-ocean-blue" />
                                        Procesor
                                    </label>
                                    <select
                                        value={gameFpsConfig?.cpu || ""}
                                        onChange={(e) => setGameFpsConfig(prev => ({ ...prev, cpu: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-all"
                                    >
                                        <option value="">Wybierz procesor</option>
                                        {processorTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-midnight-dark mb-1.5">
                                        <Gpu className="w-3.5 h-3.5 text-ocean-blue" />
                                        Karta Graficzna
                                    </label>
                                    <select
                                        value={gameFpsConfig?.gpu || ""}
                                        onChange={(e) => setGameFpsConfig(prev => ({ ...prev, gpu: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-all"
                                    >
                                        <option value="">Wybierz GPU</option>
                                        {gpuTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-midnight-dark mb-1.5 block">
                                        Rozdzielczość
                                    </label>
                                    <select
                                        value={gameFpsConfig?.resolution || ""}
                                        onChange={(e) => setGameFpsConfig(prev => ({ ...prev, resolution: e.target.value as typeof resolutionList[number] }))}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-all"
                                    >
                                        <option value="">Wybierz rozdzielczość</option>
                                        {resolutionList.map(resolution => (
                                            <option key={resolution} value={resolution}>{resolution}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-midnight-dark mb-1.5 block">
                                        Technologia
                                    </label>
                                    <select
                                        value={gameFpsConfig?.technology || ""}
                                        onChange={(e) => setGameFpsConfig(prev => ({ ...prev, technology: e.target.value as typeof technologyList[number] }))}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-all"
                                    >
                                        <option value="">Wybierz technologię</option>
                                        {technologyList.map(technology => (
                                            <option key={technology} value={technology}>{technology}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-midnight-dark mb-1.5 block">
                                        Jakość Grafiki
                                    </label>
                                    <select
                                        value={gameFpsConfig?.graphicsPreset || ""}
                                        onChange={(e) => setGameFpsConfig(prev => ({ ...prev, graphicsPreset: e.target.value as typeof graphicsPresetList[number] }))}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-all"
                                    >
                                        <option value="">Wybierz jakość</option>
                                        {graphicsPresetList.map(graphicsPreset => (
                                            <option key={graphicsPreset} value={graphicsPreset}>{graphicsPreset}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedGame && (
                                    <div className="pt-3 border-t border-gray-200">
                                        <p className="text-xs font-semibold text-gray-500 mb-2">WYBRANA GRA</p>
                                        <div className="flex items-center gap-2 p-2 bg-ocean-light-blue/10 rounded-lg border border-ocean-light-blue">
                                            <img
                                                src={`data:image/png;base64,${games?.find(g => g.title === gameFpsConfig?.gameTitle)?.imageBase64}`}
                                                alt={gameFpsConfig?.gameTitle}
                                                className="w-10 h-10 rounded object-cover"
                                            />
                                            <p className="text-xs font-medium text-midnight-dark flex-1 line-clamp-2">
                                                {gameFpsConfig?.gameTitle}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => {
                                        if (canSearch && gameFpsConfig) {
                                            refetch();
                                        }
                                    }}
                                    disabled={!canSearch}
                                    className={`w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 
                                        ${canSearch
                                            ? 'bg-ocean-blue text-white hover:bg-ocean-dark-blue shadow-md hover:shadow-lg'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Search className="w-4 h-4" />
                                    Szukaj wideo
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-midnight-dark">Wybierz grę</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Kliknij na grę, aby dodać ją do konfiguracji
                                </p>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                {isLoading ? (
                                    <LoadingSpinner/>
                                ) : isError ? (
                                        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                                            <p className="text-ocean-red">Błąd podczas pobierania gier</p>
                                        </div>
                                    ): (games?.map((game: GameDto) => (
                                    <div
                                        key={game.id}
                                        onClick={() => {
                                            setSelectedGame(game);
                                            setGameFpsConfig(prev => ({ ...prev, gameTitle: game.title }));
                                        }}
                                        className={`cursor-pointer transition-all ${
                                            selectedGame?.id === game.id
                                                ? 'ring-2 ring-ocean-blue ring-offset-2 scale-105'
                                                : 'hover:scale-105'
                                        }`}
                                    >
                                        <GameCard game={game} />
                                    </div>
                                ))
                                )}
                            </div>
                        </div>

                        {
                            videoError ? (
                                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                                        <p className="text-ocean-red">Błąd podczas pobierania gier</p>
                                    </div>
                                ) : videoLoading ? (
                                    <LoadingSpinner />
                            ) : videoFetching ? (
                                <LoadingSpinner/>
                                ) :
                                    recommendedVideoData ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-ocean-blue to-ocean-dark-blue p-4">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                        Rekomendowane wideo
                                    </h2>
                                </div>

                                <div className="p-4 space-y-4">
                                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-md bg-black">
                                        <iframe
                                            className="absolute inset-0 w-full h-full"
                                            src={`https://www.youtube.com/embed/${recommendedVideoData.id}`}
                                            title={recommendedVideoData.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-base font-semibold text-midnight-dark line-clamp-2">
                                            {recommendedVideoData.title}
                                        </h3>

                                        <a
                                            href={`https://www.youtube.com/watch?v=${recommendedVideoData.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                            Otwórz w YouTube
                                        </a>
                                    </div>
                                </div>
                            </div>)
                                        : recommendedVideoData === null ? (
                                            <p>Brak dopasowania</p>
                                    ) :
                                        canSearch ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                                </div>
                                <h3 className="text-base font-semibold text-gray-700 mb-1">
                                    Nie znaleziono wideo
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Spróbuj zmienić parametry konfiguracji
                                </p>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default GamesPage;