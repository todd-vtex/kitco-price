import React, { createContext, useContext, useState, useEffect } from 'react'
import { useProduct } from 'vtex.product-context'

interface ProductContextType {
    product?: {
        items?: Array<{
            sellers?: Array<{
                commertialOffer?: {
                    Price?: number
                    ListPrice?: number
                }
            }>
        }>
        priceRange?: {
            sellingPrice?: {
                lowPrice?: number
            }
        }
    }
}

interface PriceContextType {
    currentPrice: number
    originalPrice: number
    updatePrice: () => void
}

const PriceContext = createContext<PriceContextType>({
    currentPrice: 0,
    originalPrice: 0,
    updatePrice: () => {}
})

export const usePriceContext = () => useContext(PriceContext)

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const productContext = useProduct() as ProductContextType
    const [currentPrice, setCurrentPrice] = useState<number>(0)
    const [originalPrice, setOriginalPrice] = useState<number>(0)
    const [isInitialized, setIsInitialized] = useState(false)

    // Initialize prices from VTEX context
    useEffect(() => {
        console.log('Full VTEX Product Context:', productContext)
        
        // Try different paths to get the price
        let rawPrice = productContext?.product?.priceRange?.sellingPrice?.lowPrice

        // If priceRange is not available, try getting price from items[0]
        if (!rawPrice && productContext?.product?.items?.[0]?.sellers?.[0]?.commertialOffer?.Price) {
            rawPrice = productContext.product.items[0].sellers[0].commertialOffer.Price
        }

        console.log('Raw price from VTEX:', rawPrice)

        if (typeof rawPrice === 'number' && rawPrice > 0) {
            console.log('Setting initial price:', rawPrice)
            
            setCurrentPrice(rawPrice)
            setOriginalPrice(rawPrice)
            setIsInitialized(true)
        } else {
            console.warn('Could not find valid price in product context:', {
                priceRange: productContext?.product?.priceRange,
                firstItem: productContext?.product?.items?.[0],
                rawPrice
            })
        }
    }, [productContext])

    const updatePrice = () => {
        if (!originalPrice) {
            console.warn('Update price called before initialization')
            return
        }

        try {
            // Calculate random price within range (±5%)
            const minPrice = originalPrice * 0.95  // 5% below original
            const maxPrice = originalPrice * 1.05  // 5% above original
            const newPrice = Math.round(Math.random() * (maxPrice - minPrice) + minPrice)

            console.log('Updating price:', {
                originalPrice,
                minPrice,
                maxPrice,
                newPrice
            })

            setCurrentPrice(newPrice)
        } catch (error) {
            console.error('Error updating price:', error)
        }
    }

    // Start price updates only after initialization
    useEffect(() => {
        if (!isInitialized) {
            console.log('Waiting for price initialization...')
            return
        }

        console.log('Starting price updates with initial state:', {
            currentPrice,
            originalPrice,
            isInitialized
        })

        const interval = setInterval(updatePrice, 10000)
        return () => clearInterval(interval)
    }, [isInitialized, originalPrice])

    // Debug state changes
    useEffect(() => {
        console.log('Price state updated:', {
            currentPrice,
            originalPrice,
            isInitialized
        })
    }, [currentPrice, originalPrice, isInitialized])

    return (
        <PriceContext.Provider value={{
            currentPrice,
            originalPrice,
            updatePrice
        }}>
            {children}
        </PriceContext.Provider>
    )
}

export default PriceContext 