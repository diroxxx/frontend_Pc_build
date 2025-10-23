import { useState, useEffect } from 'react';
import customAxios from '../lib/customAxios.tsx';
import type { ComponentDto } from '../atomContext/offerAtom';

const CACHE_KEY = 'components_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useComponentsCache = () => {
    const [components, setComponents] = useState<ComponentDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchComponents = async (forceRefresh = false) => {
        try {
            if (forceRefresh) setRefreshing(true);
            
            // Check cache
            if (!forceRefresh) {
                const cached = sessionStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { data, timestamp } = JSON.parse(cached);
                    if (Date.now() - timestamp < CACHE_DURATION) {
                        setComponents(data);
                        setLoading(false);
                        return;
                    }
                }
            }

            // Fetch fresh data
            const response = await customAxios.get("/components");
            const data = response.data;
            
            // Cache data
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
            
            setComponents(data);
            setError(null);
        } catch (err) {
            setError('Błąd podczas ładowania komponentów');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchComponents();
    }, []);

    const refresh = () => fetchComponents(true);

    return { components, loading, error, refreshing, refresh };
};
