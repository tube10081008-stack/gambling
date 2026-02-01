import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Landmark, Gamepad2, Wallet, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useStore } from '../lib/store';

const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={clsx(
            "flex flex-col items-center justify-center w-full py-3 transition-colors",
            active ? "text-casino-gold" : "text-slate-400 hover:text-slate-200"
        )}
    >
        <Icon size={24} className="mb-1" />
        <span className="text-xs font-medium">{label}</span>
    </Link>
);

export default function Layout({ children }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { gameState, user, logout } = useStore();

    const handleLogout = async () => {
        if (confirm('로그아웃 하시겠습니까?')) {
            await logout();
            navigate('/login');
        }
    };

    // 로그인 페이지 등에서는 레이아웃(헤더/푸터) 숨기기
    if (pathname === '/login') return children;

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10 shadow-lg">
                <div className="flex justify-between items-center max-w-md mx-auto w-full">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-casino-gold to-yellow-200">
                        Gold Savings
                    </h1>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                            <Wallet size={16} className="text-emerald-400" />
                            <span className="text-sm font-mono text-emerald-400">
                                ₩{gameState.virtualBalance.toLocaleString()}
                            </span>
                        </div>
                        {user && (
                            <button onClick={handleLogout} className="text-slate-400 hover:text-white">
                                <LogOut size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-20">
                <div className="max-w-md mx-auto w-full p-4">
                    {children}
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="bg-slate-900 border-t border-slate-800 fixed bottom-0 w-full z-10 safe-area-pb">
                <div className="max-w-md mx-auto flex justify-around">
                    <NavItem
                        to="/"
                        icon={LayoutDashboard}
                        label="대시보드"
                        active={pathname === '/'}
                    />
                    <NavItem
                        to="/bank"
                        icon={Landmark}
                        label="뱅킹"
                        active={pathname === '/bank'}
                    />
                    <NavItem
                        to="/game"
                        icon={Gamepad2}
                        label="게임센터"
                        active={pathname === '/game'}
                    />
                </div>
            </nav>
        </div>
    );
}
