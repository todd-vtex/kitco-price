import React, { useState } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useProduct } from 'vtex.product-context'
import { usePriceContext } from './PriceContext'

const CustomAddToCart: React.FC = () => {
  const { orderForm } = useOrderForm() as any
  const orderFormId = orderForm?.id || orderForm?.orderFormId
  const productContext = useProduct() as any
  const { currentPrice } = usePriceContext()
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const skuId = productContext?.selectedItem?.itemId || productContext?.product?.items?.[0]?.itemId
      const quantity = 1
      if (!skuId || !orderFormId) {
        throw new Error('Missing skuId or orderFormId, aborting add to cart')
      }
      // 1. Add item normally (no price field)
      const addItemRes = await fetch(`/api/checkout/pub/orderForm/${orderFormId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderItems: [
            {
              id: skuId,
              quantity,
              seller: '1'
            }
          ]
        })
      })
      if (!addItemRes.ok) {
        const errorText = await addItemRes.text()
        console.error('Add to cart API error:', errorText)
        throw new Error('Failed to add item')
      }
      const updatedOrderForm = await addItemRes.json()
      // 2. Find the index of the added item
      const itemIndex = updatedOrderForm.items.findIndex((item: any) => item.id === skuId)
      if (itemIndex === -1) throw new Error('Item not found in cart')
      // 3. Override the price
      const overrideRes = await fetch(`/api/checkout/pub/orderForm/${orderFormId}/items/${itemIndex}/price`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: Math.round(currentPrice * 100) })
      })
      if (!overrideRes.ok) throw new Error('Failed to override price')
      // 4. Trigger VTEX Minicart update
      window.postMessage({ event: 'cartUpdated' }, window.origin)
    } catch (err) {
      console.error('Custom add to cart error:', err)
    }
    setLoading(false)
  }

  return (
    <button onClick={handleAddToCart} disabled={loading} style={{ padding: '10px 20px', fontSize: '1em' }}>
      {loading ? 'Adding...' : 'Add to Cart (Dynamic Price)'}
    </button>
  )
}

export default CustomAddToCart 