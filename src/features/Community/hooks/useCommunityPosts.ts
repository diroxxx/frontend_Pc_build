import { useState, useEffect } from "react";
import customAxios from "../../../lib/customAxios.tsx";
import type { Post, Category } from "../types/communityTypes.ts";

export const useCommunityPosts = (selectedFilterCategoryId: string | null) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            let endpoint = "community/";
            if (selectedFilterCategoryId && selectedFilterCategoryId !== "all") {
                endpoint = `community/categories/id/${selectedFilterCategoryId}`;
            }
            const response = await customAxios.get(endpoint);
            setPosts(response.data);
        } catch (error) {
            console.error("Fetch posts error:", error);
            setPosts([]);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await customAxios.get("community/categories");
            setCategories(response.data);
        } catch (err) {
            console.error("Błąd kategorii", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, [selectedFilterCategoryId]);

    return { posts, categories, isLoading, fetchPosts };
};
