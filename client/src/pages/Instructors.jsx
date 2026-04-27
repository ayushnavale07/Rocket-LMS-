import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Instructors.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Instructors = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    const instructors = [
        { id: 1, name: 'James Kong', title: 'Master Certified Coach', rating: 3.88, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
        { id: 2, name: 'Jessica Wray', title: 'Network Technician at Cisco', rating: 5.00, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' },
        { id: 3, name: 'John Powe', title: 'IT Director at Cognizant', rating: 5.00, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
        { id: 4, name: 'Kate Williams', title: 'Computer Engineer at Oracle', rating: 3.42, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
        { id: 5, name: 'Linda Anderson', title: 'IT Technician at IBM', rating: 4.63, image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=200' },
        { id: 6, name: 'Robert Ransdell', title: 'System Administrator at Microsoft', rating: 4.75, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    ];

    const [selectedMentor, setSelectedMentor] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

    const handleBookClick = (mentor) => {
        if (!user) {
            alert("Please login to book a session with mentors!");
            navigate('/auth');
            return;
        }
        setSelectedMentor(mentor);
        // Default to mentor's earliest time for convenience
        setBookingTime(mentor.time.split(' ')[3]);
        setIsBookingConfirmed(false);
    };

    const handleConfirmBooking = () => {
        if (!bookingDate || !bookingTime) {
            alert("Please select both date and time for your session.");
            return;
        }
        setIsBookingConfirmed(true);
        // In a real app, you would call an API here to save the meeting
    };

    return (
        <div className="instructors-page">
            <Navbar />

            <section className="instructors-hero container">
                <div className="hero-split">
                    <div className="hero-img-stack">
                        <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600" alt="Instructor" className="main-img" />
                        <div className="floating-info i1">
                            <span>🎓 Start Earning Right Now!</span>
                            <small>$2000/Month</small>
                        </div>
                    </div>
                    <div className="hero-text">
                        <div className="badge">Become Instructor</div>
                        <h1 className="font-outfit">Start Sharing Skills, Build Courses, Earn Revenue</h1>
                        <p>Join our platform, share your expertise, reach thousands of learners, and earn income effortlessly online today.</p>
                        <ul className="check-list">
                            <li>✔️ Flexible Teaching Schedule</li>
                            <li>✔️ Global Student Reach</li>
                            <li>✔️ Earn Extra Income</li>
                        </ul>
                        <button className="btn btn-primary mt-4">💎 Become Instructor</button>
                    </div>
                </div>
            </section>

            <section className="instructors-grid-section bg-white py-5">
                <div className="container">
                    <h2 className="font-outfit text-center mb-5">Expert Instructors</h2>
                    <p className="text-center text-secondary mb-5">Learn from experienced instructors dedicated to delivering practical knowledge, guidance, and real-world expertise</p>
                    <div className="instructors-grid">
                        {instructors.map(inst => (
                            <div className="instructor-card" key={inst.id}>
                                <div className="inst-avatar">
                                    <img src={inst.image} alt={inst.name} />
                                    <span className="verify-badge">✔️</span>
                                </div>
                                <div className="inst-info">
                                    <h3>{inst.name}</h3>
                                    <p>{inst.title}</p>
                                    <div className="inst-rating">⭐ {inst.rating}</div>
                                    <button className="profile-link">👤</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-5">
                        <div className="badge-small">✔️ 400+ skilled instructors available to assist you every step of the way</div>
                        <button className="btn btn-primary mt-3">💎 All Instructors</button>
                    </div>
                </div>
            </section>

            <section className="booking-section py-5" style={{ background: '#1a73e8', color: 'white', padding: '80px 0' }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="badge-white" style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem' }}>Meeting Booking</span>
                        <h2 className="font-outfit mt-3" style={{ fontSize: '2.2rem' }}>Book Sessions With Trusted Mentors</h2>
                        <p className="opacity-75">Unlock tailored learning by booking sessions with verified mentors for personal guidance, support, and faster growth</p>
                    </div>

                    <div className="booking-table-wrapper" style={{ background: 'white', borderRadius: '30px', padding: '40px', color: '#1e293b' }}>
                        <div className="table-header" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 2fr 1fr 0.8fr', gap: '20px', fontSize: '0.8rem', color: '#64748b', fontWeight: '600', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                            <div>Instructor</div>
                            <div>Weekly Hours</div>
                            <div>Total meetings</div>
                            <div>Tutoring Hours</div>
                            <div>Earliest Available Time</div>
                            <div>Hourly Rate</div>
                            <div>Action</div>
                        </div>
                        {[
                            { name: 'Jessica Wray', img: 'https://i.pravatar.cc/100?u=1', weekly: 6.5, total: 0, tutor: 0, time: '18 Jan 2026 08:00AM-09:30AM', rate: '$100' },
                            { name: 'John Powe', img: 'https://i.pravatar.cc/100?u=2', weekly: 13, total: 0, tutor: 0, time: '18 Jan 2026 09:00AM-10:00AM', rate: '$90' },
                            { name: 'Kate Williams', img: 'https://i.pravatar.cc/100?u=3', weekly: 8.5, total: 0, tutor: 0, time: '18 Jan 2026 09:00AM-10:30AM', rate: '$200' },
                            { name: 'Linda Anderson', img: 'https://i.pravatar.cc/100?u=4', weekly: 27.5, total: 0, tutor: 0, time: '18 Jan 2026 08:40AM-09:40AM', rate: '$100' },
                            { name: 'Robert Ransdell', img: 'https://i.pravatar.cc/100?u=5', weekly: 24, total: 2, tutor: 0, time: '18 Jan 2026 09:45AM-10:15AM', rate: '$100' },
                            { name: 'Ricardo Dave', img: 'https://i.pravatar.cc/100?u=6', weekly: 18, total: 0, tutor: 0, time: '18 Jan 2026 09:30AM-10:30AM', rate: '$60' },
                        ].map((mentor, i) => (
                            <div className="table-row" key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 2fr 1fr 0.8fr', gap: '20px', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <img src={mentor.img} alt={mentor.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{mentor.name}</h4>
                                        <div style={{ color: '#fbbf24', fontSize: '0.7rem' }}>⭐⭐⭐⭐⭐</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.9rem' }}>{mentor.weekly}</div>
                                <div style={{ fontSize: '0.9rem' }}>{mentor.total}</div>
                                <div style={{ fontSize: '0.9rem' }}>{mentor.tutor}</div>
                                <div style={{ fontSize: '0.85rem' }}>{mentor.time}</div>
                                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1a73e8' }}>From {mentor.rate}</div>
                                <button
                                    onClick={() => handleBookClick(mentor)}
                                    style={{ background: '#1a73e8', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>Book ➞</button>
                            </div>
                        ))}
                    </div>

                    <div className="finder-teaser mt-5 text-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginTop: '60px' }}>
                        <div className="teaser-text text-left">
                            <h3 className="font-outfit">Need help to find your ideal instructor?</h3>
                            <p className="opacity-75">Use Tutor Finder to easily search and book the ideal instructor by expertise, availability, and teaching style</p>
                            <span style={{ color: 'white', cursor: 'pointer', fontWeight: '600' }}>➞ Instructor Finder</span>
                        </div>
                        <div className="teaser-art" style={{ fontSize: '4rem' }}>📅</div>
                    </div>
                </div>
            </section>

            <section className="finder-section container py-5">
                <div className="finder-content">
                    <div className="finder-text">
                        <div className="badge">Tutor Finder</div>
                        <h2 className="font-outfit">Search, Filter, Book Your Ideal Instructor Easily</h2>
                        <p>Quickly find and book the perfect instructor using advanced filters and flexible booking options to match your learning goals.</p>
                        <div className="finder-stats">
                            <div className="f-stat"><h3>25k</h3><p>Instructors</p></div>
                            <div className="f-stat"><h3>5k+</h3><p>Meetings Conducted</p></div>
                        </div>
                        <button className="btn btn-primary mt-4">🔍 Tutor Finder</button>
                    </div>
                    <div className="finder-img">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600" alt="Students" />
                        <div className="floating-info i2">
                            <span>Filter and Find</span>
                            <small>24k Instructors</small>
                        </div>
                    </div>
                </div>
            </section>

            {selectedMentor && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-card" style={{ background: 'white', padding: '40px', borderRadius: '30px', maxWidth: '500px', width: '90%', textAlign: 'center', color: '#1e293b' }}>
                        {!isBookingConfirmed ? (
                            <>
                                <h3 className="font-outfit" style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Book Session with {selectedMentor.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: '#f8fafc', padding: '20px', borderRadius: '20px', marginBottom: '30px', textAlign: 'left' }}>
                                    <img src={selectedMentor.img} alt={selectedMentor.name} style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                                    <div>
                                        <strong>{selectedMentor.rate}</strong> / Hour
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Availability: {selectedMentor.time}</p>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'left', marginBottom: '25px' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>Choose Preferred Date</label>
                                    <input
                                        type="date"
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                    />
                                </div>

                                <div style={{ textAlign: 'left', marginBottom: '35px' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>Choose Time Slot</label>
                                    <select
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                                        value={bookingTime}
                                        onChange={(e) => setBookingTime(e.target.value)}
                                    >
                                        <option value="">Select a time</option>
                                        <option>08:00 AM</option>
                                        <option>09:00 AM</option>
                                        <option>10:00 AM</option>
                                        <option>11:00 AM</option>
                                        <option>12:00 PM</option>
                                        <option>01:00 PM</option>
                                        <option>02:00 PM</option>
                                        <option>03:00 PM</option>
                                        <option>04:00 PM</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button
                                        onClick={() => setSelectedMentor(null)}
                                        style={{ flex: 1, padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0', background: 'none', cursor: 'pointer', fontWeight: '700' }}>Cancel</button>
                                    <button
                                        onClick={handleConfirmBooking}
                                        style={{ flex: 1, padding: '15px', borderRadius: '15px', border: 'none', background: '#1a73e8', color: 'white', cursor: 'pointer', fontWeight: '700' }}>Confirm Booking</button>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '20px 0' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                                <h3 className="font-outfit" style={{ fontSize: '2rem', marginBottom: '15px' }}>Session Booked!</h3>
                                <p style={{ color: '#64748b', marginBottom: '30px' }}>Your session with **{selectedMentor.name}** has been scheduled for **{bookingDate}** at **{bookingTime}**.</p>
                                <button
                                    onClick={() => setSelectedMentor(null)}
                                    style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', background: '#1a73e8', color: 'white', cursor: 'pointer', fontWeight: '700' }}>Back to Mentors</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Instructors;
