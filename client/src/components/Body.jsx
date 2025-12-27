import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router';

function Body() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default Body;
