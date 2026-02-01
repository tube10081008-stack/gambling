import { useState } from 'react';
import { useStore } from '../lib/store';
import { Link } from 'react-router-dom';
import { Save, Dices, ExternalLink } from 'lucide-react';

export default function GameCenter() {
    const { gameState, recordGameResult } = useStore();
    const [startBalance, setStartBalance] = useState('');
    const [endBalance, setEndBalance] = useState('');

    const handleRecord = (e) => {
        e.preventDefault();
        const start = parseInt(startBalance, 10);
        const end = parseInt(endBalance, 10);

        if (isNaN(start) || isNaN(end)) {
            alert("올바른 금액을 입력해주세요.");
            return;
        }

        const diff = end - start;

        // 잔고 부족 체크 (마이너스 방지)
        if (gameState.virtualBalance + diff < 0) {
            alert(`보유하신 가상 금액(${gameState.virtualBalance.toLocaleString()}원)보다 더 많이 잃을 수 없습니다.\n충전 후 이용해주시거나 입력값을 확인해주세요.`);
            return;
        }

        recordGameResult(start, end);

        if (diff > 0) alert(`축하합니다! ${diff.toLocaleString()}원을 땄습니다!`);
        else if (diff < 0) alert(`아쉽네요. ${Math.abs(diff).toLocaleString()}원을 잃었습니다.`);
        else alert("본전이네요!");

        setStartBalance('');
        setEndBalance('');
    };

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 shadow-xl border border-indigo-700/50 text-center relative overflow-hidden animate-fade-in">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                <div className="relative z-10">
                    <Dices size={56} className="mx-auto text-indigo-300 mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-2">Pragmatic Play</h2>
                    <p className="text-indigo-200 mb-8 font-medium">
                        무료 데모 게임을 즐기고<br />결과를 기록하세요.
                    </p>

                    <Link
                        to="/game/list"
                        className="inline-flex items-center gap-2 bg-white text-indigo-900 font-bold py-4 px-10 rounded-full shadow-lg hover:bg-indigo-50 transition-transform hover:scale-105 active:scale-95"
                    >
                        게임 하러 가기 <ExternalLink size={18} />
                    </Link>
                </div>
            </div>

            {/* Result Recorder */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
                    <Save size={20} className="text-casino-gold" />
                    게임 결과 기록
                </h3>
                <form onSubmit={handleRecord} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                게임 시작 금액
                            </label>
                            <input
                                type="number"
                                value={startBalance}
                                onChange={(e) => setStartBalance(e.target.value)}
                                placeholder="100,000"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-4 px-4 text-white text-lg focus:border-casino-gold outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                게임 종료 금액
                            </label>
                            <input
                                type="number"
                                value={endBalance}
                                onChange={(e) => setEndBalance(e.target.value)}
                                placeholder="150,000"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-4 px-4 text-white text-lg focus:border-casino-gold outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 text-sm text-slate-500 leading-relaxed">
                        * 게임 시작 전 크레딧과 종료 후 크레딧을 정확히 입력해주세요.<br /> 차액만큼 가상 잔고에 반영됩니다.
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-casino-gold hover:bg-yellow-400 text-slate-900 font-bold text-lg rounded-lg shadow-lg transition-transform active:scale-95 mt-2"
                    >
                        결과 저장하기
                    </button>
                </form>
            </div>

            <div className="text-center text-xs text-slate-600 pb-4">
                <p>게임 중독 상담은 국번없이 1336</p>
            </div>
        </div>
    );
}
