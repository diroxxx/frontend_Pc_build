import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getUnknownOffersApi,
    assignOfferToComponentApi,
    dismissUnknownOfferApi,
    createComponentAndAssignApi,
    searchComponentsApi,
} from "../api/unknownOffersApi.ts";
import type { ComponentTypeEnum } from "../../../shared/dtos/BaseItemDto.ts";
import { showToast } from "../../../lib/ToastContainer.tsx";

export function useUnknownOffers(page: number = 0, size: number = 10) {
    return useQuery({
        queryKey: ["unknown-offers", page, size],
        queryFn: () => getUnknownOffersApi(page, size),
    });
}

export function useAssignOffer() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: assignOfferToComponentApi,
        onSuccess: () => {
            showToast.success("Oferta przypisana do komponentu");
            qc.invalidateQueries({ queryKey: ["unknown-offers"] });
        },
        onError: () => showToast.error("Błąd podczas przypisywania oferty"),
    });
}

export function useDismissOffer() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: dismissUnknownOfferApi,
        onSuccess: () => {
            showToast.success("Oferta odrzucona");
            qc.invalidateQueries({ queryKey: ["unknown-offers"] });
        },
        onError: () => showToast.error("Błąd podczas odrzucania oferty"),
    });
}

export function useCreateAndAssign() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ componentData, offerId }: { componentData: Record<string, unknown>; offerId: number }) =>
            createComponentAndAssignApi(componentData, offerId),
        onSuccess: () => {
            showToast.success("Komponent utworzony i oferta przypisana");
            qc.invalidateQueries({ queryKey: ["unknown-offers"] });
        },
        onError: () => showToast.error("Błąd podczas tworzenia komponentu"),
    });
}

export function useComponentSearch(query: string, type?: ComponentTypeEnum) {
    return useQuery({
        queryKey: ["component-search", query, type],
        queryFn: () => searchComponentsApi(query, type),
        enabled: false, // TODO: enabled: query.length >= 2
    });
}
