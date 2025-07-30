import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Room from './Room.jsx'
import { rootStore, StoreProvider } from './store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/room',
    element: <Room/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider value={rootStore}>
      <RouterProvider router={router} future={{v7_startTransition: true, v7_relativeSplatPath: true}}/>
    </StoreProvider>
  </StrictMode>,
)
