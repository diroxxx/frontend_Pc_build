import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import {IconButton, Stack} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
    type CpuRecDto,
    type GameReqCompDto,
    type GpuRecDto,
    RecGameLevel,
    recLevels
} from "../../dto/GameReqCompDto.ts";
import {createNewGameReqCompApi} from "../api/createNewGameReqCompApi.ts";
import {modalSx} from "../../../../shared/dtos/modalStyle.ts";
import Alert from "@mui/material/Alert";


interface GameModalProps {
    open: boolean;
    handleClose: () => void;
    cpus?: CpuRecDto[];
    gpus?: GpuRecDto[];
    gamesTitles?: string[];
    refetchGames: () => void;

}

export function AddNewGameModal({ open, handleClose, gamesTitles, gpus, cpus, refetchGames }: GameModalProps) {

    const [newGameInfo, setNewGameInfo] = useState<GameReqCompDto>({
        cpuSpecs: [],
        gpuSpecs: [],
        id: 0,
        imageUrl: "",
        title: "",
    });

    const [selectedCpuId, setSelectedCpuId] = useState<number>(0);
    const [selectedCpuLevel, setSelectedCpuLevel] = useState<RecGameLevel>(RecGameLevel.MIN);
    const [selectedGpuId, setSelectedGpuId] = useState<number>(0);
    const [selectedGpuLevel, setSelectedGpuLevel] = useState<RecGameLevel>(RecGameLevel.MIN);


    const [selectedGameImage, setSelectedGameImage] = useState<string>("");
    const [selectedGameFile, setSelectedGameFile] = useState<File | null>(null);

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [titleError, setTitleError] = useState<string>("");



    const handleSave = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newGameInfo.title?.trim()) {
            setErrorMessage("Wpisz tytuł gry");
            return;
        }

        if (!validateTitle()) return;

        if (!selectedGameImage || selectedGameImage.trim().length === 0) {
            setErrorMessage("Wybierz obrazek gry");
            return;
        }

        const prevCpuSpecs = Array.isArray(newGameInfo.cpuSpecs) ? [...newGameInfo.cpuSpecs] : [];
        const prevGpuSpecs = Array.isArray(newGameInfo.gpuSpecs) ? [...newGameInfo.gpuSpecs] : [];

        const cpuEntry: CpuRecDto | undefined  = selectedCpuId
            ? {
                processorId: selectedCpuId,
                processorModel: cpus?.find((c) => c.processorId === selectedCpuId)?.processorModel ?? "",
                recGameLevel: selectedCpuLevel,
            }
            : undefined;

        const gpuEntry: GpuRecDto | null = selectedGpuId
            ? {
                gpuModelId: selectedGpuId,
                gpuModel: gpus?.find((g) => g.gpuModelId === selectedGpuId)?.gpuModel ?? "",
                recGameLevel: selectedGpuLevel
            }
            : null;

        let newCpuSpecs = prevCpuSpecs;
        if (cpuEntry) {
            const idx = prevCpuSpecs.findIndex((c) => String(c.processorId) === String(cpuEntry.processorId));
            if (idx >= 0) {
                newCpuSpecs = [...prevCpuSpecs.slice(0, idx), cpuEntry, ...prevCpuSpecs.slice(idx + 1)];
            } else {
                newCpuSpecs = [...prevCpuSpecs, cpuEntry];
            }
        }

        let newGpuSpecs = prevGpuSpecs;
        if (gpuEntry) {
            const idxG = prevGpuSpecs.findIndex((g) => String(g.gpuModelId) === String(gpuEntry.gpuModelId));
            if (idxG >= 0) {
                newGpuSpecs = [...prevGpuSpecs.slice(0, idxG), gpuEntry, ...prevGpuSpecs.slice(idxG + 1)];
            } else {
                newGpuSpecs = [...prevGpuSpecs, gpuEntry];
            }
        }

        const result: GameReqCompDto = {
            ...newGameInfo,
            cpuSpecs: newCpuSpecs,
            gpuSpecs: newGpuSpecs,
        };


        if (result.cpuSpecs.length === 0) {
            setErrorMessage("Podaj co najmniej jeden procesor");
            return;
        }
        if (result.gpuSpecs.length === 0) {
            setErrorMessage("Podaj co najmiej jedną karte graficzne")
            return;
        }
        createNewGameReqCompApi(result, selectedGameFile ?? null).then(() => { refetchGames()})

        console.log("Saved (merged):", result);

        setNewGameInfo((prev) => ({ ...prev, cpuSpecs: newCpuSpecs, gpuSpecs: newGpuSpecs }));

        setSelectedCpuId(0);
        setSelectedCpuLevel(RecGameLevel.MIN);
        setSelectedGpuId(0);
        setSelectedGpuLevel(RecGameLevel.MIN);

        setErrorMessage("");
        setTitleError("");

        handleClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) {
            setSelectedGameFile(null);
            setSelectedGameImage("");
            return;
        }

        setSelectedGameFile(file);

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = String(reader.result || "");
            setSelectedGameImage(base64);
        };
        reader.readAsDataURL(file);
    };

    const validateTitle = (value?: string) => {
        const v = (value ?? newGameInfo.title ?? "").trim();
        setTitleError("");
        if (v.length <= 1) {
            setTitleError("Tytuł musi posiadać więcej niż jeden znak");
            return false;
        }

        if (gamesTitles?.some((t) => t.toLowerCase() === v.toLowerCase())) {
            setTitleError("Tytuł gry już istnieje");
            return false;
        }
        return true;
    };
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="game-modal-title"
            aria-describedby="game-modal-description"
            closeAfterTransition
            BackdropProps={{ sx: { bgcolor: "rgba(0,0,0,0.45)" } }}
        >
            <Box sx={modalSx} component="form" onSubmit={handleSave}>
                <div className="flex items-start justify-between">
                    <Typography id="game-modal-title" variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                        Dodaj wymagania
                    </Typography>

                    <IconButton
                        onClick={handleClose}
                        size="small"
                        aria-label="Zamknij"
                        className="text-[var(--color-ocean-white)] bg-white/3 hover:bg-white/6"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
                {errorMessage && <Alert severity="error" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>}

                <Stack spacing={2}>
                    <TextField
                        label="Tytuł gry"
                        value={newGameInfo.title}
                        onChange={(e) => setNewGameInfo(prev => ({ ...prev, title: e.target.value }))}
                        size="small"
                        fullWidth
                        required
                        error={!!titleError}
                        helperText={titleError || undefined}
                        sx={{
                            "& .MuiInputBase-root": {
                                bgcolor: "rgba(255,255,255,0.02)",
                                color: "var(--color-ocean-white)",
                            },
                            "& .MuiInputLabel-root": { color: "rgba(241,250,238,0.8)" },
                            "& .MuiInputBase-input": { color: "var(--color-ocean-white)" },
                        }}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                        <FormControl size="small" fullWidth>
                            <InputLabel id="cpu-model-label" sx={{ color: "rgba(241,250,238,0.8)" }}>
                                Procesor
                            </InputLabel>
                            <Select
                                labelId="cpu-model-label"
                                value={selectedCpuId}
                                label="Procesor"
                                onChange={(e) => setSelectedCpuId(e.target.value)}
                                sx={{
                                    "& .MuiSelect-select": { py: 1 },
                                    "& .MuiInputBase-root": { bgcolor: "rgba(255,255,255,0.02)" },
                                    color: "var(--color-ocean-white)",
                                }}
                            >
                                {cpus?.map((p,k) => (
                                    <MenuItem key={k} value={String(p.processorId)}>
                                        {p.processorModel}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" fullWidth>
                            <InputLabel id="cpu-level-label" sx={{ color: "rgba(241,250,238,0.8)" }}>
                                Wymagania (CPU)
                            </InputLabel>
                            <Select
                                labelId="cpu-level-label"
                                value={selectedCpuLevel}
                                label="Wymagania (CPU)"
                                onChange={(e) => setSelectedCpuLevel(e.target.value) }
                                sx={{
                                    "& .MuiSelect-select": { py: 1 },
                                    "& .MuiInputBase-root": { bgcolor: "rgba(255,255,255,0.02)" },
                                    color: "var(--color-ocean-white)",
                                }}
                            >
                                {recLevels.map((r,k) => (
                                    <MenuItem key={k} value={r}>
                                        {r}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" fullWidth>
                            <InputLabel id="gpu-model-label" sx={{ color: "rgba(241,250,238,0.8)" }}>
                                Karta graficzna
                            </InputLabel>
                            <Select
                                labelId="gpu-model-label"
                                value={selectedGpuId}
                                label="Karta graficzna"
                                onChange={(e) => setSelectedGpuId(e.target.value)}
                                sx={{
                                    "& .MuiSelect-select": { py: 1 },
                                    "& .MuiInputBase-root": { bgcolor: "rgba(255,255,255,0.02)" },
                                    color: "var(--color-ocean-white)",
                                }}
                            >
                                <MenuItem value="">
                                    <em>Brak</em>
                                </MenuItem>
                                {gpus?.map((d,k) => (
                                    <MenuItem key={k} value={String(d.gpuModelId)}>
                                        {d.gpuModel}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" fullWidth>
                            <InputLabel id="gpu-level-label" sx={{ color: "rgba(241,250,238,0.8)" }}>
                                Wymagania (GPU)
                            </InputLabel>
                            <Select
                                labelId="gpu-level-label"
                                value={selectedGpuLevel}
                                label="Wymagania (GPU)"
                                onChange={(e) => setSelectedGpuLevel(e.target.value)}
                                sx={{
                                    "& .MuiSelect-select": { py: 1 },
                                    "& .MuiInputBase-root": { bgcolor: "rgba(255,255,255,0.02)" },
                                    color: "var(--color-ocean-white)",
                                }}
                            >
                                <MenuItem value="">
                                    <em>Brak</em>
                                </MenuItem>
                                {recLevels.map((r,k) => (
                                    <MenuItem key={k} value={r}>
                                        {r}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Button
                            component="label"
                            variant="outlined"
                            size="small"
                            className="border-[var(--color-ocean-light-blue)] text-[var(--color-ocean-light-blue)]"
                        >
                            Wybierz grafike gry
                            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                        </Button>

                        {selectedGameImage ? (
                            <div className="w-28 h-16 rounded overflow-hidden border border-white/6">
                                {selectedGameImage && <img src={selectedGameImage} alt="preview"  className="w-full h-full object-cover opacity-50"   />}

                            </div>
                        ) : (
                            <div className="text-xs text-[rgba(241,250,238,0.75)]">Brak wybranego obrazka</div>
                        )}
                    </div>
                </Stack>

                <div className="mt-4 flex justify-end gap-2">
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        size="small"
                        className="border-[var(--color-ocean-light-blue)] text-[var(--color-ocean-light-blue)]"
                    >
                        Anuluj
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        className="bg-[var(--color-ocean-blue)] hover:bg-[var(--color-ocean-dark-blue)] text-[var(--color-ocean-white)]"
                    >
                        Zapisz
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}
