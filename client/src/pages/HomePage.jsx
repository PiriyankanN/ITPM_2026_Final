import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../components/common/PageWrapper";
import { AuthContext } from "../context/AuthContext";

function HomePage() {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");

  const services = [
    { 
      title: "Premium Housing", 
      image: "/assets/images/eco/room.png", 
      path: "/rooms",
      desc: "Eco-friendly, verified student rooms with lush views and modern sustainable amenities." 
    },
    { 
      title: "Green Dining", 
      image: "/assets/images/eco/food.png", 
      path: "/food",
      desc: "Healthy, locally-sourced meal plans and campus dining menus tailored for your wellness." 
    },
    { 
      title: "Eco Transit", 
      image: "/assets/images/eco/bus.png", 
      path: "/routes",
      desc: "Sustainable campus shuttle routes and electric bus schedules to keep you moving." 
    },
    { 
      title: "Smart Support", 
      image: "/assets/images/eco/support.png", 
      path: "/inquiries/new",
      desc: "Direct inquiry lines to resolve housing issues quickly through our official channels." 
    }
  ];

  return (
    <PageWrapper>
      <div className="home-eco-wrapper">
        
        {/* 🌿 Hero Section */}
        <section 
          className="hero-eco" 
          style={{ backgroundImage: `url('/assets/images/eco/hero.png')` }}
        >
          <div className="container">
            <motion.div 
              className="hero-content"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span style={{ color: "var(--accent)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "3px", fontSize: "0.9rem", marginBottom: "16px", display: "block" }}>
                Sustainable Campus Life
              </span>
              <h1>Find Student Living Made Easy</h1>
              <p>
                Experience a new standard of campus living. Focus on your academic journey while we manage your sustainable housing, healthy dining, and green transit needs.
              </p>
              <div className="hero-buttons" style={{ justifyContent: "flex-start", gap: "20px" }}>
                {user ? (
                  <Link to="/app">
                    <button className="primary-button" style={{ padding: "16px 44px", fontSize: "1.1rem", borderRadius: "100px" }}>Go to My Dashboard</button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <button className="primary-button" style={{ padding: "16px 44px", fontSize: "1.1rem", borderRadius: "100px" }}>Get Started Now</button>
                    </Link>
                    <Link to="/login">
                      <button className="secondary-button" style={{ padding: "16px 44px", fontSize: "1.1rem", borderRadius: "100px", background: "rgba(255,255,255,0.1)", color: "white", borderColor: "rgba(255,255,255,0.3)" }}>Sign In</button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 🔍 Floating Action Bar */}
        <div className="container" style={{ position: "relative" }}>
          <motion.div 
            className="floating-action-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="action-input-group">
              <span style={{ fontSize: "1.3rem" }}>📍</span>
              <input 
                type="text" 
                placeholder="Search by campus or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ height: "30px", width: "1px", background: "#e2e8f0" }} className="desktop-only" />
            <div className="action-input-group" style={{ flex: 0.6 }}>
              <span style={{ fontSize: "1.3rem" }}>🏡</span>
              <select style={{ border: "none", background: "transparent", fontSize: "1.05rem", width: "100%", color: "var(--text-dark)", fontWeight: "500", cursor: "pointer" }}>
                <option>All Services</option>
                <option>Rooms</option>
                <option>Food</option>
                <option>Transit</option>
              </select>
            </div>
            <button className="primary-button" style={{ borderRadius: "100px", padding: "14px 36px" }}>
              Search Now
            </button>
          </motion.div>
        </div>

        {/* 🏢 Feature Highlight Section */}
        <section className="container">
          <div className="feature-highlight-eco">
            <motion.div 
              className="feature-image-container"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src="/assets/images/eco/feature.png" alt="Sustainable Campus" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 style={{ fontSize: "3rem", color: "var(--secondary)", marginBottom: "24px", lineHeight: "1.1" }}>Your Student Living Companion</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", lineHeight: "1.7", marginBottom: "32px" }}>
                We understand that finding proper housing shouldn't be a hurdle to your education. Our eco-conscious platform simplifies the search, booking, and daily management of student essentials.
              </p>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "40px" }}>
                {[
                  { icon: "✨", text: "Verified Sustainable Accommodations" },
                  { icon: "🍃", text: "Carbon-neutral Shuttle Tracking" },
                  { icon: "🥗", text: "Healthy & Local Dining Access" }
                ].map((item, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", fontSize: "1.1rem", color: "var(--secondary)", fontWeight: "600" }}>
                    <span>{item.icon}</span> {item.text}
                  </li>
                ))}
              </ul>
              <Link to="/rooms">
                <button className="secondary-button" style={{ borderRadius: "100px", padding: "14px 32px" }}>Explore All Services</button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 📦 Service Grid Section */}
        <section style={{ background: "white", padding: "100px 0" }}>
          <div className="container">
            <div className="text-center" style={{ maxWidth: "800px", margin: "0 auto 60px" }}>
              <h2 style={{ fontSize: "2.8rem", color: "var(--secondary)", marginBottom: "16px" }}>Everything You Need to Thrive</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "1.15rem" }}>
                Streamline your campus journey with our integrated modules designed for the modern, environmentally-conscious student.
              </p>
            </div>

            <div className="service-grid-premium">
              {services.map((s, idx) => (
                <motion.div 
                  key={s.title}
                  className="service-card-premium"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                >
                  <div className="card-img-wrapper">
                    <img src={s.image} alt={s.title} />
                  </div>
                  <div className="card-body-premium">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <Link to={s.path}>
                      <button className="primary-button" style={{ width: "100%", borderRadius: "12px" }}>Enter Module</button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 🎓 Bottom CTA */}
        <section className="container mt-8" style={{ paddingBottom: "100px" }}>
          <motion.div 
            style={{ 
              background: "var(--secondary)", 
              borderRadius: "40px", 
              padding: "80px 40px", 
              textAlign: "center",
              position: "relative",
              overflow: "hidden"
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 style={{ fontSize: "3.5rem", color: "white", marginBottom: "16px" }}>Ready for Better Living?</h2>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.25rem", maxWidth: "700px", margin: "0 auto 40px" }}>
                Join thousands of students who have already moved to a smarter, greener campus lifestyle. Start your journey today.
              </p>
              {user ? (
                <Link to="/app">
                  <button className="primary-button" style={{ background: "white", color: "var(--secondary)", padding: "18px 50px", fontSize: "1.2rem", borderRadius: "100px" }}>Go back to Dashboard</button>
                </Link>
              ) : (
                <Link to="/register">
                  <button className="primary-button" style={{ background: "white", color: "var(--secondary)", padding: "18px 50px", fontSize: "1.2rem", borderRadius: "100px" }}>Create Free Account</button>
                </Link>
              )}
            </div>
            {/* Background Decoration */}
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", background: "rgba(34, 197, 94, 0.2)", borderRadius: "50%", filter: "blur(40px)" }} />
            <div style={{ position: "absolute", bottom: "-50px", left: "-50px", width: "300px", height: "300px", background: "rgba(34, 197, 94, 0.1)", borderRadius: "50%", filter: "blur(60px)" }} />
          </motion.div>
        </section>

      </div>
    </PageWrapper>
);
}

export default HomePage;
