import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import './Store.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';

const Store = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const products = [
        { id: 'prod-1', title: 'How to Do a Website UX Audit E-book', tutor: 'Admin', price: 20, rating: 0, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400' },
        { id: 'prod-2', title: 'ChatGPT for UI/UX Design E-book', tutor: 'Ricardo Dave', price: 5, rating: 5, image: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&q=80&w=400' },
        { id: 'prod-3', title: 'Practical UI/UX Playbook E-book', tutor: 'Admin', price: 20, rating: 5, image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=400' },
        { id: 'prod-4', title: 'Painting tools', tutor: 'Robert Ransdell', price: 25, rating: 4, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400' },
        { id: 'prod-5', title: 'Advanced microscope', tutor: 'Linda Anderson', price: 290, rating: 5, image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=400' },
        { id: 'prod-6', title: 'Business Software', tutor: 'Robert Ransdell', price: 75, rating: 4, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400' },
    ];

    const plans = [
        { id: 'vip-plan-starter-access', name: 'Starter Access', price: 20, features: ['Unlimited course access', 'Flexible payment options', 'Regular content updates'], icon: '🛡️', duration: '15 Days', subs: 100 },
        { id: 'vip-plan-pro-plus', name: 'Pro Plus', price: 100, features: ['Unlimited course access', 'Flexible payment options', 'Regular content updates', 'Advanced tools'], icon: '📈', popular: true, duration: '30 Days', subs: 1000 },
        { id: 'vip-plan-elite-mastery', name: 'Elite Mastery', price: 40, oldPrice: 50, features: ['Unlimited course access', 'Flexible payment options', 'Regular content updates', 'Exclusive resources'], icon: '💎', duration: '30 Days', subs: 400 },
    ];

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
        const token = localStorage.getItem('token');
        try {
            const targetId = (courseId && courseId.startsWith('6')) ? courseId : validCourseId;
            const res = await axios.post(`${API_BASE_URL}/api/payment/create-order`,
                { courseId: targetId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const { orderId, amount, currency, courseTitle, userName, userEmail, razorpayKeyId } = res.data;

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            document.body.appendChild(script);
            script.onload = () => {
                const options = {
                    key: razorpayKeyId,
                    amount: amount,
                    currency: currency || 'INR',
                    name: 'Rocket LMS',
                    description: courseTitle,
                    order_id: orderId,
                    handler: async (response) => {
                        try {
                            const verifyRes = await axios.post(`${API_BASE_URL}/api/payment/verify-payment`,
                                {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    courseId: targetId
                                },
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            setPaymentSuccessData(verifyRes.data.transaction);
                            setShowCheckoutModal(true);
                        } catch (err) {
                            alert('Enrollment failed: ' + (err.response?.data?.message || 'Unknown error'));
                        }
                    },
                    prefill: { name: userName, email: userEmail },
                    theme: { color: '#3b82f6' }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            };
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to initiate payment. Please log out and log back in.');
        }
    };

    const confirmPayment = async () => { /* handled by Razorpay */ };

    return (
        <div className="store-page">
            <Navbar />

            <section className="store-hero container">
                <div className="badge">Store</div>
                <h1 className="font-outfit text-center">Store Products</h1>
                <p className="text-center">Discover a variety of physical and virtual educational products designed to enhance your learning experience</p>

                <div className="products-grid">
                    {products.map(p => (
                        <div className="product-card" key={p.id}>
                            <div className="product-img">
                                <img src={p.image} alt={p.title} />
                            </div>
                            <div className="product-info">
                                <h3>{p.title}</h3>
                                <div className="product-meta">
                                    <span>👤 {p.tutor}</span>
                                    <div className="stars">{"⭐".repeat(p.rating)}</div>
                                </div>
                                <div className="product-footer">
                                    <span className="price">${p.price}</span>
                                    <button className="btn-buy-mini" onClick={() => handlePurchase(p.id)}>Buy Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4">
                    <button className="btn btn-primary">🛍️ Explore Store</button>
                </div>
            </section>

            <section className="subscription-section bg-light py-5">
                <div className="container">
                    <h2 className="font-outfit text-center mb-5">Subscription Plans For You</h2>
                    <div className="plans-grid">
                        {plans.map(plan => (
                            <div className={`plan-card ${plan.popular ? 'popular' : ''}`} key={plan.name}>
                                {plan.popular && <span className="popular-badge">Populer</span>}
                                <div className="plan-icon">{plan.icon}</div>
                                <h3>{plan.name}</h3>
                                <div className="plan-price">
                                    ${plan.price} {plan.oldPrice && <span className="old-price">${plan.oldPrice}</span>}
                                </div>
                                <ul className="plan-features">
                                    {plan.features.map((f, i) => <li key={i}>✔️ {f}</li>)}
                                </ul>
                                <div className="plan-meta">
                                    <span>🕒 {plan.duration}</span>
                                    <span>👥 {plan.subs} Subs</span>
                                </div>
                                <button className="btn btn-primary w-100 mt-3" onClick={() => handlePurchase(plan.id)}>Become VIP Member</button>
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
                            <h3>{paymentSuccessData ? 'Payment Receipt' : 'Order Summary'}</h3>
                            <button className="close-btn" onClick={() => setShowCheckoutModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {!paymentSuccessData ? (
                                <div className="order-summary">
                                    <div className="summary-item"><span>User:</span> <strong>{checkoutDetails?.userName}</strong></div>
                                    <div className="summary-item"><span>Email:</span> <strong>{checkoutDetails?.email}</strong></div>
                                    <div className="summary-item"><span>Item:</span> <strong>{checkoutDetails?.courseTitle}</strong></div>
                                    <div className="summary-item"><span>Amount:</span> <strong className="text-primary">${checkoutDetails?.amount}</strong></div>
                                    <div className="summary-item"><span>Date:</span> <strong>{new Date().toLocaleString()}</strong></div>
                                </div>
                            ) : (
                                <div className="payment-success-msg text-center">
                                    <div className="success-icon">✅</div>
                                    <h4>Purchase Successful!</h4>
                                    <p>Your item has been successfully purchased.</p>
                                    <div className="receipt-box mt-4">
                                        <div className="summary-item"><span>Transaction ID:</span> <strong>#{Math.random().toString(36).substr(2, 9).toUpperCase()}</strong></div>
                                        <div className="summary-item"><span>Paid At:</span> <strong>{new Date(paymentSuccessData.date).toLocaleString()}</strong></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            {!paymentSuccessData ? (
                                <>
                                    <button className="btn btn-outline" onClick={() => setShowCheckoutModal(false)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={confirmPayment} disabled={isProcessing}>
                                        {isProcessing ? 'Verifying Payment...' : 'Proceed to Pay'}
                                    </button>
                                </>
                            ) : (
                                <button className="btn btn-primary" onClick={() => setShowCheckoutModal(false)}>Done</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Store;
