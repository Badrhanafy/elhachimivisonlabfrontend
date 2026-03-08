// App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// public
import Homepage from './pages/Homepage';
import Works from './pages/Works';

// admin
import ReservationDetail from './pages/ReservationDetail';
import ServicesManage from './pages/ServicesManage';
import Photography from './pages/Photography';
import ImageGallery from './pages/ClientDownload';
import SportAnalysis from './pages/SportAnalysis';
import Test from './pages/test';
import DataAnalytics from './pages/admin/DataAnalytics';
import About from './pages/About';
import AdminLogin from './pages/admin/AdminLogin';
import Contact from './pages/Contact';

// lazy admin
const AdminLayout = React.lazy(() => import('./components/layout/AdminLayout'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const Reservations = React.lazy(() => import('./pages/admin/Reservations'));
const Images = React.lazy(() => import('./pages/admin/Images'));

function App() {
  const isAuthenticated = true;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <React.Suspense fallback={<div>Loading...</div>}>

        <Toaster position="top-right" />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Homepage isOpen={isModalOpen}  closeModal={() => setIsModalOpen(false)} />} />
         {/*  <Route path="/works" element={<Works />} /> */}
          <Route path="/analysis" element={<SportAnalysis />} />
          <Route path="/test" element={<Test />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={<AdminLayout  />}
          >
            <Route path='charts' element={<DataAnalytics/>}/>
            <Route index element={<Dashboard />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="reservations/:id" element={<ReservationDetail />} />
            <Route path="images" element={<Images />} />
            <Route path="services" element={<ServicesManage />} /> ✅

            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Global fallback */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
          <Route path='/photography' element={<Photography/>}/>
          <Route path='/:username/:id/results' element={<ImageGallery/>}/>
          <Route path='/About' element={<About/>}/>
          <Route path='/login' element={<AdminLogin/>}/>
          <Route path='/contact' element={<Contact/>}/>
        </Routes>
     
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
