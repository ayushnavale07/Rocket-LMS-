import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Authenticated state check
    const user = JSON.parse(localStorage.getItem('user'));

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', message: '' });
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [activePlan, setActivePlan] = useState('Pro Plus');
    const [websiteReviews, setWebsiteReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    // Payment States
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
            const apiBase = import.meta.env.VITE_API_URL || 'https://rocket-lms-api-v2.loca.lt';
            const res = await axios.post(`${apiBase}/api/payment/initiate-order`,
                { courseId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setCheckoutDetails({ ...res.data, courseId });
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
            const res = await axios.post('http://localhost:5000/api/payment/verify-payment',
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

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://rocket-lms-api-v2.loca.lt'}/api/courses`);
                setCourses(res.data);
            } catch (err) {
                console.error("Error fetching courses", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/reviews?type=website');
                setWebsiteReviews(res.data);
            } catch (err) {
                console.error("Error fetching reviews", err);
            }
        };

        fetchCourses();
        fetchReviews();
    }, []);

    const handlePostReview = async (e) => {
        e.preventDefault();
        if (!user) {
            showAlertModal("Authentication Required", "Please login to share your experience!");
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/reviews',
                { ...newReview, type: 'website' },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setWebsiteReviews([res.data, ...websiteReviews]);
            setNewReview({ rating: 5, comment: '' });
            alert("Thank you for your feedback!");
        } catch (err) {
            alert("Failed to post review");
        }
    };

    const handleNavClick = (path) => {
        if (path === '/categories') {
            const element = document.getElementById('trending-categories');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        if (['/courses', '/instructors', '/store', '/forums', '/events', '/meeting', '/rewards', '/dashboard'].includes(path) && !user) {
            showAlertModal("Authentication Required", "Please login or sign up first to continue further!");
            return;
        }
        navigate(path);
    };


    return (
        <div className="home">
            <Navbar />

            <section className="hero">
                <div className="container hero-content">
                    <div className="hero-text">
                        <div className="badge-new-ai">⚡ New AI Learning Features Updated! →</div>
                        <h1 className="hero-main-title font-outfit">Start With Top Tutors Worldwide</h1>
                        <p className="hero-sub-text">Join thousands of learners advancing their skills through expert-led courses. Connect with top instructors, learn anytime, and unlock new career opportunities on one platform.</p>
                        <div className="hero-btns">
                            <button className="btn btn-primary btn-enroll" onClick={() => navigate('/courses')}>
                                <span className="icon">🎓</span> Enroll on Courses
                            </button>
                            <button className="btn-book-meeting" onClick={() => navigate('/meeting')}>
                                <span className="icon">📅</span> Book a Meeting
                            </button>
                        </div>
                        <div className="hero-trust-badge">
                            <div className="avatar-group">
                                <img src="https://i.pravatar.cc/100?u=1" alt="student" />
                                <img src="https://i.pravatar.cc/100?u=2" alt="student" />
                                <img src="https://i.pravatar.cc/100?u=3" alt="student" />
                                <img src="https://i.pravatar.cc/100?u=4" alt="student" />
                            </div>
                            <div className="trust-info">
                                <div className="stars">⭐⭐⭐⭐⭐</div>
                                <span>Trusted by 2,500+ Successful Students</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image-new">
                        <div className="image-grid-stack">
                            <div className="img-box top-left"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400" alt="Student" /></div>
                            <div className="img-box center-main"><img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500" alt="Student" /></div>
                            <div className="img-box bottom-right"><img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400" alt="Student" /></div>
                            <div className="rotating-badge">
                                <svg viewBox="0 0 100 100" width="100" height="100">
                                    <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0 " fill="none" />
                                    <text fontSize="8">
                                        <textPath href="#circlePath">Courses in Different Categories • 2500+ • </textPath>
                                    </text>
                                </svg>
                                <div className="badge-center">+</div>
                            </div>
                            <div className="start-now-card">
                                <span className="avatar-mini">🎓</span>
                                <div className="text">
                                    <strong>Start Now!</strong>
                                    <p>Learning Anywhere, Anytime</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats-bar-new container">
                <div className="stats-dark-container">
                    <div className="stat-box">
                        <div className="icon blue"><span className="inner-icon">💼</span></div>
                        <div className="info">
                            <h3>257</h3>
                            <p>Skillful Instructors</p>
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="icon green"><span className="inner-icon">🎓</span></div>
                        <div className="info">
                            <h3>508</h3>
                            <p>Happy Students</p>
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="icon red"><span className="inner-icon">🎬</span></div>
                        <div className="info">
                            <h3>29</h3>
                            <p>Professional Courses</p>
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="icon yellow"><span className="inner-icon">🏢</span></div>
                        <div className="info">
                            <h3>6</h3>
                            <p>Official Organizations</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Grid Section */}
            <section className="course-section container">
                <div className="section-header">
                    <h2 className="font-outfit">Featured Courses</h2>
                    <p>Explore our top-rated courses, handpicked to boost your skills and accelerate your learning journey.</p>
                </div>

                {/* Large Featured Card (New UI) */}
                <div className="large-featured-card">
                    <div className="card-content">
                        <h3 className="font-outfit">Health And Fitness Masterclass</h3>
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                        <div className="instructor-minimal">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" alt="Jessica" />
                            <span>Jessica Wray <span>in Health & Fitness</span></span>
                        </div>
                        <p>Transform your lifestyle with this all-in-one masterclass. Learn effective workouts, balanced nutrition, and wellness habits guided by experts. Perfect for all fitness levels...</p>
                        <ul className="course-perks">
                            <li>✔️ Personalized workout plans</li>
                            <li>✔️ Nutrition and meal guidance</li>
                            <li>✔️ Daily fitness challenges</li>
                        </ul>
                        <div className="price-tag">$25 <span className="old-price">$35</span></div>
                        <button className="btn btn-primary" onClick={() => handlePurchase('67a1da90cc0f970678dcf49b')}>Enroll in Course</button>
                    </div>
                    <div className="card-image">
                        <img src="https://images.unsplash.com/photo-1549576490-b0b4831da60a?auto=format&fit=crop&q=80&w=800" alt="Fitness" />
                    </div>
                </div>

                <div className="course-grid">
                    {loading ? (
                        <p>Loading courses...</p>
                    ) : (
                        courses.slice(0, 4).map(course => (
                            <div className="course-card" key={course._id}>
                                <div className="course-thumb">
                                    <img src={course.image} alt={course.title} />
                                    <span className="category-badge">{course.category}</span>
                                </div>
                                <div className="course-info">
                                    <div className="stars">{"⭐".repeat(Math.round(course.rating))}</div>
                                    <h3>{course.title}</h3>
                                    <div className="instructor">by {course.instructor}</div>
                                    <div className="course-footer">
                                        <div className="price">
                                            {course.price === 0 ? "Free" : `$${course.price}`}
                                            {course.originalPrice > course.price && <span className="old-price">${course.originalPrice}</span>}
                                        </div>
                                        <button className="btn-buy" onClick={() => handlePurchase(course._id)}>Buy Now</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Trending Categories */}
            <section id="trending-categories" className="categories-section container">
                <div className="section-header">
                    <div className="badge-trending">Trending</div>
                    <h2 className="font-outfit">Trending Categories</h2>
                </div>
                <div className="categories-grid-new">
                    {[
                        { name: "Management", count: 2, icon: "📁", color: "#eef2ff", iconColor: "#4f46e5" },
                        { name: "Business Strategy", count: 2, icon: "🎯", color: "#fffbeb", iconColor: "#d97706" },
                        { name: "Lifestyle", count: 3, icon: "✨", color: "#f0fdf4", iconColor: "#16a34a" },
                        { name: "Health & Fitness", count: 1, icon: "🍎", color: "#fef2f2", iconColor: "#dc2626" },
                        { name: "Science", count: 3, icon: "🔬", color: "#f5f3ff", iconColor: "#7c3aed" },
                        { name: "Design", count: 9, icon: "🎨", color: "#ecfeff", iconColor: "#0891b2" },
                        { name: "Web Development", count: 7, icon: "💻", color: "#fff7ed", iconColor: "#ea580c" },
                        { name: "Marketing", count: 0, icon: "📈", color: "#fdf2f8", iconColor: "#db2777" },
                    ].map(cat => (
                        <div className="category-card-new" key={cat.name}>
                            <div className="cat-icon-box" style={{ backgroundColor: cat.color, color: cat.iconColor }}>
                                {cat.icon}
                            </div>
                            <div className="cat-info">
                                <h3>{cat.name}</h3>
                                <p>{cat.count} Courses</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* New Events Section (PNG 3) */}
            <section className="events-banner-section container">
                <div className="events-dark-banner">
                    <div className="events-badge">New Events</div>
                    <h2 className="font-outfit text-white">Explore Upcoming Events and Secure Your Spot Today With Ease</h2>
                    <p>Explore our upcoming events, join in-person or online sessions, and gain valuable skills and meaningful connections.</p>
                    <div className="events-tags">
                        <span>Product Design</span> • <span>Development</span> • <span>Marketing</span> • <span>Business</span>
                    </div>
                    <div className="events-actions">
                        <button className="btn btn-primary" onClick={() => navigate('/events')}>
                            <span>📅</span> Explore Events
                        </button>
                        <button className="btn-outline-white" onClick={() => navigate('/instructors')}>
                            <span>👥</span> Event Providers
                        </button>
                    </div>
                </div>
            </section>

            {/* Bundle Teaser Section */}
            <section className="horizontal-section bundle-teaser bg-light">
                <div className="container hs-container">
                    <div className="hs-intro">
                        <h2 className="font-outfit">Course Bundles For Maximum Savings</h2>
                        <p>Unlock more value with curated course bundles. Get multiple courses at a discounted price.</p>
                        <button className="view-more" onClick={() => handleNavClick('/bundles')}>View More ➔</button>
                    </div>
                    <div className="hs-grid">
                        {[
                            { title: "Become a Probability & Statistics Master", img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=400", price: 25, courses: 2, instructor: "Prof. Sarah Johnson", rating: 5 },
                            { title: "Microsoft Office Beginner to Expert Bundle", img: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=400", price: 50, courses: 4, instructor: "Tech Academy", rating: 4.8 },
                            { title: "A-Z Web Programming", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400", price: 8, courses: 2, instructor: "Dev Mastery", rating: 4.9 },
                        ].map((bundle, idx) => (
                            <div className="hs-card" key={idx}>
                                <div className="hs-thumb">
                                    <img src={bundle.img} alt={bundle.title} />
                                    <span className="hs-promo">BUNDLE</span>
                                </div>
                                <div className="hs-info">
                                    <h3>{bundle.title}</h3>
                                    <div className="stars">{"⭐".repeat(Math.round(bundle.rating))} ({bundle.rating})</div>
                                    <div className="instructor-row">
                                        👤 {bundle.instructor}
                                    </div>
                                    <div className="hs-footer">
                                        <span className="hs-price">${bundle.price}</span>
                                        <span className="hs-duration">{bundle.courses} Courses</span>
                                    </div>
                                    <button className="btn-buy mt-2 w-100" onClick={() => handlePurchase('bundle-' + idx)}>Buy Bundle</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bestsellers Section (Blue) */}
            <section className="horizontal-section bestseller-blue">
                <div className="container hs-container">
                    <div className="hs-intro">
                        <h2 className="font-outfit">Bestsellers Chosen by Our Students</h2>
                        <p>Explore our top-selling courses, chosen by thousands of learners who've enrolled and benefitted.</p>
                        <button className="view-more" onClick={() => handleNavClick('/courses')}>View More ➔</button>
                    </div>
                    <div className="hs-grid">
                        {courses.filter(c => ['Excel from Beginner to Advanced', 'New In-App Live System', 'Learn Linux in 5 Days'].includes(c.title)).map((course, idx) => (
                            <div className="hs-card" key={idx}>
                                <div className="hs-thumb">
                                    <img src={course.image} alt={course.title} />
                                    {course.originalPrice > course.price && <span className="hs-promo">PROMO</span>}
                                </div>
                                <div className="hs-info">
                                    <h3>{course.title}</h3>
                                    <div className="stars">{"⭐".repeat(Math.round(course.rating))} (1)</div>
                                    <div className="instructor-row">
                                        👤 {course.instructor} In {course.category}
                                    </div>
                                    <div className="hs-footer">
                                        <span className="hs-price">{course.price === 0 ? "Free" : `$${course.price}`}</span>
                                        <button className="btn-buy" onClick={() => handlePurchase(course._id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Buy Now</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Rated Section (Dark) */}
            <section className="horizontal-section toprated-dark">
                <div className="container hs-container">
                    <div className="hs-intro">
                        <h2 className="font-outfit">Top Rated Courses</h2>
                        <p>Handpicked courses with exceptional ratings from our global learning community.</p>
                        <button className="view-more" onClick={() => handleNavClick('/courses')}>View More ➔</button>
                    </div>
                    <div className="hs-grid">
                        {courses.filter(c => c.rating >= 4.9).slice(0, 3).map((course, idx) => (
                            <div className="hs-card dark" key={idx}>
                                <div className="hs-thumb">
                                    <img src={course.image} alt={course.title} />
                                </div>
                                <div className="hs-info">
                                    <h3>{course.title}</h3>
                                    <div className="stars">{"⭐".repeat(Math.round(course.rating))}</div>
                                    <div className="instructor-row">
                                        👤 {course.instructor}
                                    </div>
                                    <div className="hs-footer">
                                        <span className="hs-price">${course.price}</span>
                                        <button className="btn-buy" onClick={() => handlePurchase(course._id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Buy Now</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Subscription Plans Section (PNG 4) */}
            <section className="subscription-section-new py-5">
                <div className="container">
                    <h2 className="font-outfit text-center mb-5">Subscription Plans For You</h2>
                    <div className="plans-grid-new">
                        {[
                            { name: 'Starter Access', price: 20, features: ['Unlimited course access', 'Flexible payment options', 'Regular content updates'], icon: '🛡️', duration: '15 Days', subs: 100 },
                            { name: 'Pro Plus', price: 100, features: ['Unlimited course access', 'Flexible payment options', 'Regular content updates', 'Advanced tools'], icon: '📈', popular: true, duration: '30 Days', subs: 1000 },
                            { name: 'Elite Mastery', price: 40, oldPrice: 50, features: ['Unlimited course access', 'Flexible payment options', 'Regular content updates', 'Exclusive resources'], icon: '💎', duration: '30 Days', subs: 400 },
                        ].map(plan => (
                            <div
                                className={`plan-card-new ${activePlan === plan.name ? 'active' : ''}`}
                                key={plan.name}
                                onClick={() => setActivePlan(plan.name)}
                            >
                                {plan.popular && <span className="populer-badge">Populer</span>}
                                <div className="plan-icon">
                                    <span className={`icon-img ${plan.name === 'Starter Access' ? 'blue' : plan.name === 'Pro Plus' ? 'green' : 'cyan'}`}>
                                        {plan.icon}
                                    </span>
                                </div>
                                <h3 className="plan-name">{plan.name}</h3>
                                <div className="plan-price">
                                    <span className="current">${plan.price}</span>
                                    {plan.oldPrice && <span className="old">${plan.oldPrice}</span>}
                                </div>
                                <ul className="plan-features">
                                    {plan.features.map((f, i) => <li key={i}><span className="check">✔️</span> {f}</li>)}
                                </ul>
                                <div className="plan-footer-info">
                                    <span>🕒 {plan.duration}</span>
                                    <span>👥 {plan.subs} Subs</span>
                                </div>
                                <button className="btn btn-primary w-100" onClick={() => handlePurchase('vip-plan-' + plan.name.toLowerCase().replace(' ', '-'))}>Become VIP Member</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="live-classes-section py-5">
                <div className="container text-center">
                    <div className="badge-small-blue">Live Classes</div>
                    <h2 className="font-outfit mt-3">Experience Interactive High Quality Live Classes</h2>
                    <p className="text-secondary mb-5">Join our interactive high quality live classes to experience real-time learning, collaboration, and immediate instructor feedback today.</p>

                    <div className="live-img-box">
                        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000" alt="Live Class" />
                        <div className="play-btn-pulse">▶️</div>
                        <span className="live-overlay-badge">Enjoy Live Classes!</span>
                    </div>

                    <div className="rewards-grid mt-5">
                        <div className="rewards-text text-left">
                            <div className="badge-small-blue">Reward Points</div>
                            <h2 className="font-outfit">Earn Reward Points For Every Learning Activity</h2>
                            <p className="text-secondary">Stay motivated and get rewarded as you learn. Earn points for quizzes, assignments, course completions, and engagement, then redeem them for exciting benefits.</p>
                            <button className="btn btn-primary mt-4" onClick={() => navigate('/rewards')}>🎁 Explore Rewards</button>
                            <div className="rewards-stats mt-4">
                                <div><h3 style={{ color: '#1a73e8' }}>300K+</h3><p>Points Collected</p></div>
                                <div style={{ marginLeft: '40px' }}><h3 style={{ color: '#1a73e8' }}>180+</h3><p>Rewards Available</p></div>
                            </div>
                        </div>
                        <div className="rewards-img">
                            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600" alt="Success" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="testimonials-section py-5 bg-light" style={{ paddingBottom: '100px' }}>
                <div className="container">
                    <div className="badge-wrapper text-center">
                        <span className="badge-small-blue" style={{ background: '#e0f2fe', color: '#1a73e8', padding: '6px 16px', borderRadius: '20px', fontWeight: '700' }}>Testimonials</span>
                    </div>
                    <h2 className="font-outfit text-center mb-5 mt-3">Student Reviews and Shared Experiences</h2>
                    <p className="text-center text-secondary mb-5">Discover honest student reviews and inspiring stories about learning experiences and success with our platform</p>

                    <div className="marquee-wrapper">
                        <div className="testimonials-marquee">
                            {(websiteReviews.length > 0 ? websiteReviews : [1, 2, 3, 4]).map((rev, idx) => {
                                const isReal = typeof rev === 'object';
                                return (
                                    <div
                                        className="testimonial-card"
                                        key={idx}
                                        onClick={() => setSelectedTestimonial({
                                            text: isReal ? rev.comment : "I signed up for this platform last year, and it's been an amazing journey of learning and growth.",
                                            user: isReal ? rev.user?.name : "Sarah Mitchell",
                                            role: "Student",
                                            id: isReal ? (rev.user?._id || idx + 10) : idx + 10,
                                            rating: isReal ? rev.rating : 5
                                        })}
                                    >
                                        <p className="text-secondary">"{isReal ? rev.comment : "I signed up for this platform last year, and it's been an amazing journey of learning and growth."}"</p>
                                        <div className="test-user">
                                            <div className="user-info-row">
                                                <img src={isReal ? rev.user?.avatar : `https://i.pravatar.cc/100?u=${idx + 10}`} alt="user" />
                                                <div className="user-meta">
                                                    <h4>{isReal ? rev.user?.name : "Sarah Mitchell"}</h4>
                                                    <p>{isReal ? "Verified Student" : "Graphic Designer"}</p>
                                                </div>
                                            </div>
                                            <div className="stars">{"⭐".repeat(isReal ? rev.rating : 5)}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="post-review-section mt-5 card p-4 shadow-sm">
                        <h3>Share Your Experience</h3>
                        <form onSubmit={handlePostReview}>
                            <div className="form-group mb-3">
                                <label>Rating</label>
                                <select
                                    className="form-control"
                                    value={newReview.rating}
                                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                >
                                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <label>Your Review</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Tell us what you think..."
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit Review</button>
                        </form>
                    </div>
                </div>
            </section>

            {
                selectedTestimonial && (
                    <div className="modal-overlay" onClick={() => setSelectedTestimonial(null)}>
                        <div className="modal-card testimonial-modal" onClick={(e) => e.stopPropagation()}>
                            <button className="close-btn" onClick={() => setSelectedTestimonial(null)}>×</button>
                            <div className="modal-body">
                                <p className="modal-text">"{selectedTestimonial.text}"</p>
                                <div className="test-user large">
                                    <img src={`https://i.pravatar.cc/100?u=${selectedTestimonial.id}`} alt="user" />
                                    <div className="user-meta">
                                        <h4>{selectedTestimonial.user}</h4>
                                        <p>{selectedTestimonial.role}</p>
                                    </div>
                                    <div className="stars">⭐⭐⭐⭐⭐</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                showAuthModal && (
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
                )
            }

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
                                    <div className="summary-item"><span>Course:</span> <strong>{checkoutDetails?.courseTitle}</strong></div>
                                    <div className="summary-item"><span>Rate:</span> <strong className="text-primary">${checkoutDetails?.amount}</strong></div>
                                    <div className="summary-item"><span>Date:</span> <strong>{new Date().toLocaleString()}</strong></div>
                                </div>
                            ) : (
                                <div className="payment-success-msg text-center">
                                    <div className="success-icon">✅</div>
                                    <h4>Enrollment Successful!</h4>
                                    <p>You can now access your course from the dashboard.</p>
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
        </div >
    );
};

export default Home;
