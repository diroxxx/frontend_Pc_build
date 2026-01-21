import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton
} from '@mui/material';
import { Check, Gpu, X } from 'lucide-react';
import { type ComponentItem, ComponentTypeEnum } from '../../../../shared/dtos/BaseItemDto.ts';
import {modalSx} from "../../../../shared/dtos/modalStyle.ts";
import { useFetchBrands } from '../../../../shared/hooks/useFetchBrands.ts';
import { set } from 'date-fns';
import { showToast } from '../../../../lib/ToastContainer.tsx';
import { useGpuModels } from '../../../../shared/hooks/useGpuModels.ts';
interface AddComponentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ComponentItem) => void;
    initialData?: ComponentItem;
}

const AddComponentForm: React.FC<AddComponentModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {

    const {data:brandsNames} = useFetchBrands();
    const {data: gpuModels} = useGpuModels();


    const [componentToEdit, setComponentToEdit] = useState<Partial<ComponentItem >>(initialData || {} );
    const [coolerSocketsTypeInput, setCoolerSocketsTypeInput] = useState<string>('');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!componentToEdit.componentType || !componentToEdit.brand || !componentToEdit.model) {
        showToast.error('Uzupełnij wszystkie wymagane pola');
        return;
    }

    switch (componentToEdit.componentType) {
        case ComponentTypeEnum.PROCESSOR: {
            const requiredStrings = [
                { field: componentToEdit.brand, name: 'Marka' },
                { field: componentToEdit.model, name: 'Model' },
                { field: componentToEdit.socketType, name: 'Socket' },
                { field: componentToEdit.integratedGraphics, name: 'Zintegrowana grafika' }
            ];
            for (const { field, name } of requiredStrings) {
                if (typeof field === 'string' && field.trim() === '') {
                    showToast.error(`${name} nie może być pusty`);
                    return;
                }
            }
            break;
        }
        case ComponentTypeEnum.GRAPHICS_CARD: {
            const requiredStrings = [
                { field: componentToEdit.brand, name: 'Marka' },
                { field: componentToEdit.model, name: 'Model' },
                { field: componentToEdit.gddr, name: 'Rodzaj pamięci' },
                { field: componentToEdit.baseModel, name: 'Model bazowy' }
            ];
            for (const { field, name } of requiredStrings) {
                if (typeof field === 'string' && field.trim() === '') {
                    showToast.error(`${name} nie może być pusty`);
                    return;
                }
            }
            break;
        }
        case ComponentTypeEnum.MEMORY: {
            const requiredStrings = [
                { field: componentToEdit.brand, name: 'Marka' },
                { field: componentToEdit.model, name: 'Model' },
                { field: componentToEdit.type, name: 'Typ pamięci' }
            ];
            for (const { field, name } of requiredStrings) {
                if (typeof field === 'string' && field.trim() === '') {
                    showToast.error(`${name} nie może być pusty`);
                    return;
                }
            }
            break;
        }
        case ComponentTypeEnum.MOTHERBOARD: {
            const requiredStrings = [
                { field: componentToEdit.brand, name: 'Marka' },
                { field: componentToEdit.model, name: 'Model' },
                { field: componentToEdit.chipset, name: 'Chipset' },
                { field: componentToEdit.socketType, name: 'Typ socketu' },
                { field: componentToEdit.memoryType, name: 'Rodzaj pamięci' },
                { field: componentToEdit.format, name: 'Format płyty' }
            ];
            for (const { field, name } of requiredStrings) {
                if (typeof field === 'string' && field.trim() === '') {
                    showToast.error(`${name} nie może być pusty`);
                    return;
                }
            }
            break;
        }
        case ComponentTypeEnum.POWER_SUPPLY: {
            const requiredStrings = [
                { field: componentToEdit.brand, name: 'Marka' },
                { field: componentToEdit.model, name: 'Model' },
                { field: componentToEdit.efficiencyRating, name: 'Certyfikat' },
                { field: componentToEdit.modular, name: 'Modular' },
                { field: componentToEdit.type, name: 'Typ' }
            ];
            for (const { field, name } of requiredStrings) {
                if (typeof field === 'string' && field.trim() === '') {
                    showToast.error(`${name} nie może być pusty`);
                    return;
                }
            }
            break;
        }
        case ComponentTypeEnum.STORAGE: {
            const requiredStrings = [
                { field: componentToEdit.brand, name: 'Marka' },
                { field: componentToEdit.model, name: 'Model' }
            ];
            for (const { field, name } of requiredStrings) {
                if (typeof field === 'string' && field.trim() === '') {
                    showToast.error(`${name} nie może być pusty`);
                    return;
                }
            }
            break;
        }
        case ComponentTypeEnum.CPU_COOLER: {
            const requiredStrings = [
                { field: componentToEdit.brand, name: 'Marka' },
                { field: componentToEdit.model, name: 'Model' },
                { field: coolerSocketsTypeInput, name: 'Sockety' },
                { field: componentToEdit.fanRpm, name: 'Obroty wentylatorów' },
                { field: componentToEdit.noiseLevel, name: 'Hałas wentylatorów' },
                { field: componentToEdit.radiatorSize, name: 'Wielkość radiatora' }
            ];
            for (const { field, name } of requiredStrings) {
                if (typeof field === 'string' && field.trim() === '') {
                    showToast.error(`${name} nie może być pusty`);
                    return;
                }
            }
            break;
        }
        case ComponentTypeEnum.CASE_PC: {
            const requiredStrings = [
                { field: componentToEdit.brand, name: 'Marka' },
                { field: componentToEdit.model, name: 'Model' },
                { field: componentToEdit.format, name: 'Format' }
            ];
            for (const { field, name } of requiredStrings) {
                if (typeof field === 'string' && field.trim() === '') {
                    showToast.error(`${name} nie może być pusty`);
                    return;
                }
            }
            break;
        }
        default:
            showToast.error('Nieobsługiwany typ komponentu');
            return;
    }



        let newComponent: ComponentItem;

        switch (componentToEdit.componentType) {
            case ComponentTypeEnum.PROCESSOR:
                newComponent = {
                    id: componentToEdit.id,
                    componentType: ComponentTypeEnum.PROCESSOR,
                    brand: componentToEdit.brand,
                    model: componentToEdit.model,
                    cores: Number(componentToEdit.cores),
                    threads: Number(componentToEdit.threads),
                    baseClock: Number(componentToEdit.baseClock),
                    socketType: componentToEdit.socketType || '',
                    boostClock: Number(componentToEdit.boostClock),
                    integratedGraphics: componentToEdit.integratedGraphics || '',
                    tdp: Number(componentToEdit.tdp),
                };
                break;

            case ComponentTypeEnum.GRAPHICS_CARD:
                newComponent = {
                    id: componentToEdit.id,
                    componentType: ComponentTypeEnum.GRAPHICS_CARD,
                    brand: componentToEdit.brand || '',
                    model: componentToEdit.model || '',
                    vram: Number(componentToEdit.vram),
                    gddr: componentToEdit.gddr || '',
                    powerDraw: Number(componentToEdit.powerDraw),
                    boostClock: Number(componentToEdit.boostClock),
                    lengthInMM: Number(componentToEdit.lengthInMM),
                    baseModel: componentToEdit.baseModel || '',
                };
                break;

            case ComponentTypeEnum.MEMORY:
                newComponent = {
                    id: componentToEdit.id,
                    componentType: ComponentTypeEnum.MEMORY,
                    brand: componentToEdit.brand || '',
                    model: componentToEdit.model || '',
                    type: componentToEdit.type || '',
                    capacity: Number(componentToEdit.capacity),
                    speed: Number(componentToEdit.speed),
                    latency: Number(componentToEdit.latency),
                    amount: Number(componentToEdit.amount),
                };
                break;

            case ComponentTypeEnum.MOTHERBOARD:
                newComponent = {
                    id: componentToEdit.id,
                    componentType: ComponentTypeEnum.MOTHERBOARD,
                    brand: componentToEdit.brand || '',
                    model: componentToEdit.model || '',
                    chipset: componentToEdit.chipset || '',
                    socketType: componentToEdit.socketType || '',
                    memoryType: componentToEdit.memoryType || '',
                    format: componentToEdit.format || '',
                    ramSlots: Number(componentToEdit.ramSlots),
                    ramCapacity: Number(componentToEdit.ramCapacity),
                };
                break;

            case ComponentTypeEnum.POWER_SUPPLY:
                newComponent = {
                    id: componentToEdit.id,
                    componentType: ComponentTypeEnum.POWER_SUPPLY,
                    brand: componentToEdit.brand || '',
                    model: componentToEdit.model || '',
                    maxPowerWatt: Number(componentToEdit.maxPowerWatt),
                    efficiencyRating: componentToEdit.efficiencyRating || '',
                    modular: componentToEdit.modular || '',
                    type: componentToEdit.type || '',
                };
                break;

            case ComponentTypeEnum.STORAGE:
                newComponent = {
                    id: componentToEdit.id,
                    componentType: ComponentTypeEnum.STORAGE,
                    brand: componentToEdit.brand || '',
                    model: componentToEdit.model || '',
                    capacity: Number(componentToEdit.capacity),
                };
                break;

            case ComponentTypeEnum.CPU_COOLER:
                newComponent = {
                    id: componentToEdit.id,
                    componentType: ComponentTypeEnum.CPU_COOLER,
                    brand: componentToEdit.brand || '',
                    model: componentToEdit.model || '',
                    coolerSocketsType: coolerSocketsTypeInput
                        ? coolerSocketsTypeInput.split(',').map((s) => s.trim())
                        : [],
                    fanRpm: componentToEdit.fanRpm || '',
                    noiseLevel: componentToEdit.noiseLevel || '',
                    radiatorSize: componentToEdit.radiatorSize || '',
                };
                break;

            case ComponentTypeEnum.CASE_PC:
                newComponent = {
                    id: componentToEdit.id,
                    componentType: ComponentTypeEnum.CASE_PC,
                    brand: componentToEdit.brand || '',
                    model: componentToEdit.model || '',
                    format: componentToEdit.format || '',
                };
                break;

            default:
                showToast.error('Nieobsługiwany typ komponentu');
                return;
        }

        onSubmit(newComponent);
        handleClose();
    };

    const handleClose = () => {
        setComponentToEdit({} as ComponentItem);
        setCoolerSocketsTypeInput('');
        onClose();
    };

    const renderDynamicFields = () => {
        switch (componentToEdit.componentType) {
            case ComponentTypeEnum.PROCESSOR:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Socket (string)"  value={componentToEdit.socketType} onChange={(v) => setComponentToEdit({ ...componentToEdit, socketType: v })} />
                        <CustomTextField label="Rdzenie (number)" type='number' value={componentToEdit.cores !== undefined ? String(componentToEdit.cores) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, cores: Number(v) })} />
                        <CustomTextField label="Taktowanie bazowe GHz (number)" type='number' value={componentToEdit.baseClock !== undefined ? String(componentToEdit.baseClock) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, baseClock: Number(v) })} />
                        <CustomTextField label="Taktowanie boost GHz (number)" type='number' value={componentToEdit.boostClock !== undefined ? String(componentToEdit.boostClock) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, boostClock: Number(v) })} />
                        <CustomTextField label="Wątki (number)" type='number' value={componentToEdit.threads !== undefined ? String(componentToEdit.threads) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, threads: Number(v) })} />
                        <CustomTextField label="Zintegrowana grafika (string)" value={componentToEdit.integratedGraphics} onChange={(v) => setComponentToEdit({ ...componentToEdit, integratedGraphics: v })} />
                        <CustomTextField label="TDP (number)" type='number' value={componentToEdit.tdp !== undefined ? String(componentToEdit.tdp) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, tdp: Number(v) })} />
                    </div>
                );

            case ComponentTypeEnum.GRAPHICS_CARD:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Pamięć VRAM (number)" type='number' value={componentToEdit.vram !== undefined ? String(componentToEdit.vram) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, vram: Number(v) })} />
                        <CustomTextField label="Rodzaj pamięci (string)" value={componentToEdit.gddr !== undefined ? componentToEdit.gddr : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, gddr: v })} />
                        <CustomTextField label="TDP (number)" type='number' value={componentToEdit.powerDraw !== undefined ? String(componentToEdit.powerDraw) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, powerDraw: Number(v) })} />
                        <CustomTextField label="Boost Clock (number)" type='number' value={componentToEdit.boostClock !== undefined ? String(componentToEdit.boostClock) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, boostClock: Number(v) })} />
                        <CustomTextField label="Długość karty mm (number)" type='number' value={componentToEdit.lengthInMM !== undefined ? String(componentToEdit.lengthInMM) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, lengthInMM: Number(v) })} />
                    </div>
                );

            case ComponentTypeEnum.MEMORY:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Typ pamięci (string)" value={componentToEdit.type !== undefined ? componentToEdit.type : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, type: v })} />
                        <CustomTextField label="Pojemność GB (number)" type='number' value={componentToEdit.capacity !== undefined ? String(componentToEdit.capacity) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, capacity: Number(v) })} />
                        <CustomTextField label="Taktowanie MHz (number)" type='number' value={componentToEdit.speed !== undefined ? String(componentToEdit.speed) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, speed: Number(v) })} />
                        <CustomTextField label="Opóźnienie CL (number)" type='number' value={componentToEdit.latency !== undefined ? String(componentToEdit.latency) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, latency: Number(v) })} />
                        <CustomTextField label="Ilość (number)" type='number' value={componentToEdit.amount !== undefined ? String(componentToEdit.amount) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, amount: Number(v) })} />
                    </div>
                );

            case ComponentTypeEnum.MOTHERBOARD:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Chipset (string)" value={componentToEdit.chipset !== undefined ? componentToEdit.chipset : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, chipset: v })} />
                        <CustomTextField label="Typ socketu (string)" value={componentToEdit.socketType !== undefined ? componentToEdit.socketType : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, socketType: v })} />
                        <CustomTextField label="Rodzaj pamięci (string)" value={componentToEdit.memoryType !== undefined ? componentToEdit.memoryType : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, memoryType: v })} />
                        <CustomTextField label="Format płyty (string)" value={componentToEdit.format !== undefined ? componentToEdit.format : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, format: v })} />
                        <CustomTextField label="Ilość slotów RAM (number)" type='number' value={componentToEdit.ramSlots !== undefined ? String(componentToEdit.ramSlots) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, ramSlots: Number(v) })} />
                        <CustomTextField label="Max pojemność RAM GB (number)" type='number' value={componentToEdit.ramCapacity !== undefined ? String(componentToEdit.ramCapacity) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, ramCapacity: Number(v) })} />
                    </div>
                );

            case ComponentTypeEnum.POWER_SUPPLY:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Moc maksymalna W (number)" type='number' value={componentToEdit.maxPowerWatt !== undefined ? String(componentToEdit.maxPowerWatt) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, maxPowerWatt: Number(v) })} />
                        <CustomTextField label="Certyfikat (string)" value={componentToEdit.efficiencyRating !== undefined ? componentToEdit.efficiencyRating : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, efficiencyRating: v })} />
                        <CustomTextField label="Modular (string)" value={componentToEdit.modular !== undefined ? componentToEdit.modular : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, modular: v })} />
                        <CustomTextField label="Typ (string)" value={componentToEdit.type !== undefined ? componentToEdit.type : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, type: v })} />
                    </div>
                );

            case ComponentTypeEnum.STORAGE:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Pojemność GB (number)" type='number' value={componentToEdit.capacity !== undefined ? String(componentToEdit.capacity) : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, capacity: Number(v) })} />
                    </div>
                );

            case ComponentTypeEnum.CPU_COOLER:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Sockety (rozdziel przecinkami)" value={coolerSocketsTypeInput !== undefined ? coolerSocketsTypeInput : ''} onChange={setCoolerSocketsTypeInput} />
                        <CustomTextField label="Obroty wentylatorów (string)" value={componentToEdit.fanRpm !== undefined ? componentToEdit.fanRpm : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, fanRpm: v })} />
                        <CustomTextField label="Hałas wentylatorów (string)" value={componentToEdit.noiseLevel !== undefined ? componentToEdit.noiseLevel : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, noiseLevel: v })} />
                        <CustomTextField label="Wielkość radiatora (string)" value={componentToEdit.radiatorSize !== undefined ? componentToEdit.radiatorSize : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, radiatorSize: v })} />
                    </div>
                );

            case ComponentTypeEnum.CASE_PC:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Format (string)" value={componentToEdit.format !== undefined ? componentToEdit.format : ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, format: v })} />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="component-modal-title"
            closeAfterTransition
            BackdropProps={{ sx: { bgcolor: 'rgba(0,0,0,0.45)' } }}
        >
            <Box sx={modalSx} component="form" onSubmit={handleSubmit}>
                <div className="flex items-start justify-between mb-4">
                    <Typography id="component-modal-title" variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                        Dodaj nowy komponent
                    </Typography>
                    <IconButton onClick={handleClose} size="small" aria-label="Zamknij" className="text-[var(--color-ocean-white)] bg-white/3 hover:bg-white/6">
                        <X size={20} />
                    </IconButton>
                </div>

                <Stack spacing={2}>
                    <FormControl size="small" fullWidth required>
                        <InputLabel id="component-type-label" sx={{ color: 'rgba(241,250,238,0.8)' }}>Typ komponentu</InputLabel>
                        <Select
                            labelId="component-type-label"
                            value={componentToEdit.componentType || ''}
                            label="Typ komponentu"
                            onChange={(e) => setComponentToEdit({ ...componentToEdit, componentType: e.target.value as ComponentTypeEnum })}
                            disabled={!!initialData}
                            sx={{
                                '& .MuiSelect-select': { py: 1 },
                                bgcolor: 'rgba(255,255,255,0.02)',
                                color: 'var(--color-ocean-white)',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(241,250,238,0.23)' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(241,250,238,0.4)' },
                            }}
                        >
                            <MenuItem value=""><em>-- Wybierz typ --</em></MenuItem>
                            {Object.values(ComponentTypeEnum).map((type) => (
                                <MenuItem key={type} value={type}>{type.replaceAll('_', ' ')}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth required>
                        <InputLabel id="brand-label" sx={{ color: 'rgba(241,250,238,0.8)' }}>Firma</InputLabel>
                        <Select
                                labelId="brand-label"
                                value={componentToEdit.brand || ''}
                                label="Firma"
                                onChange={(e) => setComponentToEdit({ ...componentToEdit, brand: e.target.value })}
                                
                                sx={{
                                    '& .MuiSelect-select': { py: 1 },
                                    bgcolor: 'rgba(255,255,255,0.02)',
                                    color: 'var(--color-ocean-white)',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(241,250,238,0.23)' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(241,250,238,0.4)' },
                                }}
                            >
                                <MenuItem value=""><em>-- Wybierz firme --</em></MenuItem>
                                {brandsNames?.map((brand) => (
                                    <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        { componentToEdit.componentType === ComponentTypeEnum.GRAPHICS_CARD &&
                            <FormControl size="small" fullWidth required>
                        <InputLabel id="baseModel-label" sx={{ color: 'rgba(241,250,238,0.8)' }}>Model bazowy</InputLabel>
                        <Select
                                labelId="baseModel-label"
                                value={componentToEdit.baseModel || ''}
                                label="Model bazowy"
                                onChange={(e) => setComponentToEdit({ ...componentToEdit, baseModel: Array.isArray(e.target.value) ? e.target.value[0] : e.target.value })}
                                
                                sx={{
                                    '& .MuiSelect-select': { py: 1 },
                                    bgcolor: 'rgba(255,255,255,0.02)',
                                    color: 'var(--color-ocean-white)',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(241,250,238,0.23)' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(241,250,238,0.4)' },
                                }}
                            >
                                <MenuItem value=""><em>-- Wybierz model bazowy --</em></MenuItem>
                                {gpuModels?.map((model) => (
                                    <MenuItem key={model} value={model}>{model}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        }

                    <CustomTextField label="Model" value={componentToEdit.model || ''} onChange={(v) => setComponentToEdit({ ...componentToEdit, model: v })} required />
                    {renderDynamicFields()}
                </Stack>

                <div className="mt-4 flex justify-end gap-2">
                    <Button onClick={handleClose} variant="outlined" size="small" className="border-[var(--color-ocean-light-blue)] text-[var(--color-ocean-light-blue)]">
                        Anuluj
                    </Button>
                    <Button type="submit" variant="contained" size="small" className="bg-[var(--color-ocean-blue)] hover:bg-[var(--color-ocean-dark-blue)] text-[var(--color-ocean-white)]" startIcon={<Check size={16} />}>
                        Zapisz
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

const CustomTextField: React.FC<{
    label: string;
    value?: string;
    onChange: (v: string) => void;
    required?: boolean;
    type?: string;
}> = ({ label, value, onChange, required = false, type = "text" }) => (
    <TextField
        label={label}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        fullWidth
        required={required}
        type={type}
        inputProps={type === "number" ? { min: 0, step: "any" } : undefined}
        sx={{
            '& .MuiInputBase-root': { bgcolor: 'rgba(255,255,255,0.02)', color: 'var(--color-ocean-white)' },
            '& .MuiInputLabel-root': { color: 'rgba(241,250,238,0.8)' },
            '& .MuiInputBase-input': { color: 'var(--color-ocean-white)' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(241,250,238,0.23)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(241,250,238,0.4)' },
        }}
    />
);

export default AddComponentForm;