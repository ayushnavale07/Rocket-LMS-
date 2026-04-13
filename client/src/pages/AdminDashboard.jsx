import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LayoutDashboard, BookOpen, CreditCard, FileText, Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
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
            // Courses
            try {
                const res = await axios.get(`${API_BASE_URL}/api/courses`);
                setCourses(res.data);
            } catch (e) { console.error("Courses fail", e); }

            // Stats
            try {
                const res = await axios.get(`${API_BASE_URL}/api/admin/stats`);
                setStats(res.data);
            } catch (e) { console.error("Stats fail", e); }
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
            } else {
                await axios.post(`${API_BASE_URL}/api/courses`, formData);
            }
            setShowModal(false);
            setEditingCourse(null);
            setFormData({ title: '', price: '', image: '', category: 'Design', instructor: 'Admin', description: '' });
            fetchData();
            alert(editingCourse ? "Updated!" : "Created!");
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this course?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/courses/${id}`);
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
        return <div style={{padding: '4rem', textAlign: 'center'}}><h2>Access Denied</h2></div>;
    }

    return (
        <div className="admin-page">
            <Navbar />
            
            <div className="admin-container">
                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <nav className="admin-nav-list">
                        <div className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                            <LayoutDashboard size={20} /> Overview
                        </div>
                        <div className={`admin-nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
                            <BookOpen size={20} /> Courses
                        </div>
                        <div className={`admin-nav-item ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
                            <CreditCard size={20} /> Payments
                        </div>
                        <div className={`admin-nav-item ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
                            <FileText size={20} /> Content
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="admin-main">
                    <header className="admin-header">
                        <h1 className="admin-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                        {activeTab === 'courses' && (
                            <button className="btn-primary" onClick={() => { setEditingCourse(null); setFormData({ title: '', price: '', image: '', category: 'Design', instructor: 'Admin', description: '' }); setShowModal(true); }}>
                                <Plus size={18} style={{marginRight: '0.5rem'}} /> Add Course
                            </button>
                        )}
                    </header>

                    {loading && (
                        <div style={{display: 'flex', justifyContent: 'center', padding: '4rem'}}>
                            <Loader2 className="animate-spin" size={40} />
                        </div>
                    )}

                    {!loading && activeTab === 'overview' && (
                        <>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-value">₹{stats.revenue}</div>
                                    <div className="stat-label">Total Revenue</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{stats.students}</div>
                                    <div className="stat-label">Students</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{stats.courses}</div>
                                    <div className="stat-label">Active Courses</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{stats.enrollments}</div>
                                    <div className="stat-label">Enrollments</div>
                                </div>
                            </div>

                            <div className="admin-card">
                                <h3 style={{marginBottom: '1rem'}}>Recent Transactions</h3>
                                <div className="table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Student</th>
                                                <th>Course</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.recentPayments.map(p => (
                                                <tr key={p._id}>
                                                    <td>{p.user?.name || 'User'}</td>
                                                    <td>{p.course?.title}</td>
                                                    <td>₹{p.amount}</td>
                                                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {!loading && activeTab === 'courses' && (
                        <div className="admin-card">
                            <div className="table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map(c => (
                                            <tr key={c._id}>
                                                <td><img src={c.image} alt="" style={{width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} /></td>
                                                <td style={{fontWeight: '600'}}>{c.title}</td>
                                                <td>{c.category}</td>
                                                <td>₹{c.price}</td>
                                                <td>
                                                    <button className="btn-icon" onClick={() => openEditModal(c)}><Edit2 size={16} /></button>
                                                    <button className="btn-icon delete" onClick={() => handleDelete(c._id)}><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {!loading && activeTab === 'payments' && (
                         <div className="admin-card">
                            <h3 style={{marginBottom: '1rem'}}>Transaction History</h3>
                            <div className="table-container">
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
                                                <td><code style={{fontSize: '0.8rem'}}>{p._id}</code></td>
                                                <td>{p.user?.name}</td>
                                                <td>₹{p.amount}</td>
                                                <td><span style={{background: '#dcfce7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 'bold'}}>Paid</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                         </div>
                    )}

                    {!loading && activeTab === 'content' && (
                        <div className="admin-card" style={{textAlign: 'center', padding: '4rem'}}>
                            <h3>📝 Content Management</h3>
                            <p style={{color: '#64748b'}}>Manage lessons, videos and course resources here.</p>
                            <button className="btn-primary" style={{marginTop: '1rem'}}>Create New Lesson</button>
                        </div>
                    )}
                </main>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <header style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                            <h3>{editingCourse ? 'Edit Course' : 'Create Course'}</h3>
                            <X size={24} style={{cursor: 'pointer'}} onClick={() => setShowModal(false)} />
                        </header>
                        <form onSubmit={handleCreateOrUpdate}>
                            <div style={{marginBottom: '1rem'}}>
                                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>Title</label>
                                <input type="text" style={{width: '100%', padding: '0.625rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem'}} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            </div>
                            <div style={{marginBottom: '1rem'}}>
                                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>Price (₹)</label>
                                <input type="number" style={{width: '100%', padding: '0.625rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem'}} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                            </div>
                            <div style={{marginBottom: '1rem'}}>
                                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>Category</label>
                                <select style={{width: '100%', padding: '0.625rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem'}} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    <option>Design</option>
                                    <option>Web Development</option>
                                    <option>Technology</option>
                                    <option>Marketing</option>
                                </select>
                            </div>
                            <div style={{marginBottom: '1.5rem'}}>
                                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>Image URL</label>
                                <input type="text" style={{width: '100%', padding: '0.625rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem'}} value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required />
                            </div>
                            <button className="btn-primary" style={{width: '100%'}} type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Course'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default AdminDashboard;
