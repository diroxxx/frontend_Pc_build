import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../auth/atoms/userAtom.tsx'; // Upewnij się, że ścieżka jest poprawna
import customAxios from '../../lib/customAxios.tsx'; // Upewnij się, że ścieżka jest poprawna

interface AddCommentFormProps {
    postId: number;
    onCommentAdded: () => void; // Callback do odświeżenia listy komentarzy po dodaniu
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ postId, onCommentAdded }) => {
    const [commentContent, setCommentContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [user] = useAtom(userAtom);
    const isAuthenticated = !!user;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isAuthenticated) {
            setError('Musisz być zalogowany, aby komentować.');
            return;
        }

        if (!commentContent.trim()) {
            setError('Treść komentarza nie może być pusta.');
            return;
        }

        setLoading(true);

        const newCommentData = {
            content: commentContent,
            // ID użytkownika i posta są przekazywane przez kontekst Security/PathVariable
        };

        try {
            // Wysłanie żądania POST do Twojego endpointu
            await customAxios.post(`community/posts/${postId}/comments`, newCommentData);

            setCommentContent(''); // Wyczyść pole po sukcesie

            // Wywołaj callback, aby PostDetails odświeżył listę komentarzy
            onCommentAdded();

        } catch (err: any) {
            console.error("Błąd dodawania komentarza:", err);
            const errorMessage = err.response?.data?.message
                || err.response?.data?.error
                || 'Wystąpił błąd podczas dodawania komentarza. Spróbuj ponownie.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="p-4 bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500">
                Zaloguj się, aby dodać komentarz.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Dodaj Komentarz: </h3>

            <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Napisz swój komentarz..."
                rows={4}
                required
                className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
            />

            {error && (
                <p className="text-red-600 font-medium">{error}</p>
            )}

            <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                disabled={loading || !commentContent.trim()}
            >
                {loading ? 'Wysyłanie...' : 'Opublikuj Komentarz'}
            </button>
        </form>
    );
};

export default AddCommentForm;