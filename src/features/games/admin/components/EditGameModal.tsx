import {
    type CpuRecDto,
    type GameReqCompDto,
    type GpuRecDto,
    RecGameLevel,
    recLevels
} from "../../dto/GameReqCompDto.ts";
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
import {modalSx} from "../../../../shared/dtos/modalStyle.ts";
import Alert from "@mui/material/Alert";

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

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [titleError, setTitleError] = useState<string>("");


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
        const fallbackCpu = cpus?.[0];
        const fallbackGpu = gpus?.[0];

        const normalizedCpuSpecs = (gameReqComp?.cpuSpecs ?? []).map((s) => {
            const valid = cpus.find((c) => c.processorId === s.processorId);
            if (valid) return s;
            if (fallbackCpu) return { ...s, processorId: fallbackCpu.processorId, processorModel: fallbackCpu.processorModel };
            return s;
        });

        const normalizedGpuSpecs = (gameReqComp?.gpuSpecs ?? []).map((s) => {
            const valid = gpus.find((g) => g.gpuModelId === s.gpuModelId);
            if (valid) return s;
            if (fallbackGpu) return { ...s, gpuModelId: fallbackGpu.gpuModelId, gpuModel: fallbackGpu.gpuModel };
            return s;
        });

        setGameInfoToChange({
            ...gameReqComp,
            cpuSpecs: normalizedCpuSpecs,
            gpuSpecs: normalizedGpuSpecs,
        });
        setSelectedFile(null);
        if (!open) {
            setErrorMessage("");
            setTitleError("");
        }
    }, [gameReqComp, open, cpus, gpus]);

    const validateTitle = (value?: string) => {
        const v = (value ?? gameInfoToChange.title ?? "").trim();
        setTitleError("");
        if (v.length <= 1) {
            setTitleError("Tytuł musi posiadać więcej niż jeden znak");
            return false;
        }
        if (gamesTitles?.some((t) => t.toLowerCase() === v.toLowerCase() && t !== gameReqComp.title)) {
            setTitleError("Tytuł gry już istnieje");
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
            setSelectedFile(file);
        };
        reader.readAsDataURL(file);
    };

    const addCpuSpec = () => {
        const defaultCpuId = cpus?.[0]?.processorId ?? -1;
        const modelObj = cpus?.find((c) => c.processorId === defaultCpuId);
        const newSpec: CpuRecDto = {
            processorId: defaultCpuId,
            processorModel: modelObj?.processorModel ?? "",
            recGameLevel: modelObj?.recGameLevel ?? RecGameLevel.MIN,
        };

            const exists = (gameInfoToChange.cpuSpecs ?? []).some(
            (cpu) => cpu.processorId === newSpec.processorId && cpu.recGameLevel === newSpec.recGameLevel
        );
        if (exists) {
            showToast.error("Ten procesor z tym poziomem już istnieje!");
            return;
        }
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
        const defaultGpuId = gpus?.[0]?.gpuModelId ?? -1;
        const modelObj = gpus?.find((g) => g.gpuModelId === defaultGpuId);
        const newSpec: GpuRecDto = {
            gpuModelId: defaultGpuId,
            gpuModel: modelObj?.gpuModel ?? "",
            recGameLevel: modelObj?.recGameLevel ?? RecGameLevel.MIN,
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

        if ((gameInfoToChange.cpuSpecs?.length ?? 0) === 0) {
            setErrorMessage("Musi być przypisany co najmniej jeden procesor");
            return;
        }


        if ((gameInfoToChange.gpuSpecs?.length ?? 0) === 0) {
            // showToast.error("Wprowadź dane");
            setErrorMessage("Musi być przypisana co najmniej jedna karta graficzna");
            return;
        }

        const cpuEqual = JSON.stringify(gameInfoToChange.cpuSpecs ?? []) === JSON.stringify(gameReqComp.cpuSpecs ?? []);
        const gpuEqual = JSON.stringify(gameInfoToChange.gpuSpecs ?? []) === JSON.stringify(gameReqComp.gpuSpecs ?? []);
        const titleEqual = (gameInfoToChange.title ?? "") === (gameReqComp.title ?? "");

        if (cpuEqual && gpuEqual && titleEqual) {
            setErrorMessage("Brak zmian");
            return;
        }


        try {
            const dtoToSend: GameReqCompDto = {
                ...gameInfoToChange,
                cpuSpecs: gameInfoToChange.cpuSpecs ?? [],
                gpuSpecs: gameInfoToChange.gpuSpecs ?? [],
            };

            console.log(dtoToSend);
            setErrorMessage("");
            setTitleError("");
            await updateGameReqCompApi(dtoToSend, selectedFile).then(() => refetchGames());
            console.log("dtoToSend", dtoToSend);
            showToast.success("Zapisano zmiany");
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
                {errorMessage && <Alert severity="error" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>}

                <Stack spacing={2} mt={2}>
                    <TextField
                        label="Tytuł gry"
                        value={gameInfoToChange.title ?? ""}
                        onChange={(e) => setGameInfoToChange((prev) => ({ ...prev, title: e.target.value }))}
                        size="small"
                        fullWidth
                        required
                        error={!!titleError}
                        helperText={titleError || undefined}
                    />

                    <Box>
                        <div className="flex items-center justify-between mb-2">
                            <Typography variant="subtitle2">Wymagania CPU</Typography>
                            <Button size="small" onClick={addCpuSpec}>
                                Dodaj CPU
                            </Button>
                        </div>
                        <Box
                            sx={{
                                maxHeight: (gameInfoToChange.cpuSpecs?.length ?? 0) > 3 ? `${5 * 30}px` : "auto",
                                overflowY: (gameInfoToChange.cpuSpecs?.length ?? 0) > 3 ? "auto" : "visible",
                                pr: 1,
                            }}
                        >
                        {(gameInfoToChange.cpuSpecs ?? []).map((cpu, idx) => (
                            <div key={`cpu-${idx}`} className="mb-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id={`cpu-model-label-${idx}`}>Procesor</InputLabel>
                                        <Select
                                            labelId={`cpu-model-label-${idx}`}
                                            value={cpu.processorId ?? cpus?.[0]?.processorId ?? ''}
                                            label="Procesor"
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                const model = val === -1 ? "" : cpus?.find((c) => c.processorId === val)?.processorModel ?? "";
                                                updateCpuSpecAt(idx, { processorId: val, processorModel: model });
                                            }}
                                        >

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
                                            onChange={(e) => updateCpuSpecAt(idx, { recGameLevel: e.target.value as RecGameLevel })}
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
                        </Box>
                    </Box>

                    <Box mt={2}>
                        <div className="flex items-center justify-between mb-2">
                            <Typography variant="subtitle2">Wymagania GPU</Typography>
                            <Button size="small" onClick={addGpuSpec}>
                                Dodaj GPU
                            </Button>
                        </div>


                        <Box
                            sx={{
                                maxHeight: (gameInfoToChange.gpuSpecs?.length ?? 0) > 3 ? `${5 * 30}px` : "auto",
                                overflowY: (gameInfoToChange.gpuSpecs?.length ?? 0) > 3 ? "auto" : "visible",
                                pr: 1
                            }}
                        >
                        {(gameInfoToChange.gpuSpecs ?? []).map((gpu, idx) => (
                            <div key={`gpu-${idx}`} className="mb-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id={`gpu-model-label-${idx}`}>Karta graficzna</InputLabel>
                                        <Select
                                            labelId={`gpu-model-label-${idx}`}
                                            value={gpu.gpuModelId ?? gpus?.[0]?.gpuModelId ?? ''}
                                            label="Karta graficzna"
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                const model = val === -1 ? "" : gpus?.find((g) => g.gpuModelId === val)?.gpuModel ?? "";
                                                updateGpuSpecAt(idx, { gpuModelId: val, gpuModel: model });
                                            }}
                                        >

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
                                            onChange={(e) => updateGpuSpecAt(idx, { recGameLevel: e.target.value as RecGameLevel })}
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
                        </Box>
                    </Box>

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