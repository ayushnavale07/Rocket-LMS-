import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SearchResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get('q');

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:5000/api/courses/search?query=${query}`);
                setResults(res.data);
            } catch (err) {
                console.error("Error fetching search results", err);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchResults();
        }
    }, [query]);

    const handlePurchase = (courseId) => {
        if (!user) {
            alert("Please login to enroll in courses!");
            navigate('/auth');
            return;
        }
        // Logic for purchase (same as Home.jsx)
        navigate('/courses');
    };

    return (
        <div className="search-results-page">
            <Navbar />
            
            <div className="container results-container py-5">
                <div className="search-header-main mb-5">
                    <h1 className="font-outfit">Search Results</h1>
                    <p className="text-secondary">Showing results for: <strong>"{query}"</strong></p>
                </div>

                {loading ? (
                    <div className="results-loader">Finding the best courses for you...</div>
                ) : (
                    <div className="results-grid">
                        {results.length > 0 ? (
                            results.map(course => (
                                <div className="result-card" key={course._id}>
                                    <div className="result-thumb">
                                        <img src={course.image} alt={course.title} />
                                        <span className="cat-badge">{course.category}</span>
                                    </div>
                                    <div className="result-info">
                                        <div className="stars">{"⭐".repeat(Math.round(course.rating))}</div>
                                        <h3>{course.title}</h3>
                                        <p className="instructor">by {course.instructor}</p>
                                        <div className="result-footer">
                                            <div className="price-box">
                                                <span className="price">${course.price}</span>
                                                {course.originalPrice > course.price && <span className="old-price">${course.originalPrice}</span>}
                                            </div>
                                            <button className="btn-enroll-mini" onClick={() => handlePurchase(course._id)}>Enroll Now</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                <span className="no-res-icon">🔍</span>
                                <h2>No results found for "{query}"</h2>
                                <p>Try searching for different keywords or categories like "Web Development" or "Design".</p>
                                <button className="btn btn-primary" onClick={() => navigate('/courses')}>Browse All Courses</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default SearchResults;
