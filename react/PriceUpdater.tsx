import React, { useEffect, useState } from 'react'
import { useProduct } from 'vtex.product-context'

interface ProductType {
    priceRange?: {
        sellingPrice?: {
            lowPrice?: number
        }
    }
}

interface ProductContextType {
    product?: ProductType
}

interface Schema {
    title: string
    description: string
    type: string
    properties: {
        updateInterval: {
            title: string
            description: string
            type: string
            default: number
        }
    }
}

interface PriceUpdaterComponent extends React.FC {
    schema: Schema
}

// Simplified version just showing the dynamic price and using the native add-to-cart button
const PriceUpdater: PriceUpdaterComponent = () => {
    const productContext = useProduct() as ProductContextType || {}
    const { product } = productContext
    const [currentPrice, setCurrentPrice] = useState<number>(0)
    const [originalPrice, setOriginalPrice] = useState<number>(0)

    // PRICE MULTIPLIER - if the price should be $3,297.61 but shows as $32.98, use 100
    // This multiplies the price value by 100 to correct the display
    const PRICE_MULTIPLIER = 100;

    // Debug print the product to console to see its structure
    useEffect(() => {
        if (product) {
            console.log('Product data:', JSON.stringify(product, null, 2));
            const priceData = product.priceRange?.sellingPrice?.lowPrice || 0;
            console.log('Price data raw value:', priceData);
            console.log('Price data type:', typeof priceData);

            // Show what the price would be with multiplier
            console.log('Price with multiplier:', priceData * PRICE_MULTIPLIER);
        }
    }, [product]);

    // Update price randomly
    useEffect(() => {
        if (!product) return

        const updatePrice = () => {
            try {
                let basePrice = product.priceRange?.sellingPrice?.lowPrice || 0;

                // Log the raw price we're getting
                console.log('Raw base price:', basePrice);

                // APPLY PRICE MULTIPLIER to fix the scale issue
                basePrice = basePrice * PRICE_MULTIPLIER;
                console.log('Base price after multiplier:', basePrice);

                if (!originalPrice) {
                    setOriginalPrice(basePrice);
                    console.log('Set original price to:', basePrice);
                }

                // Calculate random price within range (±5%)
                const minPrice = basePrice * 0.95;  // 5% below original
                const maxPrice = basePrice * 1.05;  // 5% above original
                const newPrice = Math.round(Math.random() * (maxPrice - minPrice) + minPrice);

                console.log('New random price:', newPrice);
                console.log('New random price formatted:', formatPrice(newPrice));

                setCurrentPrice(newPrice);
            } catch (error) {
                console.error('Error updating price:', error);
            }
        }

        // Initial price update
        updatePrice();

        // Set up interval for price updates
        const interval = setInterval(updatePrice, 10000);
        return () => clearInterval(interval);
    }, [product, originalPrice]);

    // Format prices with proper thousands separators and two decimal places
    const formatPrice = (cents: number): string => {
        return (cents / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Don't render if we don't have product data
    if (!product) {
        return (
            <div style={{
                padding: '10px',
                margin: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                background: '#f8f9fa',
                color: '#721c24'
            }}>
                No product data available
            </div>
        )
    }

    // Calculate discount with one decimal place instead of rounding to whole number
    const discount = originalPrice > 0 ? Number(((1 - (currentPrice / originalPrice)) * 100).toFixed(1)) : 0;
    const priceIncreased = discount < 0;

    return (
        <div className="price-updater" style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            background: '#f8f9fa'
        }}>
            <h4>Dynamic Pricing</h4>
            <div>
                <p>Original Price: {formatPrice(originalPrice)}</p>
                <p style={{
                    fontSize: '1.2em',
                    fontWeight: 'bold',
                    color: priceIncreased ? '#d9534f' : '#5cb85c'
                }}>
                    Current Price: {formatPrice(currentPrice)}
                    {discount !== 0 && (
                        <span style={{
                            marginLeft: '10px',
                            color: priceIncreased ? '#d9534f' : '#5cb85c'
                        }}>
                            ({priceIncreased ? '+' : ''}{-discount.toFixed(1)}%)
                        </span>
                    )}
                </p>
                <p style={{ fontSize: '0.9em', color: '#666' }}>
                    Price updates every 10 seconds. Use the normal Add to Cart button below.
                </p>
            </div>
        </div>
    )
}

// Schema for VTEX IO
PriceUpdater.schema = {
    title: 'Price Updater',
    description: 'Shows a random price that changes every 10 seconds (±5%)',
    type: 'object',
    properties: {
        updateInterval: {
            title: 'Update Interval',
            description: 'Time in seconds between price updates',
            type: 'number',
            default: 10
        }
    }
}

export default React.memo(PriceUpdater) 