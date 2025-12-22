import React from 'react'
import ProductList from '@/app/componants/ProductList'

async function getProducts() {
  const res = await fetch('https://dummyjson.com/products')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function ProductsPage() {
  const data = await getProducts()
  const products = data.products

  return (
    <>
      <ProductList products={products} />
    </>
  )
}
