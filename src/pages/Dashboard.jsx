import { useStore } from '../lib/store';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

export default function Dashboard() {
    const { gameState } = useStore();

    const chartData = {
        labels: gameState.history.map((_, i) => i + 1).slice(-10), // Last 10 entries
        datasets: [
            {
                label: '가상 잔고',
                data: gameState.history.map(h => h.balance).slice(-10),
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: '실제 저축',
                data: gameState.history.map(h => h.savings).slice(-10),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { color: '#94a3b8' } },
            title: { display: false },
        },
        scales: {
            y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { display: false } }
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <PiggyBank size={64} />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">실제 저축액</p>
                    <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                        ₩{gameState.realSavings.toLocaleString()}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">안전하게 보관 중</p>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet size={64} />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">게임 머니</p>
                    <h3 className="text-2xl font-bold text-casino-gold mt-1">
                        ₩{gameState.virtualBalance.toLocaleString()}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">게임 사용 가능</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
                <h3 className="text-slate-300 font-medium mb-4">자산 변동 추이</h3>
                <div className="h-48">
                    {gameState.history.length > 0 ? (
                        <Line data={chartData} options={options} />
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-600">
                            데이터가 없습니다.
                        </div>
                    )}
                </div>
            </div>

            {/* Recent History */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
                <div className="p-4 border-b border-slate-700">
                    <h3 className="text-slate-300 font-medium">최근 활동</h3>
                </div>
                <div className="divide-y divide-slate-700">
                    {gameState.history.slice().reverse().slice(0, 5).map((item, idx) => (
                        <div key={idx} className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${item.type === 'DEPOSIT' ? 'bg-emerald-900/50 text-emerald-400' :
                                        item.type === 'WITHDRAW' ? 'bg-red-900/50 text-red-400' :
                                            item.amount >= 0 ? 'bg-indigo-900/50 text-indigo-400' : 'bg-orange-900/50 text-orange-400'
                                    }`}>
                                    {item.type === 'DEPOSIT' && <PiggyBank size={16} />}
                                    {item.type === 'WITHDRAW' && <TrendingDown size={16} />}
                                    {item.type === 'GAME' && <TrendingUp size={16} />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-200">
                                        {item.type === 'DEPOSIT' ? '저축 입금' :
                                            item.type === 'WITHDRAW' ? '출금' : '게임 결과'}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                            <span className={`font-mono font-medium ${item.amount >= 0 ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}
                            </span>
                        </div>
                    ))}
                    {gameState.history.length === 0 && (
                        <div className="p-8 text-center text-slate-600">
                            아직 기록이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
