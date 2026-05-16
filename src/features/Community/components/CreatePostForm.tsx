import React from "react";
import { FaArrowLeft, FaPaperclip, FaTimes } from "react-icons/fa";
import { useCreatePost } from "../hooks/useCreatePost.ts";
import type { Category, User } from "../types/communityTypes.ts";

interface CreatePostFormProps {
    categories: Category[];
    currentUser: User | null;
    onCancel: () => void;
    onSuccess: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ categories, currentUser, onCancel, onSuccess }) => {
    const {
        title, setTitle,
        content, setContent,
        categoryId, setCategoryId,
        selectedFiles,
        postStatus,
        isSubmitting,
        handleFileSelect,
        removeFile,
        handleSubmit,
        reset,
    } = useCreatePost(onSuccess);

    const handleCancel = () => {
        reset();
        onCancel();
    };

    return (
        <div className="bg-dark-bg p-6">
            <button
                className="mb-4 px-4 py-2 bg-dark-surface border border-dark-border text-dark-text rounded-lg hover:bg-dark-surface2 flex items-center transition"
                onClick={handleCancel}
            >
                <FaArrowLeft className="mr-2" /> Anuluj
            </button>

            <div className="max-w-xl mx-auto mt-5 p-5 border border-dark-border rounded-xl bg-dark-surface">
                <h2 className="text-2xl font-bold mb-1 text-dark-text">Nowy Post</h2>
                <p className="text-sm text-dark-muted mb-4">Autor: {currentUser?.nickname}</p>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="block mt-4 mb-1 font-medium text-dark-text">Tytuł:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full p-2 border border-dark-border rounded-lg bg-dark-surface2 text-dark-text placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-dark-accent/40"
                            placeholder="Wpisz tytuł..."
                        />
                    </div>

                    <div>
                        <label className="block mt-4 mb-1 font-medium text-dark-text">Kategoria:</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                            className="w-full p-2 border border-dark-border rounded-lg bg-dark-surface2 text-dark-text focus:outline-none focus:ring-2 focus:ring-dark-accent/40"
                        >
                            <option value="" disabled>Wybierz kategorię</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mt-4 mb-1 font-medium text-dark-text">Treść:</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={6}
                            className="w-full p-2 border border-dark-border rounded-lg bg-dark-surface2 text-dark-text placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-dark-accent/40"
                            placeholder="O czym chcesz napisać?"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block mb-2 font-medium text-dark-text">Zdjęcia (max 10):</label>
                        <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-dark-surface2 border border-dark-border text-dark-text rounded-lg hover:bg-dark-border transition">
                            <FaPaperclip className="mr-2" /> Wybierz pliki
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>

                        {selectedFiles.length > 0 && (
                            <ul className="mt-3 space-y-2">
                                {selectedFiles.map((file, index) => (
                                    <li key={index} className="flex justify-between items-center bg-dark-surface2 p-2 rounded-lg border border-dark-border text-sm text-dark-text">
                                        <span className="truncate max-w-xs">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-ocean-red hover:text-ocean-red-hover p-1"
                                        >
                                            <FaTimes />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 p-3 bg-ocean-blue text-white font-bold rounded-lg hover:bg-ocean-blue-hover transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        disabled={!title.trim() || !content.trim() || !categoryId || isSubmitting}
                    >
                        {isSubmitting ? postStatus : "Opublikuj Post"}
                    </button>
                </form>

                {postStatus && !isSubmitting && (
                    <p className={`mt-4 p-3 rounded-lg text-center font-semibold ${postStatus.includes("pomyślnie") ? "bg-green-500/10 text-ocean-teal" : "bg-red-500/10 text-ocean-red"}`}>
                        {postStatus}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CreatePostForm;
