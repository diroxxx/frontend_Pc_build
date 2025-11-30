

import React, { useState } from 'react';
import customAxios from "../../../lib/customAxios.tsx";
import { FaArrowLeft } from 'react-icons/fa';

interface Post {
    id: number;
    title: string;
    content: string;
}

interface EditPostContentFormProps {
    initialPost: Post;
    onSuccess: () => void; // Wywoływany po pomyślnym zapisie, aby odświeżyć listę
    onCancel: () => void; // Wywoływany po anulowaniu
}

const EditPostContentForm: React.FC<EditPostContentFormProps> = ({ initialPost, onSuccess, onCancel }) => {

    const [content, setContent] = useState(initialPost.content);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!content.trim()) {
            setError('Treść nie może być pusta!');
            return;
        }

        setLoading(true);

        // ⭐ DTO WYCHODZĄCE: Aktualizujemy TYLKO treść ⭐
        const updatedData = {
            content: content,
        };

        try {
            // ⭐ WYŚLIJ ŻĄDANIE PUT DO ENDPOINTU EDYCJI ⭐
            await customAxios.put(`community/posts/${initialPost.id}`, updatedData);

            alert(`Post "${initialPost.title}" został zaktualizowany!`);
            onSuccess(); // Zamknij formularz i odśwież listę

        } catch (err: any) {
            const errorMessage = err.response?.data?.message
                || err.response?.data?.error
                || 'Wystąpił błąd podczas aktualizacji posta.';
            setError(`Błąd: ${errorMessage}`);
            console.error("Błąd edycji posta:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <button
                className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 flex items-center"
                onClick={onCancel}
            >
                <FaArrowLeft className="mr-2"/> Anuluj Edycję
            </button>

            <div style={{
                maxWidth: '600px',
                margin: '50px auto',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                background: 'white'
            }}>
                <h2 className="text-2xl font-bold mb-4">Edytuj Treść Posta: {initialPost.title}</h2>

                <form onSubmit={handleSubmit}>
                    {/* Pole Treści */}
                    <div>
                        <label htmlFor="content"
                               className="block text-sm font-medium text-gray-700 mb-1">Treść:</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={8}
                            className="w-full p-2 border border-gray-300 rounded"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <p className="mt-4 p-3 rounded text-center font-semibold bg-red-100 text-red-700">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full mt-4 p-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
                        disabled={loading || !content.trim()}
                    >
                        {loading ? 'Zapisywanie...' : 'Zapisz Zmienioną Treść'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPostContentForm;