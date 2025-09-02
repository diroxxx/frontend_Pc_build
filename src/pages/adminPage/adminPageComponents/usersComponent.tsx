
import { useEffect, useState } from "react";
import instance from "../../../components/instance";

interface User {
    name: string;
    email: string;
    role: number;
}

const UsersComponent = () => {
    const[ getUsers, setUsers ] = useState<User[]>([]);

    function fetchAllUsers() {
        instance.get("admin/users")
            .then(response => {
                console.log("Fetched users:", response.data);
                setUsers(response.data);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }

    useEffect(() => {
        fetchAllUsers();
    }, []);

    return (
        <div>
            <h2>Users List</h2>
            <ul>
                {getUsers.map(({ role, name, email }) => (
                    <li className="p-4 border-b border-gray-200" key={email}>{name} - {email} - {role}</li>
                ))}
            </ul>
        </div>
    );
};

export default UsersComponent;
