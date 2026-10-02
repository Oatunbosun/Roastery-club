'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Coffee,
  Sparkles,
  Award,
  CreditCard,
  MapPin,
  Clock,
  Calendar,
  LogOut,
  ArrowRight,
  Phone,
  Gift,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  QrCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth, UserProfileData } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';

export default function AccountModal() {
  const {
    user,
    userProfile,
    signIn,
    signInEmail,
    signUpEmail,
    resetPassword,
    signOut,
    updateProfileData,
    userOrders,
    userReservations,
    isAccountModalOpen,
    setIsAccountModalOpen,
    accountActiveTab,
    setAccountActiveTab,
  } = useAuth();

  const { addItem, setIsCartOpen, setMailgunPreview } = useCart();

  // Auth form states (when logged out)
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [coffeePreference, setCoffeePreference] = useState('Medium Caramel Roast');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [isDispatchingWelcome, setIsDispatchingWelcome] = useState(false);
  const [welcomeSuccessBanner, setWelcomeSuccessBanner] = useState<string | null>(null);

  // Profile editing states (when logged in)
  const [editMilk, setEditMilk] = useState(userProfile?.favoriteMilk || 'Oatly Barista Edition');
  const [editRoast, setEditRoast] = useState(userProfile?.coffeePreference || 'Medium Caramel Roast');
  const [editBrew, setEditBrew] = useState(userProfile?.brewingMethod || 'Espresso Ristretto');
  const [editStreet, setEditStreet] = useState(userProfile?.deliveryAddress?.street || '');
  const [editSuite, setEditSuite] = useState(userProfile?.deliveryAddress?.suite || '');
  const [editCity, setEditCity] = useState(userProfile?.deliveryAddress?.city || '');
  const [editZip, setEditZip] = useState(userProfile?.deliveryAddress?.zip || '');
  const [editNotes, setEditNotes] = useState(userProfile?.deliveryAddress?.instructions || '');
  const [editPhone, setEditPhone] = useState(userProfile?.phone || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Derived fallback values for profile editing
  const currentMilk = editMilk || userProfile?.favoriteMilk || 'Oatly Barista Edition';
  const currentRoast = editRoast || userProfile?.coffeePreference || 'Medium Caramel Roast';
  const currentBrew = editBrew || userProfile?.brewingMethod || 'Espresso Ristretto';
  const currentPhone = editPhone !== '' ? editPhone : (userProfile?.phone || '');
  const currentStreet = editStreet !== '' ? editStreet : (userProfile?.deliveryAddress?.street || '');
  const currentSuite = editSuite !== '' ? editSuite : (userProfile?.deliveryAddress?.suite || '');
  const currentCity = editCity !== '' ? editCity : (userProfile?.deliveryAddress?.city || '');
  const currentZip = editZip !== '' ? editZip : (userProfile?.deliveryAddress?.zip || '');
  const currentNotes = editNotes !== '' ? editNotes : (userProfile?.deliveryAddress?.instructions || '');

  // Keyboard shortcut ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAccountModalOpen) {
        setIsAccountModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAccountModalOpen, setIsAccountModalOpen]);

  if (!isAccountModalOpen) return null;

  // Password validation requirements
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialOrUpper = /[!@#$%^&*(),.?":{}|<>A-Z]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Helper to dispatch official welcome email via Mailgun API
  const handleDispatchWelcomeEmail = async (targetEmail?: string, targetName?: string) => {
    const toEmail = targetEmail || user?.email || email;
    const toName = targetName || user?.displayName || fullName || 'Distinguished Member';
    if (!toEmail) return;

    try {
      setIsDispatchingWelcome(true);
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: toEmail,
          type: 'welcome',
          user: {
            displayName: toName,
            email: toEmail,
            memberTier: userProfile?.memberTier || 'Gold Artisan',
            beanPoints: userProfile?.beanPoints || 50,
            coffeePreference: userProfile?.coffeePreference || coffeePreference || 'Medium Caramel Roast',
            uid: user?.uid,
          },
        }),
      });
      const data = await res.json();
      if (data?.htmlPreview) {
        setMailgunPreview({ open: true, data });
      }
      setWelcomeSuccessBanner(`Welcome email dispatched to ${toEmail}!`);
      setTimeout(() => setWelcomeSuccessBanner(null), 5000);
    } catch (err) {
      console.warn('Welcome email error:', err);
    } finally {
      setIsDispatchingWelcome(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleConnect = async () => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      const loggedUser = await signIn();
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
      if (loggedUser && loggedUser.email) {
        await handleDispatchWelcomeEmail(loggedUser.email, loggedUser.displayName || 'Coffee Enthusiast');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Google sign in was cancelled or failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Email Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please fill in both email and password.');
      return;
    }
    try {
      setIsSubmitting(true);
      setAuthError(null);
      await signInEmail(email, password);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    } catch (err: any) {
      setAuthError(err?.message || 'Invalid credentials. Please verify your email & password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Email Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setAuthError('Please enter your full name.');
      return;
    }
    if (!isValidEmail) {
      setAuthError('Please provide a valid email address.');
      return;
    }
    if (!hasMinLength || !hasNumber || !hasSpecialOrUpper) {
      setAuthError('Please meet all password security requirements.');
      return;
    }
    if (!passwordsMatch) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (!termsAccepted) {
      setAuthError('Please accept the Roastery Club membership terms.');
      return;
    }

    try {
      setIsSubmitting(true);
      setAuthError(null);
      await signUpEmail(email, password, fullName, coffeePreference);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });

      // Automatically dispatch welcome email upon registration
      await handleDispatchWelcomeEmail(email, fullName);
    } catch (err: any) {
      setAuthError(err?.message || 'Could not create account. Email may already be in use.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) {
      setAuthError('Please enter a valid email to receive reset instructions.');
      return;
    }
    try {
      setIsSubmitting(true);
      setAuthError(null);
      await resetPassword(email);
      setResetSent(true);
    } catch (err: any) {
      setAuthError(err?.message || 'Could not send reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save updated coffee preferences and address
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      await updateProfileData({
        favoriteMilk: currentMilk,
        coffeePreference: currentRoast,
        brewingMethod: currentBrew,
        phone: currentPhone,
        deliveryAddress: {
          street: currentStreet,
          suite: currentSuite,
          city: currentCity,
          zip: currentZip,
          instructions: currentNotes,
        },
      });
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAccountModalOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm overflow-y-auto cursor-pointer"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl my-6 bg-[#fbf7ee] rounded-3xl shadow-2xl border border-[#ebdcc9] overflow-hidden text-[#2c1810] cursor-default flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#ebdcc9] bg-white/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#3e2213] text-[#e6b98d] flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-xl sm:text-2xl font-bold text-[#2c1810] leading-none">
                  Roastery Club Member Lounge
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f3ebd9] text-[#8c5020] uppercase tracking-wider">
                  {user ? (userProfile?.memberTier || 'Gold Member') : 'Club Access'}
                </span>
              </div>
              <span className="text-xs text-[#8c6e58]">
                {user ? user.email : 'Personalized Coffee DNA, Digital Card & Member Perks'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAccountModalOpen(false)}
            className="p-2 rounded-full hover:bg-[#ebdcc9] text-[#2c1810] transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          {!user ? (
            /* ========================================================
               LOGGED OUT: AUTH & REGISTRATION WITH REQUIREMENTS
               ======================================================== */
            <div className="p-6 sm:p-8 max-w-xl mx-auto">
              
              {/* Tab Selector */}
              <div className="flex rounded-2xl bg-[#ebd9c5]/60 p-1.5 mb-6 border border-[#dfccb6]">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setAuthError(null); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    authMode === 'signin'
                      ? 'bg-white text-[#2c1810] shadow-sm'
                      : 'text-[#6a4b36] hover:text-[#2c1810]'
                  }`}
                >
                  Member Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'signup'
                      ? 'bg-white text-[#2c1810] shadow-sm'
                      : 'text-[#6a4b36] hover:text-[#2c1810]'
                  }`}
                >
                  <span>Join the Club</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#c97a3e]" />
                </button>
              </div>

              {/* Error Message */}
              {authError && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Fast Google Auth Button */}
              <button
                type="button"
                onClick={handleGoogleConnect}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-2xl border border-[#d8c4ad] bg-white hover:bg-[#faf5eb] text-[#2c1810] text-xs font-bold flex items-center justify-center gap-2.5 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] mb-5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.27-2.09 3.67-5.17 3.67-9.15z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.08 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.36 7.34 24 12 24z" />
                  <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
                </svg>
                <span>Continue with Google Account</span>
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-[#ebdcc9]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c6e58]">
                  Or With Member Credentials
                </span>
                <div className="flex-1 h-px bg-[#ebdcc9]" />
              </div>

              {/* SIGN IN FORM */}
              {authMode === 'signin' && (
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8c6e58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36]">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => { setAuthMode('forgot'); setAuthError(null); }}
                        className="text-[11px] text-[#c97a3e] hover:underline font-semibold"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8c6e58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-[#8c6e58] hover:text-[#2c1810] absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-[#d38243] hover:bg-[#bd6f32] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#d38243]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                  >
                    <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Member Lounge'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* SIGN UP FORM (FULL REQUIREMENTS) */}
              {authMode === 'signup' && (
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  {/* Perk Banner */}
                  <div className="p-3.5 rounded-2xl bg-[#faf5eb] border border-[#ebdcc9] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#c97a3e]/15 text-[#c97a3e] flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-[#704b32]">
                      New members receive <strong>50 Welcome Bean Points</strong> + a complimentary origin tasting flight.
                    </span>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8c6e58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Jordan Miller"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8c6e58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                      />
                    </div>
                  </div>

                  {/* Phone (Optional) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                      Mobile Phone (Optional for pickup SMS alerts)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#8c6e58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                      />
                    </div>
                  </div>

                  {/* Palate Preference */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                      Coffee Palate Preference
                    </label>
                    <select
                      value={coffeePreference}
                      onChange={(e) => setCoffeePreference(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                    >
                      <option value="Light Floral & Citrus Roast">Light Floral & Citrus Roast (Ethiopia Yirgacheffe)</option>
                      <option value="Medium Caramel Roast">Medium Caramel & Honey Roast (Colombia Huila)</option>
                      <option value="Dark Cacao & Velvet Roast">Dark Cacao & Velvet Roast (Sumatra Mandheling)</option>
                      <option value="Swiss Water Decaf Specialty">Swiss Water Decaf Specialty</option>
                    </select>
                  </div>

                  {/* Password & Password Requirements Checklist */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mb-2">
                      <Lock className="w-4 h-4 text-[#8c6e58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-[#8c6e58] hover:text-[#2c1810] absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Requirements Visual Checklist */}
                    <div className="p-3 bg-white/70 rounded-xl border border-[#ebdcc9] space-y-1 text-[11px]">
                      <span className="font-bold text-[#8c6e58] block mb-1">
                        Password Requirements:
                      </span>
                      <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                        <CheckCircle className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-600' : 'text-gray-300'}`} />
                        <span>Minimum 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                        <CheckCircle className={`w-3.5 h-3.5 ${hasNumber ? 'text-emerald-600' : 'text-gray-300'}`} />
                        <span>At least one number (0-9)</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${hasSpecialOrUpper ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                        <CheckCircle className={`w-3.5 h-3.5 ${hasSpecialOrUpper ? 'text-emerald-600' : 'text-gray-300'}`} />
                        <span>At least one uppercase letter or special character</span>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8c6e58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type password"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                      />
                    </div>
                    {password && confirmPassword && (
                      <span className={`text-[11px] mt-1 block font-semibold ${passwordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                        {passwordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
                      </span>
                    )}
                  </div>

                  {/* Terms & Membership Checkbox */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#c97a3e] rounded"
                    />
                    <label htmlFor="terms" className="text-xs text-[#6a4b36] cursor-pointer">
                      I accept the <strong>Roastery Club Membership Agreement</strong> & opt into artisan bean release alerts.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !passwordsMatch || !hasMinLength}
                    className="w-full py-3.5 rounded-2xl bg-[#d38243] hover:bg-[#bd6f32] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#d38243]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                  >
                    <span>{isSubmitting ? 'Creating Membership...' : 'Create Account & Claim 50 Bean Points'}</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* FORGOT PASSWORD FORM */}
              {authMode === 'forgot' && (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  {resetSent ? (
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                      <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                      <h4 className="font-bold text-sm text-[#2c1810]">Password Reset Link Dispatched</h4>
                      <p className="text-xs text-[#6a4b36]">
                        Check your inbox at <strong>{email}</strong> for instructions to set your new password.
                      </p>
                      <button
                        type="button"
                        onClick={() => { setAuthMode('signin'); setResetSent(false); }}
                        className="mt-3 py-2 px-5 rounded-full bg-[#3e2213] text-white text-xs font-bold"
                      >
                        Back to Member Sign In
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-[#6a4b36]">
                        Enter the email associated with your Roastery Club account, and we will dispatch a secure reset link.
                      </p>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#8c6e58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@domain.com"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#c97a3e]"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setAuthMode('signin')}
                          className="flex-1 py-3 rounded-2xl border border-[#d8c4ad] bg-white text-[#2c1810] text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 py-3 rounded-2xl bg-[#d38243] hover:bg-[#bd6f32] text-white text-xs font-bold uppercase tracking-wider"
                        >
                          {isSubmitting ? 'Dispatching...' : 'Send Reset Link'}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}

            </div>
          ) : (
            /* ========================================================
               LOGGED IN: MEMBER DASHBOARD & REQUIREMENTS HUB
               ======================================================== */
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Member Profile Header Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#3e2213] via-[#2c1810] to-[#1c0e07] text-[#fbf7ee] shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 z-10">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || 'Member'}
                      width={56}
                      height={56}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#d38243] shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-[#c97a3e] text-white flex items-center justify-center font-bold text-2xl border-2 border-[#e6b98d]">
                      {(user.displayName || user.email || 'M')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-editorial text-2xl font-bold text-[#fbf7ee]">
                        {user.displayName || userProfile?.displayName || 'Roastery Club Connoisseur'}
                      </h3>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#c97a3e]/40 border border-[#e6b98d]/30 text-[#e6b98d] font-bold uppercase tracking-wider">
                        {userProfile?.memberTier || 'Gold Artisan'}
                      </span>
                    </div>
                    <span className="text-xs text-[#d8c4ad] block">
                      {user.email} • Member since {userProfile?.memberSince || '2024'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => signOut()}
                  className="z-10 py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>

                {/* Subtle background glow */}
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#c97a3e]/10 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-[#ebdcc9] pb-3">
                {[
                  { id: 'card', label: 'Digital Card & Perks', icon: CreditCard },
                  { id: 'preferences', label: 'Coffee Palate DNA', icon: Coffee },
                  { id: 'address', label: 'Delivery Address & Notes', icon: MapPin },
                  { id: 'orders', label: `My Orders (${userOrders.length})`, icon: Clock },
                  { id: 'reservations', label: `Reservations (${userReservations.length})`, icon: Calendar },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = accountActiveTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setAccountActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#3e2213] text-white shadow-xs'
                          : 'bg-white hover:bg-[#f3ebd9] text-[#2c1810] border border-[#ebdcc9]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: DIGITAL CARD & PERKS */}
              {accountActiveTab === 'card' && (
                <div className="space-y-6">
                  {/* Virtual Gold Member Card */}
                  <div className="relative aspect-[1.8/1] max-w-md mx-auto rounded-3xl p-6 bg-gradient-to-br from-[#854d0e] via-[#b45309] to-[#78350f] text-white shadow-2xl border border-[#fde047]/30 flex flex-col justify-between overflow-hidden">
                    {/* Card Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#fef08a] block">
                          The Roastery Club
                        </span>
                        <h4 className="font-editorial text-xl font-bold tracking-wide text-white">
                          Artisan VIP Member Pass
                        </h4>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Coffee className="w-5 h-5 text-[#fef08a]" />
                      </div>
                    </div>

                    {/* Member ID and Barcode Mock */}
                    <div className="my-2">
                      <div className="text-[11px] font-mono tracking-widest text-[#fde68a] mb-1">
                        TRC-8921-9942-01
                      </div>
                      <div className="h-6 w-full flex items-center gap-1 opacity-80">
                        {[4, 2, 6, 1, 3, 5, 2, 4, 1, 3, 6, 2, 5, 1, 4, 3, 2, 5, 1, 4, 2, 6, 3].map((w, i) => (
                          <div key={i} className="bg-white h-full" style={{ width: `${w * 2}px` }} />
                        ))}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex justify-between items-end border-t border-white/20 pt-3 text-xs">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#fef08a] block">Cardholder</span>
                        <span className="font-bold text-sm tracking-wide">
                          {user.displayName || 'Distinguished Member'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider text-[#fef08a] block">Bean Balance</span>
                        <span className="font-editorial text-lg font-bold text-[#fef08a]">
                          {userProfile?.beanPoints || 140} Beans
                        </span>
                      </div>
                    </div>
                  </div>

                  {welcomeSuccessBanner && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{welcomeSuccessBanner}</span>
                    </div>
                  )}

                  {/* Mailgun Email Dispatch Action Banner */}
                  <div className="p-4 rounded-2xl bg-[#faf5eb] border border-[#ebdcc9] flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#c97a3e]/15 text-[#c97a3e] flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-[#2c1810]">
                          VIP Welcome & Member Pass Email
                        </h5>
                        <p className="text-[11px] text-[#8c6e58]">
                          Dispatches your official membership credential and 50 Bean gift to <strong>{user.email}</strong>.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isDispatchingWelcome}
                      onClick={() => handleDispatchWelcomeEmail()}
                      className="py-2 px-4 rounded-full bg-[#3e2213] hover:bg-[#25130a] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 whitespace-nowrap"
                    >
                      {isDispatchingWelcome ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Shooting Email...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#e6b98d]" />
                          <span>Shoot Welcome Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bean Rewards Tiers */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-white border border-[#ebdcc9] text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c97a3e] block mb-1">
                        50 Beans
                      </span>
                      <h5 className="font-bold text-xs text-[#2c1810] mb-1">Fresh Bakery Pairing</h5>
                      <p className="text-[11px] text-[#8c6e58] mb-3">Complimentary hand-rolled almond croissant or cannoli.</p>
                      <button
                        onClick={() => alert('Voucher activated! Show barcode on next visit or at checkout.')}
                        className="py-1 px-3 rounded-full bg-[#f3ebd9] hover:bg-[#ebdcc9] text-xs font-bold text-[#2c1810] transition-colors"
                      >
                        Redeem Voucher
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-[#ebdcc9] text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c97a3e] block mb-1">
                        100 Beans
                      </span>
                      <h5 className="font-bold text-xs text-[#2c1810] mb-1">Signature Hand-Brew</h5>
                      <p className="text-[11px] text-[#8c6e58] mb-3">Free barista pour-over or signature iced cloud mocha.</p>
                      <button
                        onClick={() => alert('Voucher activated! Show barcode on next visit or at checkout.')}
                        className="py-1 px-3 rounded-full bg-[#f3ebd9] hover:bg-[#ebdcc9] text-xs font-bold text-[#2c1810] transition-colors"
                      >
                        Redeem Voucher
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-[#ebdcc9] text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c97a3e] block mb-1">
                        200 Beans
                      </span>
                      <h5 className="font-bold text-xs text-[#2c1810] mb-1">250g Whole Bean Bag</h5>
                      <p className="text-[11px] text-[#8c6e58] mb-3">Single-origin micro-lot bag roasted within 48 hours.</p>
                      <button
                        onClick={() => alert('Voucher activated! Show barcode on next visit or at checkout.')}
                        className="py-1 px-3 rounded-full bg-[#f3ebd9] hover:bg-[#ebdcc9] text-xs font-bold text-[#2c1810] transition-colors"
                      >
                        Redeem Voucher
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COFFEE PALATE & BREWING DNA */}
              {accountActiveTab === 'preferences' && (
                <form onSubmit={handleSavePreferences} className="space-y-4 max-w-xl mx-auto text-left">
                  {saveSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Coffee DNA saved! Baristas will craft your orders to these exact preferences.</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                      Roast Profile
                    </label>
                    <select
                      value={currentRoast}
                      onChange={(e) => setEditRoast(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:ring-2 focus:ring-[#c97a3e] focus:outline-none"
                    >
                      <option value="Light Floral & Citrus Roast">Light Floral & Citrus (Ethiopia, Kenya)</option>
                      <option value="Medium Caramel Roast">Medium Caramel & Brown Sugar (Colombia, Guatemala)</option>
                      <option value="Dark Cacao & Velvet Roast">Dark Cacao & Velvet (Sumatra, Espresso Roast)</option>
                      <option value="Swiss Water Decaf Specialty">Swiss Water Decaf Specialty</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                      Default Milk of Choice
                    </label>
                    <select
                      value={currentMilk}
                      onChange={(e) => setEditMilk(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:ring-2 focus:ring-[#c97a3e] focus:outline-none"
                    >
                      <option value="Oatly Barista Edition">Oatly Barista Edition (Silky, plant-based)</option>
                      <option value="Whole Organic Dairy">Whole Organic Dairy (Sweet, rich microfoam)</option>
                      <option value="Organic Almond Milk">Organic Almond Milk (Nutty, lighter)</option>
                      <option value="No Milk / Black Coffee">No Milk / Pure Black Coffee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                      Preferred Brewing Style
                    </label>
                    <select
                      value={currentBrew}
                      onChange={(e) => setEditBrew(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:ring-2 focus:ring-[#c97a3e] focus:outline-none"
                    >
                      <option value="Espresso Ristretto">Espresso Ristretto (Concentrated, sweet)</option>
                      <option value="Pour-over V60">Pour-over V60 (Crisp, nuanced tasting notes)</option>
                      <option value="Cold Drip / Nitro">Cold Drip / Nitro Brew (Smooth, low acidity)</option>
                      <option value="French Press Full Immersion">French Press Full Immersion (Heavy body)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="py-3 px-6 rounded-2xl bg-[#d38243] hover:bg-[#bd6f32] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Coffee DNA'}
                  </button>
                </form>
              )}

              {/* TAB 3: SAVED DELIVERY ADDRESS & NOTES */}
              {accountActiveTab === 'address' && (
                <form onSubmit={handleSavePreferences} className="space-y-4 max-w-xl mx-auto text-left">
                  {saveSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Delivery address updated! It will auto-fill during checkout.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={currentStreet}
                        onChange={(e) => setEditStreet(e.target.value)}
                        placeholder="e.g. 1284 Market Street"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:ring-2 focus:ring-[#c97a3e] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                        Suite / Apt
                      </label>
                      <input
                        type="text"
                        value={currentSuite}
                        onChange={(e) => setEditSuite(e.target.value)}
                        placeholder="Apt 4B"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:ring-2 focus:ring-[#c97a3e] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={currentCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        placeholder="San Francisco"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:ring-2 focus:ring-[#c97a3e] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                        Postal Code / ZIP
                      </label>
                      <input
                        type="text"
                        value={currentZip}
                        onChange={(e) => setEditZip(e.target.value)}
                        placeholder="94102"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:ring-2 focus:ring-[#c97a3e] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                      Contact Phone (for delivery driver)
                    </label>
                    <input
                      type="tel"
                      value={currentPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:ring-2 focus:ring-[#c97a3e] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6a4b36] mb-1.5">
                      Delivery Courier Instructions
                    </label>
                    <input
                      type="text"
                      value={currentNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="e.g. Ring bell, leave on front porch table"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d8c4ad] bg-white text-xs text-[#2c1810] focus:ring-2 focus:ring-[#c97a3e] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="py-3 px-6 rounded-2xl bg-[#d38243] hover:bg-[#bd6f32] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Default Address'}
                  </button>
                </form>
              )}

              {/* TAB 4: ORDERS & REORDER */}
              {accountActiveTab === 'orders' && (
                <div className="space-y-4">
                  {userOrders.length === 0 ? (
                    <div className="py-12 text-center">
                      <Coffee className="w-10 h-10 text-[#a88d77] mx-auto mb-2" />
                      <h4 className="font-editorial text-lg font-bold text-[#2c1810]">No Order History Yet</h4>
                      <p className="text-xs text-[#8c6e58] mb-4">Your freshly roasted orders and receipts will appear here.</p>
                      <button
                        onClick={() => {
                          setIsAccountModalOpen(false);
                          document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="py-2.5 px-6 rounded-full bg-[#3e2213] text-white text-xs font-bold uppercase tracking-wider"
                      >
                        Explore Roastery Menu
                      </button>
                    </div>
                  ) : (
                    userOrders.map((ord: any) => (
                      <div key={ord.id} className="p-4 rounded-2xl bg-white border border-[#ebdcc9] text-left flex flex-col sm:flex-row justify-between gap-3 shadow-xs">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-xs text-[#2c1810]">
                              Order #{ord.id?.slice(0, 7).toUpperCase()}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                              {ord.status || 'Brewing'}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#8c6e58] block mb-2">
                            {new Date(ord.createdAt || 0).toLocaleString()} • {ord.deliveryType || 'Delivery'}
                          </span>
                          <div className="space-y-1">
                            {ord.items?.map((it: any, i: number) => (
                              <div key={i} className="text-xs text-[#6a4b36]">
                                <strong>{it.quantity}x</strong> {it.name} {it.milk ? `(${it.milk})` : ''} - ${(it.price * it.quantity).toFixed(2)}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#f0e4d3]">
                          <span className="font-editorial text-lg font-bold text-[#b45309]">
                            ${ord.total?.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              ord.items?.forEach((it: any) =>
                                addItem(
                                  {
                                    id: it.id,
                                    name: it.name,
                                    description: it.name,
                                    category: 'classics',
                                    price: it.price,
                                    prepTime: '3-5 mins',
                                    image:
                                      it.image ||
                                      'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
                                  },
                                  {
                                    milk: it.milk,
                                    size: it.size,
                                    roast: it.roast,
                                    notes: it.notes,
                                  }
                                )
                              );
                              setIsAccountModalOpen(false);
                              setIsCartOpen(true);
                            }}
                            className="py-1.5 px-4 rounded-full bg-[#f4ebdc] hover:bg-[#ebdcc9] text-[#2c1810] text-xs font-bold transition-colors"
                          >
                            Reorder All
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 5: TABLE RESERVATIONS */}
              {accountActiveTab === 'reservations' && (
                <div className="space-y-4">
                  {userReservations.length === 0 ? (
                    <div className="py-12 text-center">
                      <Calendar className="w-10 h-10 text-[#a88d77] mx-auto mb-2" />
                      <h4 className="font-editorial text-lg font-bold text-[#2c1810]">No Table Bookings Found</h4>
                      <p className="text-xs text-[#8c6e58] mb-4">Reserve a cozy leather booth or garden tasting table anytime.</p>
                      <button
                        onClick={() => {
                          setIsAccountModalOpen(false);
                          document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="py-2.5 px-6 rounded-full bg-[#3e2213] text-white text-xs font-bold uppercase tracking-wider"
                      >
                        Book a Table
                      </button>
                    </div>
                  ) : (
                    userReservations.map((res: any) => (
                      <div key={res.id} className="p-4 rounded-2xl bg-white border border-[#ebdcc9] text-left flex justify-between items-center shadow-xs">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-xs text-[#2c1810]">
                              {res.guests} Guests • {res.tableType || 'Artisan Lounge Table'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                              Confirmed
                            </span>
                          </div>
                          <span className="text-xs text-[#8c6e58] block">
                            Date: <strong>{res.date}</strong> at <strong>{res.time}</strong>
                          </span>
                          {res.notes && (
                            <span className="text-[11px] text-[#704b32] italic block mt-1">
                              Special Request: {res.notes}
                            </span>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#f3ebd9] text-[#c97a3e] flex items-center justify-center">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-[#ebdcc9] flex items-center justify-between">
          <span className="text-xs text-[#8c6e58] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Roastery Club Membership Data</span>
          </span>
          <button
            onClick={() => setIsAccountModalOpen(false)}
            className="py-2 px-5 rounded-full bg-[#3e2213] hover:bg-[#27150a] text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Close Lounge
          </button>
        </div>

      </motion.div>
    </div>
  );
}
