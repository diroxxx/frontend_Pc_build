interface ShopImageProps {
    shopName: string;
    size?: number;
}

const shopLogoMap: Record<string, string> = {
    allegro: "allegro.png",
    olx: "olx.png",
    allegrolokalnie: "Allegro-Lokalnie.png",
    "x-kom": "x-kom.png",
};

export const ShopImageComponent = ({shopName}: ShopImageProps) => {
    const src = shopLogoMap[shopName.toLowerCase()] ?? "";

    if (!src) return null;

    return (
        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden p-1">
            <img
                src={src}
                alt={shopName}
                className="w-full h-full object-contain"
            />
        </div>
    );
}