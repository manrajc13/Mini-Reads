import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Library, Search, List, BookMarked, Sparkles, Star, ArrowRight, Check, BookOpenCheck } from 'lucide-react';
import "./landing-page.css";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("discover");

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1>Discover Your Next Favorite Book</h1>
              <p>
                Mini-Reads helps you find, organize, and track your reading journey with personalized recommendations
                based on your preferences.
              </p>
              <div className="hero-buttons">
                <Link to="/discover" className="btn btn-primary">
                  Start Exploring
                  <ArrowRight className="btn-icon" />
                </Link>
                <Link to="/" className="btn btn-secondary">
                  View Collections
                </Link>
              </div>
            </div>
            <div className="hero-image-container">
              <div className="hero-image-bg"></div>
              <div className="hero-image animate-float">
                <img
                  src="/WhatsApp Image 2025-04-26 at 01.02.58_e522ad55.jpg"
                  alt="Book collection illustration"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need for Your Reading Journey</h2>
            <p>
              Mini-Reads combines powerful features to enhance your reading experience
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Sparkles />
              </div>
              <h3>Personalized Recommendations</h3>
              <p>
                Get book suggestions tailored to your reading preferences and interests
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <List />
              </div>
              <h3>Custom Book Lists</h3>
              <p>
                Create and organize your reading lists by genre, mood, or any category
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Search />
              </div>
              <h3>Advanced Search</h3>
              <p>
                Find books by title, author, or genre with our powerful search tools
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BookMarked />
              </div>
              <h3>Reading Tracker</h3>
              <p>
                Keep track of books you've read, want to read, and are currently reading
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How Mini-Reads Works</h2>
            <p>Get started in just a few simple steps</p>
          </div>

          <div className="steps-container">
            <div className="step-timeline"></div>

            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Create Your Profile</h3>
                  <p>
                    Sign up and tell us about your reading preferences and favorite genres
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Discover New Books</h3>
                  <p>Browse personalized recommendations based on your interests</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Create Book Lists</h3>
                  <p>Organize books into custom collections for easy access</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Track Your Reading</h3>
                  <p>Keep a record of your reading journey and progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Showcase Section */}
      <section id="showcase" className="showcase-section">
        <div className="container">
          <div className="section-header">
            <h2>Explore Mini-Reads Features</h2>
            <p>Take a closer look at what our platform offers</p>
          </div>

          <div className="showcase-tabs">
            <button
              className={`tab-button ${activeTab === "discover" ? "active" : ""}`}
              onClick={() => setActiveTab("discover")}
            >
              <Sparkles className="tab-icon" />
              Discover
            </button>
            <button
              className={`tab-button ${activeTab === "collections" ? "active" : ""}`}
              onClick={() => setActiveTab("collections")}
            >
              <BookOpen className="tab-icon" />
              Collections
            </button>
            <button
              className={`tab-button ${activeTab === "search" ? "active" : ""}`}
              onClick={() => setActiveTab("search")}
            >
              <Search className="tab-icon" />
              Search
            </button>
          </div>

          <div className="showcase-content">
            {activeTab === "discover" && (
              <div className="tab-content animate-fadeIn">
                <div className="tab-text">
                  <h3>Discover New Books</h3>
                  <p>
                    Our recommendation engine analyzes your preferences to suggest books you'll love. 
                    Browse through personalized recommendations based on your favorite genres and reading history.
                  </p>
                  <ul className="feature-list">
                    <li><Check className="check-icon" /> Personalized recommendations</li>
                    <li><Check className="check-icon" /> Genre-based suggestions</li>
                    <li><Check className="check-icon" /> New releases in your favorite categories</li>
                    <li><Check className="check-icon" /> Similar books to ones you've enjoyed</li>
                  </ul>
                  <Link to="/discover" className="tab-link">
                    Explore Discover <ArrowRight className="arrow-icon" />
                  </Link>
                </div>
                <div className="tab-image">
                  <div className="tab-image-bg"></div>
                  <img 
                    src="/WhatsApp Image 2025-04-26 at 01.12.16_b0595e63.jpg" 
                    alt="Discover page screenshot" 
                  />
                </div>
              </div>
            )}

            {activeTab === "collections" && (
              <div className="tab-content animate-fadeIn">
                <div className="tab-text">
                  <h3>Organize Your Books</h3>
                  <p>
                    Create custom book lists to organize your reading. Whether it's "Summer Reads," 
                    "Mystery Favorites," or "Books to Read Next," you can categorize your books however you like.
                  </p>
                  <ul className="feature-list">
                    <li><Check className="check-icon" /> Create unlimited book lists</li>
                    <li><Check className="check-icon" /> Customize list covers and descriptions</li>
                    <li><Check className="check-icon" /> Easily add books from search or recommendations</li>
                    <li><Check className="check-icon" /> Share your collections with friends</li>
                  </ul>
                  <Link to="/" className="tab-link">
                    View Collections <ArrowRight className="arrow-icon" />
                  </Link>
                </div>
                <div className="tab-image">
                  <div className="tab-image-bg"></div>
                  <img 
                    src="/image1.png" 
                    alt="Collections page screenshot" 
                  />
                </div>
              </div>
            )}

            {activeTab === "search" && (
              <div className="tab-content animate-fadeIn">
                <div className="tab-text">
                  <h3>Find Any Book</h3>
                  <p>
                    Our powerful search functionality lets you find books by title, author, or genre. 
                    Filter results to narrow down exactly what you're looking for.
                  </p>
                  <ul className="feature-list">
                    <li><Check className="check-icon" /> Search by title, author, or genre</li>
                    <li><Check className="check-icon" /> Advanced filtering options</li>
                    <li><Check className="check-icon" /> Quick add to your collections</li>
                    <li><Check className="check-icon" /> View detailed book information</li>
                  </ul>
                  <Link to="/" className="tab-link">
                    Try Searching <ArrowRight className="arrow-icon" />
                  </Link>
                </div>
                <div className="tab-image">
                  <div className="tab-image-bg"></div>
                  <img 
                    src="/image.png" 
                    alt="Search functionality screenshot" 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Join thousands of readers who love Mini-Reads</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="star-icon filled" />
                ))}
              </div>
              <p className="testimonial-text">
                "Mini-Reads has completely transformed how I discover new books. The recommendations are spot-on!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <h4>Jane Doe</h4>
                  <p>Avid Reader</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="star-icon filled" />
                ))}
              </div>
              <p className="testimonial-text">
                "I love how easy it is to organize my reading lists. The interface is intuitive and beautiful."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">JS</div>
                <div className="author-info">
                  <h4>John Smith</h4>
                  <p>Book Collector</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="star-icon filled" />
                ))}
                <Star className="star-icon" />
              </div>
              <p className="testimonial-text">
                "The genre-based search is fantastic. I've found so many hidden gems I would have missed otherwise."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">AS</div>
                <div className="author-info">
                  <h4>Alex Smith</h4>
                  <p>Fantasy Enthusiast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>10,000+</h3>
              <p>Books Available</p>
            </div>
            <div className="stat-item">
              <h3>5,000+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Book Genres</p>
            </div>
            <div className="stat-item">
              <h3>15,000+</h3>
              <p>Book Lists Created</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <BookOpenCheck className="cta-icon" />
            <h2>Ready to Start Your Reading Journey?</h2>
            <p>Join Mini-Reads today and discover your next favorite book</p>
            <div className="cta-buttons">
              <Link to="/discover" className="btn btn-primary">
                Get Started
                <ArrowRight className="btn-icon" />
              </Link>
              <Link to="/" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-top">
            <Link to="/" className="footer-logo">
              <Library />
              <span>Mini-Reads</span>
            </Link>
            <p className="footer-tagline">Your personal book discovery platform</p>
          </div>

          <div className="footer-links">
            <div className="footer-links-column">
              <h4>Features</h4>
              <ul>
                <li><Link to="/discover">Discover</Link></li>
                <li><Link to="/">Collections</Link></li>
                <li><Link to="/">Search</Link></li>
                <li><Link to="/">Reading Tracker</Link></li>
              </ul>
            </div>
            <div className="footer-links-column">
              <h4>Company</h4>
              <ul>
                <li><Link to="/">About Us</Link></li>
                <li><Link to="/">Contact</Link></li>
                <li><Link to="/">Careers</Link></li>
                <li><Link to="/">Blog</Link></li>
              </ul>
            </div>
            <div className="footer-links-column">
              <h4>Support</h4>
              <ul>
                <li><Link to="/">Help Center</Link></li>
                <li><Link to="/">Privacy Policy</Link></li>
                <li><Link to="/">Terms of Service</Link></li>
                <li><Link to="/">FAQ</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Mini-Reads. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
