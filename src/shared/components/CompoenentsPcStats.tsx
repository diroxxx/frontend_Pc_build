import { useComponentsPcStats } from "../hooks/useComponentsPcStats";
import type { ComponentsAmountPcDto } from "../dtos/ComponentsAmountPcDto";
import {ComponentTypeEnum, PolishComponentTypeEnum} from "../dtos/BaseItemDto.ts";

export default function CompoenentsPcStats() {
    const { data, isLoading, isError } = useComponentsPcStats();
    if (isLoading) {
        return <div className="py-8 text-center text-gray-600">Ładowanie statystyk…</div>;
    }

    if (isError) {
        return <div className="py-8 text-center text-red-500">Błąd podczas pobierania statystyk</div>;
    }

    const items = (data ?? []) as ComponentsAmountPcDto[];

    return (
        <section className="py-16 bg-gray-50">
            <div className="px-6 md:px-12 lg:px-20 max-w-5xl mx-auto">

                <h2 className="text-3xl font-bold text-ocean-dark-blue mb-8 text-center">
                   Najpopularniejsze komponenty PC:
                </h2>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <ul className="space-y-4">

                        {items.map((component) => (
                            <li
                                key={component.componentType}
                                className="flex items-center justify-between py-3 border-b last:border-b-0"
                            >
                                <div className="flex-1">
                                    <div className="text-sm text-gray-500 mb-1">
                                        {PolishComponentTypeEnum[
                                            component.componentType as ComponentTypeEnum
                                            ] ?? component.componentType}
                                    </div>
                                    <div className="font-semibold text-ocean-dark-blue">
                                        {component.model}
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-ocean-blue ml-4">
                                    {component.amount}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </section>
    );
}