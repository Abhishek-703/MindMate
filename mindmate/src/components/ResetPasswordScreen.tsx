
import React, { useState, useRef, useEffect } from 'react';
import * as authService from '../services/authService';

interface ResetPasswordScreenProps {
  email: string;
  onPasswordReset: () => void;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ email, onPasswordReset }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!/^[0-9]$/.test(value) && value !== '') return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const otpString = otp.join('');
    if (otpString.length !== 6 || newPassword.length < 6) {
      setError('Please enter the 6-digit code and a new password (min. 6 characters).');
      setIsLoading(false);
      return;
    }

    try {
      await authService.resetPassword(email, otpString, newPassword);
      onPasswordReset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 font-sans flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
      <div className="flex flex-col items-center justify-center text-white space-y-4 max-w-sm w-full">
        <div className="w-full text-center animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <h1 className="text-3xl font-serif font-bold tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-white/60 mt-2">
            Enter the code sent to <span className="font-semibold text-white/90">{email}</span> and set a new password.
          </p>
        </div>

        {error && <p className="text-red-400 text-sm animate-fadeInUp" style={{ animationDelay: '150ms' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} className="w-full space-y-6 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <div>
            <label className="block text-left text-xs text-white/60 mb-1 pl-1">Reset Code</label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-12 h-14 bg-white/10 placeholder-white/50 border-2 border-white/20 rounded-xl text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-white/80 transition-all duration-300"
                  required
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>
          
          <div>
              <label className="block text-left text-xs text-white/60 mb-1 pl-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password (min. 6 characters)"
                className="w-full text-left bg-white/10 placeholder-white/50 border-2 border-white/20 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-white/80 transition-all duration-300"
                required
                disabled={isLoading}
              />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6 || newPassword.length < 6}
            className="w-full primary-button font-bold py-3 px-12 rounded-full text-base shadow-lg shadow-purple-900/10 disabled:opacity-50"
          >
            {isLoading ? 'Resetting...' : 'Set New Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;