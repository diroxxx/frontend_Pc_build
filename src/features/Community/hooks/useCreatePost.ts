import React, { useState } from "react";
import customAxios from "../../../lib/customAxios.tsx";
import type { Post } from "../types/communityTypes.ts";

export const useCreatePost = (onSuccess: () => void) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [postStatus, setPostStatus] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]);
        }
    };

    const removeFile = (indexToRemove: number) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const reset = () => {
        setTitle("");
        setContent("");
        setCategoryId("");
        setSelectedFiles([]);
        setPostStatus(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim() || !categoryId) {
            setPostStatus("Wypełnij wszystkie wymagane pola!");
            return;
        }

        setPostStatus("Tworzenie posta...");

        try {
            const response = await customAxios.post<Post>("community/posts", {
                title,
                content,
                categoryId: parseInt(categoryId, 10),
            });
            const newPostId = response.data.id;

            if (selectedFiles.length > 0) {
                setPostStatus(`Wysyłanie ${selectedFiles.length} zdjęć...`);
                await Promise.all(
                    selectedFiles.map(file => {
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("postId", newPostId.toString());
                        return customAxios.post("community/posts/upload-image-to-db", formData);
                    })
                );
            }

            setPostStatus("Post opublikowany pomyślnie!");
            setTimeout(() => {
                reset();
                onSuccess();
            }, 1000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.response?.data || "Wystąpił błąd.";
            setPostStatus(`Błąd: ${errorMessage}`);
            console.error("Błąd procesu tworzenia:", err);
        }
    };

    const isSubmitting = postStatus !== null && postStatus.includes("...");

    return {
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
    };
};
