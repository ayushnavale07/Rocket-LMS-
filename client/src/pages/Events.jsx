import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Events.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Events = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const events = [
        { id: 'event-1', title: 'DevOps and CI/CD Automation for Modern Teams', tutor: 'Robert Ransdell', price: 20, date: 'June 30', status: 'Ongoing', img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400' },
        { id: 'event-2', title: 'Blockchain and Crypto Development for Applications', tutor: 'Robert Ransdell', price: 15, date: 'June 12', status: 'Completed', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400' },
        { id: 'event-3', title: 'Cloud Computing Fundamentals for Modern IT Professionals', tutor: 'Robert Ransdell', price: 30, date: 'September 10', status: 'Scheduled', img: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400' },
        { id: 'event-4', title: 'Digital Marketing Mastery for High-Impact Growth', tutor: 'Robert Ransdell', price: 20, date: 'May 15', status: 'Completed', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400' },
        { id: 'event-5', title: 'Modern Mobile App Development for Android and iOS', tutor: 'Light Moon', price: 25, date: 'May 21', status: 'Scheduled', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400' },
        { id: 'event-6', title: 'Practical Cybersecurity Best Practices for Modern Organizations', tutor: 'Light Moon', price: 45, date: 'May 10', status: 'Completed', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400' },
    ];

    const [validCourseId, setValidCourseId] = useState('67a1da90cc0f970678dcf49b');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://rocket-lms-api-v2.loca.lt'}/api/courses`);
                if (res.data && res.data.length > 0) {
                    setValidCourseId(res.data[0]._id);
                }
            } catch (err) {
                console.error("Failed to fetch courses for fallback ID");
            }
        };
        fetchCourses();
    }, []);

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
            const apiBase = import.meta.env.VITE_API_URL || 'https://rocket-lms-api-v2.loca.lt';
            const res = await axios.post(`${apiBase}/api/payment/initiate-order`,
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
            const apiBase = import.meta.env.VITE_API_URL || 'https://rocket-lms-api-v2.loca.lt';
            const res = await axios.post(`${apiBase}/api/payment/verify-payment`,
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
                        <h1 className="font-outfit mt-4 hero-title">Explore Upcoming Events & <br/>Secure Your Spot Today</h1>
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

            <section className="blogs-section bg-light py-5 mb-5">
                <div className="container">
                    <div className="badge-wrapper text-center">
                        <span className="badge-small-blue">Read More</span>
                    </div>
                    <h2 className="text-center font-outfit mb-5">Blog and Articles</h2>
                    <p className="text-center text-secondary mb-5">Stay informed with expert-written articles, tips, and insights to support your learning journey daily</p>

                    <div className="blogs-layout">
                        <div className="blog-main">
                            <div className="blog-card large">
                                <img src={blogs[0].img} alt={blogs[0].title} />
                                <div className="blog-overlay">
                                    <h3>{blogs[0].title}</h3>
                                    <div className="blog-meta">
                                        <span>👤 {blogs[0].tutor}</span>
                                        <span>📅 {blogs[0].date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="blog-side-grid">
                            {blogs.slice(1).map(blog => (
                                <div className="blog-card small" key={blog.id}>
                                    <img src={blog.img} alt={blog.title} />
                                    <div className="blog-overlay">
                                        <h4>{blog.title}</h4>
                                        <span>👤 {blog.tutor}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
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

            <section className="newsletter-section container mb-5">
                <div className="newsletter-box">
                    <div className="news-text">
                        <h3>Subscribe to Our Newsletter 😊</h3>
                        <p>Receive expert insights, course updates, and learning resources directly in your inbox and get notified</p>
                    </div>
                    <div className="news-form">
                        <input type="email" placeholder="Enter your email address here" />
                        <button className="btn btn-primary">Join</button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Events;
