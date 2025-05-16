// This file was renamed from PriceUpdater.tsx to KitcoPrice.tsx to ensure the block is registered as kitco-price.
import React, { useEffect, useState } from 'react'
import { useProduct } from 'vtex.product-context'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCheckout } from 'vtex.checkout-resources/CheckoutContext'

interface KitcoPriceProps {
    // Even if empty, define a props interface for VTEX IO to recognize the component
}

const KitcoPrice: React.FC<KitcoPriceProps> = () => {
    console.log('KitcoPrice component ALWAYS rendering - debug mode')

    // Comment out the early return to test normal component behavior
    /*
    return (
        <div style={{ 
            padding: '15px', 
            margin: '10px', 
            background: '#f8d7da', 
            border: '2px solid #dc3545',
            borderRadius: '5px',
            color: '#721c24',
            fontWeight: 'bold'
        }}>
            <h3>KITCO PRICE DEBUG</h3>
            <p>Block is loading but might have issues</p>
            <p>Check browser console for logs</p>
            <p>If you see this, the block is at least being rendered in the DOM</p>
        </div>
    )
    */

    const { product } = useProduct()
    const [currentPrice, setCurrentPrice] = useState<number>(0)
    const { updateOrderForm } = useOrderForm()
    const { updateCheckout } = useCheckout()
    const [adding, setAdding] = useState(false)
    const [checkingOut, setCheckingOut] = useState(false)

    useEffect(() => {
        if (!product) {
            console.log('No product found in context')
            return
        }

        console.log('Product found:', product.productId)

        const updatePrice = () => {
            const originalPrice = product.priceRange.sellingPrice.lowPrice
            const minPrice = originalPrice * 0.8
            const maxPrice = originalPrice * 1.2
            const newPrice = Math.random() * (maxPrice - minPrice) + minPrice
            setCurrentPrice(Math.round(newPrice)) // VTEX expects integer cents
            console.log('Price updated to:', Math.round(newPrice))
        }

        // Initial price update
        updatePrice()

        // Set up interval for price updates
        const interval = setInterval(updatePrice, 10000)
        return () => clearInterval(interval)
    }, [product])

    // Always show something, even without product context
    return (
        <div className="kitco-price" style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            background: '#f8f9fa'
        }}>
            <h4>Dynamic Pricing Component</h4>
            {product ? (
                <>
                    <p>Current Price: ${(currentPrice / 100).toFixed(2)}</p>
                    <button
                        onClick={handleAddToCart}
                        disabled={adding}
                        style={{
                            marginRight: 8,
                            padding: '8px 16px',
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        {adding ? 'Adding...' : 'Add to Cart with Dynamic Price'}
                    </button>
                    <button
                        onClick={handleCheckout}
                        disabled={checkingOut}
                        style={{
                            padding: '8px 16px',
                            background: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        {checkingOut ? 'Processing...' : 'Go to Checkout with Dynamic Price'}
                    </button>
                </>
            ) : (
                <p>No product context available. Are you on a product page?</p>
            )}
        </div>
    )

    function handleAddToCart() {
        setAdding(true)
        try {
            console.log('Adding to cart with price:', currentPrice)
            updateOrderForm({
                items: [
                    {
                        productId: product!.productId,
                        price: currentPrice,
                    },
                ],
            })
            alert('Added to cart with dynamic price!')
        } catch (e) {
            console.error('Failed to add to cart:', e)
            alert('Failed to add to cart')
        }
        setAdding(false)
    }

    function handleCheckout() {
        setCheckingOut(true)
        try {
            console.log('Going to checkout with price:', currentPrice)
            updateCheckout({
                items: [
                    {
                        productId: product!.productId,
                        price: currentPrice,
                    },
                ],
            })
            window.location.href = '/checkout'
        } catch (e) {
            console.error('Failed to update checkout:', e)
            alert('Failed to update checkout')
        }
        setCheckingOut(false)
    }
}

    // Fix the TypeScript error by casting to any
    ; (KitcoPrice as any).schema = {
        title: 'Kitco Price',
        description: 'Shows a random price and allows adding to cart/checkout with that price',
        type: 'object',
        properties: {},
    }

export default KitcoPrice 