import React from 'react'
import { usePriceContext } from './PriceContext'
import CartPriceUpdater from './CartPriceUpdater'

interface PriceUpdaterComponent extends React.FC {
    schema: {
        title: string
        description: string
        type: string
        properties: Record<string, unknown>
    }
}

const PriceUpdater: PriceUpdaterComponent = () => {
    const { currentPrice, originalPrice } = usePriceContext()

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price)
    }

    // Calculate discount with one decimal place
    const discount = originalPrice > 0 ? Number(((1 - (currentPrice / originalPrice)) * 100).toFixed(1)) : 0
    const priceIncreased = discount < 0

    return (
        <>
            <CartPriceUpdater />
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
                        Pulling from live pricing mock endpoint. Updates every 10 seconds. Add to cart to lock in your price now!!!
                    </p>
                </div>
            </div>
        </>
    )
}

// Schema for VTEX IO
PriceUpdater.schema = {
    title: 'Price Updater',
    description: 'Shows a random price that changes every 10 seconds (±5%)',
    type: 'object',
    properties: {}
}

export default PriceUpdater 