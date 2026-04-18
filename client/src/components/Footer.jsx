import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import './Footer.css';

const Footer = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setStatus({ type: 'success', message: data.message });
                setEmail('');
            } else {
                setStatus({ type: 'error', message: data.message });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to subscribe' });
        }
    };

    const handleNav = (path) => {
        navigate(path);
        window.scrollTo(0, 0);
    };

    return (
        <footer className="footer shadow-lg">
            <div className="container footer-top">
                <div className="footer-newsletter">
                    <div className="newsletter-info">
                        <h2>Subscribe to Our Newsletter 📧</h2>
                        <p>Receive expert insights, course updates, and learning resources directly in your inbox.</p>
                    </div>
                    <form className="newsletter-form" onSubmit={handleSubscribe}>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Enter your email address here"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-primary">Join</button>
                        </div>
                        {status.message && (
                            <p className={`status-msg ${status.type}`}>{status.message}</p>
                        )}
                    </form>
                </div>
            </div>

            <div className="container footer-grid">
                <div className="footer-brand">
                    <div className="logo font-outfit">🚀 Rocket LMS</div>
                    <p>Rocket LMS is a comprehensive learning management system providing state-of-the-art educational tools for students and instructors worldwide.</p>
                    <div className="social-links">
                        <span className="social-icon">🔵</span>
                        <span className="social-icon">📸</span>
                        <span className="social-icon">🐦</span>
                        <span className="social-icon">💼</span>
                    </div>
                </div>

                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li onClick={() => handleNav('/courses')}>Explore Courses</li>
                        <li onClick={() => handleNav('/instructors')}>Our Instructors</li>
                        <li onClick={() => handleNav('/forums')}>Community Forums</li>
                        <li onClick={() => handleNav('/events')}>Events</li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h3>Support</h3>
                    <ul>
                        <li onClick={() => handleNav('/auth')}>Login / Register</li>
                        <li onClick={() => handleNav('/dashboard?tab=billing')}>Billing History</li>
                        <li onClick={() => handleNav('/meeting')}>Live Meetings</li>
                        <li onClick={() => handleNav('/rewards')}>Rewards Program</li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h3>Contact Us</h3>
                    <p>📍 123 Learning Lane, EdTech City</p>
                    <p>📞 +1 (123) 876-77502</p>
                    <p>✉️ mail@rocket-lms.org</p>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; 2026 Rocket LMS. All rights reserved. Created with ❤️ for future learners.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
