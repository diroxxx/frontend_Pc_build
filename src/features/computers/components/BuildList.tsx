import {useState} from "react";
import type {ComputerDto} from "../../../shared/dtos/ComputerDto.ts";
import {showToast} from "../../../lib/ToastContainer.tsx";
import {useAtom, useAtomValue} from "jotai";
import {userAtom} from "../../auth/atoms/userAtom.tsx";
import {useDeleteComputer} from "../user/hooks/useDeleteComputer.ts";
import {RemoveIcon} from "../../../assets/icons/removeIcon.tsx";
import {selectedComputerAtom} from "../atoms/computerAtom.tsx";
import { Pencil } from "lucide-react";
import {useUpdateComputerName} from "../user/hooks/updateComputerNameMutation.ts";
import {guestComputersAtom} from "../atoms/guestComputersAtom.ts";
import {EditIcon} from "lucide-react";

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
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5 mb-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold text-dark-muted uppercase tracking-widest">Twoje zestawy</h2>
                <button
                    type="button"
                    onClick={onCreateNew}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-accent/15 text-dark-accent hover:bg-dark-accent hover:text-white text-xs font-semibold transition-all"
                >
                    + Nowy zestaw
                </button>
            </div>

            {isLoading ? (
                <p className="text-center text-dark-muted text-sm py-6">Ładowanie zestawów...</p>
            ) : computers.length === 0 ? (
                <p className="text-center py-6 text-dark-muted text-sm">
                    Brak zestawów. Utwórz swój pierwszy!
                </p>
            ) : (
                <div className="grid gap-2 max-h-48 overflow-y-auto pr-1">
                    {computers.map((computer) => (
                        <div
                            key={computer.id}
                            onClick={() => onSelectBuild(computer.id)}
                            onMouseEnter={() => setHoveredId(computer.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                selectedComputer?.id === computer.id
                                    ? "border-dark-accent/40 bg-dark-accent/10"
                                    : "border-dark-border bg-dark-surface2 hover:border-dark-accent/30"
                            }`}
                        >
                            <div className="flex justify-between items-center gap-2">
                                <div className="flex flex-col flex-1 min-w-0">
                                    {user && editingId === computer.id ? (
                                        <input
                                            type="text"
                                            value={newName}
                                            autoFocus
                                            onChange={(e) => setNewName(e.target.value)}
                                            onBlur={() => { saveName(computer.id); setEditingId(null); }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveName(computer.id);
                                                if (e.key === "Escape") setEditingId(null);
                                            }}
                                            className="text-sm font-medium text-dark-text bg-transparent border-b border-dark-accent focus:outline-none pr-6"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 group">
                                            <h3
                                                className={`text-sm font-semibold truncate cursor-text ${selectedComputer?.id === computer.id ? "text-dark-accent" : "text-dark-text"}`}
                                                onDoubleClick={(e) => { e.stopPropagation(); if (user) startEditing(computer.id, computer.name); }}
                                            >
                                                {computer.name}
                                            </h3>
                                            {user && hoveredId === computer.id && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); startEditing(computer.id, computer.name); }}
                                                    className="text-dark-muted hover:text-dark-accent transition-colors flex-shrink-0"
                                                    title="Zmień nazwę"
                                                >
                                                    <Pencil size={13} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <p className="text-[11px] text-dark-muted mt-0.5">
                                        {(computer.offers || []).length} komponentów · {computer.price.toLocaleString("pl-PL")} zł
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); user ? handleDelete(computer.id) : handleDeleteGuestComuter(computer.name); }}
                                    className="flex-shrink-0 text-dark-muted hover:text-ocean-red transition-colors p-1"
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
