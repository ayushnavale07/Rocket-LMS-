import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Courses.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('Newest');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', message: '' });

    // Payment States
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [checkoutDetails, setCheckoutDetails] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccessData, setPaymentSuccessData] = useState(null);

    // Filter States
    const [toggles, setToggles] = useState({ upcoming: false, free: false, discount: false, downloadable: false });
    const [sidebarFilters, setSidebarFilters] = useState({
        types: [],
        priceRange: 1000,
        instructor: 'All',
        rating: 0
    });

    // View More/Less States
    const [showAllDiscounted, setShowAllDiscounted] = useState(false);
    const [showAllFree, setShowAllFree] = useState(false);

    const [upcomingCourses, setUpcomingCourses] = useState([]);

    const discountedCoursesArr = [
        { id: 201, title: 'Excel from Beginner to Advanced', tutor: 'Robert Ransdell', price: 80, oldPrice: 100, discount: '20%', duration: '1:40 Hours', rating: 5, image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400' },
        { id: 202, title: 'Learn and Understand AngularJS', tutor: 'James Kong', price: 16, oldPrice: 20, discount: '20%', duration: '1:00 Hours', rating: 4, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400' },
        { id: 203, title: 'Health And Fitness Masterclass', tutor: 'Jessica Wray', price: 16, oldPrice: 20, discount: '20%', duration: '1:00 Hours', rating: 5, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400' },
        { id: 204, title: 'The Future of Energy', tutor: 'Kate Williams', price: 36, oldPrice: 60, discount: '40%', duration: '1:10 Hours', rating: 3, image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=400' },
        { id: 205, title: 'Deep Learning with PyTorch', tutor: 'Robert Ransdell', price: 45, oldPrice: 90, discount: '50%', duration: '12:00 Hours', rating: 5, image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400' },
        { id: 206, title: 'Modern UI/UX Design', tutor: 'Linda Anderson', price: 25, oldPrice: 50, discount: '50%', duration: '4:30 Hours', rating: 5, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400' }
    ];

    const freeCoursesArr = [
        { id: 301, title: 'Become a Product Manager', tutor: 'Ricardo Dave', rating: 5, duration: '2:30 Hours', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400' },
        { id: 302, title: 'Learn Linux in 5 Days', tutor: 'Robert Ransdell', rating: 5, duration: '7:30 Hours', image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=400' },
        { id: 303, title: 'New Learning Page', tutor: 'Robert Ransdell', rating: 5, duration: '3:30 Hours', image: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&q=80&w=400' },
        { id: 304, title: 'Learn Python Programming', tutor: 'Linda Anderson', rating: 5, duration: '0:35 Hours', image: 'https://images.unsplash.com/photo-1526374870839-e155464bb9b2?auto=format&fit=crop&q=80&w=400' },
        { id: 305, title: 'Introduction to Cloud Computing', tutor: 'Kate Williams', rating: 4, duration: '2:15 Hours', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400' },
        { id: 306, title: 'Cybersecurity Fundamentals', tutor: 'John Powe', rating: 5, duration: '1:50 Hours', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400' }
    ];
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/courses');
                const allFetched = res.data;
                const regular = allFetched.filter(c => !c.isUpcoming);
                const upcoming = allFetched.filter(c => c.isUpcoming);

                let data = regular;

                // Sidebar Type Filter
                if (sidebarFilters.types.length > 0) {
                    data = data.filter(c => sidebarFilters.types.includes(c.type));
                }

                // Price Filter
                data = data.filter(c => c.price <= sidebarFilters.priceRange);

                // Instructor Filter
                if (sidebarFilters.instructor !== 'All') {
                    data = data.filter(c => c.instructor === sidebarFilters.instructor);
                }

                // Rating Filter
                if (sidebarFilters.rating > 0) {
                    data = data.filter(c => Math.round(c.rating) >= sidebarFilters.rating);
                }

                // Toggles
                if (toggles.free) data = data.filter(c => c.price === 0);
                if (toggles.discount) data = data.filter(c => c.originalPrice > c.price);
                if (toggles.upcoming) {
                    data = upcoming;
                }

                // Sort Logic
                if (sortBy === 'Price: Low to High') {
                    data.sort((a, b) => a.price - b.price);
                } else if (sortBy === 'Price: High to Low') {
                    data.sort((a, b) => b.price - a.price);
                }

                setCourses(data);
                setFilteredCourses(data);
                setUpcomingCourses(upcoming);
                setTotalPages(Math.ceil(data.length / 6));
            } catch (err) {
                console.error("Error fetching courses", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [sortBy, toggles, sidebarFilters]);

    const handleTypeChange = (type) => {
        setSidebarFilters(prev => ({
            ...prev,
            types: prev.types.includes(type) ? prev.types.filter(t => t !== type) : [...prev.types, type]
        }));
    };

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
            // Step 1: Initiate Order
            const res = await axios.post('http://localhost:5000/api/payment/initiate-order',
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
            // Simulate Payment Gateway delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Step 2: Verify & Finalize
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





    return (
        <div className="courses-page">
            <Navbar />

            <div className="page-header container">
                <div className="breadcrumbs">Rocket LMS / Courses</div>
                <h1 className="font-outfit">Courses</h1>
                <p>Explore courses and start learning.</p>
                <div className="floating-cap">🎓</div>
            </div>

            <div className="filter-bar container">
                <div className="filter-toggles">
                    <label className="toggle"><input type="checkbox" checked={toggles.upcoming} onChange={() => setToggles(p => ({ ...p, upcoming: !p.upcoming }))} /><span></span> Upcoming</label>
                    <label className="toggle"><input type="checkbox" checked={toggles.free} onChange={() => setToggles(p => ({ ...p, free: !p.free }))} /><span></span> Free</label>
                    <label className="toggle"><input type="checkbox" checked={toggles.discount} onChange={() => setToggles(p => ({ ...p, discount: !p.discount }))} /><span></span> Discount</label>
                    <label className="toggle"><input type="checkbox" checked={toggles.downloadable} onChange={() => setToggles(p => ({ ...p, downloadable: !p.downloadable }))} /><span></span> Downloadable</label>
                </div>
                <div className="sort-options">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option>Newest</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
                    <div className="view-toggles">
                        <button className="active">▩</button>
                        <button>≡</button>
                    </div>
                </div>
            </div>

            <main className="courses-main container">
                <aside className="sidebar">
                    <div className="filter-group">
                        <h4>Type</h4>
                        <label><input type="checkbox" checked={sidebarFilters.types.includes('Live Class')} onChange={() => handleTypeChange('Live Class')} /> Live Class</label>
                        <label><input type="checkbox" checked={sidebarFilters.types.includes('Course')} onChange={() => handleTypeChange('Course')} /> Course</label>
                        <label><input type="checkbox" checked={sidebarFilters.types.includes('Text Lesson')} onChange={() => handleTypeChange('Text Lesson')} /> Text Lesson</label>
                    </div>

                    <div className="filter-group">
                        <h4>Price</h4>
                        <input type="range" min="0" max="1000" value={sidebarFilters.priceRange} onChange={(e) => setSidebarFilters(p => ({ ...p, priceRange: e.target.value }))} />
                        <div className="price-inputs">
                            <span>Free</span>
                            <span>$1,000</span>
                        </div>
                        <div className="current-range-value text-primary mt-1" style={{ fontSize: '0.8rem', fontWeight: '800' }}>Up to ${sidebarFilters.priceRange}</div>
                    </div>

                    <div className="filter-group">
                        <h4>Instructor</h4>
                        <select value={sidebarFilters.instructor} onChange={(e) => setSidebarFilters(p => ({ ...p, instructor: e.target.value }))}>
                            <option value="All">Search and select an instructor</option>
                            <option>Robert Ransdell</option>
                            <option>Kate Williams</option>
                            <option>Ricardo Dave</option>
                            <option>John Powe</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <h4>Rating</h4>
                        <label><input type="radio" name="rating" checked={sidebarFilters.rating === 5} onChange={() => setSidebarFilters(p => ({ ...p, rating: 5 }))} /> ⭐⭐⭐⭐⭐</label>
                        <label><input type="radio" name="rating" checked={sidebarFilters.rating === 4} onChange={() => setSidebarFilters(p => ({ ...p, rating: 4 }))} /> ⭐⭐⭐⭐</label>
                        <label><input type="radio" name="rating" checked={sidebarFilters.rating === 3} onChange={() => setSidebarFilters(p => ({ ...p, rating: 3 }))} /> ⭐⭐⭐</label>
                        <label><button className="btn-clear" onClick={() => setSidebarFilters(p => ({ ...p, rating: 0 }))}>Clear</button></label>
                    </div>
                </aside>

                <section className="course-list">
                    <div className="course-grid">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            filteredCourses.slice((page - 1) * 6, page * 6).map(course => (
                                <div className="course-card-premium" key={course._id} onClick={() => handlePurchase(course._id)}>
                                    <div className="course-thumb">
                                        <img src={course.image} alt={course.title} />
                                        <div className="overlay-badge">
                                            {course.type === 'Text Lesson' ? (
                                                <span className="badge-icon light-blue">📄</span>
                                            ) : course.type === 'Live Class' ? (
                                                <span className="badge-icon light-red">📹</span>
                                            ) : (
                                                <span className="badge-icon light-green">🎥</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="course-info">
                                        <h3 className="course-title-main">{course.title}</h3>
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < Math.round(course.rating) ? "star-active" : "star-inactive"}>⭐</span>
                                            ))}
                                        </div>
                                        <div className="instructor-meta">
                                            <span className="icon">👤</span> {course.instructor} <span className="cat-text">in {course.category}</span>
                                        </div>
                                        <div className="course-card-footer">
                                            <div className="price-section">
                                                <span className="current-price">${course.price}</span>
                                                {course.originalPrice > course.price && <span className="discounted-price">${course.originalPrice}</span>}
                                            </div>
                                            <div className="duration-info">
                                                <span>🕒 {course.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="pagination">
                        <button className="prev" onClick={() => setPage(p => Math.max(1, p - 1))}>‹</button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i + 1} className={page === (i + 1) ? "active" : ""} onClick={() => setPage(i + 1)}>{i + 1}</button>
                        ))}
                        <button className="next" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>›</button>
                    </div>
                </section>
            </main>

            <section className="upcoming-section py-5 bg-white">
                <div className="container">
                    <div className="badge-wrapper text-center">
                        <span className="badge-small-blue">Upcoming</span>
                    </div>
                    <h2 className="font-outfit text-center mb-5">Explore Upcoming Courses</h2>
                    <p className="text-center text-secondary mb-5">Stay ahead with fresh courses launching soon, designed to expand your skills and knowledge further</p>
                    <div className="upcoming-grid">
                        {upcomingCourses.map(course => (
                            <div className="upcoming-card" key={course._id}>
                                <div className="u-image">
                                    <img src={course.image} alt={course.title} />
                                    <span className="date-badge">📅 {course.launchDate}</span>
                                </div>
                                <div className="u-info">
                                    <h3>{course.title}</h3>
                                    <div className="u-meta">
                                        <div className="u-tutor">👤 {course.instructor}</div>
                                        <div className="u-duration">🕒 {course.duration}</div>
                                    </div>
                                    <div className="u-footer">
                                        <span className="price">${course.price}</span>
                                        <button className="btn-buy-now ml-auto" onClick={() => handlePurchase(course._id)}>Buy Now</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-5">
                        <button className="btn btn-primary">📅 View More</button>
                    </div>
                </div>
            </section>

            <section className="discounted-section py-5 primary-dark-bg dark-bg-section">
                <div className="container">
                    <div className="discount-header">
                        <h2 className="font-outfit text-white">Discounted Courses</h2>
                        <p className="text-white opacity-75">Save more now with top courses at discounts</p>
                        <div className="discount-badge-art">
                            %
                        </div>
                    </div>
                    <div className="courses-grid mt-5">
                        {(showAllDiscounted ? discountedCoursesArr : discountedCoursesArr.slice(0, 3)).map(course => (
                            <div className="course-card white-bg" key={course.id} onClick={() => handlePurchase(course.id)}>
                                <div className="course-thumb">
                                    <img src={course.image} alt={course.title} />
                                    <span className="promo-badge">{course.discount} Off</span>
                                </div>
                                <div className="course-info">
                                    <h3>{course.title}</h3>
                                    <div className="stars">{"⭐".repeat(course.rating)} ({course.id % 5 + 1})</div>
                                    <div className="instructor">👤 {course.tutor}</div>
                                    <div className="course-footer">
                                        <div className="price">
                                            ${course.price} <span className="old-price">${course.oldPrice}</span>
                                        </div>
                                        <div className="duration">🕒 {course.duration}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-5">
                        <button className="btn btn-outline-white" onClick={() => setShowAllDiscounted(!showAllDiscounted)}>
                            {showAllDiscounted ? 'View Less' : 'View More'}
                        </button>
                        <p className="text-white mt-3 opacity-75">✔️ Over $240K Saved With Exclusive Course Discounts</p>
                    </div>
                </div>
            </section>

            <section className="free-section py-5 primary-dark-bg dark-bg-section">
                <div className="container">
                    <h2 className="font-outfit text-white text-center mb-3">Free Courses</h2>
                    <p className="text-white text-center opacity-75 mb-5">Access top-quality free courses anytime, expand your skills, and learn without spending a single dollar</p>
                    <div className="courses-grid">
                        {(showAllFree ? freeCoursesArr : freeCoursesArr.slice(0, 3)).map(course => (
                            <div className="course-card white-bg" key={course.id} onClick={() => handlePurchase(course.id)}>
                                <div className="course-thumb">
                                    <img src={course.image} alt={course.title} />
                                </div>
                                <div className="course-info">
                                    <h3>{course.title}</h3>
                                    <div className="stars">{"⭐".repeat(course.rating)} (1)</div>
                                    <div className="instructor">👤 {course.tutor}</div>
                                    <div className="course-footer">
                                        <div className="price text-success">Free</div>
                                        <div className="duration">🕒 {course.duration}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-5">
                        <button className="btn btn-outline-white" onClick={() => setShowAllFree(!showAllFree)}>
                            {showAllFree ? 'View Less' : 'View More'}
                        </button>
                    </div>
                    <div className="free-footer mt-5">
                        <div className="free-footer-text">
                            <h3 className="text-white">Need skills but budget constraints?</h3>
                            <p className="text-white opacity-75">Explore top free courses now and keep advancing your career path with practical, valuable new skills</p>
                            <a href="#" className="text-white font-weight-bold">→ Explore Free Courses</a>
                        </div>
                        <div className="free-art">🎁 FREE</div>
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
        </div>
    );
};

export default Courses;
