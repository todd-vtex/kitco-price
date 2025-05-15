declare module 'vtex.order-manager/OrderForm' {
    export const useOrderForm: () => {
        orderForm: {
            items: Array<{
                productId: string
                price: number
            }>
        }
        updateOrderForm: (data: { items: Array<{ productId: string; price: number }> }) => void
    }
} 