import React from 'react'
import { PriceProvider } from './PriceContext'
import PriceUpdater from './PriceUpdater'
import BulkDiscountDisplay from './BulkDiscountDisplay'

interface DynamicPricingContainerComponent extends React.FC {
    schema: {
        title: string
        description: string
        type: string
        properties: Record<string, unknown>
    }
}

const DynamicPricingContainer: DynamicPricingContainerComponent = () => {
    return (
        <PriceProvider>
            <PriceUpdater />
            <BulkDiscountDisplay />
        </PriceProvider>
    )
}

// Schema for VTEX IO
DynamicPricingContainer.schema = {
    title: 'Dynamic Pricing Container',
    description: 'Container for price updater and bulk discount components',
    type: 'object',
    properties: {}
}

export default DynamicPricingContainer 