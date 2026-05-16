import { useComponentsPcStats } from "../hooks/useComponentsPcStats";
import type { ComponentsAmountPcDto } from "../dtos/ComponentsAmountPcDto";
import {ComponentTypeEnum, PolishComponentTypeEnum} from "../dtos/BaseItemDto.ts";

export default function CompoenentsPcStats() {
    const { data, isLoading, isError } = useComponentsPcStats();

    if (isLoading) {
        return (
            <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden animate-pulse">
                <div className="px-5 py-3 border-b border-dark-border">
                    <div className="h-3 w-40 bg-dark-surface2 rounded" />
                </div>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-dark-border last:border-b-0">
                        <div className="flex-1 space-y-1.5">
                            <div className="h-2 w-16 bg-dark-surface2 rounded" />
                            <div className="h-3 w-32 bg-dark-surface2 rounded" />
                        </div>
                        <div className="h-5 w-6 bg-dark-surface2 rounded ml-4" />
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return <div className="py-8 text-center text-red-400 text-sm">Błąd podczas pobierania statystyk</div>;
    }

    const items = (data ?? []) as ComponentsAmountPcDto[];

    return (
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-dark-border">
                <h2 className="text-xs font-bold text-dark-muted uppercase tracking-widest">
                    Najpopularniejsze komponenty
                </h2>
            </div>
            <ul className="divide-y divide-dark-border">
                {items.map((component) => (
                    <li
                        key={component.componentType}
                        className="flex items-center justify-between px-5 py-3 hover:bg-dark-surface2 transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] text-dark-muted uppercase tracking-wide mb-0.5">
                                {PolishComponentTypeEnum[
                                    component.componentType as ComponentTypeEnum
                                ] ?? component.componentType}
                            </div>
                            <div className="text-sm font-semibold text-dark-text truncate">
                                {component.model}
                            </div>
                        </div>
                        <div className="text-lg font-extrabold text-dark-accent ml-4 flex-shrink-0">
                            {component.amount}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
