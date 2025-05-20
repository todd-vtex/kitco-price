import React, { useEffect } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { usePriceContext } from './PriceContext'

const CartPriceUpdater: React.FC = () => {
    const { orderForm, setOrderForm } = useOrderForm() as any
    const orderFormId = orderForm?.id || orderForm?.orderFormId
    const { currentPrice } = usePriceContext()

    const updateCartItemPrice = async (itemIndex: number) => {
        if (!orderFormId) {
            return
        }
        try {
            const response = await fetch(`/api/checkout/pub/orderForm/${orderFormId}/items/${itemIndex}/price`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    price: currentPrice * 100, // Convert to cents as per VTEX API requirement
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const updatedOrderForm = await response.json()
            setOrderForm(updatedOrderForm)
        } catch (error) {
            console.error('Failed to update cart price:', error)
        }
    }

    useEffect(() => {
        if (orderForm?.items?.length > 0 && orderFormId) {
            orderForm.items.forEach((item: any, index: number) => {
                if (item.price !== currentPrice * 100) {
                    updateCartItemPrice(index)
                }
            })
        }
    }, [orderForm?.items?.length, currentPrice, orderFormId])

    return null
}

export default CartPriceUpdater 