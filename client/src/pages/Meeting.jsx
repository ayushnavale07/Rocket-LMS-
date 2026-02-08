import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Events.css'; // Reusing event styles for consistency

const Meeting = () => {
    return (
        <div className="events-page">
            <Navbar />
            <div className="page-header container">
                <h1 className="font-outfit">Book a Meeting</h1>
                <p>Connect with expert tutors for one-on-one sessions.</p>
            </div>

            <div className="container py-5">
                <div className="text-center mb-5">
                    <h2>Available Tutors</h2>
                    <p className="opacity-75">Select a tutor to schedule your session</p>
                </div>

                <div className="event-grid">
                    {[
                        { name: 'Kate Williams', role: 'Laravel Expert', price: 50 },
                        { name: 'Robert Ransdell', role: 'Python Specialist', price: 45 },
                        { name: 'Linda Anderson', role: 'UI/UX Designer', price: 60 }
                    ].map((tutor, i) => (
                        <div className="event-card" key={i}>
                            <div className="event-image">
                                <img src={`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400`} alt={tutor.name} />
                            </div>
                            <div className="event-info">
                                <h3>{tutor.name}</h3>
                                <p className="opacity-75">{tutor.role}</p>
                                <div className="mt-3 font-weight-bold text-primary">${tutor.price} / hour</div>
                                <button className="btn btn-primary w-100 mt-3">Check Availability</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Meeting;
