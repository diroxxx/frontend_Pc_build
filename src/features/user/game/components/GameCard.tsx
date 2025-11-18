import type { GameDto } from "../types/GameDto";

const GameCard = ({ game }: { game: GameDto }) => {
    return (
        <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                <img 
                    src={`data:image/png;base64,${game.imageBase64}`} 
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            
            <div className="p-2 sm:p-3 bg-white">
                <h2 className="text-xs sm:text-sm font-semibold text-midnight-dark group-hover:text-ocean-blue transition-colors line-clamp-1">
                    {game.title}
                </h2>
            </div>
        </div>
    );
};

export default GameCard;