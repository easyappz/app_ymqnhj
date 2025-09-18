import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Stats from './pages/Stats';
import RoutesMap from './pages/RoutesMap';
import History from './pages/History';
import Goals from './pages/Goals';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}> 
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/routes" element={<RoutesMap />} />
          <Route path="/history" element={<History />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
