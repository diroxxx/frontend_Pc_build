import React, { useState } from "react";
import OfferComponent from "./OfferComponent.tsx";
import type {ComponentOffer} from "../../../types/OfferBase.ts";

interface OfferEditModalProps {
    offer: ComponentOffer;
    onClose: () => void;
}

const OfferEditCard: React.FC<OfferEditModalProps> = ({ offer, onClose }) => {
    const [editedOffer, setEditedOffer] = useState(offer);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedOffer({ ...editedOffer, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        console.log("Zmieniona oferta:", editedOffer);
        // tutaj możesz dodać update przez API
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-ocean-dark-blue">
                    Edytuj ofertę
                </h2>

                <div className="space-y-3">
                    <label className="block text-sm font-medium">Marka:</label>
                    <input
                        type="text"
                        name="brand"
                        value={editedOffer.brand}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                    />

                    <label className="block text-sm font-medium">Model:</label>
                    <input
                        type="text"
                        name="model"
                        value={editedOffer.model}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                    />

                    <label className="block text-sm font-medium">Typ komponentu:</label>
                    <input
                        type="text"
                        name="componentType"
                        value={editedOffer.componentType}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                    >
                        Anuluj
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-ocean-dark-blue text-white rounded hover:bg-ocean-light-blue transition"
                    >
                        Zapisz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfferEditCard;
