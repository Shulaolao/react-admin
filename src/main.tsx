import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import './styles/index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/index.ts'

createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
    }}
  >
    <RouterProvider router={router} />
  </ConfigProvider>
)
