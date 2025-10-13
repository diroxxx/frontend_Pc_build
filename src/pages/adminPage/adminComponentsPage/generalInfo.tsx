import { usersListAtom } from "../../../atomContext/adminAtom";
import { useAtom } from "jotai";
import { useLocation } from "react-router-dom";
const GeneralInfo = () => {
    const [users] = useAtom(usersListAtom);
    const location = useLocation();

return (
    <div>
        <div className="bg-gradient-admin-info rounded-xl shadow-lg p-8 flex flex-col items-center justify-center w-64 mx-auto">
            <h2 className="text-text-ocean-white text-lg font-semibold mb-2">
                Użytkownicy
            </h2>
            <span className="text-text-ocean-white text-3xl font-bold mb-1">{users.length}</span>
            <p className="text-text-ocean-white text-sm">Zobacz więcej</p>
        </div>
       </div>
);
}

export default GeneralInfo;