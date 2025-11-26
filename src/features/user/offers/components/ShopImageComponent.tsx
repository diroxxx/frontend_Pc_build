interface ShopImageProps {
    shopName: string;
    size?: number;
}

export const ShopImageComponent = ({shopName, size = 10}: ShopImageProps) => {
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
            className={`w-${size} h-${size} object-contain`}
        />
    );
}