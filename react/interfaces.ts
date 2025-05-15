export interface OrderFormItem {
    productId: string
    price: number
    priceDefinition: {
        calculatedSellingPrice: number
    }
}

export interface OrderForm {
    items: OrderFormItem[]
}

export interface ProductPrice {
    priceRange: {
        sellingPrice: {
            lowPrice: number
        }
    }
    productId: string
}

export interface CheckoutContext {
    price: number
} 