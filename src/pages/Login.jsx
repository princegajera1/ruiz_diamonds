import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [actualOtp, setActualOtp] = useState('');

  const navigate = useNavigate();
  const { login, users } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(email, password, rememberMe);
    if (res.success) {
      if (res.role === 'admin' || email.includes('admin') || email === 'princegajera944@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/shop');
      }
    } else {
      setError(res.message);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    const userExists = users.find(u => u.email === resetEmail);
    if (userExists) {
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setActualOtp(generatedOtp);
      alert(`OTP sent to ${resetEmail}: ${generatedOtp} (In a real app, this would be an email)`);
      setOtpSent(true);
    } else {
      alert('Email not found');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (otp === actualOtp) {
      // In a real app, we would update the password in the users array
      alert('Password reset successful! Please login with your new password.');
      setShowForgot(false);
      setOtpSent(false);
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="auth-page container section">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="Enter your email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="Enter your password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="auth-options">
            <label className="remember-me">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
              /> Remember me
            </label>
            <button type="button" className="forgot-password btn-link" onClick={() => setShowForgot(true)}>Forgot Password?</button>
          </div>
          
          <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create Account</Link></p>
        </div>
      </div>

      {showForgot && (
        <div className="auth-modal-overlay">
          <div className="auth-card auth-modal">
            <div className="auth-header">
              <h2>Reset Password</h2>
              <p>{otpSent ? 'Enter OTP and new password' : 'Enter your email to receive OTP'}</p>
            </div>
            
            {!otpSent ? (
              <form onSubmit={handleForgotSubmit} className="auth-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-icon" />
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      required 
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Send OTP</button>
                <button type="button" className="btn btn-outline w-100 mt-2" onClick={() => setShowForgot(false)}>Cancel</button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="auth-form">
                <div className="form-group">
                  <label>Enter 4-Digit OTP</label>
                  <div className="input-with-icon">
                    <Key size={18} className="input-icon" />
                    <input 
                      type="text" 
                      placeholder="XXXX" 
                      required 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input 
                      type="password" 
                      placeholder="New password" 
                      required 
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Reset Password</button>
                <button type="button" className="btn btn-outline w-100 mt-2" onClick={() => setOtpSent(false)}>Back</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
