import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import './Forums.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Forums = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [topics, setTopics] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTopic, setNewTopic] = useState({ title: '', content: '', category: 'General' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/forum/topics`);
            const data = await res.json();
            setTopics(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTopic = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to create a topic");
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/api/forum/topics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newTopic)
            });
            if (res.ok) {
                setShowCreateModal(false);
                setNewTopic({ title: '', content: '', category: 'General' });
                fetchTopics();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="forums-page">
            <Navbar />

            <section className="forums-hero">
                <div className="container hero-container">
                    <div className="hero-content-box">
                        <div className="badge">Forums</div>
                        <h1 className="font-outfit">Share Ideas, Gain Knowledge, Build Community</h1>
                        <p>Join our interactive community forum to connect with fellow learners, ask questions, share experiences, and exchange ideas on various topics. Engage in meaningful discussions, get valuable insights from peers and experts, and expand your knowledge beyond courses. Build connections and grow your learning network in a supportive environment.</p>

                        <div className="avatar-row">
                            <img src="https://i.pravatar.cc/100?u=1" alt="u1" />
                            <img src="https://i.pravatar.cc/100?u=2" alt="u2" />
                            <img src="https://i.pravatar.cc/100?u=3" alt="u3" />
                            <div className="active-avatar">
                                <img src="https://i.pravatar.cc/100?u=4" alt="u4" />
                                <span className="hi-badge">Hi!</span>
                            </div>
                            <img src="https://i.pravatar.cc/100?u=5" alt="u5" />
                            <img src="https://i.pravatar.cc/100?u=6" alt="u6" />
                            <img src="https://i.pravatar.cc/100?u=7" alt="u7" />
                        </div>

                        <div className="hero-btns">
                            <button className="btn btn-primary" onClick={() => document.getElementById('topics-list').scrollIntoView({ behavior: 'smooth' })}>🌐 Explore Forums</button>
                            <button className="btn btn-outline" onClick={() => setShowCreateModal(true)}>➕ Create a Topic</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="topics-section" id="topics-list">
                <div className="container">
                    <div className="section-header">
                        <h2>Recent Discussions</h2>
                    </div>
                    {loading ? (
                        <div className="loader">Loading topics...</div>
                    ) : (
                        <div className="topics-grid">
                            {topics.length > 0 ? (
                                topics.map(topic => (
                                    <div key={topic._id} className="topic-card">
                                        <div className="topic-header">
                                            <span className="topic-category">{topic.category}</span>
                                            <span className="topic-date">{new Date(topic.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3>{topic.title}</h3>
                                        <p>{topic.content.substring(0, 100)}...</p>
                                        <div className="topic-footer">
                                            <div className="author-info">
                                                <img src={topic.author?.avatar} alt={topic.author?.name} />
                                                <span>{topic.author?.name}</span>
                                            </div>
                                            <div className="topic-meta">
                                                <span>💬 {topic.comments.length}</span>
                                                <span>👁️ {topic.views}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">No topics found. Start a conversation!</div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-header">
                            <h3>Create New Topic</h3>
                            <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreateTopic}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter topic title..."
                                        value={newTopic.title}
                                        onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        className="form-control"
                                        value={newTopic.category}
                                        onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                                    >
                                        <option value="General">General</option>
                                        <option value="Web Development">Web Development</option>
                                        <option value="Design">Design</option>
                                        <option value="Marketing">Marketing</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Content</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        placeholder="What's on your mind?"
                                        value={newTopic.content}
                                        onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Post Topic</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Forums;
