import {useMutation, useQueryClient} from "@tanstack/react-query";
import {UpdateOffersToComputer} from "../../computers/user/api/UpdateOffersToComputer.ts";
import {useAtomValue} from "jotai";
import {userAtom} from "../../../atomContext/userAtom.tsx";


export const useUpdateOffersToComputer = () => {
    const queryClient = useQueryClient();
    const user = useAtomValue(userAtom);

    return useMutation({
        mutationFn: ({ computerId, offerUrl }: { computerId: number; offerUrl: string }) =>
            UpdateOffersToComputer(computerId, offerUrl),

        onSuccess: async () => {
            if (user?.email) {
                await queryClient.invalidateQueries({ queryKey: ["computers", user.email] });
            } else {
                await queryClient.invalidateQueries({ predicate: q => q.queryKey[0] === "computers" });
            }
        },
    });
};