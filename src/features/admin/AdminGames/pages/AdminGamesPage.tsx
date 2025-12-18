import {useGetAllGamesReqApi} from "../hooks/useGetAllGamesReqApi.ts";
import {useMemo, useState} from "react";
import {GameInfoDto} from "../components/GameInfoDto.tsx";
import {LoadingSpinner} from "../../../../assets/components/ui/LoadingSpinner.tsx";
import {AddNewGameModal} from "../components/AddNewGameModal.tsx";
import {useAllGpus} from "../hooks/useAllGpus.ts";
import {useAllCpus} from "../hooks/useAllCpus.ts";
import {EditGameModal} from "../components/EditGameModal.tsx";
import type {GameReqCompDto} from "../../../games/dto/GameReqCompDto.ts";

function AdminGamesPage() {

    const [openAddNewGameModal, setOpenAddNewGameModal] = useState(false);
    const [openEditGameModal, setOpenEditGameModal] = useState(false);
    const [gameToEdit, setGameToEdit] = useState<GameReqCompDto>({
        cpuSpecs: [],
        gpuSpecs: [],
        id: 0,
        imageUrl: "",
        title: ""
    });

    const handleOpenNewGameModal = () => setOpenAddNewGameModal(true);
    const handleCloseNewGameModal = () => setOpenAddNewGameModal(false);

    const handleOpenEditGameModal = () => setOpenEditGameModal(true);
    const handleCloseEditGameModal = () => setOpenEditGameModal(false);

    const {data: gpuSpecs} = useAllGpus();
    const gpuList = Array.isArray(gpuSpecs) ? gpuSpecs : [];
    const {data:cpuSpecs} = useAllCpus();
    const cpuList = Array.isArray(cpuSpecs) ? cpuSpecs : [];
    const {data: games, isLoading:gamesLoading, isError: isGamesError, isFetching:isGamesFetching, refetch: refetchGames} = useGetAllGamesReqApi();
    const gamesTitles= games != undefined ? games?.map((game) => game.title) : [];
    const [searchTerm, setSearchTerm] = useState('');

    const gamesList = Array.isArray(games) ? games : [];

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const gamesFiltered = useMemo(() => {
        if (!normalizedSearch) return gamesList;
        return gamesList.filter((game) => {
            const title = (game.title ?? "").toString().toLowerCase();
            return title.includes(normalizedSearch);
        });
    }, [gamesList, normalizedSearch]);

    return (
        <div className="flex flex-col gap-4 p-4">

            <AddNewGameModal open={openAddNewGameModal} handleClose={handleCloseNewGameModal} gamesTitles={gamesTitles} gpus={gpuList} cpus={cpuList} refetchGames={refetchGames} />
            <EditGameModal open={openEditGameModal} handleClose={handleCloseEditGameModal} gamesTitles={gamesTitles} gpus={gpuList} cpus={cpuList} refetchGames={refetchGames} gameReqComp={gameToEdit!}  />
            <div className="flex justify-between items-center gap-3 bg-white rounded-lg shadow-sm p-3">

                <div>
                    <p>{"Ilość gier: " +  gamesList.length}</p>
                </div>

                <div className="relative w-[320px]">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Szukaj po tytule..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm rounded-md border  focus:outline-none focus:ring-2]"
                    />
                </div>
                <button
                    onClick={handleOpenNewGameModal}
                    className="px-3 py-1.5 bg-ocean-dark-blue text-ocean-white rounded hover:bg-ocean-blue text-sm font-medium transition-colors flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Dodaj gre
                </button>
            </div>

            <div className="flex justify-center">
                {gamesLoading || isGamesFetching ? <LoadingSpinner /> : null}
                {isGamesError && <p className="text-sm ">Wystąpił błąd...</p>}
            </div>

            {gamesFiltered.length === 0 && !gamesLoading && (
                <p className="text-center text-sm ">Brak gier</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {gamesFiltered.map((game, i) => (
                    <GameInfoDto key={i} gameReqCompDto={game} refetchGames={refetchGames} setGameToEdit={setGameToEdit} handleOpenEditGameModal={handleOpenEditGameModal} />
                ))}
            </div>
        </div>
    );
}
export default AdminGamesPage;