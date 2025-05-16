import React from 'react'
import { usePriceContext } from './PriceContext'

interface BulkDiscountDisplayComponent extends React.FC {
    schema: {
        title: string
        description: string
        type: string
        properties: Record<string, unknown>
    }
}

const BulkDiscountDisplay: BulkDiscountDisplayComponent = () => {
    const { currentPrice, originalPrice } = usePriceContext()

    // Payment method discounts
    const WIRE_CHECK_DISCOUNT = 0.04 // 4% discount
    const BITCOIN_DISCOUNT = 0.03 // 3% discount

    // Quantity tier additional discounts
    const TIER_10_DISCOUNT = 0.01 // Additional 1% for 10+
    const TIER_40_DISCOUNT = 0.02 // Additional 2% total for 40+

    const calculatePrice = (basePrice: number, paymentDiscount: number, tierDiscount: number): number => {
        if (typeof basePrice !== 'number' || basePrice <= 0) {
            console.warn('Invalid base price for calculation:', basePrice)
            return 0
        }
        const totalDiscount = paymentDiscount + tierDiscount
        const calculatedPrice = Math.round(basePrice * (1 - totalDiscount) * 100) / 100
        return calculatedPrice
    }

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price)
    }

    // Check if we have valid prices
    const isLoading = currentPrice === 0 || originalPrice === 0

    if (isLoading) {
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
                    Loading Prices...
                </h3>
            </div>
        )
    }

    // Calculate prices for each payment method using the current dynamic price
    const mcVisaPrice = currentPrice
    const wireCheckPrice = calculatePrice(mcVisaPrice, WIRE_CHECK_DISCOUNT, 0)
    const bitcoinPrice = calculatePrice(mcVisaPrice, BITCOIN_DISCOUNT, 0)

    // Calculate tier prices
    const mcVisa10Plus = calculatePrice(mcVisaPrice, 0, TIER_10_DISCOUNT)
    const mcVisa40Plus = calculatePrice(mcVisaPrice, 0, TIER_40_DISCOUNT)
    
    const wireCheck10Plus = calculatePrice(mcVisaPrice, WIRE_CHECK_DISCOUNT, TIER_10_DISCOUNT)
    const wireCheck40Plus = calculatePrice(mcVisaPrice, WIRE_CHECK_DISCOUNT, TIER_40_DISCOUNT)
    
    const bitcoin10Plus = calculatePrice(mcVisaPrice, BITCOIN_DISCOUNT, TIER_10_DISCOUNT)

    // Debug price calculations
    React.useEffect(() => {
        console.log('BulkDiscount - Price calculations:', {
            currentPrice,
            originalPrice,
            calculatedPrices: {
                mcVisa: mcVisaPrice,
                wireCheck: wireCheckPrice,
                bitcoin: bitcoinPrice,
                mcVisa10Plus,
                mcVisa40Plus,
                wireCheck10Plus,
                wireCheck40Plus,
                bitcoin10Plus
            }
        })
    }, [currentPrice, originalPrice])

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
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(wireCheckPrice)}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(mcVisaPrice)}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(bitcoinPrice)}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>10+</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(wireCheck10Plus)}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(mcVisa10Plus)}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(bitcoin10Plus)}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>40+</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(wireCheck40Plus)}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #dee2e6' }}>{formatPrice(mcVisa40Plus)}</td>
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