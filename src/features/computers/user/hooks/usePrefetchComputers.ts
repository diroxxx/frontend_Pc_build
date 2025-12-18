import {useAtom} from "jotai";
import {userAtom} from "../../../auth/atoms/userAtom.tsx";
import {useQueryClient} from "@tanstack/react-query";
import {useEffect} from "react";
import {getAllComputersByUserEmail} from "../api/getAllComputersByUserEmail.ts";
export function usePrefetchComputers() {
    const [user] = useAtom(userAtom);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!user?.email) return;

        queryClient.prefetchQuery({
            queryKey: ["computers", user.email],
            queryFn: () => getAllComputersByUserEmail(user.email),
        });
    }, [user?.email, queryClient]);
}