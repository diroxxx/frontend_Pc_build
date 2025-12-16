import {useState} from "react";
import type {ComputerDto} from "../../../../types/ComputerDto.ts";
import {showToast} from "../../../../lib/ToastContainer.tsx";
import {useAtom, useAtomValue} from "jotai";
import {userAtom} from "../../../../atomContext/userAtom.tsx";
import {useDeleteComputer} from "../hooks/useDeleteComputer.ts";
import {RemoveIcon} from "../../../../assets/icons/removeIcon.tsx";
import {selectedComputerAtom} from "../../../../atomContext/computerAtom.tsx";
import { Pencil } from "lucide-react";
import {useUpdateComputerName} from "../hooks/updateComputerNameMutation.ts";
import {guestComputersAtom} from "../../atoms/guestComputersAtom.ts";
interface BuildListProps {
    computers: ComputerDto[];
    onSelectBuild: (index: number) => void;
    onCreateNew: () => void;
    isLoading: boolean;
}

const BuildList = ({
                                                 computers,
                                                 onSelectBuild,
                                                 onCreateNew,
                                                 isLoading,
                                             } : BuildListProps) => {

    const user = useAtomValue(userAtom)
    const deleteMutation = useDeleteComputer(user?.email);
    const [selectedComputer,] = useAtom(selectedComputerAtom);

    const updateNameMutation = useUpdateComputerName();

    const [editingId, setEditingId] = useState<number | null>(null);
    const [newName, setNewName] = useState("");
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [guestComputer, setGuestComputer] = useAtom(guestComputersAtom);

    const handleDelete = (id: number) => {
        if (!user?.email) {
            showToast.warning("Musisz być zalogowany, aby usunąć zestaw");
            return;
        }
        deleteMutation.mutate(id);
    };

    const handleDeleteGuestComuter = (name: string) => {

        const updatedComputers = guestComputer.filter(computer => computer.name !== name);
        setGuestComputer(updatedComputers);
        showToast.success(`Zestaw ${name} został usunięty`);
    }


    const startEditing = (id: number, currentName: string) => {
        setEditingId(id);
        setNewName(currentName);
    };

    const saveName = (computerId: number) => {
        if (newName.trim().length < 2) {
            showToast.warning("Nazwa musi mieć co najmniej 2 znaki");
            return;
        }
        if(newName.trim() == selectedComputer?.name) {
            showToast.warning("Nazwa komputera nie zmieniła się")
            return;
        }
        updateNameMutation.mutate({ computerId, newName });
        setEditingId(null);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-ocean-light-blue">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-midnight-dark">Twoje zestawy</h2>
                <button
                    type="button"
                    onClick={() => {
                        onCreateNew();
                    }}
                    className= "px-4 py-2 rounded-lg font-medium text-white bg-gradient-ocean hover:bg-gradient-ocean-hover"
                >
                    + Nowy zestaw
                </button>
            </div>

            {isLoading ? (
                <p className="text-center text-ocean-blue py-8">Ładowanie zestawów...</p>
            ) : computers.length === 0 ? (
                <p className="text-center py-8 text-ocean-blue">
                    Brak zestawów. Utwórz swój pierwszy!
                </p>
            ) : (
                <div className="grid gap-3 max-h-48 overflow-y-auto">
                    {computers.map((computer) => (
                        <div
                            key={computer.id}
                            onClick={() => onSelectBuild(computer.id)}
                            onMouseEnter={() => setHoveredId(computer.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                selectedComputer?.id === computer.id
                                    ? "border-ocean-blue bg-ocean-light-blue bg-opacity-20 shadow-md"
                                    : "border-ocean-light-blue hover:border-ocean-blue hover:bg-ocean-light-blue hover:bg-opacity-10"
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col relative">
                                    {user && editingId === computer.id ? (
                                        <input
                                            type="text"
                                            value={newName}
                                            autoFocus
                                            onChange={(e) => setNewName(e.target.value)}
                                            onBlur={() => {
                                                saveName(computer.id);
                                                setEditingId(null);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveName(computer.id);
                                                if (e.key === "Escape") setEditingId(null);
                                            }}
                                            className="text-sm font-medium text-midnight-dark bg-transparent border-b border-ocean-blue focus:outline-none focus:ring-0 pr-6"
                                        />
                                    ) : (
                                        <div className="flex items-center group">
                                            <h3
                                                className="font-medium text-midnight-dark cursor-text"
                                                onDoubleClick={(e) => {
                                                    e.stopPropagation();
                                                    if (user) startEditing(computer.id, computer.name);
                                                }}
                                            >
                                                {computer.name}
                                            </h3>

                                            {user && hoveredId === computer.id && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startEditing(computer.id, computer.name);
                                                    }}
                                                    className="ml-2 text-ocean-blue opacity-0 group-hover:opacity-100 hover:text-ocean-dark-blue transition-opacity duration-200"
                                                    title="Zmień nazwę zestawu"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <p className="text-sm text-ocean-blue">
                                        {(computer.offers || []).length} komponentów - {" "}
                                        {computer.price.toLocaleString("pl-PL")} zł
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (user) {
                                            handleDelete(computer.id);
                                        } else {
                                            handleDeleteGuestComuter(computer.name)
                                        }

                                    }
                                }
                                    className="hover:text-ocean-red p-1 transition-colors duration-200 cursor-pointer"
                                    title="Usuń zestaw"
                                >
                                    <RemoveIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BuildList;
