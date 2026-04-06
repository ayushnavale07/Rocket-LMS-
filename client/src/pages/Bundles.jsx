import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import './Bundles.css';

const Bundles = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [checkoutDetails, setCheckoutDetails] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccessData, setPaymentSuccessData] = useState(null);

    const [bundles] = useState([
        {
            id: 'b1',
            title: "Become a Probability & Statistics Master",
            img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600",
            price: 25,
            coursesCount: 2,
            instructor: "Prof. Sarah Johnson",
            rating: 5,
            description: "Master the fundamentals of probability and statistics with this comprehensive bundle.",
            courses: ["Probability Basics", "Advanced Statistics"]
        },
        {
            id: 'b2',
            title: "Microsoft Office Beginner to Expert Bundle",
            img: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=600",
            price: 50,
            coursesCount: 4,
            instructor: "Tech Academy",
            rating: 4.8,
            description: "Learn Word, Excel, PowerPoint, and Outlook from scratch to advanced level.",
            courses: ["Excel Mastery", "Word for Professionals", "PowerPoint Design", "Outlook Efficiency"]
        },
        {
            id: 'b3',
            title: "A-Z Web Programming",
            img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
            price: 8,
            coursesCount: 2,
            instructor: "Dev Mastery",
            rating: 4.9,
            description: "Kickstart your web development career with this essential programming bundle.",
            courses: ["HTML & CSS Zero to Hero", "JavaScript Fundamentals"]
        },
        {
            id: 'b4',
            title: "Solar Energy Design Course From Zero To Hero",
            img: "https://images.unsplash.com/photo-1509391366360-fe5bb6583e2c?auto=format&fit=crop&q=80&w=600",
            price: 25,
            coursesCount: 2,
            instructor: "Green Tech Inc.",
            rating: 4.7,
            description: "Learn how to design and implement solar energy systems for residential and commercial use.",
            courses: ["Introduction to Solar Energy", "Solar System Design & Installation"]
        }
    ]);

    const handlePurchase = (bundle) => {
        if (!user) {
            alert("Please login to purchase this bundle!");
            navigate('/auth');
            return;
        }
        setCheckoutDetails({
            userName: user.name,
            email: user.email,
            courseTitle: bundle.title,
            amount: bundle.price,
            bundleId: bundle.id
        });
        setShowCheckoutModal(true);
        setPaymentSuccessData(null);
    };

    const confirmPayment = async () => {
        setIsProcessing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPaymentSuccessData({
            transactionId: `TXN_BNDL_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            date: new Date().toISOString()
        });
        setIsProcessing(false);
    };

    return (
        <div className="bundles-page">
            <Navbar />
            
            <section className="bundles-hero py-5">
                <div className="container">
                    <h1 className="font-outfit">Course Bundles For Maximum Savings</h1>
                    <p className="text-secondary">Unlock more value with curated course bundles. Get multiple premium courses for a single discounted price.</p>
                </div>
            </section>

            <section className="bundles-grid-section container pb-5">
                <div className="bundles-grid">
                    {bundles.map((bundle) => (
                        <div className="bundle-card" key={bundle.id}>
                            <div className="bundle-thumb">
                                <img src={bundle.img} alt={bundle.title} />
                                <span className="bundle-badge">{bundle.coursesCount} Courses</span>
                            </div>
                            <div className="bundle-content">
                                <h3 className="font-outfit">{bundle.title}</h3>
                                <div className="bundle-meta">
                                    <div className="stars">{"⭐".repeat(Math.round(bundle.rating))} <span>({bundle.rating})</span></div>
                                    <div className="instructor">👤 {bundle.instructor}</div>
                                </div>
                                <p className="bundle-desc">{bundle.description}</p>
                                <div className="bundle-courses-list">
                                    <strong>Included Courses:</strong>
                                    <ul>
                                        {bundle.courses.map((c, i) => <li key={i}>✔️ {c}</li>)}
                                    </ul>
                                </div>
                                <div className="bundle-footer">
                                    <div className="bundle-price">
                                        <span className="price">${bundle.price}</span>
                                        <span className="unit">Limited Time Offer</span>
                                    </div>
                                    <button className="btn btn-primary" onClick={() => handlePurchase(bundle)}>Buy Bundle Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {showCheckoutModal && (
                <div className="modal-overlay" onClick={() => setShowCheckoutModal(false)}>
                    <div className="modal-card checkout-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{paymentSuccessData ? 'Purchase Successful' : 'Complete Your Purchase'}</h3>
                            <button className="close-btn" onClick={() => setShowCheckoutModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {!paymentSuccessData ? (
                                <div className="order-summary">
                                    <div className="summary-item"><span>Bundle:</span> <strong>{checkoutDetails?.courseTitle}</strong></div>
                                    <div className="summary-item"><span>Total Amount:</span> <strong className="text-primary">${checkoutDetails?.amount}</strong></div>
                                    <div className="summary-item"><span>User:</span> <strong>{checkoutDetails?.userName}</strong></div>
                                    <p className="mt-3 text-secondary" style={{ fontSize: '0.85rem' }}>By proceeding, you'll get instant access to all courses in this bundle.</p>
                                </div>
                            ) : (
                                <div className="payment-success-msg text-center">
                                    <div className="success-icon" style={{ fontSize: '3rem', marginBottom: '20px' }}>🎉</div>
                                    <h4>Bundle Unlocked!</h4>
                                    <p>You now have access to all courses in this bundle.</p>
                                    <div className="receipt-box mt-4 p-3 bg-light rounded">
                                        <div className="summary-item"><span>Transaction ID:</span> <strong>#{paymentSuccessData.transactionId}</strong></div>
                                        <div className="summary-item"><span>Date:</span> <strong>{new Date(paymentSuccessData.date).toLocaleDateString()}</strong></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            {!paymentSuccessData ? (
                                <>
                                    <button className="btn btn-outline" onClick={() => setShowCheckoutModal(false)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={confirmPayment} disabled={isProcessing}>
                                        {isProcessing ? 'Processing...' : 'Confirm & Pay'}
                                    </button>
                                </>
                            ) : (
                                <button className="btn btn-primary w-100" onClick={() => setShowCheckoutModal(false)}>Start Learning Now</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Bundles;
