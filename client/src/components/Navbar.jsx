import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', message: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 1) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://rocket-lms-api-v2.loca.lt'}/api/courses/search?query=${query}`);
                const data = await res.json();
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (err) {
                console.error(err);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery}`);
            setShowSuggestions(false);
        }
    };

    const showAlertModal = (title, message) => {
        setModalConfig({ title, message });
        setShowAuthModal(true);
    };

    const handleNavClick = (path) => {
        if (path === '/categories') {
            if (location.pathname === '/') {
                const element = document.getElementById('trending-categories');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                navigate('/');
                setTimeout(() => {
                    const element = document.getElementById('trending-categories');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
            return;
        }

        if (['/courses', '/instructors', '/store', '/forums', '/events', '/bundles', '/meeting', '/rewards', '/dashboard', '/admin-dashboard'].includes(path) && !user) {
            showAlertModal("Authentication Required", "Please login or sign up first to continue further!");
            return;
        }
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth');
    };

    return (
        <>
            <header className="top-header">
                <div className="container header-content">
                    <div className="contact-info">
                        <span>📞 +1 (123) 876-77502</span>
                        <span>✉️ mail@rocket-lms.org</span>
                    </div>
                    <div className="header-actions">
                        <div className="language-selector">
                            <select defaultValue="en">
                                <option value="en">English</option>
                                <option value="hi">हिन्दी (Hindi)</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                            </select>
                        </div>
                        <div className="search-bar-container">
                            <form className="search-bar" onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    placeholder="Search for courses..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                />
                                <button type="submit">🔍</button>
                            </form>
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="search-suggestions">
                                    {suggestions.map((course) => (
                                        <div
                                            key={course._id}
                                            className="suggestion-item"
                                            onClick={() => {
                                                navigate(`/courses`); // Navigating to courses for simplicity or could go to specific course
                                                setSearchQuery(course.title);
                                                setShowSuggestions(false);
                                            }}
                                        >
                                            <span className="suggestion-title">{course.title}</span>
                                            <span className="suggestion-category">{course.category}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="auth-links">
                            {user ? (
                                <div className="user-profile">
                                    <span className="user-name clickable" onClick={() => setShowProfileModal(true)}>Hello, <strong>{user.name}</strong></span>
                                    <span className="divider">|</span>
                                    <span className="clickable logout-btn" onClick={handleLogout}>Logout</span>
                                </div>
                            ) : (
                                <div className="guest-links">
                                    <span className="clickable" onClick={() => navigate('/auth')}>Login</span>
                                    <span className="divider">|</span>
                                    <span className="clickable" onClick={() => navigate('/auth')}>Register</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <nav className="main-nav">
                <div className="container nav-content">
                    <div className="logo font-outfit" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <span className="logo-icon">🚀</span> Rocket LMS
                    </div>
                    <ul className="nav-links">
                        <li className={`nav-categories ${location.pathname === '/categories' ? 'active' : ''}`} onClick={() => handleNavClick('/categories')}>
                            <span className="cat-icon-mini">☰</span>
                        </li>
                        <li className={location.pathname === '/' ? 'active' : ''} onClick={() => navigate('/')}>Home</li>
                        <li className={location.pathname === '/courses' ? 'active' : ''} onClick={() => handleNavClick('/courses')}>Courses</li>
                        <li className={location.pathname === '/instructors' ? 'active' : ''} onClick={() => handleNavClick('/instructors')}>Instructors</li>
                        <li className={location.pathname === '/store' ? 'active' : ''} onClick={() => handleNavClick('/store')}>Store</li>
                        <li className={location.pathname === '/forums' ? 'active' : ''} onClick={() => handleNavClick('/forums')}>Forums</li>
                        <li className={location.pathname === '/events' ? 'active' : ''} onClick={() => handleNavClick('/events')}>Events</li>
                        <li className={location.pathname === '/bundles' ? 'active' : ''} onClick={() => handleNavClick('/bundles')}>Bundles</li>
                        {user && user.role === 'admin' && (
                            <li className={location.pathname === '/admin-dashboard' ? 'active' : ''} onClick={() => navigate('/admin-dashboard')} style={{color: '#f59e0b', fontWeight: 'bold'}}>🛡️ Admin</li>
                        )}
                    </ul>
                    <button className="btn btn-primary" onClick={() => handleNavClick(user ? '/courses' : '/auth')}>Start Learning</button>
                </div>
            </nav>

            {showAuthModal && (
                <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{modalConfig.title}</h3>
                            <button className="close-btn" onClick={() => setShowAuthModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>{modalConfig.message}</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setShowAuthModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={() => { setShowAuthModal(false); navigate('/auth'); }}>Login / Sign Up</button>
                        </div>
                    </div>
                </div>
            )}

            {showProfileModal && (
                <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
                    <div className="modal-card profile-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>My Profile</h3>
                            <button className="close-btn" onClick={() => setShowProfileModal(false)}>×</button>
                        </div>
                        <div className="modal-body profile-body">
                            <div className="profile-header-main">
                                <div className="profile-avatar">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="profile-info-text">
                                    <h4>{user.name}</h4>
                                    <p>{user.email}</p>
                                </div>
                            </div>
                            <div className="profile-stats">
                                <div className="p-stat">
                                    <strong>Joined</strong>
                                    <span>{new Date().toLocaleDateString()}</span>
                                </div>
                                <div className="p-stat">
                                    <strong>Role</strong>
                                    <span style={{textTransform: 'capitalize'}}>{user.role || 'Student'}</span>
                                </div>
                            </div>
                            <div className="profile-links">
                                <button className="btn-profile-link" onClick={() => { setShowProfileModal(false); navigate('/dashboard?tab=courses'); }}>My Courses</button>
                                <button className="btn-profile-link" onClick={() => { setShowProfileModal(false); navigate('/dashboard?tab=billing'); }}>Billing History</button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary w-100" onClick={handleLogout}>Logout from Device</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
