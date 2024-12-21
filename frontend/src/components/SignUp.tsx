import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useLoggedInUser } from 'src/context/UserContext';
import './styles/signup.css';

const BASE_URL = 'http://localhost:3000';

const Signup: React.FC = () => {
  const { setToken } = useLoggedInUser();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/users/signup`, formData);
      if (response.status === 200) {
        setError('');
        setToken(response.data?.data?.accessToken);
        navigate('/welcome');
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        setError(err.response.data.message.join(', '));
      } else {
        setError('Something went wrong, please try again!');
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create Your Account</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="signup-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="signup-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="signup-input"
          />
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;