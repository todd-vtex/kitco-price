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

    // Combined initialization and price updates
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
            
            // Only start price updates after 10 seconds
            const updateInterval = setInterval(updatePrice, 10000)
            return () => clearInterval(updateInterval)
        } else {
            console.warn('Could not find valid price in product context:', {
                priceRange: productContext?.product?.priceRange,
                firstItem: productContext?.product?.items?.[0],
                rawPrice
            })
        }
    }, [productContext])

    const updatePrice = async () => {
        if (!originalPrice) {
            console.warn('Update price called before initialization')
            return
        }

        try {
            // Fetch price from Heroku endpoint
            const response = await fetch(`https://kitco-price-updater-1d4e12da8d56.herokuapp.com/price?basePrice=${originalPrice}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            const newPrice = data.currentPrice

            console.log('Updating price from Heroku:', {
                originalPrice,
                newPrice,
                response: data
            })

            setCurrentPrice(newPrice)
        } catch (error) {
            console.error('Error fetching price from Heroku:', error)
            // Fallback to local calculation if Heroku fails
            const minPrice = originalPrice * 0.95
            const maxPrice = originalPrice * 1.05
            const fallbackPrice = Math.round(Math.random() * (maxPrice - minPrice) + minPrice)
            console.log('Falling back to local price calculation:', fallbackPrice)
            setCurrentPrice(fallbackPrice)
        }
    }

    // Debug state changes
    useEffect(() => {
        console.log('Price state updated:', {
            currentPrice,
            originalPrice
        })
    }, [currentPrice, originalPrice])

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