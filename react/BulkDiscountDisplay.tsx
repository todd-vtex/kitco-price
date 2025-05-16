import React, { useEffect, useState } from 'react'
import { useProduct } from 'vtex.product-context'

interface ProductContextType {
    product?: {
        priceRange?: {
            sellingPrice?: {
                lowPrice?: number
            }
        }
    }
}

interface BulkDiscountDisplayComponent extends React.FC {
    schema: {
        title: string
        description: string
        type: string
        properties: Record<string, unknown>
    }
}

const BulkDiscountDisplay: BulkDiscountDisplayComponent = () => {
    const productContext = useProduct() as ProductContextType
    const basePrice = productContext?.product?.priceRange?.sellingPrice?.lowPrice || 0
    const [currentPrice, setCurrentPrice] = useState<number>(0)

    // PRICE MULTIPLIER - if the price should be $3,297.61 but shows as $32.98, use 100
    const PRICE_MULTIPLIER = 100;

    // Payment method discounts
    const WIRE_CHECK_DISCOUNT = 0.04 // 4% discount
    const BITCOIN_DISCOUNT = 0.03 // 3% discount

    // Quantity tier additional discounts
    const TIER_10_DISCOUNT = 0.01 // Additional 1% for 10+
    const TIER_40_DISCOUNT = 0.02 // Additional 2% total for 40+

    // Update price randomly every 10 seconds
    useEffect(() => {
        if (!basePrice) return

        const updatePrice = () => {
            try {
                let adjustedBasePrice = basePrice * PRICE_MULTIPLIER;
                
                // Calculate random price within range (±5%)
                const minPrice = adjustedBasePrice * 0.95;  // 5% below original
                const maxPrice = adjustedBasePrice * 1.05;  // 5% above original
                const newPrice = Math.round(Math.random() * (maxPrice - minPrice) + minPrice);

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
    }, [basePrice]);

    const calculatePrice = (basePrice: number, paymentDiscount: number, tierDiscount: number): number => {
        const totalDiscount = paymentDiscount + tierDiscount
        return basePrice * (1 - totalDiscount)
    }

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price)
    }

    return (
        <div className="bulk-discount" style={{
            padding: '20px',
            margin: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            background: '#f8f9fa'
        }}>
            <h3 style={{
                textAlign: 'center',
                backgroundColor: '#e9ecef',
                padding: '10px',
                margin: '-20px -20px 20px -20px',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px'
            }}>
                Bulk Discount
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Qty</th>
                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                            <a href="#" style={{ color: '#0056b3', textDecoration: 'none' }}>Wire/Check</a>
                        </th>
                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                            <a href="#" style={{ color: '#0056b3', textDecoration: 'none' }}>MC/Visa/PayPal</a>
                        </th>
                        <th style={{ padding: '8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                            <a href="#" style={{ color: '#0056b3', textDecoration: 'none' }}>Bitcoin</a>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>1+</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(calculatePrice(currentPrice, WIRE_CHECK_DISCOUNT, 0))}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(calculatePrice(currentPrice, 0, 0))}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(calculatePrice(currentPrice, BITCOIN_DISCOUNT, 0))}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>10+</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(calculatePrice(currentPrice, WIRE_CHECK_DISCOUNT, TIER_10_DISCOUNT))}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(calculatePrice(currentPrice, 0, TIER_10_DISCOUNT))}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(calculatePrice(currentPrice, BITCOIN_DISCOUNT, TIER_10_DISCOUNT))}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>40+</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(calculatePrice(currentPrice, WIRE_CHECK_DISCOUNT, TIER_40_DISCOUNT))}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(calculatePrice(currentPrice, 0, TIER_40_DISCOUNT))}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>N/A</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

// Schema for VTEX IO
BulkDiscountDisplay.schema = {
    title: 'Bulk Discount Display',
    description: 'Shows bulk discount pricing for different payment methods',
    type: 'object',
    properties: {}
}

export default BulkDiscountDisplay 