import React, { useEffect, useState, useCallback } from 'react'
import { useProduct } from 'vtex.product-context'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useMutation } from 'react-apollo'
import UPDATE_ITEMS from 'vtex.checkout-resources/MutationUpdateItems'

const PriceUpdater: React.FC = () => {
    const { product } = useProduct()
    const { orderForm } = useOrderForm()
    const [currentPrice, setCurrentPrice] = useState<number>(0)
    const [updateItems] = useMutation(UPDATE_ITEMS)

    const updatePrice = useCallback(async () => {
        if (!product) return

        const originalPrice = product.priceRange.sellingPrice.lowPrice
        const minPrice = originalPrice * 0.8
        const maxPrice = originalPrice * 1.2
        const newPrice = Math.random() * (maxPrice - minPrice) + minPrice

        setCurrentPrice(newPrice)

        // Update cart price if item exists
        if (orderForm?.items?.length > 0) {
            try {
                const updatedItems = orderForm.items.map((item: any) => ({
                    id: parseInt(item.id, 10),
                    quantity: item.quantity,
                    seller: item.seller,
                    priceDefinition: {
                        calculatedSellingPrice: Math.round(newPrice * 100),
                        sellingPrice: Math.round(newPrice * 100),
                        listPrice: Math.round(newPrice * 100),
                        priceTags: [{
                            name: "default",
                            value: Math.round(newPrice * 100)
                        }]
                    }
                }))

                await updateItems({
                    variables: {
                        orderItems: updatedItems
                    }
                })
            } catch (error) {
                console.error('Error updating cart prices:', error)
            }
        }
    }, [product, orderForm, updateItems])

    useEffect(() => {
        if (!product) return

        // Initial price update
        updatePrice()

        // Set up interval for price updates
        const interval = setInterval(updatePrice, 10000)

        return () => clearInterval(interval)
    }, [product, updatePrice])

    if (!product) {
        return null
    }

    return (
        <div className="price-updater">
            <p>Current Price: ${currentPrice.toFixed(2)}</p>
        </div>
    )
}

export default React.memo(PriceUpdater) 