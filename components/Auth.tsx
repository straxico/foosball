import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface AuthProps {
    onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
    const [showMagic, setShowMagic] = useState(false);
    const [recoveryRequested, setRecoveryRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
        if (isLogin) {
            if (showMagic) {
                // send magic link (email OTP)
                const { error } = await supabase.auth.signInWithOtp({ email });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } else {
            const { error } = await supabase.auth.signUp({ 
                email, 
                password,
                options: {
                    data: {
                        username: email.split('@')[0] // Default username from email
                    }
                }
            });
            if (error) throw error;
            // No need for a message here, onAuthStateChange in App.tsx will handle closing the modal.
        }
    } catch (error: any) {
        setError(error.error_description || error.message);
    } finally {
        setLoading(false);
    }
  };
  
  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
        onClick={onClose}
    >
        <div 
            className="w-full max-w-md p-8 space-y-8 bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-gray-800/95 rounded-2xl shadow-2xl border border-gray-700/50 relative backdrop-blur-xl" 
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
        >
            <button 
                onClick={onClose} 
                className="absolute top-4 left-4 text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 bg-gray-700/50 rounded-full p-1"
                aria-label="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <div>
                <div className="text-center text-6xl mb-4">🔐</div>
                <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    {isLogin ? 'ورود به حساب کاربری' : 'ایجاد حساب کاربری'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    {isLogin ? 'هنوز حساب کاربری ندارید؟' : 'قبلاً ثبت‌نام کرده‌اید؟'}
                    {' '}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(null);
                        }}
                        className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        {isLogin ? 'ثبت‌نام کنید' : 'وارد شوید'}
                    </button>
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                <div className="rounded-xl shadow-sm space-y-3">
                <div>
                    <label htmlFor="email-address" className="sr-only">آدرس ایمیل</label>
                    <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required={isLogin ? !showMagic : true}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-600 bg-gray-700/70 text-gray-200 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="📧 آدرس ایمیل"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {!showMagic && (
                <div>
                    <label htmlFor="password" className="sr-only">رمز عبور</label>
                    <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required={isLogin ? !showMagic : true}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-600 bg-gray-700/70 text-gray-200 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="🔑 رمز عبور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                )}
                </div>

                <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-700 hover:via-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-blue-500/50"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            در حال پردازش...
                        </span>
                    ) : (isLogin ? '🚀 ورود' : '✨ ثبت‌نام')}
                </button>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                                        <input type="checkbox" className="rounded" checked={showMagic} onChange={() => setShowMagic(!showMagic)} />
                                        ورود با لینک جادویی
                                    </label>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            setRecoveryRequested(false);
                                            setError(null);
                                            setLoading(true);
                                            try {
                                                    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset` });
                                                if (error) throw error;
                                                setRecoveryRequested(true);
                                            } catch (err: any) {
                                                setError(err.error_description || err.message || 'خطا هنگام ارسال ایمیل بازیابی');
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        className="text-sm underline text-blue-400 hover:text-blue-300"
                                    >
                                        فراموشی رمز عبور؟
                                    </button>
                                </div>
            </form>
                        {error && (
                <div className="mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                    <p className="text-sm text-center text-red-300">⚠️ {error}</p>
                </div>
            )}
                        {recoveryRequested && (
                            <div className="mt-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                                <p className="text-sm text-center text-green-300">📩 ایمیل بازیابی ارسال شد — صندوق ورودی و پوشه اسپم را بررسی کنید.</p>
                            </div>
                        )}
        </div>
    </div>
  );
};

export default Auth;
