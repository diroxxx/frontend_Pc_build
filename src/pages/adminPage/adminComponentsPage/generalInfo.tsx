import { usersListAtom } from "../../../atomContext/adminAtom";
import {useAtom, useAtomValue} from "jotai";
import {useNavigate} from "react-router-dom";
import {componentSpecsAtom} from "../../../atomContext/componentAtom.tsx";
const GeneralInfo = () => {
    const [users] = useAtom(usersListAtom);
    const navigate = useNavigate();
    const components = useAtomValue(componentSpecsAtom);

return (
    <div>
        <div className="bg-gradient-admin-info rounded-xl shadow-lg p-8 flex flex-col items-center justify-center w-64 mx-auto">
            <h2 className="text-text-ocean-white text-lg font-semibold mb-2">
                Użytkownicy
            </h2>
            <span className="text-text-ocean-white text-3xl font-bold mb-1">{users.length}</span>
            <p className="text-text-ocean-white text-sm">Zobacz więcej</p>
        </div>

        <div className="bg-gradient-admin-info rounded-xl shadow-lg p-8 flex flex-col items-center justify-center w-64 mx-auto">
            <h2 className="text-text-ocean-white text-lg font-semibold mb-2">
                Komponenty
            </h2>
            <span className="text-text-ocean-white text-3xl font-bold mb-1">{components.length}</span>
            <p onClick={() => {
                navigate("/admin/components");
            }} className="text-text-ocean-white text-sm">Zobacz więcej</p>
        </div>
       </div>
);
}

export default GeneralInfo;