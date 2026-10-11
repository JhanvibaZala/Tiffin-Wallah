import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AllFoodItems from './pages/AllFoodItems';
import NotFound from './pages/NotFound';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="container main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/menu" element={<AllFoodItems />} />
          <Route path="/cart" element={<Cart />} />
          <Route 
            path="/dashboard/customer" 
            element={
              <PrivateRoute>
                <CustomerDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/provider" 
            element={
              <PrivateRoute>
                <ProviderDashboard />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
