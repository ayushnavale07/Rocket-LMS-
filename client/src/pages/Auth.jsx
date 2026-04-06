import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import './Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const email = formData.email || '';
        if (!email.includes('@') || !/[a-zA-Z]/.test(email)) {
            setError('Email must contain alphabets and @ symbol');
            setLoading(false);
            return;
        }

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
        try {
            console.log(`Sending auth request to: ${API_BASE_URL}${endpoint}`);
            const res = await axios.post(`${API_BASE_URL}${endpoint}`, formData);

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                console.log("Auth success, Redirecting...");

                // Use hard redirect to ensure state is clean
                window.location.href = '/';
            } else {
                setError('Authentication failed. No token received.');
            }
        } catch (err) {
            console.error("Auth error details:", err.response || err);
            const msg = err.response?.data?.message || 'Connection failed. Is the server running?';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <button className="back-btn" onClick={() => navigate('/')}>← Back to Home</button>
            <div className="auth-card">
                <h2 className="font-outfit">{isLogin ? 'Login' : 'Create Account'}</h2>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                required
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            required
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group password-group">
                        <label>Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? "Hide Password" : "Show Password"}
                            >
                                {showPassword ? '👁️‍🗨️' : '👁️'}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>
                <p className="auth-switch">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? ' Sign up' : ' Login'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Auth;
