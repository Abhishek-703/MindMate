



import React, { useState } from 'react';
import { GoogleIcon } from './icons/SocialIcons';
import * as authService from '../services/authService';

interface SignUpScreenProps {
  onSwitchToLogin: () => void;
  onVerificationRequired: (email: string) => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSwitchToLogin, onVerificationRequired }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (name.trim() && email.trim() && password.trim()) {
      try {
        const { user, session } = await authService.register(name.trim(), email.trim(), password);
        
        if (user && !session) {
            // This case means email confirmation (OTP) is required
            onVerificationRequired(email.trim());
        }
        // If session exists, onAuthStateChange will handle navigation automatically.

      } catch (err: any) {
        setError(err.message);
      }
    }
    setIsLoading(false);
  };

  const handleSocialSignUp = async (provider: 'google') => {
    setError('');
    setIsLoading(true);
    try {
      await authService.socialLogin(provider);
      // onAuthStateChange will handle success
    } catch (err: any) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const isFormValid = name.trim() !== '' && email.trim() !== '' && password.trim() !== '' && !isLoading;

  return (
    <div className="min-h-screen bg-zinc-900 font-sans flex flex-col items-center justify-center text-center p-6 transition-colors duration-300 animate-fadeIn">
      <div className="flex flex-col items-center justify-center text-white space-y-4 max-w-sm w-full">
        <div className="w-full text-left animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            <h1 className="text-3xl font-serif font-bold tracking-tight">
                Create your account
            </h1>
            <p className="text-white/60 mt-1">Start your journey with MindMate.</p>
        </div>

        {error && <p className="text-red-400 text-sm animate-fadeInUp" style={{ animationDelay: '150ms' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} className="w-full space-y-4 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full text-left bg-white/10 placeholder-white/50 border-2 border-white/20 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-white/80 transition-all duration-300"
            required
            disabled={isLoading}
          />
           <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full text-left bg-white/10 placeholder-white/50 border-2 border-white/20 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-white/80 transition-all duration-300"
            required
            disabled={isLoading}
          />
           <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full text-left bg-white/10 placeholder-white/50 border-2 border-white/20 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-white/80 transition-all duration-300"
            required
            disabled={isLoading}
          />
            <button
                type="submit"
                disabled={!isFormValid}
                className="w-full primary-button font-bold py-3 px-12 rounded-full text-base shadow-lg shadow-purple-900/10 disabled:opacity-50"
            >
                {isLoading ? 'Creating...' : 'Create Account'}
            </button>
        </form>

        <div className="flex items-center w-full animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink mx-4 text-white/60 text-xs">OR</span>
            <div className="flex-grow border-t border-white/20"></div>
        </div>

        <div className="w-full space-y-3 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
            <button onClick={() => handleSocialSignUp('google')} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-white/10 border-2 border-white/20 rounded-full py-3 px-4 text-base font-semibold hover:bg-white/20 transition-colors disabled:opacity-50">
                <GoogleIcon />
                Sign up with Google
            </button>
        </div>
        
        <div className="animate-fadeInUp" style={{ animationDelay: '500ms' }}>
          <p className="text-sm text-white/60">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="font-semibold text-white/90 hover:text-white underline">
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;