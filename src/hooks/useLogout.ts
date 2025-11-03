import {useQueryClient} from "@tanstack/react-query";
import {useAtomValue, useSetAtom} from "jotai";
import {setAuthToken} from "../lib/Auth.tsx";
import {userAtom} from "../atomContext/userAtom.tsx";
import {saveComputerToDbAtom} from "../atomContext/computerAtom.tsx";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const user = useAtomValue(userAtom);
    const setUser = useSetAtom(userAtom);
    const saveComputer = useSetAtom(saveComputerToDbAtom);

    return async () => {

        if (user) {
            try {
                await saveComputer();
            } catch (error) {
                console.error("Błąd zapisu komputera:", error);
            }
        }

        setAuthToken(null);
        setUser(null);
        queryClient.clear();
        localStorage.clear();
    };
}
