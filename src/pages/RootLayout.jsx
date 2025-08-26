import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RootLayout = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
