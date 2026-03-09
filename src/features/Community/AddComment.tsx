import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../auth/atoms/userAtom.tsx';
import customAxios from '../../lib/customAxios.tsx';

interface AddCommentFormProps {
    postId: number;
    onCommentAdded: () => void;
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
        };

        try {
            await customAxios.post(`community/posts/${postId}/comments`, newCommentData);

            setCommentContent('');
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
            <div className="p-3 bg-yellow-500/10 text-yellow-600 border-l-4 border-yellow-500 rounded text-sm">
                Zaloguj się, aby dodać komentarz.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="text-sm font-semibold text-dark-text">Dodaj komentarz</h3>

            <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Napisz swój komentarz..."
                rows={3}
                required
                className="w-full p-2.5 text-sm border border-dark-border rounded-lg bg-dark-surface text-dark-text placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-dark-accent/40"
                disabled={loading}
            />

            {error && (
                <p className="text-ocean-red font-medium">{error}</p>
            )}

            <button
                type="submit"
                className="px-4 py-1.5 text-sm bg-ocean-blue text-white font-semibold rounded-lg hover:bg-ocean-blue-hover transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={loading || !commentContent.trim()}
            >
                {loading ? 'Wysyłanie...' : 'Opublikuj'}
            </button>
        </form>
    );
};

export default AddCommentForm;