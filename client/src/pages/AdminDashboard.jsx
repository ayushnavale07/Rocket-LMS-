import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({ title: '', price: '', image: '', category: 'Design', instructor: 'Admin' });
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses`);
            setCourses(res.data);
        };
        fetchCourses();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses/seed`, [newCourse]);
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/courses`);
            setCourses(res.data);
            setNewCourse({ title: '', price: '', image: '', category: 'Design', instructor: 'Admin' });
            alert("Course added successfully!");
        } catch (err) {
            alert("Failed to add course");
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'admin') {
        return <div className="p-5 text-center"><h2>Access Denied. Admins Only.</h2></div>;
    }

    return (
        <div className="admin-page">
            <Navbar />
            <div className="container py-5">
                <h1 className="font-outfit mb-4">Admin Control Panel</h1>
                
                <div className="admin-grid">
                    <section className="admin-form-section">
                        <h3>Add New Course</h3>
                        <form onSubmit={handleCreate} className="admin-form">
                            <input type="text" placeholder="Course Title" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} required />
                            <input type="number" placeholder="Price ($)" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} required />
                            <input type="text" placeholder="Image URL" value={newCourse.image} onChange={e => setNewCourse({...newCourse, image: e.target.value})} required />
                            <select value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value})}>
                                <option>Design</option>
                                <option>Development</option>
                                <option>Marketing</option>
                                <option>Business</option>
                            </select>
                            <button className="btn btn-primary" type="submit" disabled={loading}>
                                {loading ? 'Adding...' : 'Add Course'}
                            </button>
                        </form>
                    </section>

                    <section className="courses-list-section">
                        <h3>Current Courses</h3>
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Price</th>
                                        <th>Category</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(c => (
                                        <tr key={c._id}>
                                            <td>{c.title}</td>
                                            <td>${c.price}</td>
                                            <td>{c.category}</td>
                                            <td>
                                                <button className="btn-icon">✏️</button>
                                                <button className="btn-icon delete">🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
