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
import {useCpuGpuGame} from "../hooks/useCpuGpuGame.ts";
import {OfferRecGameCard} from "../components/OfferRecGameCard.tsx";

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
        gameTitle: "",
        budget: 0
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

const {data: recOffersGame, refetch: refetchRecGame, isFetching: isFetchingRec } = useCpuGpuGame(gameFpsConfig.gameTitle, gameFpsConfig.budget)


    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-ocean-red">Błąd podczas pobierania gier</p>
            </div>
        );
    }

return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1920px] mx-auto px-4 py-6">
                <div className="grid grid-cols-12 gap-4">
                    {/* LEFT SIDEBAR - Configuration (narrower) */}
                    <div className="col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
                            <div className="p-3 border-b border-gray-200">
                                <h2 className="text-sm font-bold">Konfiguracja</h2>
                            </div>
                            <div className="p-3 space-y-2.5">
                                <div>
                                    <label className="flex items-center gap-1.5 text-[10px] font-semibold text-midnight-dark mb-1">
                                        <Cpu className="w-3 h-3 text-ocean-blue" />
                                        Procesor
                                    </label>
                                    <select
                                        value={gameFpsConfig?.cpu || ""}
                                        onChange={(e) => setGameFpsConfig(prev => ({ ...prev, cpu: e.target.value }))}
                                        className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-ocean-blue focus:border-ocean-blue"
                                    >
                                        <option value="">Wybierz</option>
                                        {processorTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center gap-1.5 text-[10px] font-semibold text-midnight-dark mb-1">
                                        <Gpu className="w-3 h-3 text-ocean-blue" />
                                        GPU
                                    </label>
                                    <select
                                        value={gameFpsConfig?.gpu || ""}
                                        onChange={(e) => setGameFpsConfig(prev => ({ ...prev, gpu: e.target.value }))}
                                        className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-ocean-blue focus:border-ocean-blue"
                                    >
                                        <option value="">Wybierz</option>
                                        {gpuTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-semibold text-midnight-dark mb-1 block">
                                        Rozdzielczość
                                    </label>
                                    <select
                                        value={gameFpsConfig?.resolution || ""}
                                        onChange={(e) => setGameFpsConfig(prev => ({ ...prev, resolution: e.target.value as typeof resolutionList[number] }))}
                                        className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-ocean-blue focus:border-ocean-blue"
                                    >
                                        <option value="">Wybierz</option>
                                        {resolutionList.map(resolution => (
                                            <option key={resolution} value={resolution}>{resolution}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-semibold text-midnight-dark mb-1 block">
                                        Technologia
                                    </label>
                                    <select
                                        value={gameFpsConfig?.technology || ""}
                                        onChange={(e) => setGameFpsConfig(prev => ({ ...prev, technology: e.target.value as typeof technologyList[number] }))}
                                        className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-ocean-blue focus:border-ocean-blue"
                                    >
                                        <option value="">Wybierz</option>
                                        {technologyList.map(technology => (
                                            <option key={technology} value={technology}>{technology}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-semibold text-midnight-dark mb-1 block">
                                        Jakość
                                    </label>
                                    <select
                                        value={gameFpsConfig?.graphicsPreset || ""}
                                        onChange={(e) => setGameFpsConfig(prev => ({ ...prev, graphicsPreset: e.target.value as typeof graphicsPresetList[number] }))}
                                        className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-ocean-blue focus:border-ocean-blue"
                                    >
                                        <option value="">Wybierz</option>
                                        {graphicsPresetList.map(graphicsPreset => (
                                            <option key={graphicsPreset} value={graphicsPreset}>{graphicsPreset}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-semibold text-midnight-dark mb-1 block">
                                        Budżet (zł)
                                    </label>
                                    <input
                                        type="number"
                                        value={gameFpsConfig?.budget || ""}
                                        onChange={(e) => setGameFpsConfig(prev => ({ ...prev, budget: Number(e.target.value) }))}
                                        className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-ocean-blue focus:border-ocean-blue"
                                        placeholder="Budżet"
                                    />
                                </div>

                                {selectedGame && (
                                    <div className="pt-2 border-t border-gray-200">
                                        <p className="text-[9px] font-semibold text-gray-500 mb-1.5">WYBRANA GRA</p>
                                        <div className="flex items-center gap-1.5 p-1.5 bg-ocean-light-blue/10 rounded border border-ocean-light-blue">
                                            <img
                                                src={`data:image/png;base64,${games?.find(g => g.title === gameFpsConfig?.gameTitle)?.imageBase64}`}
                                                alt={gameFpsConfig?.gameTitle}
                                                className="w-8 h-8 rounded object-cover"
                                            />
                                            <p className="text-[10px] font-medium text-midnight-dark flex-1 line-clamp-2">
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
                                    className={`w-full px-2 py-2 rounded text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 
                                        ${canSearch
                                            ? 'bg-ocean-blue text-white hover:bg-ocean-dark-blue'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Search className="w-3 h-3" />
                                    Szukaj wideo
                                </button>

                                <button
                                    onClick={() => refetchRecGame()}
                                    disabled={!selectedGame || !gameFpsConfig.budget || isFetchingRec}
                                    className={`w-full px-2 py-2 rounded text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5
                                    ${selectedGame && gameFpsConfig.budget && !isFetchingRec
                                        ? 'bg-ocean-blue text-white hover:bg-ocean-dark-blue'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isFetchingRec ? (
                                        <>Szukanie...</>
                                    ) : (
                                        <>
                                            <Search className="w-3 h-3" />
                                            Podzespoły
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-6 space-y-4">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="mb-3">
                                <h2 className="text-base font-bold text-midnight-dark">Wybierz grę</h2>
                            </div>

                            <div className="grid grid-cols-6 gap-2  ">
                                {isLoading ? (
                                    <LoadingSpinner/>
                                ) : isError ? (
                                    <div className="col-span-full text-center py-8">
                                        <p className="text-ocean-red text-sm">Błąd podczas pobierania gier</p>
                                    </div>
                                ) : (games?.map((game: GameDto) => (
                                    <div
                                        key={game.id}
                                        onClick={() => {
                                            setSelectedGame(game);
                                            setGameFpsConfig(prev => ({ ...prev, gameTitle: game.title }));
                                        }}
                                        className={`cursor-pointer transition-all ${
                                            selectedGame?.id === game.id
                                                ? 'ring-2 ring-ocean-blue ring-offset-1 scale-105'
                                                : 'hover:scale-105'
                                        }`}
                                    >
                                        <GameCard game={game} />
                                    </div>
                                )))}
                            </div>
                        </div>

                        {videoError ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                                <p className="text-ocean-red text-sm">Błąd podczas pobierania wideo</p>
                            </div>
                        ) : videoLoading || videoFetching ? (
                            <LoadingSpinner />
                        ) : recommendedVideoData ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-ocean-blue to-ocean-dark-blue p-3">
                                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                        Rekomendowane wideo
                                    </h2>
                                </div>

                                <div className="p-3 space-y-3">
                                    <div className="relative aspect-video rounded overflow-hidden bg-black">
                                        <iframe
                                            className="absolute inset-0 w-full h-full"
                                            src={`https://www.youtube.com/embed/${recommendedVideoData.id}`}
                                            title={recommendedVideoData.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>

                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-xs font-semibold text-midnight-dark line-clamp-2 flex-1">
                                            {recommendedVideoData.title}
                                        </h3>
                                        <a
                                            href={`https://www.youtube.com/watch?v=${recommendedVideoData.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-medium transition-all whitespace-nowrap"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                            YouTube
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : recommendedVideoData === null ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                                <p className="text-gray-600 text-sm">Brak dopasowania</p>
                            </div>
                        ) : null}
                    </div>

                    <div className="col-span-4 space-y-4">
                        {recOffersGame && (recOffersGame.minRec.length >=1 || recOffersGame.maxRec >= 1) ? (
                            <>
                                {recOffersGame.minRec && recOffersGame.minRec.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="bg-indigo-400 p-3">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                <Cpu className="w-4 h-4" />
                                                Budżetowe podzespoły
                                            </h3>
                                        </div>
                                        <div className="p-3 space-y-3 max-h-[calc(50vh-80px)] overflow-y-auto">
                                            {recOffersGame.minRec.map((offer, key) => (
                                                <OfferRecGameCard key={key} offerRec={offer}/>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {recOffersGame.maxRec && recOffersGame.maxRec.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 ">
                                        <div className="bg-indigo-400 p-3">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                <Gpu className="w-4 h-4" />
                                                Rekomendowane podzespoły
                                            </h3>
                                        </div>
                                        <div className="p-3 space-y-3 max-h-[calc(50vh-80px)] overflow-y-auto">
                                            {recOffersGame.maxRec.map((offer, key) => (
                                                <OfferRecGameCard key={key} offerRec={offer}/>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Cpu className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                    Brak rekomendacji
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Wybierz grę i budżet, aby zobaczyć rekomendowane podzespoły
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamesPage;