export type OfferShopUpdate = {
    shopName: string,
    offersAdded?: Record<string, number>,
    offersDeleted?: Record<string, number>
    totalOffers?: Record<string, number>
}