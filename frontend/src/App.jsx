import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import MessList from './pages/MessList';
import MessDetail from './pages/MessDetail';
import Compare from './pages/Compare';
import Profile from './pages/Profile';
import Subscriptions from './pages/Subscriptions';
import SavedMesses from './pages/SavedMesses';
import AdminPanel from './pages/AdminPanel';
import OwnerPanel from './pages/OwnerPanel';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/messes" element={<MessList />} />
        <Route path="/mess/:id" element={<MessDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/saved" element={<SavedMesses />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/owner" element={<OwnerPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
