import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [gameState, setGameState] = useState({
        virtualBalance: 0,
        realSavings: 0,
        history: []
    });
    const [loading, setLoading] = useState(true);

    // 1. Auth Change Listener & Data Loading
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) loadData(session.user.id);
            else setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user;
            setUser(currentUser ?? null);
            if (currentUser) {
                loadData(currentUser.id);
            } else {
                setGameState({ virtualBalance: 0, realSavings: 0, history: [] });
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // DB에서 데이터 불러오기
    const loadData = async (userId) => {
        setLoading(true);
        try {
            // Fetch Profile
            let { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError && profileError.code === 'PGRST116') {
                // 프로필이 없으면 생성 (처음 가입 시)
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert([{ id: userId, virtual_balance: 100000, real_savings: 0 }])
                    .select()
                    .single();

                if (createError) throw createError;
                profile = newProfile;
            } else if (profileError) {
                throw profileError;
            }

            // Fetch History (Transactions)
            const { data: transactions, error: txError } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true }); // 오래된 순으로 가져옴

            if (txError) throw txError;

            setGameState({
                virtualBalance: profile.virtual_balance,
                realSavings: profile.real_savings,
                history: transactions.map(t => ({
                    type: t.type,
                    amount: t.amount,
                    date: t.created_at,
                    balance: t.balance_snapshot || 0, // 하위 호환
                    savings: 0 // Transaction에는 savings snapshot이 없을 수 있음. 
                    // 복잡도를 낮추기 위해 화면에 보여줄 때 계산하거나, DB에 필드 추가 필요.
                    // 여기선 대시보드 그래프용으로 그냥 0 처리하거나, 간단히 로컬 계산.
                    // 하지만 DB 스키마에 snapshot을 넣는게 좋음.
                    // 일단 profile의 현재 값만 보장하고 history는 로그용으로 씀.
                }))
            });
        } catch (err) {
            console.error('Data load error:', err);
        } finally {
            setLoading(false);
        }
    };

    // 공통: DB 업데이트 및 로컬 상태 반영
    const updateDb = async (newVirtual, newSavings, type, amount) => {
        if (!user) return;

        // 1. Optimistic Update
        setGameState(prev => ({
            virtualBalance: newVirtual,
            realSavings: newSavings,
            history: [...prev.history, {
                type,
                amount,
                date: new Date().toISOString(),
                balance: newVirtual,
                savings: newSavings
            }]
        }));

        // 2. DB Update
        try {
            // Update Profile
            const { error: pError } = await supabase
                .from('profiles')
                .update({
                    virtual_balance: newVirtual,
                    real_savings: newSavings,
                    updated_at: new Date()
                })
                .eq('id', user.id);

            if (pError) throw pError;

            // Insert Transaction
            const { error: tError } = await supabase
                .from('transactions')
                .insert([{
                    user_id: user.id,
                    type,
                    amount,
                    balance_snapshot: newVirtual,
                    created_at: new Date()
                }]);

            if (tError) throw tError;

        } catch (err) {
            console.error('DB Sync Error:', err);
            alert('데이터 저장 중 오류가 발생했습니다. 새로고침 해주세요.');
            // Rollback logic could be here
        }
    };

    const deposit = (amount) => {
        const newVirtual = gameState.virtualBalance + amount;
        const newSavings = gameState.realSavings + amount;
        updateDb(newVirtual, newSavings, 'DEPOSIT', amount);
    };

    const withdraw = (amount) => {
        if (gameState.virtualBalance < amount) {
            alert("가상 잔액이 부족합니다!");
            return false;
        }
        if (gameState.realSavings < amount) {
            alert(`출금 불가: 당신이 게임에서 딴 돈은 가상입니다. 실제 저축된 ${gameState.realSavings.toLocaleString()}원만 출금 가능합니다.`);
            return false;
        }
        const newVirtual = gameState.virtualBalance - amount;
        const newSavings = gameState.realSavings - amount;
        updateDb(newVirtual, newSavings, 'WITHDRAW', -amount);
        return true;
    };

    const recordGameResult = (startBalance, endBalance) => {
        const diff = endBalance - startBalance;
        const newVirtual = gameState.virtualBalance + diff;
        const newSavings = gameState.realSavings; // Savings invariant
        updateDb(newVirtual, newSavings, 'GAME', diff);
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <StoreContext.Provider value={{ user, loading, gameState, deposit, withdraw, recordGameResult, logout }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => useContext(StoreContext);
