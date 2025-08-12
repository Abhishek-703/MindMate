
import React, { useState, useEffect, useRef } from 'react';
import JourneyScreen from './components/JourneyScreen';
import Chatbot from './components/Chatbot';
import type { View, AuthView, ChatHistoryRow, ChatSessionRow, MoodsRow, MoodEnum, WeeklyInsightRow } from './types';
import { User } from '@supabase/supabase-js';
import WelcomeScreen from './components/WelcomeScreen';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import ResourcesScreen from './components/ResourcesScreen';
import TopBar from './components/TopBar';
import ProfileScreen from './components/ProfileScreen';
import ChatHistoryPanel from './components/ChatHistoryPanel';
import FloatingChatButton from './components/FloatingChatButton';
import SignUpScreen from './components/SignUpScreen';
import LoginScreen from './components/LoginScreen';
import VerifyOtpScreen from './components/VerifyOtpScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import ResetPasswordScreen from './components/ResetPasswordScreen';
import AccountSettingsScreen from './components/AccountSettingsScreen';
import * as authService from './services/authService';
import { supabase } from './services/supabaseClient';
import { generateChatTitle, parseMoodFromConversation } from './services/geminiService';
import * as insightService from './services/insightService';
import * as moodService from './services/moodService';
import { useToast } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';
import AnimatedIntroScreen from './components/onboarding/AnimatedIntroScreen';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('welcome');
  const [emailForAuth, setEmailForAuth] = useState<string>('');
  
  const [currentView, setCurrentView] = useState<View>('home');
  const [previousView, setPreviousView] = useState<View | null>(null);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward' | 'initial'>('initial');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [showProfile, setShowProfile] = useState(false);
  const [isProfileClosing, setIsProfileClosing] = useState(false);

  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [isHistoryPanelClosing, setIsHistoryPanelClosing] = useState(false);
  
  const [showAccount, setShowAccount] = useState(false);
  const [isAccountClosing, setIsAccountClosing] = useState(false);

  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const [initialChatPrompt, setInitialChatPrompt] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const [moods, setMoods] = useState<MoodsRow[]>([]);
  const [isLoadingMoods, setIsLoadingMoods] = useState(true);
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsightRow[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);

  const [insightProgress, setInsightProgress] = useState({ distinctDays: 0, requiredDays: 3, isReady: false });

  const { showToast } = useToast();
  const allViews: View[] = ['home', 'chat', 'journey', 'resources'];
  const mainScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      setIsInitialized(true);

      if (_event === 'SIGNED_OUT') {
        setAuthView('login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        setIsLoadingMoods(true);
        setIsLoadingInsights(true);
        
        const moodsPromise = supabase
          .from('moods')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        const insightsPromise = supabase
          .from('weekly_insights')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        const [moodsResult, insightsResult] = await Promise.all([moodsPromise, insightsPromise]);
        
        if (moodsResult.error) {
          console.error('Error fetching moods:', moodsResult.error.message);
        } else if (moodsResult.data) {
          setMoods(moodsResult.data);
        }
        setIsLoadingMoods(false);

        if (insightsResult.error) {
            console.error('Error fetching weekly insights:', insightsResult.error.message);
        } else if (insightsResult.data) {
            setWeeklyInsights(insightsResult.data);
        }
        setIsLoadingInsights(false);
      }
    };
    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
      if (currentView === 'chat' && currentUser) {
          insightService.getInsightProgress(currentUser.id).then(setInsightProgress);
      }
  }, [currentView, currentUser]);

  useEffect(() => {
    if (isProfileClosing) {
      const timer = setTimeout(() => setIsProfileClosing(false), 500); 
      return () => clearTimeout(timer);
    }
  }, [isProfileClosing]);

  useEffect(() => {
    if (isHistoryPanelClosing) {
        const timer = setTimeout(() => setIsHistoryPanelClosing(false), 500);
        return () => clearTimeout(timer);
    }
  }, [isHistoryPanelClosing]);
  
  useEffect(() => {
    if (isAccountClosing) {
        const timer = setTimeout(() => setIsAccountClosing(false), 500);
        return () => clearTimeout(timer);
    }
  }, [isAccountClosing]);
  
  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setAuthView('login');
    setCurrentView('home');
    setShowProfile(false);
  };
  
  const handleVerificationRequired = (email: string) => {
    setEmailForAuth(email);
    setAuthView('verify-otp');
  };

  const handlePasswordResetRequest = (email: string) => {
    setEmailForAuth(email);
    setAuthView('reset-password');
  };

  const logNewMood = async (moodToLog: MoodEnum, notes: string, sessionId?: string): Promise<MoodsRow | null> => {
    if (!currentUser) return null;

    const newMood = await moodService.logMood(moodToLog, notes, currentUser.id, sessionId);
    if (newMood) {
        setMoods(prevMoods => [newMood, ...prevMoods]);
    }
    return newMood;
  };

  const deleteMoods = async (idsToDelete: string[]): Promise<boolean> => {
      const { error } = await supabase
        .from('moods')
        .delete()
        .in('id', idsToDelete);

      if (error) {
        console.error('Error deleting moods:', error.message);
        showToast('Failed to delete entries. Please try again.', { type: 'error' });
        return false;
      }
      
      setMoods((currentMoods) => currentMoods.filter((m) => !idsToDelete.includes(m.id)));
      return true;
  };


  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-black" />
    );
  }

  if (!currentUser) {
    switch (authView) {
        case 'welcome':
            return <WelcomeScreen onGetStarted={() => setAuthView('intro-tangle')} />;
        case 'intro-tangle':
            return <AnimatedIntroScreen phase="tangle" onContinue={() => setAuthView('intro-untangle')} />;
        case 'intro-untangle':
            return <AnimatedIntroScreen phase="untangle" onAnimationEnd={() => setAuthView('signup')} />;
        case 'signup':
            return <SignUpScreen onSwitchToLogin={() => setAuthView('login')} onVerificationRequired={handleVerificationRequired} />;
        case 'login':
            return <LoginScreen onSwitchToSignUp={() => setAuthView('signup')} onForgotPassword={() => setAuthView('forgot-password')} />;
        case 'verify-otp':
            return <VerifyOtpScreen email={emailForAuth} onSwitchToLogin={() => setAuthView('login')} />;
        case 'forgot-password':
            return <ForgotPasswordScreen onEmailSent={handlePasswordResetRequest} onBackToLogin={() => setAuthView('login')} />;
        case 'reset-password':
            return <ResetPasswordScreen email={emailForAuth} onPasswordReset={() => { showToast('Password has been reset successfully!', { type: 'success' }); setAuthView('login'); }} />;
        default:
             return <WelcomeScreen onGetStarted={() => setAuthView('signup')} />;
    }
  }
  
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const threshold = 20;
    const isScrolledDown = event.currentTarget.scrollTop > threshold;

    if (isScrolledDown && isTitleVisible) {
      setIsTitleVisible(false);
    } else if (!isScrolledDown && !isTitleVisible) {
      setIsTitleVisible(true);
    }
  };

  const generateAndSaveTitle = async (sessionId: string, historyData: ChatHistoryRow[]) => {
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('title')
        .eq('id', sessionId)
        .single();

      if (sessionError) console.warn(`Could not fetch session ${sessionId} to check for title.`, sessionError.message);
      if (sessionData?.title) return;

      if (historyData.length < 2) return;

      const newTitle = await generateChatTitle(historyData);
      if (!newTitle) return;

      await supabase.from('chat_sessions').update({ title: newTitle }).eq('id', sessionId);
  };

  const analyzeAndLogMood = async (sessionId: string, history: ChatHistoryRow[]) => {
    if (!currentUser) return;

    const { data: existingMood, error: checkError } = await supabase
        .from('moods')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('session_id', sessionId)
        .maybeSingle();

    if (checkError) {
        console.error("Error checking for existing mood log:", checkError.message);
        return;
    }

    const result = await parseMoodFromConversation(history);
    if (!result || !result.mood) {
        return; // Gemini didn't return a mood, do nothing.
    }

    if (existingMood) {
        // Update the existing mood log
        const updatedMood = await moodService.updateMood(existingMood.id, result.mood, result.notes);
        if (updatedMood) {
            setMoods(prev => prev.map(m => m.id === updatedMood.id ? updatedMood : m));
            setTimeout(() => {
                showToast(`I've updated your mood to "${result.mood}" based on our chat.`, { type: 'success' });
            }, 1000);
        }
    } else {
        // Insert a new mood log (logNewMood already handles state update)
        const loggedMood = await logNewMood(result.mood, result.notes, sessionId);
        if (loggedMood) {
            setTimeout(() => {
                showToast(`Based on our chat, I've logged your mood as "${result.mood}".`, { type: 'success' });
            }, 1000);
        }
    }
  };

  const handleEndChatSession = async (sessionId: string) => {
    try {
        const { data: historyData, error: historyError } = await supabase
            .from('chat_history')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (historyError || !historyData || historyData.length < 2) {
            return;
        }

        await Promise.all([
            generateAndSaveTitle(sessionId, historyData),
            analyzeAndLogMood(sessionId, historyData),
        ]);

        if (currentUser) {
           const newInsight = await insightService.checkAndGenerateWeeklyInsight(currentUser.id, currentUser.user_metadata.full_name || "friend");
           if (newInsight) {
               setWeeklyInsights(prev => [newInsight, ...prev]);
               showToast("✨ A new Weekly Insight is ready for you on your Journey tab!", { type: 'success', duration: 8000 });
               insightService.getInsightProgress(currentUser.id).then(setInsightProgress);
           }
        }
    } catch (error) {
        console.error("Error during end-of-session tasks:", error);
    }
  };

  const handleSetCurrentView = (view: View) => {
    if (view === currentView || isTransitioning) return;

    if (currentView === 'chat' && currentSessionId) {
        handleEndChatSession(currentSessionId);
    }

    if (view === 'chat') {
        setCurrentSessionId(null);
    }

    setIsTransitioning(true);
    const oldIndex = allViews.indexOf(currentView);
    const newIndex = allViews.indexOf(view);

    setAnimationDirection(newIndex > oldIndex ? 'forward' : 'backward');
    setPreviousView(currentView);
    setCurrentView(view);
    
    if (mainScrollRef.current) {
        mainScrollRef.current.scrollTop = 0;
    }
    setIsTitleVisible(true);

    setTimeout(() => {
      setPreviousView(null);
      setIsTransitioning(false);
    }, 500);
  };
  
  const handleNavigateToChat = (prompt?: string) => {
    if (prompt) {
      setInitialChatPrompt(prompt);
    }
    handleSetCurrentView('chat');
  };

  const handlePromptHandled = () => {
    setInitialChatPrompt(null);
  };

  const renderView = (viewToRender: View) => {
    if (!currentUser) return null;
    switch (viewToRender) {
      case 'home':
        return <HomeScreen moods={moods} isLoadingMoods={isLoadingMoods} onNavigate={handleSetCurrentView} onNavigateToChat={handleNavigateToChat} user={currentUser} />;
      case 'chat':
        return <Chatbot initialPrompt={initialChatPrompt} onPromptHandled={handlePromptHandled} onScroll={handleScroll} sessionId={currentSessionId} onSessionCreated={setCurrentSessionId} />;
      case 'journey':
        return <JourneyScreen moods={moods} isLoadingMoods={isLoadingMoods} onLogMood={logNewMood} onDeleteMoods={deleteMoods} onNavigate={handleSetCurrentView} onNavigateToChat={handleNavigateToChat} weeklyInsights={weeklyInsights} isLoadingInsights={isLoadingInsights} />;
      case 'resources':
        return <ResourcesScreen moods={moods} />;
      default:
        return null;
    }
  };

  const handleCloseProfile = () => {
    setIsProfileClosing(true);
    setShowProfile(false);
  };

  const handleCloseHistoryPanel = () => {
    setIsHistoryPanelClosing(true);
    setShowHistoryPanel(false);
  }
  
  const handleCloseAccount = () => {
    setIsAccountClosing(true);
    setShowAccount(false);
  };
  
  const handleNavigateToAccount = () => {
    handleCloseProfile();
    setTimeout(() => {
        setShowAccount(true);
    }, 300); // Wait for profile screen to start animating out
  };

  const handleSelectSession = (sessionId: string) => {
    handleSetCurrentView('chat');
    setCurrentSessionId(sessionId);
    handleCloseHistoryPanel();
  };

  const handleNewChat = () => {
    handleSetCurrentView('chat');
    setCurrentSessionId(null);
    handleCloseHistoryPanel();
  };
  
  const gradientMap: Record<View, string> = {
    home: 'gradient-bg-peach',
    chat: 'gradient-bg-cool',
    journey: 'gradient-bg-mood',
    resources: 'gradient-bg-resources',
  };

  const showAnyOverlay = showProfile || showHistoryPanel || showAccount;
  const isScalingDown = showAnyOverlay;
  const isScalingUp = (isProfileClosing && !showHistoryPanel && !showAccount) || 
                      (isHistoryPanelClosing && !showProfile && !showAccount) ||
                      (isAccountClosing && !showProfile && !showHistoryPanel);

  return (
    <div className="relative w-screen max-w-md h-screen max-h-[900px] font-sans flex flex-col overflow-hidden rounded-3xl bg-transparent">
      <ToastContainer />
      <div className="absolute inset-0 z-0">
        {allViews.map((view) => (
          <div
            key={view}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${gradientMap[view]} ${
              (currentView === view && view !== 'resources') ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      
      <div 
        className={`relative z-10 w-full h-full text-[var(--text-primary)] flex flex-col transition-all duration-500 ease-in-out ${
          isScalingDown ? 'animate-scaleDown' : isScalingUp ? 'animate-scaleUp' : ''
        }`}
        style={{ backgroundColor: 'transparent' }}
      >
        <TopBar 
          user={currentUser}
          onProfileClick={() => setShowProfile(true)} 
          onHistoryClick={() => setShowHistoryPanel(true)}
          isTitleVisible={isTitleVisible}
          currentView={currentView}
          insightProgress={insightProgress}
        />
        <main className="relative flex-1 overflow-hidden">
           <div
            ref={mainScrollRef}
            key={currentView}
            className={`absolute inset-0 overflow-y-auto no-scrollbar pb-24 scroll-smooth ${
                currentView === 'resources' ? 'snap-y snap-mandatory scroll-snap-stop-always' : ''
            } ${
                animationDirection === 'initial' ? 'animate-fadeInUp' :
                animationDirection === 'forward' ? 'animate-slideInFromRight' : 'animate-slideInFromLeft'
            }`}
            onScroll={handleScroll}
          >
            {renderView(currentView)}
          </div>

          {previousView && (
            <div
                key={previousView}
                className={`absolute inset-0 overflow-y-auto no-scrollbar pb-24 ${
                    animationDirection === 'forward' ? 'animate-slideOutToLeft' : 'animate-slideOutToRight'
                }`}
            >
                {renderView(previousView)}
            </div>
          )}
        </main>
        
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <BottomNav currentView={currentView} setCurrentView={handleSetCurrentView} />
        </div>
      </div>

      {currentView !== 'chat' && !showAnyOverlay && (
        <FloatingChatButton onClick={() => handleNavigateToChat()} />
      )}

      {showAnyOverlay && (
        <div 
          onClick={showProfile ? handleCloseProfile : showHistoryPanel ? handleCloseHistoryPanel : handleCloseAccount}
          className="absolute inset-0 bg-black/50 z-30 animate-fadeIn"
          aria-hidden="true"
        />
      )}
      {currentUser && (
        <>
            <ProfileScreen 
                isOpen={showProfile}
                onClose={handleCloseProfile}
                onLogout={handleLogout}
                onNavigateToAccount={handleNavigateToAccount}
                user={currentUser}
            />
            <ChatHistoryPanel
                isOpen={showHistoryPanel}
                onClose={handleCloseHistoryPanel}
                onSelectSession={handleSelectSession}
                onNewChat={handleNewChat}
                user={currentUser}
            />
            <AccountSettingsScreen
                isOpen={showAccount}
                onClose={handleCloseAccount}
                user={currentUser}
            />
        </>
      )}
    </div>
  );
};

export default App;