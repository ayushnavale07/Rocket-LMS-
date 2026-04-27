import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import './Events.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Events = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/events`);
                setEvents(res.data);
            } catch (err) {
                console.error("Error fetching events", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const [validCourseId, setValidCourseId] = useState('67a1da90cc0f970678dcf49b');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/courses`);
                if (res.data && res.data.length > 0) {
                    setValidCourseId(res.data[0]._id);
                }
            } catch (err) {
                console.error("Failed to fetch courses for fallback ID");
            }
        };
        fetchCourses();
    }, []);

    const handleReadBlog = (blog) => {
        alert(`Reading: ${blog.title}\n\nFull article content loading...`);
    };

    const handleNewsletterJoin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        if (email) {
            alert(`Thank you! ${email} has been subscribed to our newsletter.`);
            e.target.reset();
        }
    };

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', message: '' });
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [checkoutDetails, setCheckoutDetails] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccessData, setPaymentSuccessData] = useState(null);

    const showAlertModal = (title, message) => {
        setModalConfig({ title, message });
        setShowAuthModal(true);
    };

    const handlePurchase = async (courseId) => {
        if (!user) {
            showAlertModal("Authentication Required", "Please login or sign up first to continue further!");
            return;
        }
        try {
            // Use the valid course ID as a fallback for mock items
            const targetId = courseId.startsWith('6') ? courseId : validCourseId;
            const res = await axios.post(`${API_BASE_URL}/api/payment/create-order`,
                { courseId: targetId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            
            setCheckoutDetails({ ...res.data, courseId: targetId });
            setShowCheckoutModal(true);
            setPaymentSuccessData(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to initiate order');
        }
    };

    const confirmPayment = async () => {
        setIsProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const res = await axios.post(`${API_BASE_URL}/api/payment/verify-payment`,
                {
                    courseId: checkoutDetails.courseId,
                    amount: checkoutDetails.amount,
                    transactionId: `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setPaymentSuccessData(res.data.transaction);
            setIsProcessing(false);
        } catch (err) {
            setIsProcessing(false);
            alert('Payment verification failed');
        }
    };

    const blogs = [
        { id: 1, title: 'How to Set Freelance Rates and Negotiate with Confidence', tutor: 'George Hamilton', date: '30 Jun 2021', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600' },
        { id: 2, title: 'Top 10 Essential UI/UX Design Tools for Beginners in 2024', tutor: 'Admin', date: '15 Jul 2021', img: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=400' },
        { id: 3, title: 'The Future of AI in Modern Education and Learning', tutor: 'Admin', date: '10 Aug 2021', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400' },
    ];

    return (
        <div className="events-page">
            <Navbar />

            <section className="events-hero-v2">
                <div className="container">
                    <div className="glass-hero-card p-5 text-center text-white">
                        <div className="premium-badge">✨ Limited Events Available</div>
                        <h1 className="font-outfit mt-4 hero-title text-white">Explore Upcoming Events & <br/>Secure Your Spot Today</h1>
                        <p className="hero-description mt-3">Join industry leaders in exclusive sessions designed to elevate your career and connect you with global experts.</p>
                        <div className="hero-tags mt-4">
                            <span className="tag">#Design</span>
                            <span className="tag">#Tech</span>
                            <span className="tag">#Marketing</span>
                            <span className="tag">#Future</span>
                        </div>
                        <div className="hero-group-btns mt-5">
                            <button className="btn btn-premium" onClick={() => {
                                document.getElementById('events-main-grid').scrollIntoView({ behavior: 'smooth' });
                            }}>📅 Explore All Events</button>
                            <button className="btn btn-glass" onClick={() => navigate('/instructors')}>👥 View Providers</button>
                        </div>
                    </div>
                </div>
            </section>

            <section id="events-main-grid" className="events-grid-v2 container mb-5 py-5">
                <div className="section-header-v2">
                    <h2 className="font-outfit">Upcoming Sessions</h2>
                    <p>Don't miss out on these handpicked professional events</p>
                </div>
                <div className="grid-v2">
                    {events.map(ev => (
                        <div className="event-card-v2" key={ev.id}>
                            <div className="ev-thumb-v2">
                                <img src={ev.img} alt={ev.title} />
                                <span className={`premium-status ${ev.status.toLowerCase()}`}>{ev.status}</span>
                                <div className="ev-hover-overlay">
                                    <button className="btn btn-outline-white" onClick={() => handlePurchase(ev.id)}>Buy Ticket</button>
                                </div>
                            </div>
                            <div className="ev-body-v2">
                                <span className="ev-date-chip">📅 {ev.date}</span>
                                <h3>{ev.title}</h3>
                                <div className="ev-instructor-row">
                                    <img src={`https://i.pravatar.cc/100?u=${ev.tutor}`} alt="tutor" />
                                    <span>{ev.tutor}</span>
                                </div>
                                <div className="ev-footer-v2">
                                    <div className="ev-price-v2">${ev.price} <span className="per-seat">/ seat</span></div>
                                    <button className="btn-register" onClick={() => handlePurchase(ev.id)}>Register Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="blogs-section bg-light py-5 mb-5" style={{ background: '#f8fafc', borderRadius: '80px', margin: '20px 40px' }}>
                <div className="container">
                    <div className="badge-wrapper text-center">
                        <span className="badge-small-blue" style={{ background: '#e0f2fe', color: '#1a73e8', padding: '6px 16px', borderRadius: '20px', fontWeight: '700' }}>Read More</span>
                    </div>
                    <h2 className="text-center font-outfit mb-3 mt-3" style={{ fontSize: '2.5rem', fontWeight: '800' }}>Blog and Articles</h2>
                    <p className="text-center text-secondary mb-5">Stay informed with expert-written articles, tips, and insights to support your learning journey daily</p>

                    <div className="blogs-modern-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                        {blogs.map(blog => (
                            <div className="blog-modern-card" key={blog.id} style={{ background: 'white', borderRadius: '32px', overflow: 'hidden', transition: '0.4s', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', cursor: 'pointer' }} onClick={() => handleReadBlog(blog)}>
                                <div className="blog-thumb" style={{ height: '240px', overflow: 'hidden' }}>
                                    <img src={blog.img} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.6s' }} />
                                </div>
                                <div className="blog-info" style={{ padding: '30px' }}>
                                    <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '0.85rem', marginBottom: '15px' }}>
                                        <span>👤 {blog.tutor}</span>
                                        <span>📅 {blog.date || 'Jul 2024'}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: '1.4', marginBottom: '20px', color: '#1e293b' }}>{blog.title}</h3>
                                    <button className="read-btn" style={{ background: 'none', border: 'none', color: '#1a73e8', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', padding: 0 }}>Read Article ➔</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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

            {showCheckoutModal && (
                <div className="modal-overlay" onClick={() => setShowCheckoutModal(false)}>
                    <div className="modal-card checkout-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{paymentSuccessData ? 'Enrollment Receipt' : 'Event Ticket Summary'}</h3>
                            <button className="close-btn" onClick={() => setShowCheckoutModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {!paymentSuccessData ? (
                                <div className="order-summary">
                                    <div className="summary-item"><span>Attendee:</span> <strong>{checkoutDetails?.userName}</strong></div>
                                    <div className="summary-item"><span>Email:</span> <strong>{checkoutDetails?.email}</strong></div>
                                    <div className="summary-item"><span>Event:</span> <strong>{checkoutDetails?.courseTitle}</strong></div>
                                    <div className="summary-item"><span>Price:</span> <strong className="text-primary">${checkoutDetails?.amount}</strong></div>
                                    <div className="summary-item"><span>Date:</span> <strong>{new Date().toLocaleString()}</strong></div>
                                </div>
                            ) : (
                                <div className="payment-success-msg text-center">
                                    <div className="success-icon">🎟️</div>
                                    <h4>Registration Successful!</h4>
                                    <p>Your spot has been secured. Check your email for the ticket.</p>
                                    <div className="receipt-box mt-4">
                                        <div className="summary-item"><span>Ticket ID:</span> <strong>#{Math.random().toString(36).substr(2, 9).toUpperCase()}</strong></div>
                                        <div className="summary-item"><span>Reserved At:</span> <strong>{new Date(paymentSuccessData.date).toLocaleString()}</strong></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            {!paymentSuccessData ? (
                                <>
                                    <button className="btn btn-outline" onClick={() => setShowCheckoutModal(false)}>Cancel</button>
                                    <button className="btn btn-premium w-100" onClick={confirmPayment} disabled={isProcessing}>
                                        {isProcessing ? 'Verifying...' : 'Complete Registration'}
                                    </button>
                                </>
                            ) : (
                                <button className="btn btn-premium w-100" onClick={() => setShowCheckoutModal(false)}>Awesome!</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <section className="newsletter-section-premium container mb-5">
                <div className="newsletter-premium-box" style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)', padding: '80px', borderRadius: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 40px 80px rgba(26, 115, 232, 0.3)', color: 'white', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
                    <div className="news-content" style={{ flex: 1, zIndex: 1 }}>
                        <h2 className="font-outfit" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '20px' }}>Subscribe to Our Newsletter 😊</h2>
                        <p style={{ opacity: '0.9', fontSize: '1.1rem', maxWidth: '500px' }}>Receive expert insights, course updates, and learning resources directly in your inbox and get notified</p>
                    </div>
                    <form onSubmit={handleNewsletterJoin} className="news-form-modern" style={{ flex: 1, display: 'flex', gap: '15px', justifyContent: 'flex-end', zIndex: 1 }}>
                        <input name="email" type="email" placeholder="Enter your email address here" required style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '20px 30px', borderRadius: '20px', width: '100%', maxWidth: '350px', color: 'white', fontWeight: '500', outline: 'none' }} />
                        <button type="submit" className="btn-join-modern" style={{ background: 'white', color: '#1a73e8', padding: '20px 40px', borderRadius: '20px', border: 'none', fontWeight: '800', cursor: 'pointer', transition: '0.3s' }}>Join Now</button>
                    </form>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Events;
