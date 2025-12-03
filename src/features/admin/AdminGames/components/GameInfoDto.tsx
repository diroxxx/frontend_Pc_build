import {type GameReqCompDto, RecGameLevel} from "../../types/GameReqCompDto.ts";
import {RemoveIcon} from "../../../../assets/icons/removeIcon.tsx";
import {EditIcon} from "lucide-react";
import {showToast} from "../../../../lib/ToastContainer.tsx";
import {deleteGameByIdApi} from "../api/deleteGameByIdApi.ts";
import {baseUrl} from "../../../../types/baseUrl.ts";

interface GameInfoDtoProps {
    gameReqCompDto: GameReqCompDto;
    refetchGames: () => void;
    setGameToEdit: (game: GameReqCompDto) => void;
    handleOpenEditGameModal: () => void;
}


export function GameInfoDto({ gameReqCompDto,refetchGames, handleOpenEditGameModal, setGameToEdit }: GameInfoDtoProps) {
    const { title, imageUrl, cpuSpecs = [], gpuSpecs = [] } = gameReqCompDto;

    // const imageToShow = useFetchImageBlobUrl(imageUrl);
    const handleDeleteGame = async (gameId?: number) => {
        if (gameId === undefined || gameId === null) {
            showToast.error("Nie można usunąć gry, brak identyfikatora");
            return;
        }
        try {
            await deleteGameByIdApi(gameId);
            refetchGames();
        } catch (err) {
            console.error("Błąd usuwania gry", err);
            showToast.error("Błąd podczas usuwania gry");
        }
    };

    return (
        <div className=" p-2 ">
            <div className=" h-full overflow-hidden rounded-lg shadow-sm border bg-white border-gray-200 divide-y divide-gray-200">
                <div className="p-3">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <h3 className="text-lg font-semibold truncate">{title}</h3>

                        <div className="flex items-center gap-1">
                            <EditIcon
                                className={"w-5 h-5 text-ocean-dark-blue hover:text-shadow-ocean-dark-blue cursor-pointer"}
                                onClick={() => {
                                    setGameToEdit(gameReqCompDto);
                                    handleOpenEditGameModal();
                                }}
                            />
                            <button
                                onClick={() => { handleDeleteGame(gameReqCompDto.id);}}
                                className="p-1.5 text-ocean-red hover:bg-ocean-red/10 rounded transition-colors" title="Usuń">
                                <RemoveIcon/>
                            </button>
                        </div>


                    </div>
                    <div className="flex items-center gap-3">
                        {gameReqCompDto.imageUrl  ? (
                            <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-md">
                                <img
                                    src={ baseUrl + imageUrl}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-12 h-12 flex-shrink-0 rounded-md " />
                        )}
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-1 text-sm">
                        <div>
                            <div className="flex items-center gap-2 mb-1">

                                <h4 className="text-xs ">Procesor</h4>
                            </div>

                            <div className="space-y-1">
                                {cpuSpecs.length === 0 && <p className="text-xs">Brak danych</p>}

                                {cpuSpecs.map((cpu,k) => (
                                    <div
                                        key={k}
                                        className="flex items-center justify-between p-2 rounded-md"
                                    >
                                        <p className="text-xs font-medium truncate">{cpu.processorModel}</p>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold">
                      {cpu.recGameLevel == RecGameLevel.REC ? "Rekomendowany" : "minimalne"}
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-xs font-medium">Karta graficzna</h4>
                            </div>

                            <div className="space-y-1">
                                {gpuSpecs.length === 0 && <p className="text-xs">Brak danych</p>}
                                {gpuSpecs.map((gpu,k) => (
                                    <div
                                        key={k}
                                        className="flex items-center justify-between p-2 rounded-md"
                                    >
                                        <p className="text-xs font-medium truncate">{gpu.gpuModel}</p>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold">
                      {gpu.recGameLevel == RecGameLevel.REC ? "Rekomendowany" : "minimalne"}
                    </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
