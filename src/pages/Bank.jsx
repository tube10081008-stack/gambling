import { useState } from 'react';
import { useStore } from '../lib/store';
import { ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';

export default function Bank() {
    const { gameState, deposit, withdraw } = useStore();
    const [activeTab, setActiveTab] = useState('deposit'); // deposit | withdraw
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const val = parseInt(amount.replace(/,/g, ''), 10);
        if (!val || val <= 0) return;

        if (activeTab === 'deposit') {
            deposit(val);
            alert(`${val.toLocaleString()}원이 저축(충전) 되었습니다!`);
        } else {
            const success = withdraw(val);
            if (success) alert(`${val.toLocaleString()}원이 출금되었습니다.`);
        }
        setAmount('');
    };

    return (
        <div className="space-y-6">
            <div className="text-center py-4">
                <p className="text-slate-400 mb-1">현재 보유 포인트</p>
                <h2 className="text-4xl font-bold text-casino-gold font-mono">
                    ₩{gameState.virtualBalance.toLocaleString()}
                </h2>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-800 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('deposit')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'deposit'
                            ? 'bg-emerald-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    입금 (충전)
                </button>
                <button
                    onClick={() => setActiveTab('withdraw')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'withdraw'
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    출금 (환전)
                </button>
            </div>

            {/* Form */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            금액 입력
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₩</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-4 pl-10 pr-4 text-xl font-bold text-white placeholder-slate-600 focus:outline-none focus:border-casino-gold transition-colors"
                                autoFocus
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${activeTab === 'deposit'
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950'
                                : 'bg-red-500 hover:bg-red-400 text-white'
                            }`}
                    >
                        {activeTab === 'deposit' ? <ArrowUpRight /> : <ArrowDownLeft />}
                        {activeTab === 'deposit' ? '저축하고 충전하기' : '환전하기'}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="text-slate-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-slate-400 space-y-1">
                            {activeTab === 'deposit' ? (
                                <>
                                    <p>• 입금한 금액은 실제 <strong>저금통</strong>에 넣어주세요.</p>
                                    <p>• 앱에는 동일한 금액의 <strong>게임 머니</strong>가 충전됩니다.</p>
                                </>
                            ) : (
                                <>
                                    <p>• 출금 시 가상 머니가 차감됩니다.</p>
                                    <p>• <strong>게임에서 딴 수익금</strong>은 가상 머니이므로 실제 출금이 불가능합니다.</p>
                                    <p>• 실제 저축한 원금 내에서만 출금이 가능합니다.</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
