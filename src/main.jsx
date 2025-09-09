import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Home from './routes/Home'
import TryOn from './routes/TryOn'
import Shop from './routes/Shop'
import ProductDetail from './routes/ProductDetail'
import Artisans from './routes/Artisans'
import Cart from './routes/Cart'
import Checkout from './routes/Checkout'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Home /> },
    { path: 'try-on', element: <TryOn /> },
    { path: 'shop', element: <Shop /> },
    { path: 'product/:id', element: <ProductDetail /> },
    { path: 'artisans', element: <Artisans /> },
    { path: 'cart', element: <Cart /> },
    { path: 'checkout', element: <Checkout /> },
  ]}
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)