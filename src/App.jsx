import './App.css';
import { StoreProvider, createStore } from 'easy-peasy';
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';
import models from './store/models';
import Home from './pages/Home';
import Login from './pages/Login';
import Invoice from './components/Invoice';
import SalesManagerHome from './pages/SalesManagerHome'
import VehicleProducts from './components/VehicleProducts';
import 'react-toastify/dist/ReactToastify.css';

const store = createStore(models);

const PrivateRoute = ({ path, element: Element, roles }) => {
  const token  = localStorage.getItem("token")

  if (!roles.includes(token)) {
    return <Navigate to="/login" />;
  }

  return Element 
};

function App() {
  return (
    <StoreProvider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute roles={['admin']} element={<Home />}/> }  />
          <Route
            path="/sales-manager-home"
            element={<PrivateRoute roles={['user','admin']} element={<SalesManagerHome />} />}
          />
          <Route
            path="/invoice/:id"
            element={<PrivateRoute roles={['admin','user']} element={<Invoice />} />}
          />
          <Route
            path="/vehicle-products/:id"
            element={<PrivateRoute roles={['admin']} element={<VehicleProducts />} />}
          />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
