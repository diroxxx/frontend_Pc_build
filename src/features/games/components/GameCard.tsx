import type { GameDto } from "../dto/GameDto.ts";
import {baseUrl} from "../../../shared/dtos/baseUrl.ts";

const GameCard = ({ game }: { game: GameDto }) => {
    return (
        <div className="group bg-dark-surface border border-dark-border rounded-xl overflow-hidden hover:border-dark-accent/50 transition-all duration-200">
            <div className="relative w-full aspect-square overflow-hidden bg-dark-surface2">
                <img
                    src={baseUrl + game.imageUrl}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="px-2 py-1.5">
                <h2 className="text-[11px] font-semibold text-dark-text group-hover:text-dark-accent transition-colors line-clamp-1">
                    {game.title}
                </h2>
            </div>
        </div>
    );
};

export default GameCard;