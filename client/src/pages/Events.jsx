import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Events = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const events = [
        { id: 1, title: 'DevOps and CI/CD Automation for Modern Teams', tutor: 'Robert Ransdell', price: '$20 - $80', date: 'June 30', status: 'Ongoing', img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400' },
        { id: 2, title: 'Blockchain and Crypto Development for Applications', tutor: 'Robert Ransdell', price: '$15 - $70', date: 'June 12', status: 'Completed', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400' },
        { id: 3, title: 'Cloud Computing Fundamentals for Modern IT Professionals', tutor: 'Robert Ransdell', price: '$30 - $100', date: 'September 10', status: 'Scheduled', img: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400' },
        { id: 4, title: 'Digital Marketing Mastery for High-Impact Growth', tutor: 'Robert Ransdell', price: '$20 - $70', date: 'May 15', status: 'Completed', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400' },
        { id: 5, title: 'Modern Mobile App Development for Android and iOS', tutor: 'Light Moon', price: '$25 - $75', date: 'May 21', status: 'Scheduled', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400' },
        { id: 6, title: 'Practical Cybersecurity Best Practices for Modern Organizations', tutor: 'Light Moon', price: '$45 - $95', date: 'May 10', status: 'Completed', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400' },
    ];

    const blogs = [
        { id: 1, title: 'How to Set Freelance Rates and Negotiate with Confidence', tutor: 'George Hamilton', date: '30 Jun 2021', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600' },
        { id: 2, title: 'Mastering Client Communication to Build Long-Term Freelance', tutor: 'George Hamilton', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400' },
        { id: 3, title: 'Freelancing vs. Full-Time: Which Career Path Suits You Best?', tutor: 'George Hamilton', img: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400' },
        { id: 4, title: 'Top Tools Every Successful Freelancer Uses to Stay Productive', tutor: 'George Hamilton', img: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400' },
        { id: 5, title: 'How to Start Freelancing with No Experience or Clients Today', tutor: 'Admin', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400' },
    ];

    return (
        <div className="events-page">
            <Navbar />

            <section className="events-hero py-5">
                <div className="container">
                    <div className="hero-card-blue p-5 text-center text-white">
                        <div className="badge-white">New Events</div>
                        <h1 className="font-outfit mt-4">Explore Upcoming Events and Secure Your Spot Today With Ease</h1>
                        <p className="opacity-75 mt-3">Explore our upcoming events, join in-person or online sessions, and gain valuable skills and meaningful connections.</p>
                        <div className="hero-links mt-4">
                            <span>Product Design</span> • <span>Development</span> • <span>Marketing</span> • <span>Business</span>
                        </div>
                        <div className="hero-btns mt-5">
                            <button className="btn btn-primary-white">📅 Explore Events</button>
                            <button className="btn btn-outline-white">👥 Event Providers</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="events-grid container mb-5">
                <div className="grid">
                    {events.map(ev => (
                        <div className="event-card" key={ev.id}>
                            <div className="ev-thumb">
                                <img src={ev.img} alt={ev.title} />
                                <span className={`status-badge ${ev.status.toLowerCase()}`}>{ev.status}</span>
                            </div>
                            <div className="ev-body">
                                <h3>{ev.title}</h3>
                                <div className="ev-tutor">👤 {ev.tutor}</div>
                                <div className="ev-bottom">
                                    <span className="ev-price">{ev.price}</span>
                                    <span className="ev-date">📅 {ev.date}</span>
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
                    <div className="text-center mt-5">
                        <button className="btn btn-primary">📘 Blog Posts</button>
                    </div>
                </div>
            </section>

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
