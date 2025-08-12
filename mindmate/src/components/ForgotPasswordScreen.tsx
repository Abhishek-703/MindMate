
import React, { useState } from 'react';
import * as authService from '../services/authService';

interface ForgotPasswordScreenProps {
  onEmailSent: (email: string) => void;
  onBackToLogin: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onEmailSent, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (email.trim()) {
      try {
        await authService.sendPasswordResetEmail(email.trim());
        setIsEmailSent(true);
      } catch (err: any) {
        setError(err.message);
      }
    }
    setIsLoading(false);
  };
  
  if (isEmailSent) {
    return (
        <div className="min-h-screen bg-zinc-900 font-sans flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
            <div className="flex flex-col items-center justify-center text-white space-y-4 max-w-sm w-full">
                <h1 className="text-3xl font-serif font-bold tracking-tight">Check your inbox</h1>
                <p className="text-white/60 mt-2">
                    We've sent a password reset code to <br /> <span className="font-semibold text-white/90">{email}</span>
                </p>
                <button onClick={() => onEmailSent(email)} className="w-full primary-button font-bold py-3 px-12 rounded-full text-base mt-4">
                    Continue
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 font-sans flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
      <div className="flex flex-col items-center justify-center text-white space-y-4 max-w-sm w-full">
        <div className="w-full text-left animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <h1 className="text-3xl font-serif font-bold tracking-tight">
            Forgot Password
          </h1>
          <p className="text-white/60 mt-1">Enter your email to receive a reset code.</p>
        </div>

        {error && <p className="text-red-400 text-sm animate-fadeInUp" style={{ animationDelay: '150ms' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} className="w-full space-y-4 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full text-left bg-white/10 placeholder-white/50 border-2 border-white/20 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-white/80 transition-all duration-300"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!email.trim() || isLoading}
            className="w-full primary-button font-bold py-3 px-12 rounded-full text-base shadow-lg shadow-purple-900/10 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>

        <div className="animate-fadeInUp pt-2" style={{ animationDelay: '300ms' }}>
          <p className="text-sm text-white/60">
            Remembered your password?{' '}
            <button onClick={onBackToLogin} className="font-semibold text-white/90 hover:text-white underline">
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;