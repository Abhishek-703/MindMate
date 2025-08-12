

import React, { useState, useRef, useEffect } from 'react';
import * as authService from '../services/authService';

interface VerifyOtpScreenProps {
  email: string;
  onSwitchToLogin: () => void;
}

const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({ email, onSwitchToLogin }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    // Only allow numbers
    if (!/^[0-9]$/.test(value) && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if a number is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(paste)) {
      const newOtp = paste.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the full 6-digit code.');
      setIsLoading(false);
      return;
    }

    try {
      await authService.verifyOtp(email, otpString);
      // Success will be handled by onAuthStateChange in App.tsx
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
            Verify your email
          </h1>
          <p className="text-white/60 mt-2">
            We've sent a 6-digit code to <br /> <span className="font-semibold text-white/90">{email}</span>
          </p>
        </div>

        {error && <p className="text-red-400 text-sm animate-fadeInUp" style={{ animationDelay: '150ms' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} className="w-full space-y-6 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 bg-white/10 placeholder-white/50 border-2 border-white/20 rounded-xl text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-white/80 transition-all duration-300"
                required
                disabled={isLoading}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full primary-button font-bold py-3 px-12 rounded-full text-base shadow-lg shadow-purple-900/10 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        
        <div className="animate-fadeInUp pt-2" style={{ animationDelay: '300ms' }}>
          <p className="text-sm text-white/60">
            Didn't get a code?{' '}
            <button onClick={onSwitchToLogin} className="font-semibold text-white/90 hover:text-white underline">
              Try logging in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpScreen;