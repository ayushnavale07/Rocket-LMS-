import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Home.css';

const Rewards = () => {
    return (
        <div className="rewards-page" style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Navbar />
            <div className="container py-5 mt-5">
                <div className="text-center mb-5">
                    <h1 className="font-outfit">My Rewards</h1>
                    <p className="opacity-75">Track your progress and unlock exclusive badges</p>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-4">
                        <div className="card text-center p-4 border-0 shadow-sm" style={{ borderRadius: '24px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏆</div>
                            <h3>850 Points</h3>
                            <p className="text-muted">You're in the top 10% this month!</p>
                            <div className="progress mt-3">
                                <div className="progress-bar bg-primary" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card p-4 border-0 shadow-sm" style={{ borderRadius: '24px' }}>
                            <h3 className="mb-4">Unlocked Badges</h3>
                            <div className="d-flex flex-wrap gap-4">
                                {['Early Bird', 'Consistency King', 'Quiz Master', 'Fast Learner'].map(badge => (
                                    <div key={badge} className="text-center">
                                        <div style={{ width: '80px', height: '80px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 10px' }}>🥇</div>
                                        <div className="font-weight-bold">{badge}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Rewards;
