import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Dices } from 'lucide-react';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('회원가입 성공! 자동 로그인됩니다.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
            navigate('/');
        } catch (error) {
            if (error.message.includes('Email not confirmed')) {
                alert('이메일 인증이 완료되지 않았습니다. 이메일을 확인하거나, 관리자 대시보드(Supabase)에서 [Authentication > Providers > Email > Confirm email]을 꺼주세요.');
            } else {
                alert('로그인 오류: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <Dices size={48} className="text-casino-gold mx-auto mb-4" />
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-casino-gold to-yellow-200">
                        Gold Savings
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">
                        실제 저축으로 즐기는 나만의 카지노
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-casino-gold outline-none"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-casino-gold outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-casino-gold hover:bg-yellow-400 text-slate-900 font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? '처리 중...' : (mode === 'login' ? '로그인' : '회원가입')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        className="text-sm text-slate-500 hover:text-white underline"
                    >
                        {mode === 'login' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
                    </button>
                </div>
            </div>
        </div>
    );
}
