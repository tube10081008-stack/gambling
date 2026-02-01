import { useState, useMemo } from 'react';
import { Search, Play, ArrowLeft } from 'lucide-react';
import { PRAGMATIC_GAMES } from '../data/pragmaticGames';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 12;

export default function GameList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const generateGameLink = (symbol) => {
        // 'gs2c' logic with jurisdiction=99 enables Feature Buy (User Request)
        return `https://demogamesfree-asia.pragmaticplay.net/gs2c/openGame.do?gameSymbol=${symbol}&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fko%2F&lang=KO&cur=KRW`;
    };

    const filteredGames = useMemo(() => {
        return PRAGMATIC_GAMES.filter(g =>
            g.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const visibleGames = filteredGames.slice(0, visibleCount);

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="sticky top-0 bg-slate-950/80 backdrop-blur-md z-10 py-4 -mx-4 px-4 border-b border-slate-800">
                <div className="flex items-center gap-4 mb-4">
                    <Link to="/game" className="p-2 -ml-2 text-slate-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </Link>
                    <h2 className="text-xl font-bold text-white">
                        전체 게임 ({filteredGames.length})
                    </h2>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="게임 검색..."
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setVisibleCount(ITEMS_PER_PAGE);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-casino-gold outline-none shadow-inner"
                    />
                </div>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {visibleGames.map(game => (
                    <a
                        key={game.symbol}
                        href={generateGameLink(game.symbol)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-lg hover:border-casino-gold/50 transition-all hover:-translate-y-1"
                    >
                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
                            <img
                                src={`https://www.vegasslotsonline.com/pragmatic-play/images/${game.title.toLowerCase().replace(/ /g, '-').replace(/'/g, '').replace(/!/g, '')}.jpg`}
                                alt={game.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                    const currentSrc = e.target.src;
                                    const symbol = game.symbol;

                                    if (currentSrc.includes('vegasslotsonline')) {
                                        e.target.src = `https://www.pragmaticplay.com/content/img/games/${symbol}.png`;
                                    }
                                    else if (currentSrc.includes('content/img/games')) {
                                        e.target.src = `https://static.pragmaticplay.net/gs2c/common/games/${symbol}.jpg`;
                                    }
                                    else if (currentSrc.includes('static.pragmaticplay.net')) {
                                        e.target.src = `https://cdn.softswiss.net/i/s3/pragmaticexternal/${symbol}.png`;
                                    }
                                    else {
                                        e.target.src = `https://placehold.co/400x300/0f172a/FFD700?text=${encodeURIComponent(game.title)}`;
                                        e.target.onerror = null;
                                    }
                                }}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="bg-casino-gold text-slate-900 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform delay-100">
                                    <Play fill="currentColor" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="p-3">
                            <h3 className="text-sm font-bold text-slate-200 truncate">{game.title}</h3>
                            <p className="text-xs text-slate-500">Pragmatic Play</p>
                        </div>
                    </a>
                ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredGames.length && (
                <div className="text-center pt-8 pb-4">
                    <button
                        onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-8 rounded-full shadow-lg border border-slate-700 transition-colors"
                    >
                        더 보기
                    </button>
                </div>
            )}

            {filteredGames.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    검색 결과가 없습니다.
                </div>
            )}
        </div>
    );
}
