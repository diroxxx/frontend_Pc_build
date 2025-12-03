import {
    type CpuRecDto,
    type GameReqCompDto,
    type GpuRecDto,
    RecGameLevel,
    recLevels
} from "../../types/GameReqCompDto.ts";
import React, {useEffect, useState} from "react";
import {showToast} from "../../../../lib/ToastContainer.tsx";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {IconButton, Stack} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {updateGameReqCompApi} from "../api/updateGameReqCompApi.ts";

const modalSx = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "92%", sm: 700 },
    bgcolor: "var(--color-ocean-dark-blue)",
    color: "var(--color-ocean-white)",
    border: "1px solid var(--color-ocean-blue)",
    boxShadow: "0 12px 40px rgba(16,55,131,0.25)",
    borderRadius: 2,
    p: 3,
    outline: "none",
};

interface GameModalProps {
    open: boolean;
    handleClose: () => void;
    gameReqComp: GameReqCompDto;
    cpus?: CpuRecDto[];
    gpus?: GpuRecDto[];
    gamesTitles?: string[];
    refetchGames: () => void;
}

export const EditGameModal = ({
                                  open,
                                  handleClose,
                                  gamesTitles,
                                  gpus = [],
                                  cpus = [],
                                  refetchGames,
                                  gameReqComp,


                              }: GameModalProps) => {

    const [gameInfoToChange, setGameInfoToChange] = useState<GameReqCompDto>({
        ...gameReqComp,
        cpuSpecs: gameReqComp?.cpuSpecs ?? [],
        gpuSpecs: gameReqComp?.gpuSpecs ?? [],
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [previewSrc, setPreviewSrc] = useState<string>("");

    useEffect(() => {
        let objectUrl: string | undefined;

        if (selectedFile) {
            objectUrl = URL.createObjectURL(selectedFile);
            setPreviewSrc(objectUrl);
            return () => {
                URL.revokeObjectURL(objectUrl!);
                setPreviewSrc("");
            };
        }
    }, [selectedFile, gameInfoToChange.imageUrl]);


    useEffect(() => {
        setGameInfoToChange({
            ...gameReqComp,
            cpuSpecs: gameReqComp?.cpuSpecs ?? [],
            gpuSpecs: gameReqComp?.gpuSpecs ?? [],
        });
        setSelectedFile(null);
    }, [gameReqComp, open]);

    const validateTitle = (value?: string) => {
        const v = (value ?? gameInfoToChange.title ?? "").trim();
        if (v.length <= 1) {
            showToast.error("Tytuł musi posiadać więcej niż jeden znak");
            return false;
        }
        if (gamesTitles?.some((t) => t.toLowerCase() === v.toLowerCase() && t !== gameReqComp.title)) {
            showToast.error("Tytuł gry już istnieje");
            return false;
        }
        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = () => {
            setSelectedFile(file)
        };
        reader.readAsDataURL(file);
    };

    const addCpuSpec = () => {
        const defaultCpuId = cpus?.[0]?.processorId ?? 0;
        const newSpec: CpuRecDto = {
            processorId: defaultCpuId,
            processorModel: cpus?.find((c) => c.processorId === defaultCpuId)?.processorModel ?? "",
            recGameLevel: cpus?.find((c) => c.processorId === defaultCpuId)?.recGameLevel ?? RecGameLevel.MIN,
        };
        setGameInfoToChange((prev) => ({ ...prev, cpuSpecs: [...(prev.cpuSpecs ?? []), newSpec] }));
    };

    const updateCpuSpecAt = (index: number, patch: Partial<CpuRecDto>) => {
        setGameInfoToChange((prev) => {
            const cpuSpecs = [...(prev.cpuSpecs ?? [])];
            cpuSpecs[index] = { ...cpuSpecs[index], ...patch } as CpuRecDto;
            return { ...prev, cpuSpecs };
        });
    };

    const removeCpuSpecAt = (index: number) => {
        setGameInfoToChange((prev) => {
            const cpuSpecs = [...(prev.cpuSpecs ?? [])];
            cpuSpecs.splice(index, 1);
            return { ...prev, cpuSpecs };
        });
    };

    const addGpuSpec = () => {
        const defaultGpuId = gpus?.[0]?.gpuModelId ?? 0;
        const newSpec: GpuRecDto = {
            gpuModelId: defaultGpuId,
            gpuModel: gpus?.find((g) => g.gpuModelId === defaultGpuId)?.gpuModel ?? "",
            recGameLevel: gpus?.find((c) => c.gpuModelId === defaultGpuId)?.recGameLevel ?? RecGameLevel.MIN,
        };
        setGameInfoToChange((prev) => ({ ...prev, gpuSpecs: [...(prev.gpuSpecs ?? []), newSpec] }));
    };

    const updateGpuSpecAt = (index: number, patch: Partial<GpuRecDto>) => {
        setGameInfoToChange((prev) => {
            const gpuSpecs = [...(prev.gpuSpecs ?? [])];
            gpuSpecs[index] = { ...gpuSpecs[index], ...patch } as GpuRecDto;
            return { ...prev, gpuSpecs };
        });
    };

    const removeGpuSpecAt = (index: number) => {
        setGameInfoToChange((prev) => {
            const gpuSpecs = [...(prev.gpuSpecs ?? [])];
            gpuSpecs.splice(index, 1);
            return { ...prev, gpuSpecs };
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateTitle(gameInfoToChange.title)) return;
        if (gameInfoToChange.imageUrl == null || gameInfoToChange.imageUrl === ''|| gameInfoToChange.imageUrl === '' || gameInfoToChange.cpuSpecs.length == 0 || gameInfoToChange.cpuSpecs.length == 0) {
            showToast.error("Wprowadź dane")
        }
        // if (selectedFile == null ) {
        //     showToast.error("Podaj grafike gry");
        //     return;
        //
        // }
        try {
            const dtoToSend: GameReqCompDto = {
                ...gameInfoToChange,
                cpuSpecs: gameInfoToChange.cpuSpecs ?? [],
                gpuSpecs: gameInfoToChange.gpuSpecs ?? [],
            };

            console.log(dtoToSend);
            await updateGameReqCompApi(dtoToSend, selectedFile);
            console.log("dtoToSend", dtoToSend);
            showToast.success("Zapisano zmiany");
            refetchGames();
            handleClose();
        } catch (err) {
            console.error("save failed", err);
            showToast.error("Błąd podczas zapisu");
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            disableEnforceFocus
            disableAutoFocus

        >

            <Box sx={modalSx} component="form" onSubmit={handleSave}>
                <div className="flex items-start justify-between">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Edytuj wymagania
                    </Typography>
                    <IconButton onClick={handleClose} size="small" aria-label="Zamknij">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>

                <Stack spacing={2} mt={2}>
                    <TextField
                        label="Tytuł gry"
                        value={gameInfoToChange.title ?? ""}
                        onChange={(e) => setGameInfoToChange((prev) => ({ ...prev, title: e.target.value }))}
                        size="small"
                        fullWidth
                        required
                    />

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Typography variant="subtitle2">Wymagania CPU</Typography>
                            <Button size="small" onClick={addCpuSpec}>
                                Dodaj CPU
                            </Button>
                        </div>

                        {(gameInfoToChange.cpuSpecs ?? []).map((cpu, idx) => (
                            <div key={`cpu-${cpu.processorId ?? idx}`} className="mb-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id={`cpu-model-label-${idx}`}>Procesor</InputLabel>
                                        <Select
                                            labelId={`cpu-model-label-${idx}`}
                                            value={cpu.processorId}
                                            label="Procesor"
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                const model = cpus?.find((c) => c.processorId === val)?.processorModel ?? "";
                                                updateCpuSpecAt(idx, { processorId: val, processorModel: model });
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Brak</em>
                                            </MenuItem>
                                            {cpus?.map((p,k) => (
                                                <MenuItem key={k} value={p.processorId}>
                                                    {p.processorModel}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl size="small" fullWidth>
                                        <InputLabel id={`cpu-level-label-${idx}`}>Wymagania (CPU)</InputLabel>
                                        <Select
                                            labelId={`cpu-level-label-${idx}`}
                                            value={cpu.recGameLevel}
                                            label="Wymagania (CPU)"
                                            onChange={(e) => updateCpuSpecAt(idx, { recGameLevel: e.target.value})}

                                        >
                                            {recLevels.map((r,k) => (
                                                <MenuItem key={k} value={r}>
                                                    {r}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <div className="col-span-1 flex items-center gap-2">
                                        <Button size="small" color="error" onClick={() => removeCpuSpecAt(idx)}>
                                            Usuń
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Typography variant="subtitle2">Wymagania GPU</Typography>
                            <Button size="small" onClick={addGpuSpec}>
                                Dodaj GPU
                            </Button>
                        </div>

                        {(gameInfoToChange.gpuSpecs ?? []).map((gpu, idx) => (
                            <div key={`gpu-${gpu.gpuModelId ?? idx}`} className="mb-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id={`gpu-model-label-${idx}`}>Karta graficzna</InputLabel>
                                        <Select
                                            labelId={`gpu-model-label-${idx}`}
                                            value={gpu.gpuModelId }
                                            label="Karta graficzna"
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                const model = gpus?.find((g) => g.gpuModelId === val)?.gpuModel ?? "";
                                                updateGpuSpecAt(idx, { gpuModelId: val, gpuModel: model });
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Brak</em>
                                            </MenuItem>
                                            {gpus?.map((d, k) => (
                                                <MenuItem key={k} value={d.gpuModelId}>
                                                    {d.gpuModel}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl size="small" fullWidth>
                                        <InputLabel id={`gpu-level-label-${idx}`}>Wymagania (GPU)</InputLabel>
                                        <Select
                                            labelId={`gpu-level-label-${idx}`}
                                            value={gpu.recGameLevel}
                                            label="Wymagania (GPU)"
                                            onChange={(e) => updateGpuSpecAt(idx, { recGameLevel: e.target.value })}
                                        >
                                            {recLevels.map((r, k) => (
                                                <MenuItem key={k} value={r}>
                                                    {r}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <div className="col-span-1 flex items-center gap-2">
                                        <Button size="small" color="error" onClick={() => removeGpuSpecAt(idx)}>
                                            Usuń
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button component="label" variant="outlined" size="small">
                            Wybierz grafikę gry
                            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                        </Button>

                        {previewSrc && selectedFile ? (
                            <div className="w-28 h-16 rounded overflow-hidden border">
                                <img src={previewSrc} alt="preview" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="text-xs text-gray-400">Brak wybranego obrazka</div>
                        )}
                    </div>
                </Stack>

                <div className="mt-4 flex justify-end gap-2">
                    <Button onClick={handleClose} variant="outlined" size="small">
                        Anuluj
                    </Button>

                    <Button type="submit" variant="contained" size="small">
                        Zapisz
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};