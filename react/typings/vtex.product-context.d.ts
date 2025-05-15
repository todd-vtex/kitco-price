declare module 'vtex.product-context' {
    export const useProduct: () => {
        product: {
            productId: string
            priceRange: {
                sellingPrice: {
                    lowPrice: number
                }
            }
        }
    }
} 