import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface ResetPasswordProps {
  onDone?: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onDone }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase will store session when user clicks the recovery link. We call
    // getSessionFromUrl so the SDK processes the url and we can proceed.
    (async () => {
      try {
        // If the SDK supports getSessionFromUrl, call it; otherwise, fallback
        // to checking the URL for the recovery type param.
        if ((supabase as any).auth?.getSessionFromUrl) {
          const { data, error } = await (supabase as any).auth.getSessionFromUrl();
          if (error) {
            setStatus(error.message || 'خطا هنگام بارگذاری لینک بازیابی');
            return;
          }
          if (data?.redirectType !== 'recovery') {
            setStatus('لینک بازیابی نامعتبر است.');
            return;
          }
        } else {
          // Detect by URL param
          const url = new URL(window.location.href);
          const type = url.searchParams.get('type') || (window.location.hash.includes('type=recovery') ? 'recovery' : null);
          if (type !== 'recovery') {
            setStatus('لینک بازیابی نامعتبر است.');
            return;
          }
        }
        // If we reach here, the recovery flow is valid
        setStatus(null);
      } catch (err: any) {
        setStatus(err.message || 'خطا هنگام پردازش لینک');
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!password || !confirmPassword) return setStatus('لطفاً رمز عبور را وارد کنید.');
    if (password !== confirmPassword) return setStatus('رمزهای عبور مطابقت ندارند.');

    setLoading(true);
    try {
      // After getSessionFromUrl the user's session is active and we can update the user
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setStatus('✅ رمز عبور با موفقیت بروزرسانی شد. اکنون می‌توانید وارد شوید.');
      if (onDone) onDone();
    } catch (err: any) {
      setStatus(err.error_description || err.message || 'خطا هنگام بروزرسانی رمز عبور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-gray-700/50 text-gray-100">
      <h2 className="text-xl font-bold text-center mb-4">🔑 تنظیم رمز عبور جدید</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="sr-only">رمز عبور جدید</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="🔑 رمز عبور جدید" className="w-full px-3 py-2 rounded bg-gray-900/70" />
        </div>
        <div>
          <label className="sr-only">تکرار رمز عبور</label>
          <input type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="🔁 تکرار رمز عبور" className="w-full px-3 py-2 rounded bg-gray-900/70" />
        </div>
        <div>
          <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg">{loading ? 'در حال پردازش...' : 'تنظیم رمز عبور'}</button>
        </div>
      </form>
      {status && <div className="mt-4 text-sm text-center">{status}</div>}
    </div>
  );
};

export default ResetPassword;
