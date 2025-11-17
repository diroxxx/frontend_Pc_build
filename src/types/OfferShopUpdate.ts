export type OfferShopUpdate = {
    shopName: string,
    offersAdded?: Record<string, number>,
    offersDeleted?: Record<string, number>
    status: 'RUNNING' | 'COMPLETED' | 'FAILED'
}