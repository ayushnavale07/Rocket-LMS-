import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Courses from './pages/Courses';
import Store from './pages/Store';
import Instructors from './pages/Instructors';
import Forums from './pages/Forums';
import Events from './pages/Events';
import Meeting from './pages/Meeting';
import Rewards from './pages/Rewards';
import Dashboard from './pages/Dashboard';
import SearchResults from './pages/SearchResults';
import Bundles from './pages/Bundles';
import AdminDashboard from './pages/AdminDashboard';
import AIChatbot from './components/AIChatbot';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/bundles" element={<Bundles />} />
          <Route path="/store" element={<Store />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/forums" element={<Forums />} />
          <Route path="/events" element={<Events />} />
          <Route path="/meeting" element={<Meeting />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
        <AIChatbot />
      </div>
    </Router>
  );
}

export default App;
