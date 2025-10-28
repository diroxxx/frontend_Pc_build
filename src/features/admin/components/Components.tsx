import {useFetchComponents} from "../hooks/useFetchComponents.ts";
import {Component} from "./component.tsx";
// import type {ComponentItem} from "../../../types/BaseItemDto.ts";
import {useState} from "react";
import ReactPaginate from "react-paginate";


const Components = () => {
    const [page, setPage] = useState(1);
    const { data, isLoading, error, isFetching, isPlaceholderData } = useFetchComponents(page);

    if (isLoading) return <p className="p-4 text-midnight-dark">Ładowanie komponentów...</p>;
    if (error) return <p className="p-4 text-ocean-red">Błąd podczas pobierania danych.</p>;

    const components = data?.items ?? [];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-midnight-dark">Lista komponentów</h2>
                </div>
                <div className="flex items-center gap-3 text-xs text-midnight-dark">
          <span>
            Wyświetlono: <strong>{components.length}</strong>
          </span>
                    <span>
            Strona: <strong>{page + 1}</strong>
          </span>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-ocean-dark-blue text-ocean-white">
                    <tr>
                        <th className="px-3 py-2 text-left font-medium">Typ</th>
                        <th className="px-3 py-2 text-left font-medium">Marka</th>
                        <th className="px-3 py-2 text-left font-medium">Model</th>
                        <th className="px-3 py-2 text-left font-medium">Szczegóły</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {components.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-3 py-8 text-center text-midnight-dark">
                                Brak komponentów w bazie
                            </td>
                        </tr>
                    ) : (
                        components.map((component) => (
                            <Component key={`${component.componentType}-${component.id}`} component={component} />
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <ReactPaginate
                breakLabel="..."
                nextLabel="→"
                onPageChange={(e) => setPage(e.selected)}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={data?.totalPages ?? 1}
                previousLabel="←"
                containerClassName="flex justify-center gap-1 py-4"
                pageClassName="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                activeClassName="bg-ocean-dark-blue text-white font-semibold"
            />
        </div>
    );
};

export default Components;