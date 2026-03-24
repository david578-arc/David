import React from 'react';
import './WelcomePage.css';

const WelcomePage = ({ onShowLogin, onShowRegister }) => {
    return (
        <div className="home-page">
            <div className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            ⚽ FIFA Management System
                            <span className="hero-subtitle">Professional Tournament Platform</span>
                        </h1>
                        <p className="hero-description">
                            Manage teams, players, matches, and tournaments with a modern, secure, and scalable suite.
                        </p>

                        <div className="cta-group" style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button className="auth-button" onClick={onShowLogin}>Login</button>
                            <button className="auth-button" style={{ background: '#5bbcff' }} onClick={onShowRegister}>Register</button>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="floating-elements">
                            <div className="floating-ball">⚽</div>
                            <div className="floating-trophy">🏆</div>
                            <div className="floating-whistle">📯</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="features-section">
                <h2 className="section-title">Key Features</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔐</div>
                        <h3>Secure Access</h3>
                        <p>JWT-based authentication and role-based authorization for every user.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📈</div>
                        <h3>Rich Analytics</h3>
                        <p>Insights on players, matches, and tournaments with real-time data.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Fast Workflows</h3>
                        <p>Streamlined operations for scheduling, registrations, and reporting.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🤖</div>
                        <h3>AI Assistance</h3>
                        <p>Predictive capabilities to support decisions across the platform.</p>
                    </div>
                </div>
            </div>

            {/* Why Us Section */}
            <section className="why-us-section">
                <div className="container">
                    <h2 className="section-title">Why choose our platform?</h2>
                    <div className="why-grid">
                        <div className="why-item">
                            <div className="why-icon">🏟️</div>
                            <h3>End-to-end tournament control</h3>
                            <p>Plan, schedule, and monitor tournaments from a single, cohesive interface.</p>
                        </div>
                        <div className="why-item">
                            <div className="why-icon">🧭</div>
                            <h3>Intuitive navigation</h3>
                            <p>Modern UX patterns ensure users quickly find what they need with minimal clicks.</p>
                        </div>
                        <div className="why-item">
                            <div className="why-icon">🛡️</div>
                            <h3>Enterprise security</h3>
                            <p>Hardened security baseline with audit trails and secure data handling.</p>
                        </div>
                        <div className="why-item">
                            <div className="why-icon">☁️</div>
                            <h3>Cloud-ready</h3>
                            <p>Built for scalability and reliability across environments and deployments.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="how-section">
                <div className="container">
                    <h2 className="section-title">How it works</h2>
                    <ol className="how-steps" aria-label="How it works steps">
                        <li className="how-step">
                            <div className="step-index">1</div>
                            <div className="step-content">
                                <h3>Create your account</h3>
                                <p>Get started by registering your organization or personal account. Set up roles and permissions.</p>
                                <div className="step-cta">
                                    <button className="step-button" onClick={onShowRegister}>Register Now</button>
                                </div>
                            </div>
                        </li>
                        <li className="how-step">
                            <div className="step-index">2</div>
                            <div className="step-content">
                                <h3>Configure your teams</h3>
                                <p>Add teams, players, and staff. Define rosters and assign roles to kick off your season.</p>
                            </div>
                        </li>
                        <li className="how-step">
                            <div className="step-index">3</div>
                            <div className="step-content">
                                <h3>Schedule matches</h3>
                                <p>Generate fixtures, manage venues, and keep stakeholders informed with automated notifications.</p>
                            </div>
                        </li>
                        <li className="how-step">
                            <div className="step-index">4</div>
                            <div className="step-content">
                                <h3>Analyze and improve</h3>
                                <p>Leverage analytics for player performance, match insights, and strategic decision-making.</p>
                            </div>
                        </li>
                    </ol>
                </div>
            </section>

            {/* Statistics Highlights */}
            <section className="stats-section" aria-label="Statistics highlights">
                <div className="container stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">99.9%</div>
                        <div className="stat-label">Uptime SLA</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">120K+</div>
                        <div className="stat-label">Players Managed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">5x</div>
                        <div className="stat-label">Faster Scheduling</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">24/7</div>
                        <div className="stat-label">Support</div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <div className="container">
                    <h2 className="section-title">What our users say</h2>
                    <div className="testimonials-grid">
                        <blockquote className="testimonial">
                            <p>“Scheduling used to take days. Now it’s done in hours with complete transparency.”</p>
                            <footer>
                                <span className="author">Tournament Director</span>
                                <span className="org">Pro League</span>
                            </footer>
                        </blockquote>
                        <blockquote className="testimonial">
                            <p>“The analytics helped us identify key improvements, resulting in measurable team gains.”</p>
                            <footer>
                                <span className="author">Head Coach</span>
                                <span className="org">Elite FC</span>
                            </footer>
                        </blockquote>
                        <blockquote className="testimonial">
                            <p>“Security and role controls give us peace of mind during high-stakes tournaments.”</p>
                            <footer>
                                <span className="author">Operations Lead</span>
                                <span className="org">International Cup</span>
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* Pricing Overview */}
            <section className="pricing-section" aria-label="Pricing plans">
                <div className="container pricing-grid">
                    <div className="pricing-card">
                        <h3 className="pricing-title">Starter</h3>
                        <p className="pricing-price">Free</p>
                        <ul className="pricing-features">
                            <li>Up to 2 teams</li>
                            <li>Basic scheduling</li>
                            <li>Email support</li>
                        </ul>
                        <button className="pricing-cta" onClick={onShowRegister}>Get Started</button>
                    </div>
                    <div className="pricing-card featured">
                        <h3 className="pricing-title">Professional</h3>
                        <p className="pricing-price">$29/mo</p>
                        <ul className="pricing-features">
                            <li>Unlimited teams</li>
                            <li>Advanced analytics</li>
                            <li>Priority support</li>
                        </ul>
                        <button className="pricing-cta" onClick={onShowRegister}>Start Trial</button>
                    </div>
                    <div className="pricing-card">
                        <h3 className="pricing-title">Enterprise</h3>
                        <p className="pricing-price">Contact us</p>
                        <ul className="pricing-features">
                            <li>Custom SLAs</li>
                            <li>Dedicated success manager</li>
                            <li>Audit & compliance</li>
                        </ul>
                        <button className="pricing-cta" onClick={onShowRegister}>Contact Sales</button>
                    </div>
                </div>
            </section>

            {/* Partners */}
            <section className="partners-section" aria-label="Partners and sponsors">
                <div className="container partners-row">
                    <div className="partner">Partner A</div>
                    <div className="partner">Partner B</div>
                    <div className="partner">Partner C</div>
                    <div className="partner">Partner D</div>
                    <div className="partner">Partner E</div>
                </div>
            </section>

            {/* FAQ */}
            <section className="faq-section" aria-label="Frequently asked questions">
                <div className="container">
                    <h2 className="section-title">Frequently asked questions</h2>
                    <div className="faq-grid">
                        <details className="faq-item">
                            <summary>Can I import existing team data?</summary>
                            <p>Yes, bulk import is available for teams, players, and matches using CSV templates.</p>
                        </details>
                        <details className="faq-item">
                            <summary>How secure is the platform?</summary>
                            <p>We use JWT authentication, data encryption in transit, and role-based access controls.</p>
                        </details>
                        <details className="faq-item">
                            <summary>Do you support live match updates?</summary>
                            <p>Yes, real-time updates and live status indicators are available for supported events.</p>
                        </details>
                        <details className="faq-item">
                            <summary>Is there an API?</summary>
                            <p>Yes, a RESTful API is available for integrations with external systems.</p>
                        </details>
                    </div>
                </div>
            </section>

            {/* Call To Action */}
            <section className="cta-section" aria-label="Get started call to action">
                <div className="container cta-container">
                    <div className="cta-text">
                        <h2>Ready to elevate your tournament operations?</h2>
                        <p>Create your account and explore the platform in minutes.</p>
                    </div>
                    <div className="cta-actions">
                        <button className="cta-primary" onClick={onShowRegister}>Create Account</button>
                        <button className="cta-secondary" onClick={onShowLogin}>I already have an account</button>
                    </div>
                </div>
            </section>

            <div className="home-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>FIFA Management System</h4>
                        <p>Professional football management platform</p>
                    </div>
                    <div className="footer-section">
                        <h4>Get Started</h4>
                        <div className="footer-links">
                            <button onClick={onShowLogin}>Login</button>
                            <button onClick={onShowRegister}>Register</button>
                        </div>
                    </div>
                    <div className="footer-section">
                        <h4>Status</h4>
                        <div className="status-indicators">
                            <span className="status-indicator online">🟢 Online</span>
                            <span className="status-indicator secure">🔒 Secure</span>
                            <span className="status-indicator fast">⚡ Fast</span>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 FIFA Management System. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;


