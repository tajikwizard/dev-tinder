import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Provider } from 'react-redux';
import Body from './components/Body';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';
import EditProfile from './components/EditProfile';
import appStore from './utils/appStore';
import Feed from './components/Feed';

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/feed" element={<Feed />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
