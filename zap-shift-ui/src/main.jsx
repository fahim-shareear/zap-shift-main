import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import routes from './routes/routes'
import AuthProvider from './authcontext/AuthProvider'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'


const queryclient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryclient}r>
      <AuthProvider>
        <RouterProvider router={routes}></RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
