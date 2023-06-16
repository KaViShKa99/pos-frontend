import './App.css'
import { StoreProvider, createStore } from 'easy-peasy'
import modles from './store/models'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import SalesManagerHome from './pages/SalesManagerHome'
// import Invoice from './components/Invoice'
import Invoice from './components/Invoice'


const store = createStore(modles)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    Component: Login
  },
  {
    path: '/sales-manager-home',
    Component: SalesManagerHome
  },
  {
    path: '/invoice',
    Component: Invoice
  },
])

function App() {

  return (
      <StoreProvider store={store} >
        <RouterProvider router={router} />
      </StoreProvider>
  )
}

export default App
