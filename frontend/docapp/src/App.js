import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './components/Login/Login';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useToken from './useToken';
import Registration from './components/Registration/Registration';
import CreateProject from './components/CreateProject/CreateProject';
import MainNav from './components/Navbar/MainNav';
import HomePage from './components/HomePage/HomePage';

function App() {
  const { token, setToken } = useToken();

  return (
    <div className="wrapper">
      <Router>
        <MainNav setToken={setToken} token={token} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={token ? <Navigate replace to="/" /> : <Login setToken={setToken} />} />
          <Route path="/registration" element={token ? <Navigate replace to="/" /> : <Registration />} />
          <Route path="/create" element={token ? <CreateProject setToken={setToken} /> : <Navigate replace to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
