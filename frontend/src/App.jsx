import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
import Root from './utils/Root'
import Login from './pages/Login'
import ProtectedRoutes from './utils/ProtectedRoutes'
import Dashboard from './pages/Dashboard'
import Categories from './components/Categories'
import Suppliers from './components/Suppliers'
import Product from './components/Products'
import Logout from './components/Logout'
import Summary from './components/Summary'

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route 
        path="/admin-dashboard" 
        element={
        <ProtectedRoutes requireRole={["admin"]}>
          <Dashboard />
        </ProtectedRoutes>
      }
      >
        <Route
          index
          element={<Summary />}
          />
        <Route
          path='categories'
          element={<Categories />}
          />
        <Route
          path='products'
          element={<Product />}
          />
        <Route
          path='suppliers'
          element={<Suppliers />}
          />
        <Route
          path='orders'
          element={<h1>Orders</h1>}
          />
        <Route
          path='users'
          element={<h1>Users</h1>}
          />
        <Route
          path='profile'
          element={<h1>Profile</h1>}
          />
        <Route
          path='logout'
          element={<Logout />}
          />
        </Route>
        <Route path="/customer/dashboard" element={<h1>customer dashboard</h1>}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/unauthorized" element={<p className='font-bold text-3xl mt-20 ml-20'>Unauthorized</p>}></Route>
      </Routes>
    </Router>
  )
}

export default App
