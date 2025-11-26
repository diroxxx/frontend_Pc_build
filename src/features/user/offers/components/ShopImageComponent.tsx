
interface ShopeImageProps {
    shopName: string
}


export const ShopeImageComponent = ({shopName}: ShopeImageProps) => {

    return (
        <img
            src={
                shopName.toLowerCase() === "allegro"
                    ? "allegro.png"
                    : shopName.toLowerCase() === "olx"
                        ? "olx.png"
                        : shopName.toLowerCase() === "allegrolokalnie"
                            ? "Allegro-Lokalnie.png"
                            : ""
            }
            alt={shopName}
            className="w-10 h-10 object-contain"
        />
    );
}