import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../components/common/PageWrapper";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      return setError("All fields are required.");
    }
    
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword })
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! Redirecting to Home...");
        setError("");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(`Error: ${data.message} ${data.error ? "| Details: " + data.error : ""}`);
      }
    } catch (err) {
      setError(`Network/Server crash: ${err.message}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        staggerChildren: 0.08 
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
          style={{ maxWidth: "500px" }}
        >
          <motion.h2 className="mb-2 text-center" style={{ fontSize: "2rem" }} variants={itemVariants}>Create Account</motion.h2>
          <motion.p className="text-center mb-6" style={{ color: "var(--text-muted)" }} variants={itemVariants}>Join the Student Living Assistant platform.</motion.p>
          
          {error && <motion.div className="message error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}><span>⚠️</span>{error}</motion.div>}
          {success && <motion.div className="message success" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}><span>✅</span>{success}</motion.div>}

          <form onSubmit={handleSubmit} className="form-grid">
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </motion.div>
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="student@university.edu"
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
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength="6"
              />
            </motion.div>
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                minLength="6"
              />
            </motion.div>
            <motion.button type="submit" className="primary-button mt-4" style={{ width: "100%" }} variants={itemVariants}>Register</motion.button>
          </form>

          <motion.p className="text-center mt-6" style={{ color: "var(--text-muted)" }} variants={itemVariants}>
            Already have an account? <Link to="/login" style={{ color: "var(--primary)", fontWeight: "500" }}>Login here</Link>
          </motion.p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

export default RegisterPage;
