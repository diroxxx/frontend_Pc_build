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
import { Check, X } from 'lucide-react';
import {type ComponentItem, ComponentTypeEnum } from '../../../types/BaseItemDto';
import {modalSx} from "../../../types/modalStyle.ts";
interface AddComponentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ComponentItem) => void;
}



const AddComponentForm: React.FC<AddComponentModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [componentType, setComponentType] = useState<ComponentTypeEnum | ''>('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [details, setDetails] = useState<Record<string, string>>({});

    const handleDetailChange = (key: string, value: string) => {
        setDetails((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!componentType || !brand || !model) {
            alert('Uzupełnij wszystkie wymagane pola');
            return;
        }

        let newComponent: ComponentItem;

        switch (componentType) {
            case ComponentTypeEnum.PROCESSOR:
                newComponent = {
                    componentType: ComponentTypeEnum.PROCESSOR,
                    brand,
                    model,
                    cores: Number(details.cores),
                    threads: Number(details.threads),
                    baseClock: Number(details.baseClock),
                    socketType: details.socketType,
                    boostClock: Number(details.boostClock),
                    integratedGraphics: details.integratedGraphics,
                    tdp: Number(details.tdp),
                };
                break;

            case ComponentTypeEnum.GRAPHICS_CARD:
                newComponent = {
                    componentType: ComponentTypeEnum.GRAPHICS_CARD,
                    brand,
                    model,
                    vram: Number(details.vram),
                    gddr: details.gddr,
                    powerDraw: Number(details.powerDraw),
                    boostClock: Number(details.boostClock),
                    lengthInMM: Number(details.lengthInMM),
                };
                break;

            case ComponentTypeEnum.MEMORY:
                newComponent = {
                    componentType: ComponentTypeEnum.MEMORY,
                    brand,
                    model,
                    type: details.type,
                    capacity: Number(details.capacity),
                    speed: Number(details.speed),
                    latency: Number(details.latency),
                    amount: Number(details.amount),
                };
                break;

            case ComponentTypeEnum.MOTHERBOARD:
                newComponent = {
                    componentType: ComponentTypeEnum.MOTHERBOARD,
                    brand,
                    model,
                    chipset: details.chipset,
                    socketType: details.socketType,
                    memoryType: details.memoryType,
                    format: details.format,
                    ramSlots: Number(details.ramSlots),
                    ramCapacity: Number(details.ramCapacity),
                };
                break;

            case ComponentTypeEnum.POWER_SUPPLY:
                newComponent = {
                    componentType: ComponentTypeEnum.POWER_SUPPLY,
                    brand,
                    model,
                    maxPowerWatt: Number(details.maxPowerWatt),
                    efficiencyRating: details.efficiencyRating,
                    modular: details.modular,
                    type: details.type,
                };
                break;

            case ComponentTypeEnum.STORAGE:
                newComponent = {
                    componentType: ComponentTypeEnum.STORAGE,
                    brand,
                    model,
                    capacity: Number(details.capacity),
                };
                break;

            case ComponentTypeEnum.CPU_COOLER:
                newComponent = {
                    componentType: ComponentTypeEnum.CPU_COOLER,
                    brand,
                    model,
                    coolerSocketsType: details.coolerSocketsType
                        ? details.coolerSocketsType.split(',').map((s) => s.trim())
                        : [],
                    fanRpm: details.fanRpm,
                    noiseLevel: details.noiseLevel,
                    radiatorSize: details.radiatorSize,
                };
                break;

            case ComponentTypeEnum.CASE_PC:
                newComponent = {
                    componentType: ComponentTypeEnum.CASE_PC,
                    brand,
                    model,
                    format: details.format,
                };
                break;

            default:
                alert('Nieobsługiwany typ komponentu');
                return;
        }

        onSubmit(newComponent);
        handleClose();
    };

    const handleClose = () => {
        setComponentType('');
        setBrand('');
        setModel('');
        setDetails({});
        onClose();
    };

    const renderDynamicFields = () => {
        switch (componentType) {
            case ComponentTypeEnum.PROCESSOR:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Socket (string)" value={details.socketType} onChange={(v) => handleDetailChange('socketType', v)} />
                        <CustomTextField label="Rdzenie (number)" value={details.cores} onChange={(v) => handleDetailChange('cores', v)} />
                        <CustomTextField label="Taktowanie bazowe GHz (number)" value={details.baseClock} onChange={(v) => handleDetailChange('baseClock', v)} />
                        <CustomTextField label="Taktowanie boost GHz (number)" value={details.boostClock} onChange={(v) => handleDetailChange('boostClock', v)} />
                        <CustomTextField label="Wątki (number)" value={details.threads} onChange={(v) => handleDetailChange('threads', v)} />
                        <CustomTextField label="Zintegrowana grafika (string)" value={details.integratedGraphics} onChange={(v) => handleDetailChange('integratedGraphics', v)} />
                        <CustomTextField label="TDP (number)" value={details.tdp} onChange={(v) => handleDetailChange('tdp', v)} />
                    </div>
                );

            case ComponentTypeEnum.GRAPHICS_CARD:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Pamięć VRAM (number)" value={details.vram} onChange={(v) => handleDetailChange('vram', v)} />
                        <CustomTextField label="Rodzaj pamięci (string)" value={details.gddr} onChange={(v) => handleDetailChange('gddr', v)} />
                        <CustomTextField label="TDP (number)" value={details.powerDraw} onChange={(v) => handleDetailChange('powerDraw', v)} />
                        <CustomTextField label="Boost Clock (number)" value={details.boostClock} onChange={(v) => handleDetailChange('boostClock', v)} />
                        <CustomTextField label="Długość karty mm (number)" value={details.lengthInMM} onChange={(v) => handleDetailChange('lengthInMM', v)} />
                    </div>
                );

            case ComponentTypeEnum.MEMORY:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Typ pamięci (string)" value={details.type} onChange={(v) => handleDetailChange('type', v)} />
                        <CustomTextField label="Pojemność GB (number)" value={details.capacity} onChange={(v) => handleDetailChange('capacity', v)} />
                        <CustomTextField label="Taktowanie MHz (number)" value={details.speed} onChange={(v) => handleDetailChange('speed', v)} />
                        <CustomTextField label="Opóźnienie CL (number)" value={details.latency} onChange={(v) => handleDetailChange('latency', v)} />
                        <CustomTextField label="Ilość (number)" value={details.amount} onChange={(v) => handleDetailChange('amount', v)} />
                    </div>
                );

            case ComponentTypeEnum.MOTHERBOARD:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Chipset (string)" value={details.chipset} onChange={(v) => handleDetailChange('chipset', v)} />
                        <CustomTextField label="Typ socketu (string)" value={details.socketType} onChange={(v) => handleDetailChange('socketType', v)} />
                        <CustomTextField label="Rodzaj pamięci (string)" value={details.memoryType} onChange={(v) => handleDetailChange('memoryType', v)} />
                        <CustomTextField label="Format płyty (string)" value={details.format} onChange={(v) => handleDetailChange('format', v)} />
                        <CustomTextField label="Ilość slotów RAM (number)" value={details.ramSlots} onChange={(v) => handleDetailChange('ramSlots', v)} />
                        <CustomTextField label="Max pojemność RAM GB (number)" value={details.ramCapacity} onChange={(v) => handleDetailChange('ramCapacity', v)} />
                    </div>
                );

            case ComponentTypeEnum.POWER_SUPPLY:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Moc maksymalna W (number)" value={details.maxPowerWatt} onChange={(v) => handleDetailChange('maxPowerWatt', v)} />
                        <CustomTextField label="Certyfikat (string)" value={details.efficiencyRating} onChange={(v) => handleDetailChange('efficiencyRating', v)} />
                        <CustomTextField label="Modular (string)" value={details.modular} onChange={(v) => handleDetailChange('modular', v)} />
                        <CustomTextField label="Typ (string)" value={details.type} onChange={(v) => handleDetailChange('type', v)} />
                    </div>
                );

            case ComponentTypeEnum.STORAGE:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Pojemność GB (number)" value={details.capacity} onChange={(v) => handleDetailChange('capacity', v)} />
                    </div>
                );

            case ComponentTypeEnum.CPU_COOLER:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Sockety (rozdziel przecinkami)" value={details.coolerSocketsType} onChange={(v) => handleDetailChange('coolerSocketsType', v)} />
                        <CustomTextField label="Obroty wentylatorów (string)" value={details.fanRpm} onChange={(v) => handleDetailChange('fanRpm', v)} />
                        <CustomTextField label="Hałas wentylatorów (string)" value={details.noiseLevel} onChange={(v) => handleDetailChange('noiseLevel', v)} />
                        <CustomTextField label="Wielkość radiatora (string)" value={details.radiatorSize} onChange={(v) => handleDetailChange('radiatorSize', v)} />
                    </div>
                );

            case ComponentTypeEnum.CASE_PC:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <CustomTextField label="Format (string)" value={details.format} onChange={(v) => handleDetailChange('format', v)} />
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
                            value={componentType}
                            label="Typ komponentu"
                            onChange={(e) => setComponentType(e.target.value as ComponentTypeEnum)}
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

                    <CustomTextField label="Marka" value={brand} onChange={setBrand} required />
                    <CustomTextField label="Model" value={model} onChange={setModel} required />
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
}> = ({ label, value, onChange, required = false }) => (
    <TextField
        label={label}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        fullWidth
        required={required}
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