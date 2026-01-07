import {useState } from "react";
import GameCard from "../components/GameCard.tsx";
import { useGetAllGamesApi } from "../hooks/useAllGames.ts";
import type { GameDto } from "../dto/GameDto.ts";
import { Cpu, Gpu, Search, ShoppingCart, Video } from "lucide-react";
import type { GameFpsConfigDto } from "../dto/GameFpsConfigDto.ts";
import { resolutionList, graphicsPresetList, technologyList } from "../dto/GameFpsConfigDto.ts";
import { useReccommendedVideo } from "../hooks/useReccommendedVideo.ts";
import {LoadingSpinner} from "../../../assets/components/ui/LoadingSpinner.tsx";
import {useCpuGpuGame} from "../hooks/useCpuGpuGame.ts";
import OfferCardFlex from "../../offers/guest/components/OfferCardFlex.tsx";
import {useCpus} from "../../../shared/hooks/useCpus.ts";
import {useGpuModels} from "../../../shared/hooks/useGpuModels.ts";
import {useAtom} from "jotai/index";
import {selectedComputerAtom} from "../../computers/atoms/computerAtom.tsx";
import axios from "axios";

const GamesPage = () => {
    const { data: games, isLoading, isError } = useGetAllGamesApi();
    const [selectedGame, setSelectedGame] = useState<GameDto | null>(null);
    const [selectedComputer] = useAtom(selectedComputerAtom);

    const {data:cpus} = useCpus();
    const {data:gpuModels} = useGpuModels()

    const [gameFpsConfig, setGameFpsConfig] = useState<GameFpsConfigDto>({
        cpu: "",
        gpu: "",
        resolution: "" as typeof resolutionList[number],
        technology: "" as typeof technologyList[number],
        graphicsPreset: "" as typeof graphicsPresetList[number],
        gameTitle: "",
        budget: 0
    });    
    
    const processorTypes = cpus || [];
    const gpuTypes = gpuModels || [];

    const isConfigComplete = (config: GameFpsConfigDto | null): config is GameFpsConfigDto => {
        return config !== null && 
            !!selectedGame;
    };

    const completeConfig = isConfigComplete(gameFpsConfig) ? gameFpsConfig : null;

    const {data: recommendedVideoData, refetch, isError:videoError, error: videoErrorDetails, isLoading:videoLoading, isFetching:videoFetching} = useReccommendedVideo(completeConfig || undefined);

    const {data: recOffersGame, refetch: refetchRecGame, isFetching: isFetchingRec, isLoading: isLoadingRec } = useCpuGpuGame(gameFpsConfig.gameTitle, gameFpsConfig.budget)

    const is404Error = videoErrorDetails && axios.isAxiosError(videoErrorDetails) && videoErrorDetails.response?.status === 404;

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
                    <div className="col-span-2">
                        <div className="space-y-3 sticky top-6 " >
                            <div className="bg-white rounded-lg shadow-sm  border-ocean-blue border-1 overflow-hidden">
                               <div className="p-3 border-b border-gray-500 bg-gradient-to-r from-ocean-blue to-ocean-dark-blue">
                                <div className="flex items-center justify-between rounded-lg">
                                    <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                                        <Video className="w-4 h-4" />
                                        Wyszukaj wideo
                                    </h3>
                                    <span className="text-xs text-ocean-light-blue">YouTube</span>
                                    </div>
                                </div>

                                <div className="p-3 space-y-2.5">
                                    {/* <p className="text-[11px] text-gray-500">Wyszukiwanie wideo wymaga wybrania gry oraz pełnej konfiguracji (CPU, GPU, rozdzielczość, technologia, jakość).</p> */}

                                    <div>
                                        <label className="flex items-center gap-1.5 text-[10px] font-semibold text-midnight-dark mb-1">
                                            <Cpu className="w-3 h-3 text-ocean-blue" />
                                            Procesor
                                        </label>
                                        <select
                                            value={gameFpsConfig.cpu || ""}
                                            onChange={(e) => setGameFpsConfig(prev => ({ ...prev, cpu: e.target.value }))}
                                            className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded"
                                        >
                                            <option value="">Wybierz</option>
                                            {processorTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-1.5 text-[10px] font-semibold text-midnight-dark mb-1">
                                            <Gpu className="w-3 h-3 text-ocean-blue" />
                                            GPU
                                        </label>
                                        <select
                                            value={gameFpsConfig.gpu || ""}
                                            onChange={(e) => setGameFpsConfig(prev => ({ ...prev, gpu: e.target.value }))}
                                            className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded"
                                        >
                                            <option value="">Wybierz</option>
                                            {gpuTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] font-semibold text-midnight-dark mb-1 block">Rozdzielczość</label>
                                            <select
                                                value={gameFpsConfig.resolution || ""}
                                                onChange={(e) => setGameFpsConfig(prev => ({ ...prev, resolution: e.target.value as typeof resolutionList[number] }))}
                                                className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded"
                                            >
                                                <option value="">Wybierz</option>
                                                {resolutionList.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-semibold text-midnight-dark mb-1 block">Technologia</label>
                                            <select
                                                value={gameFpsConfig.technology || ""}
                                                onChange={(e) => setGameFpsConfig(prev => ({ ...prev, technology: e.target.value as typeof technologyList[number] }))}
                                                className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded"
                                            >
                                                <option value="">Wybierz</option>
                                                {technologyList.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-semibold text-midnight-dark mb-1 block">Jakość</label>
                                        <select
                                            value={gameFpsConfig.graphicsPreset || ""}
                                            onChange={(e) => setGameFpsConfig(prev => ({ ...prev, graphicsPreset: e.target.value as typeof graphicsPresetList[number] }))}
                                            className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded"
                                        >
                                            <option value="">Wybierz</option>
                                            {graphicsPresetList.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>

                                    {(() => {
                                        const canSearchVideo = Boolean(
                                            selectedGame &&
                                            gameFpsConfig.cpu &&
                                            gameFpsConfig.gpu &&
                                            gameFpsConfig.resolution &&
                                            gameFpsConfig.technology &&
                                            gameFpsConfig.graphicsPreset
                                        );
                                        return (
                                            <button
                                                onClick={() => { if (canSearchVideo) refetch(); }}
                                                disabled={!canSearchVideo}
                                                title={!canSearchVideo ? 'Wybierz grę i uzupełnij wszystkie pola konfiguracji' : 'Szukaj rekomendowanego wideo'}
                                                className={`w-full px-3 py-2 rounded text-[11px] font-semibold flex items-center justify-center gap-2 transition-all
                                                ${canSearchVideo ? 'bg-ocean-blue text-white hover:bg-ocean-dark-blue' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                            >
                                                <Search className="w-3 h-3" />
                                                Znajdź wideo na YouTube
                                            </button>
                                        );
                                    })()}
                                </div>
                            </div>
                            <div className="relative py-2">

                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-gray-50 px-2 text-gray-500">lub</span>
                            </div>
                        </div>

                            <div className="bg-white rounded-lg shadow-sm border border-teal-500 overflow-hidden">
                                <div className="p-3  bg-gradient-to-r from-emerald-600 to-teal-700">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                                            <ShoppingCart className="w-4 h-4" />
                                            Wyszukaj oferty
                                        </h3>
                                        <span className="text-xs text-emerald-100">Sklepy</span>
                                    </div>
                                </div>

                                <div className="p-3 space-y-2">
                                    <p className="text-[11px] text-gray-500">Wyszukiwanie ofert wymaga wybrania gry oraz ustawienia budżetu (min. 500 zł).</p>

                                    <div>
                                        <label className="text-[10px] font-semibold text-midnight-dark mb-1 block">Budżet (zł)</label>
                                        <input
                                            type="number"
                                            value={gameFpsConfig.budget || ""}
                                            min={0}
                                            onChange={(e) => setGameFpsConfig(prev => ({ ...prev, budget: Number(e.target.value) }))}
                                            className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded"
                                            placeholder="Budżet (np. 1500)"
                                        />
                                    </div>

                                    {(() => {
                                        const canSearchOffers = Boolean(selectedGame && gameFpsConfig.budget >= 500);
                                        return (
                                            <button
                                                onClick={() => { if (canSearchOffers) refetchRecGame(); }}
                                                disabled={!canSearchOffers}
                                                title={!canSearchOffers ? 'Wybierz grę i ustaw budżet (min. 500 zł)' : 'Szukaj ofert zgodnych z wybraną konfiguracją'}
                                                className={`w-full px-3 py-2 rounded text-[11px] font-semibold flex items-center justify-center gap-2 transition-all
                                                ${canSearchOffers ? 'bg-ocean-teal text-white hover:bg-ocean-teal-hover' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                            >
                                                <Search className="w-3 h-3" />
                                                Szukaj ofert (budżet)
                                            </button>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>                    <div className="col-span-6 space-y-4">
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

                        {videoError && !is404Error ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                                <p className="text-ocean-red text-sm">Błąd podczas pobierania wideo</p>
                            </div>
                        ) : videoLoading || videoFetching ? (
                            <LoadingSpinner />
                        ) : recommendedVideoData ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-ocean-blue to-ocean-dark-blue p-3">
                                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
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
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ocean-red hover:bg-ocean-red-hover text-white text-xs rounded font-medium transition-all whitespace-nowrap"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                            YouTube
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : is404Error || recommendedVideoData === null ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                                <p className="text-gray-600 text-sm">Brak filmiku dla podanych wymagań</p>
                            </div>
                        ) : null}
                    </div>

                    <div className="col-span-4 space-y-4">

                        {
                            isLoadingRec || isFetchingRec ? (
                                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                                        <LoadingSpinner />
                                    </div>
                                ): recOffersGame && (recOffersGame.minRec.length >=1 || recOffersGame.maxRec.length >= 1) ? (
                            <>
                                {recOffersGame.minRec && recOffersGame.minRec.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-3">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                Budżetowe podzespoły
                                            </h3>
                                        </div>
                                        <div className="p-3 space-y-3 max-h-[calc(50vh-80px)] overflow-y-auto">
                                            {recOffersGame.minRec.map((offer, key) => (
                                                <OfferCardFlex key={key} offer={offer} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {recOffersGame.maxRec && recOffersGame.maxRec.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hiddenoverflow-hidden ">
                                        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-3">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                Rekomendowane podzespoły
                                            </h3>
                                        </div>
                                        <div className="p-3 space-y-3 max-h-[calc(50vh-80px)] overflow-y-auto">
                                            {recOffersGame.maxRec.map((offer, key) => (
                                                <OfferCardFlex key={ key} offer={offer} />
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
                                {recOffersGame?.minRec.length == 0 && recOffersGame?.maxRec.length == 0 && (
                                    <>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                            Brak rekomendacji dla podanej gry
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Możliwe że dla podanych podzespołów z wymagań gry nie ma aktualnych ofert.
                                        </p>
                                    </>
                                ) }
                                {recOffersGame == null && (
                                    <>
                                        <h3 className="textS-sm font-semibold text-gray-700 mb-2">
                                            Brak dopasowania ofert do wymagan gry
                                        </h3>

                                        <p className="text-xs text-gray-500">
                                            Spróbuj zmienić budżet,gre albo szukaj bez budżetu
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamesPage;