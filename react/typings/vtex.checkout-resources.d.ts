declare module 'vtex.checkout-resources/CheckoutContext' {
    export const useCheckout: () => {
        updateCheckout: (data: { items: Array<{ productId: string; price: number }> }) => void
    }
} 