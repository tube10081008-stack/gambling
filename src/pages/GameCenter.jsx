import { useState } from 'react';
import { useStore } from '../lib/store';
import { ExternalLink, Save, Dices } from 'lucide-react';

export default function GameCenter() {
    const { gameState, recordGameResult } = useStore();
    const [startBalance, setStartBalance] = useState('');
    const [endBalance, setEndBalance] = useState('');

    const handleGameLink = () => {
        // Pragmatic Play Demo URL (Example: Gates of Olympus)
        // In a real app, this might be a list of games.
        window.open('https://www.pragmaticplay.com/en/games/gates-of-olympus/', '_blank');
    };

    const handleRecord = (e) => {
        e.preventDefault();
        const start = parseInt(startBalance, 10);
        const end = parseInt(endBalance, 10);

        if (isNaN(start) || isNaN(end)) {
            alert("올바른 금액을 입력해주세요.");
            return;
        }

        recordGameResult(start, end);
        const diff = end - start;
        if (diff > 0) alert(`축하합니다! ${diff.toLocaleString()}원을 땄습니다!`);
        else if (diff < 0) alert(`아쉽네요. ${Math.abs(diff).toLocaleString()}원을 잃었습니다.`);
        else alert("본전이네요!");

        setStartBalance('');
        setEndBalance('');
    };

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 shadow-xl border border-indigo-700/50 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <Dices size={48} className="mx-auto text-indigo-300 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Pragmatic Play</h2>
                <p className="text-indigo-200 mb-6 text-sm">
                    무료 데모 게임을 즐기고<br />결과를 기록하세요.
                </p>
                <button
                    onClick={handleGameLink}
                    className="bg-white text-indigo-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 mx-auto"
                >
                    게임 하러 가기 <ExternalLink size={16} />
                </button>
            </div>

            {/* Result Recorder */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <Save size={20} className="text-casino-gold" />
                    게임 결과 기록
                </h3>
                <form onSubmit={handleRecord} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                게임 시작 금액
                            </label>
                            <input
                                type="number"
                                value={startBalance}
                                onChange={(e) => setStartBalance(e.target.value)}
                                placeholder="100,000"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-3 text-white focus:border-casino-gold outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                게임 종료 금액
                            </label>
                            <input
                                type="number"
                                value={endBalance}
                                onChange={(e) => setEndBalance(e.target.value)}
                                placeholder="150,000"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-3 text-white focus:border-casino-gold outline-none"
                            />
                        </div>
                    </div>

                    <div className="p-3 bg-slate-900/50 rounded text-xs text-slate-500">
                        * 게임 시작 전 크레딧과 종료 후 크레딧을 정확히 입력해주세요. 차액만큼 가상 잔고에 반영됩니다.
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-casino-gold hover:bg-yellow-400 text-slate-900 font-bold rounded-lg shadow-lg transition-colors"
                    >
                        결과 저장하기
                    </button>
                </form>
            </div>

            <div className="text-center text-xs text-slate-600">
                <p>게임 중독 상담은 국번없이 1336</p>
            </div>
        </div>
    );
}
