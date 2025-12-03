import { useEffect, useState } from "react";
import customAxios from "../../../lib/customAxios.tsx";
import { usersListAtom } from "../atoms/adminAtom.tsx";
import { useAtom } from "jotai";
import {RemoveIcon} from "../../../assets/icons/removeIcon.tsx"
const UsersPage = () => {
    const [getUsers, setUsers] = useAtom(usersListAtom);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');

    const filteredUsers = getUsers.filter(user => {
        const matchesSearch =
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesRole = filterRole === 'all' || user.role === filterRole;

        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className=" rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-midnight-dark">Lista użytkowników</h2>
                    <button className="px-3 py-1.5 bg-ocean-dark-blue text-ocean-white rounded hover:bg-ocean-blue text-sm font-medium transition-colors flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Dodaj użytkownika
                    </button>
                </div>

                <div className="flex gap-3 mb-3">
                    <div className="flex-1 relative">
                        <svg className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Szukaj po imieniu lub email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-ocean-blue"
                        />
                    </div>

                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-ocean-blue"
                    >
                        <option value="all">Wszystkie role</option>
                        <option value="USER">Użytkownik</option>
                        <option value="ADMIN">Administrator</option>
                    </select>
                </div>

                <div className="flex items-center gap-3 text-xs text-midnight-dark">
                    <span>Wyświetlono: <strong>{filteredUsers.length}</strong></span>
                    <span>•</span>
                    <span>Łącznie: <strong>{getUsers.length}</strong></span>
                </div>
            </div>

            {/* Table */}
            <div className=" rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-ocean-dark-blue text-ocean-white">
                    <tr>
                        <th className="px-3 py-2 text-left font-medium">Imię</th>
                        <th className="px-3 py-2 text-left font-medium">Email</th>
                        <th className="px-3 py-2 text-left font-medium">Rola</th>
                        <th className="px-3 py-2 text-right font-medium">Akcje</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-3 py-8 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <svg className="w-10 h-10 text-ocean-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="text-midnight-dark text-sm">Nie znaleziono użytkowników</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        filteredUsers.map(({ role, username, email }) => (
                            <tr key={email} className="hover:bg-ocean-light-blue/20">
                                <td className="px-3 py-2 font-medium text-midnight-dark">{username}</td>
                                <td className="px-3 py-2 text-midnight-dark">{email}</td>
                                <td className="px-3 py-2">
                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                             role === 'ADMIN'
                                                ? 'bg-ocean-red/10 text-ocean-red'
                                                : 'bg-ocean-blue/10 text-ocean-blue'
                                        }`}>
                                            {role}
                                        </span>
                                </td>
                                <td className="px-3 py-2">
                                    <div className="flex items-center justify-end gap-1">
                                        {/*<button className="p-1.5 text-ocean-blue hover:bg-ocean-light-blue rounded transition-colors" title="Edytuj">*/}
                                        {/*    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                                        {/*        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />*/}
                                        {/*    </svg>*/}
                                        {/*</button>*/}
                                        <button className="p-1.5 text-ocean-red hover:bg-ocean-red/10 rounded transition-colors" title="Usuń">
                                            <RemoveIcon/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;