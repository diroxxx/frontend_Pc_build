import instance from '../../components/instance.tsx';
import {useEffect, useState} from "react";

const fetchUsers = async () => {
    try {
        const response = await instance.get("/auth/users"); // Endpoint np. /auth/users
        console.log("Users:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

function Components() {

    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        fetchUsers()
            .then((data) => setUsers(data))
            .catch((err) => console.error(err));
    }, []);



    return (
        <div>
            <h1>Użytkownicy</h1>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user.email}</li>
                ))}
            </ul>
        </div>
    )
}

export default Components;