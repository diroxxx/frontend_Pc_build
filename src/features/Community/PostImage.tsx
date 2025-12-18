import React, { useState } from 'react';
import customAxios from "../../lib/customAxios.tsx";
import { FaFileUpload } from 'react-icons/fa';

// --- INTERFEJSY ---
interface PostImageDTO {
    id: number;
    imageUrl: string; // URL do pobrania zdjęcia z backendu (np. /api/forum/posts/image/{id})
    filename: string;
    mimeType: string;
}

interface PostImageUploaderProps {
    postId: number;
    initialImages: PostImageDTO[]; // Aktualnie załadowane zdjęcia (stan z PostDetails)
    MAX_IMAGES?: number; // Opcjonalny limit (domyślnie 5)
    onUploadSuccess: (newImages: PostImageDTO[]) => void; // Callback po udanym przesłaniu

}

// --- KOMPONENT ---
const PostImage: React.FC<PostImageUploaderProps> = ({
                                                                 postId,
                                                                 initialImages,
                                                                 MAX_IMAGES = 10,
                                                                 onUploadSuccess
                                                             }) => {

    // Stany wewnętrzne do zarządzania procesem ładowania
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);

    const currentImageCount = initialImages.length;
    const filesToUploadCount = filesToUpload.length;
    const canUploadMore = currentImageCount < MAX_IMAGES;

    // 1. Obsługa wyboru plików i walidacja limitu
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);

            if (currentImageCount + newFiles.length > MAX_IMAGES) {
                setImageUploadError(`Możesz dodać maksymalnie ${MAX_IMAGES} zdjęć do postu. Przekroczono limit.`);
                event.target.value = '';
                return;
            }

            setImageUploadError(null);
            setFilesToUpload(prev => [...prev, ...newFiles]);
        }
    };

    // 2. Obsługa przesyłania plików do Spring Boot
    const handleImageUpload = async () => {
        if (filesToUpload.length === 0) {
            setImageUploadError("Wybierz pliki do przesłania.");
            return;
        }

        setUploadingImages(true);
        setImageUploadError(null);
        const successfulUploads: PostImageDTO[] = [];
        let hasError = false;

        for (const file of filesToUpload) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('postId', String(postId));

            try {
                // Wywołanie endpointu POST w Spring Boot
                const response = await customAxios.post<PostImageDTO>(
                    `community/posts/upload-image-to-db`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                successfulUploads.push(response.data);
            } catch (err: any) {
                console.error(`Błąd przesyłania zdjęcia ${file.name}:`, err);
                setImageUploadError(`Błąd przesyłania zdjęcia ${file.name}: ${err.response?.data?.message || err.message}`);
                hasError = true;
                break;
            }
        }

        setUploadingImages(false);

        if (!hasError) {
            setFilesToUpload([]);
            // Wywołanie callbacka, aby poinformować komponent nadrzędny o sukcesie
            onUploadSuccess(successfulUploads);
        }
    };

    // Usuwanie pliku z listy przed przesłaniem
    const handleRemoveFile = (fileName: string) => {
        setFilesToUpload(filesToUpload.filter(file => file.name !== fileName));
    };


    return (
        <div className="mt-8 p-6 border rounded-lg bg-white shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaFileUpload className="mr-2 text-blue-600" /> Dodaj zdjęcia ({currentImageCount}/{MAX_IMAGES})
            </h3>

            {/* --- WYŚWIETLANIE ISTNIEJĄCYCH ZDJĘĆ --- */}
            {currentImageCount > 0 && (
                <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {initialImages.map((img) => (
                        <div key={img.id} className="relative group overflow-hidden rounded-lg shadow-md border-2 border-green-500">
                            <img
                                src={img.imageUrl}
                                alt={img.filename}
                                className="w-full h-24 object-cover"
                            />
                            {/* Opcjonalnie: Przycisk podglądu lub usuwania */}
                        </div>
                    ))}
                </div>
            )}

            {/* --- FORMULARZ ŁADOWANIA --- */}
            {!canUploadMore ? (
                <p className="text-orange-600 font-medium">Osiągnięto limit {MAX_IMAGES} zdjęć dla tego postu.</p>
            ) : (
                <>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        disabled={uploadingImages || !canUploadMore}
                    />

                    {filesToUploadCount > 0 && (
                        <div className="mt-4 p-3 bg-gray-100 rounded">
                            <p className="text-gray-700 font-medium mb-2">Wybrane pliki ({filesToUploadCount}):</p>
                            <ul className="list-none space-y-1 text-sm">
                                {filesToUpload.map((file, index) => (
                                    <li key={index} className="flex justify-between items-center text-gray-600">
                                        {file.name}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(file.name)}
                                            className="text-red-500 hover:text-red-700 text-xs ml-2"
                                        >
                                            [Usuń]
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {imageUploadError && (
                        <p className="text-red-600 font-semibold mt-4">{imageUploadError}</p>
                    )}

                    <button
                        onClick={handleImageUpload}
                        disabled={filesToUploadCount === 0 || uploadingImages || currentImageCount + filesToUploadCount > MAX_IMAGES}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploadingImages ? 'Przesyłanie...' : `Prześlij ${filesToUploadCount} zdjęcie(a)`}
                    </button>
                </>
            )}
        </div>
    );
};

export default PostImage;