import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, students: 0, courses: 0, enrollments: 0, recentPayments: [], categoryStats: [] });
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({ title: '', price: '', image: '', category: 'Design', instructor: 'Admin', description: '' });

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [coursesRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/courses`),
                axios.get(`${API_BASE_URL}/api/admin/stats`)
            ]);
            setCourses(coursesRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error("Data fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingCourse) {
                await axios.put(`${API_BASE_URL}/api/courses/${editingCourse._id}`, formData);
                alert("Course updated successfully!");
            } else {
                await axios.post(`${API_BASE_URL}/api/courses`, formData);
                alert("Course added successfully!");
            }
            setShowModal(false);
            setEditingCourse(null);
            setFormData({ title: '', price: '', image: '', category: 'Design', instructor: 'Admin', description: '' });
            fetchData();
        } catch (err) {
            alert("Operation failed: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/courses/${id}`);
            alert("Course deleted");
            fetchData();
        } catch (err) {
            alert("Delete failed");
        }
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            price: course.price,
            image: course.image,
            category: course.category,
            instructor: course.instructor || 'Admin',
            description: course.description || ''
        });
        setShowModal(true);
    };

    if (!user || user.role !== 'admin') {
        return <div className="p-5 text-center"><h2>Access Denied. Admins Only.</h2></div>;
    }

    return (
        <div className="admin-page">
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-lg-2 admin-sidebar">
                        <div className="admin-nav-list">
                            <div className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                                📊 Overview
                            </div>
                            <div className={`admin-nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
                                📚 Courses
                            </div>
                            <div className={`admin-nav-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
                                💰 Payments
                            </div>
                            <div className={`admin-nav-item ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
                                📝 Content
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-lg-10 p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h1 className="font-outfit">Admin Panel - {activeTab.toUpperCase()}</h1>
                            {activeTab === 'courses' && (
                                <button className="btn btn-primary" onClick={() => { setEditingCourse(null); setFormData({ title: '', price: '', image: '', category: 'Design', instructor: 'Admin', description: '' }); setShowModal(true); }}>
                                    + Add New Course
                                </button>
                            )}
                        </div>

                        {activeTab === 'overview' && (
                            <div className="row g-4">
                                <div className="col-md-3">
                                    <div className="stat-card blue">
                                        <span className="label">Total Revenue</span>
                                        <span className="value">₹{stats.revenue}</span>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="stat-card green">
                                        <span className="label">Students</span>
                                        <span className="value">{stats.students}</span>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="stat-card purple">
                                        <span className="label">Active Courses</span>
                                        <span className="value">{stats.courses}</span>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="stat-card orange">
                                        <span className="label">Total Enrollments</span>
                                        <span className="value">{stats.enrollments}</span>
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <div className="admin-card">
                                        <h4 className="mb-3">Recent Transactions</h4>
                                        <div className="table-responsive">
                                            <table className="admin-table">
                                                <thead>
                                                    <tr>
                                                        <th>User</th>
                                                        <th>Course</th>
                                                        <th>Amount</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stats.recentPayments.map(p => (
                                                        <tr key={p._id}>
                                                            <td>{p.user?.name || 'Unknown'}</td>
                                                            <td>{p.course?.title}</td>
                                                            <td>₹{p.amount}</td>
                                                            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="admin-card">
                                        <h4 className="mb-3">Categories Distribution</h4>
                                        {stats.categoryStats.map(c => (
                                            <div key={c._id} className="d-flex justify-content-between mb-2">
                                                <span>{c._id}</span>
                                                <span className="badge bg-primary rounded-pill">{c.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'courses' && (
                            <div className="admin-card">
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Title</th>
                                                <th>Price</th>
                                                <th>Category</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map(c => (
                                                <tr key={c._id}>
                                                    <td><img src={c.image} alt="" style={{ width: '50px', borderRadius: '4px' }} /></td>
                                                    <td className="fw-bold">{c.title}</td>
                                                    <td>₹{c.price}</td>
                                                    <td>{c.category}</td>
                                                    <td>
                                                        <button className="action-btn" onClick={() => openEditModal(c)}>✏️</button>
                                                        <button className="action-btn delete" onClick={() => handleDelete(c._id)}>🗑️</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'payments' && (
                            <div className="admin-card">
                                <h4>Full Transaction History</h4>
                                <p className="text-muted">Detailed view of all payments and revenue streams.</p>
                                {/* Similar table to recent transactions but with more detail or pagination */}
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Transaction ID</th>
                                            <th>Student</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentPayments.map(p => (
                                            <tr key={p._id}>
                                                <td><code>{p._id}</code></td>
                                                <td>{p.user?.name}</td>
                                                <td>₹{p.amount}</td>
                                                <td><span className="badge bg-success">Completed</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'content' && (
                            <div className="admin-card text-center py-5">
                                <h3>🚀 Content Management System</h3>
                                <p>This section is for managing lessons, uploading videos, and resources.</p>
                                <button className="btn btn-outline-primary mt-3">Upload Video Lesson</button>
                                <button className="btn btn-outline-secondary mt-3 ms-2">Manage Resources</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <div className="course-modal-overlay">
                    <div className="course-modal">
                        <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
                        <form onSubmit={handleCreateOrUpdate} className="mt-4">
                            <div className="mb-3">
                                <label className="form-label">Course Title</label>
                                <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Price (₹)</label>
                                <input type="number" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Image URL</label>
                                <input type="text" className="form-control" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <select className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    <option>Design</option>
                                    <option>Web Development</option>
                                    <option>Technology</option>
                                    <option>Management</option>
                                    <option>Marketing</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" className="btn btn-light" onClick={() => setShowModal(false)} disabled={loading}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default AdminDashboard;
