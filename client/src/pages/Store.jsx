import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Store.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Store = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const products = [
        { id: 1, title: 'How to Do a Website UX Audit E-book', tutor: 'Admin', price: 20, rating: 0, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400' },
        { id: 2, title: 'ChatGPT for UI/UX Design E-book', tutor: 'Ricardo Dave', price: 5, rating: 5, image: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&q=80&w=400' },
        { id: 3, title: 'Practical UI/UX Playbook E-book', tutor: 'Admin', price: 20, rating: 5, image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=400' },
        { id: 4, title: 'Painting tools', tutor: 'Robert Ransdell', price: 25, rating: 4, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400' },
        { id: 5, title: 'Advanced microscope', tutor: 'Linda Anderson', price: 290, rating: 5, image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=400' },
        { id: 6, title: 'Business Software', tutor: 'Robert Ransdell', price: 75, rating: 4, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400' },
    ];

    const plans = [
        { name: 'Starter Access', price: 20, features: ['Unlimited course access', 'Flexible payment options', 'Regular content updates'], icon: '🛡️', duration: '15 Days', subs: 100 },
        { name: 'Pro Plus', price: 100, features: ['Unlimited course access', 'Flexible payment options', 'Regular content updates', 'Advanced tools'], icon: '📈', popular: true, duration: '30 Days', subs: 1000 },
        { name: 'Elite Mastery', price: 40, oldPrice: 50, features: ['Unlimited course access', 'Flexible payment options', 'Regular content updates', 'Exclusive resources'], icon: '💎', duration: '30 Days', subs: 400 },
    ];

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
                                <button className="btn btn-primary w-100 mt-3">Become VIP Member</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Store;
