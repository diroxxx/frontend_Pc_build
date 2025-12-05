import React, { useState, useEffect } from 'react';
import customAxios from "../../../lib/customAxios.tsx";

// --- INTERFEJS (ten sam co u Ciebie) ---
interface PostImageDTO {
    id: number;
    imageUrl: string;
    filename: string;
    mimeType: string;
}

interface PostMainImageProps {
    images: PostImageDTO[]; // Lista zdjęć przypisana do posta
}

const PostMainImage: React.FC<PostMainImageProps> = ({ images }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        // 1. Sprawdź, czy są jakiekolwiek zdjęcia
        if (!images || images.length === 0) {
            return;
        }

        // 2. Pobierz ID pierwszego zdjęcia
        const firstImage = images[0];

        // Funkcja pobierająca binarną zawartość zdjęcia
        const fetchImage = async () => {
            try {
                setLoading(true);
                // Używamy endpointu GET do pobrania obrazka po ID
                // Zakładam ścieżkę na podstawie Twojego uploadu: community/posts/image/{id}
                const response = await customAxios.get(
                    `/community/posts/image/${firstImage.id}`,
                    { responseType: 'blob' } // KLUCZOWE: Odbieramy jako Blob (plik)
                );

                // Tworzymy tymczasowy URL w przeglądarce dla tego Bloba
                const imageUrl = URL.createObjectURL(response.data);
                setImageSrc(imageUrl);
                setLoading(false);
            } catch (err) {
                console.error("Błąd ładowania głównego zdjęcia:", err);
                setError(true);
                setLoading(false);
            }
        };

        fetchImage();

        // Cleanup: zwalniamy pamięć po URL gdy komponent znika
        return () => {
            if (imageSrc) {
                URL.revokeObjectURL(imageSrc);
            }
        };
    }, [images]); // Uruchom ponownie, jeśli zmieni się lista zdjęć

    // --- RENDEROWANIE ---

    if (!images || images.length === 0) {
        // Placeholder, gdy post nie ma zdjęć
        return (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
                Brak zdjęcia
            </div>
        );
    }

    if (loading) {
        return (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg animate-pulse">
                <span className="text-gray-400">Ładowanie...</span>
            </div>
        );
    }

    if (error || !imageSrc) {
        return (
            <div className="w-full h-64 bg-red-50 flex items-center justify-center rounded-lg text-red-400">
                Błąd wczytywania
            </div>
        );
    }

    // Wyświetlenie pierwszego zdjęcia
    return (
        <div className="w-full h-auto overflow-hidden rounded-lg shadow-sm border border-gray-200">
            <img
                src={imageSrc}
                alt={images[0].filename}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
        </div>
    );
};

export default PostMainImage;