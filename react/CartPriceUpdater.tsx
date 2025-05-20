import React, { useEffect } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { usePriceContext } from './PriceContext'

interface OrderForm {
    orderFormId: string
    items: Array<{
        productId: string
        price: number
        quantity: number
    }>
}

interface OrderFormContext {
    orderForm: OrderForm
    updateOrderForm: (data: Partial<OrderForm>) => void
}

const CartPriceUpdater: React.FC = () => {
    const { orderForm, updateOrderForm } = useOrderForm() as OrderFormContext
    const { currentPrice } = usePriceContext()

    const updateCartItemPrice = async (itemIndex: number) => {
        if (!orderForm?.orderFormId) return

        try {
            const response = await fetch(`/api/checkout/pub/orderForm/${orderForm.orderFormId}/items/${itemIndex}/price`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    price: currentPrice * 100,
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const updatedOrderForm = await response.json()
            updateOrderForm(updatedOrderForm)
        } catch (error) {
            console.error('Failed to update cart price:', error)
        }
    }

    useEffect(() => {
        if (orderForm?.items?.length > 0 && orderForm?.orderFormId) {
            orderForm.items.forEach((item, index) => {
                if (item.price !== currentPrice * 100) {
                    updateCartItemPrice(index)
                }
            })
        }
    }, [orderForm?.items?.length, currentPrice, orderForm?.orderFormId])

    return null
}

export default CartPriceUpdater 