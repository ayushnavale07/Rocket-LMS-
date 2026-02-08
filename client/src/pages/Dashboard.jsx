import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Dashboard.css';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'courses';
    const [activeTab, setActiveTab] = useState(initialTab);
    const user = JSON.parse(localStorage.getItem('user'));

    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const [billingHistory, setBillingHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/auth');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch purchased courses
                const coursesRes = await fetch(`http://localhost:5000/api/courses/enrolled/${userData._id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const coursesData = await coursesRes.json();
                setPurchasedCourses(coursesData);

                // Fetch billing history
                const billingRes = await fetch(`http://localhost:5000/api/payment/history/${userData._id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const billingData = await billingRes.json();
                setBillingHistory(billingData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/dashboard?tab=${tab}`);
    };

    return (
        <div className="dashboard-page">
            <Navbar />
            <div className="container dashboard-container">
                <div className="dashboard-header">
                    <h1 className="font-outfit">My Profile & Learning</h1>
                    <div className="tab-buttons">
                        <button
                            className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
                            onClick={() => handleTabChange('courses')}
                        >
                            📚 My Courses
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
                            onClick={() => handleTabChange('billing')}
                        >
                            💳 Billing History
                        </button>
                    </div>
                </div>

                <div className="dashboard-content">
                    {loading ? (
                        <div className="loader">Loading...</div>
                    ) : activeTab === 'courses' ? (
                        <div className="courses-grid">
                            {purchasedCourses.length > 0 ? (
                                purchasedCourses.map(course => (
                                    <div key={course._id} className="course-card">
                                        <div className="course-image">
                                            <img src={course.image} alt={course.title} />
                                            <span className="badge ongoing">Ongoing</span>
                                        </div>
                                        <div className="course-info">
                                            <h3>{course.title}</h3>
                                            <p className="instructor">👤 {course.instructor}</p>
                                            <div className="progress-bar-container">
                                                <div className="progress-bar" style={{ width: '10%' }}></div>
                                            </div>
                                            <button className="btn btn-primary w-100 mt-2">Continue Learning</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <p>You haven't purchased any courses yet.</p>
                                    <button className="btn btn-outline" onClick={() => navigate('/courses')}>Browse Courses</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="billing-list">
                            {billingHistory.length > 0 ? (
                                <table className="billing-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Course</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Invoice</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billingHistory.map(payment => (
                                            <tr key={payment._id}>
                                                <td>{new Date(payment.paidAt).toLocaleDateString()}</td>
                                                <td>{payment.course?.title || 'Unknown Course'}</td>
                                                <td>${payment.amount}</td>
                                                <td><span className={`status-badge ${payment.status}`}>{payment.status}</span></td>
                                                <td><button className="btn-link">View Bill</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state">
                                    <p>No billing records found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
