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

const selectClass = "w-full px-2 py-1.5 text-xs bg-dark-surface2 border border-dark-border rounded-lg text-dark-text focus:border-dark-accent transition-colors";
const labelClass = "text-[10px] font-semibold text-dark-muted uppercase tracking-wide mb-1 block";

const GamesPage = () => {
    const { data: games, isLoading, isError } = useGetAllGamesApi();
    const [selectedGame, setSelectedGame] = useState<GameDto | null>(null);
    const [selectedComputer] = useAtom(selectedComputerAtom);

    const {data:cpus} = useCpus();
    const {data:gpuModels} = useGpuModels();

    const [gameFpsConfig, setGameFpsConfig] = useState<GameFpsConfigDto>({
        cpu: "",
        gpu: "",
        resolution: "" as typeof resolutionList[number],
        technology: "" as typeof technologyList[number],
        graphicsPreset: "" as typeof graphicsPresetList[number],
        gameTitle: ""
    });

    const processorTypes = cpus || [];
    const gpuTypes = gpuModels || [];

    const isConfigComplete = (config: GameFpsConfigDto | null): config is GameFpsConfigDto => {
        return config !== null && !!selectedGame;
    };

    const completeConfig = isConfigComplete(gameFpsConfig) ? gameFpsConfig : null;

    const {data: recommendedVideoData, refetch, isError:videoError, error: videoErrorDetails, isLoading:videoLoading, isFetching:videoFetching} = useReccommendedVideo(completeConfig || undefined);
    const {data: recOffersGame, refetch: refetchRecGame, isFetching: isFetchingRec, isLoading: isLoadingRec } = useCpuGpuGame(gameFpsConfig.gameTitle, gameFpsConfig.budget);

    const is404Error = videoErrorDetails && axios.isAxiosError(videoErrorDetails) && videoErrorDetails.response?.status === 404;

    if (isError) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <p className="text-ocean-red">Błąd podczas pobierania gier</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg">
            <div className="max-w-[1920px] mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

                    {/* LEFT SIDEBAR */}
                    <div className="col-span-2 space-y-3">
                        <div className="sticky top-6 space-y-3">

                            {/* Video search panel */}
                            <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
                                <div className="px-4 py-3 border-b border-dark-border flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-dark-text flex items-center gap-1.5">
                                        <Video className="w-3.5 h-3.5 text-dark-accent" />
                                        Wyszukaj wideo
                                    </h3>
                                    <span className="text-[10px] text-dark-muted">YouTube</span>
                                </div>

                                <div className="p-3 space-y-2.5">
                                    <div>
                                        <label className={labelClass}>
                                            <span className="flex items-center gap-1"><Cpu className="w-3 h-3" />Procesor</span>
                                        </label>
                                        <select
                                            value={gameFpsConfig.cpu || ""}
                                            onChange={(e) => setGameFpsConfig(prev => ({ ...prev, cpu: e.target.value }))}
                                            className={selectClass}
                                        >
                                            <option value="">Wybierz</option>
                                            {processorTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            <span className="flex items-center gap-1"><Gpu className="w-3 h-3" />GPU</span>
                                        </label>
                                        <select
                                            value={gameFpsConfig.gpu || ""}
                                            onChange={(e) => setGameFpsConfig(prev => ({ ...prev, gpu: e.target.value }))}
                                            className={selectClass}
                                        >
                                            <option value="">Wybierz</option>
                                            {gpuTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className={labelClass}>Rozdzielczość</label>
                                            <select
                                                value={gameFpsConfig.resolution || ""}
                                                onChange={(e) => setGameFpsConfig(prev => ({ ...prev, resolution: e.target.value as typeof resolutionList[number] }))}
                                                className={selectClass}
                                            >
                                                <option value="">Wybierz</option>
                                                {resolutionList.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Technologia</label>
                                            <select
                                                value={gameFpsConfig.technology || ""}
                                                onChange={(e) => setGameFpsConfig(prev => ({ ...prev, technology: e.target.value as typeof technologyList[number] }))}
                                                className={selectClass}
                                            >
                                                <option value="">Wybierz</option>
                                                {technologyList.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Jakość grafiki</label>
                                        <select
                                            value={gameFpsConfig.graphicsPreset || ""}
                                            onChange={(e) => setGameFpsConfig(prev => ({ ...prev, graphicsPreset: e.target.value as typeof graphicsPresetList[number] }))}
                                            className={selectClass}
                                        >
                                            <option value="">Wybierz</option>
                                            {graphicsPresetList.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>

                                    {(() => {
                                        const canSearch = Boolean(
                                            selectedGame &&
                                            gameFpsConfig.cpu &&
                                            gameFpsConfig.gpu &&
                                            gameFpsConfig.resolution &&
                                            gameFpsConfig.technology &&
                                            gameFpsConfig.graphicsPreset
                                        );
                                        return (
                                            <button
                                                onClick={() => { if (canSearch) refetch(); }}
                                                disabled={!canSearch}
                                                title={!canSearch ? 'Wybierz grę i uzupełnij wszystkie pola' : ''}
                                                className={`w-full py-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                                    canSearch
                                                        ? 'bg-dark-accent hover:bg-dark-accent-hover text-white'
                                                        : 'bg-dark-surface2 text-dark-muted cursor-not-allowed'
                                                }`}
                                            >
                                                <Search className="w-3 h-3" />
                                                Znajdź wideo
                                            </button>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="relative py-1">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-dark-border" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-dark-bg px-2 text-[10px] text-dark-muted">lub</span>
                                </div>
                            </div>

                            {/* Offers search panel */}
                            <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
                                <div className="px-4 py-3 border-b border-dark-border flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-dark-text flex items-center gap-1.5">
                                        <ShoppingCart className="w-3.5 h-3.5 text-green-400" />
                                        Wyszukaj oferty
                                    </h3>
                                    <span className="text-[10px] text-dark-muted">Sklepy</span>
                                </div>

                                <div className="p-3 space-y-2.5">
                                    <p className="text-[10px] text-dark-muted">Wybierz grę. Budżet jest opcjonalny.</p>
                                    <div>
                                        <label className={labelClass}>Budżet (zł)</label>
                                        <input
                                            type="number"
                                            value={gameFpsConfig.budget || ""}
                                            min={0}
                                            onChange={(e) => setGameFpsConfig(prev => ({ ...prev, budget: Number(e.target.value) }))}
                                            className={selectClass}
                                            placeholder="np. 1500"
                                        />
                                    </div>

                                    {(() => {
                                        const canSearch = Boolean(selectedGame);
                                        return (
                                            <button
                                                onClick={() => { if (canSearch) refetchRecGame(); }}
                                                disabled={!canSearch}
                                                title={!canSearch ? 'Najpierw wybierz grę' : ''}
                                                className={`w-full py-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                                    canSearch
                                                        ? 'bg-green-500/15 text-green-400 hover:bg-green-500 hover:text-white border border-green-500/20 hover:border-green-500'
                                                        : 'bg-dark-surface2 text-dark-muted cursor-not-allowed'
                                                }`}
                                            >
                                                <Search className="w-3 h-3" />
                                                Szukaj ofert {gameFpsConfig.budget ? '(z budżetem)' : ''}
                                            </button>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CENTER — game grid + video */}
                    <div className="col-span-6 space-y-4">

                        {/* Game picker */}
                        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
                            <h2 className="text-xs font-bold text-dark-muted uppercase tracking-widest mb-3">Wybierz grę</h2>
                            <div className="grid grid-cols-6 gap-2">
                                {isLoading ? (
                                    <div className="col-span-full flex justify-center py-8"><LoadingSpinner /></div>
                                ) : games?.map((game: GameDto) => (
                                    <div
                                        key={game.id}
                                        onClick={() => {
                                            setSelectedGame(game);
                                            setGameFpsConfig(prev => ({ ...prev, gameTitle: game.title }));
                                        }}
                                        className={`cursor-pointer transition-all duration-200 rounded-xl ${
                                            selectedGame?.id === game.id
                                                ? 'ring-2 ring-dark-accent ring-offset-2 ring-offset-dark-bg scale-105'
                                                : 'hover:scale-105'
                                        }`}
                                    >
                                        <GameCard game={game} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Video result */}
                        {videoError && !is404Error ? (
                            <div className="bg-dark-surface border border-dark-border rounded-xl p-6 text-center">
                                <p className="text-ocean-red text-sm">Błąd podczas pobierania wideo</p>
                            </div>
                        ) : videoLoading || videoFetching ? (
                            <div className="flex justify-center py-8"><LoadingSpinner /></div>
                        ) : recommendedVideoData ? (
                            <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
                                <div className="px-4 py-3 border-b border-dark-border flex items-center gap-2">
                                    <Video className="w-4 h-4 text-dark-accent" />
                                    <h2 className="text-xs font-bold text-dark-text">Rekomendowane wideo</h2>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                                        <iframe
                                            className="absolute inset-0 w-full h-full"
                                            src={`https://www.youtube.com/embed/${recommendedVideoData.id}`}
                                            title={recommendedVideoData.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-xs font-semibold text-dark-text line-clamp-2 flex-1">
                                            {recommendedVideoData.title}
                                        </h3>
                                        <a
                                            href={`https://www.youtube.com/watch?v=${recommendedVideoData.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-ocean-red hover:bg-ocean-red-hover text-white text-xs rounded-lg font-medium transition-all whitespace-nowrap"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                            YouTube
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : is404Error || recommendedVideoData === null ? (
                            <div className="bg-dark-surface border border-dark-border rounded-xl p-6 text-center">
                                <p className="text-dark-muted text-sm">Brak filmiku dla podanych wymagań</p>
                            </div>
                        ) : null}
                    </div>

                    {/* RIGHT — recommended offers */}
                    <div className="col-span-4 space-y-4">
                        {isLoadingRec || isFetchingRec ? (
                            <div className="flex justify-center py-16"><LoadingSpinner /></div>
                        ) : recOffersGame && (recOffersGame.minRec.length >= 1 || recOffersGame.maxRec.length >= 1) ? (
                            <>
                                {recOffersGame.minRec.length > 0 && (
                                    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
                                        <div className="px-4 py-3 border-b border-dark-border flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                                            <h3 className="text-xs font-bold text-dark-text">Budżetowe podzespoły</h3>
                                        </div>
                                        <div className="p-3 space-y-2 max-h-[calc(50vh-80px)] overflow-y-auto">
                                            {recOffersGame.minRec.map((offer, key) => (
                                                <OfferCardFlex key={key} offer={offer} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {recOffersGame.maxRec.length > 0 && (
                                    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
                                        <div className="px-4 py-3 border-b border-dark-border flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-dark-accent flex-shrink-0" />
                                            <h3 className="text-xs font-bold text-dark-text">Rekomendowane podzespoły</h3>
                                        </div>
                                        <div className="p-3 space-y-2 max-h-[calc(50vh-80px)] overflow-y-auto">
                                            {recOffersGame.maxRec.map((offer, key) => (
                                                <OfferCardFlex key={key} offer={offer} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-dark-surface border border-dark-border rounded-xl p-8 text-center">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-dark-surface2 border border-dark-border flex items-center justify-center">
                                    <Cpu className="w-7 h-7 text-dark-muted" />
                                </div>
                                {recOffersGame?.minRec.length === 0 && recOffersGame?.maxRec.length === 0 ? (
                                    <>
                                        <h3 className="text-sm font-semibold text-dark-text mb-1">Brak rekomendacji</h3>
                                        <p className="text-xs text-dark-muted">Dla podanych podzespołów z wymagań gry nie ma aktualnych ofert.</p>
                                    </>
                                ) : recOffersGame == null ? (
                                    <>
                                        <h3 className="text-sm font-semibold text-dark-text mb-1">Brak dopasowania</h3>
                                        <p className="text-xs text-dark-muted">Spróbuj zmienić budżet, grę albo szukaj bez budżetu.</p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-sm font-semibold text-dark-text mb-1">Wybierz grę i kliknij szukaj</h3>
                                        <p className="text-xs text-dark-muted">Rekomendacje podzespołów pojawią się tutaj.</p>
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
