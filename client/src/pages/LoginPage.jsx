import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import PageWrapper from "../components/common/PageWrapper";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        login(data);
      } else {
        setError("Username or password is incorrect");
      }
    } catch (err) {
      setError("Username or password is incorrect");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <PageWrapper>
      <div className="auth-container">
        <motion.div 
          className="auth-card"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 className="mb-2 text-center" style={{ fontSize: "2rem" }} variants={itemVariants}>Welcome Back</motion.h2>
          <motion.p className="text-center mb-6" style={{ color: "var(--text-muted)" }} variants={itemVariants}>Sign in to continue to your dashboard.</motion.p>
          
          {error && <motion.div className="message error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}><span>⚠️</span>{error}</motion.div>}

          <form onSubmit={handleSubmit} className="form-grid">
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </motion.div>
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </motion.div>
            <motion.button type="submit" className="primary-button mt-4" style={{ width: "100%" }} variants={itemVariants}>Login</motion.button>
          </form>
          
          <motion.p className="text-center mt-6" style={{ color: "var(--text-muted)" }} variants={itemVariants}>
            Don't have an account? <Link to="/register" style={{ color: "var(--primary)", fontWeight: "500" }}>Register here</Link>
          </motion.p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

export default LoginPage;
