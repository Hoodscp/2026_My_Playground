"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Loader2 } from 'lucide-react';

const LoginScreen = () => {
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
        const body = isLogin ? { email, password } : { name, email, password };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (data.success) {
                login(data.data);
            } else {
                setError(data.error || 'Authentication failed');
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="w-screen h-screen flex flex-col items-center justify-center bg-cover bg-center text-white relative overflow-hidden"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1732646397396-74895689133b?q=80&w=2670&auto=format&fit=crop)',
            }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>

            <div className="z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white/20 mb-6 overflow-hidden shadow-2xl relative">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                </div>

                <h1 className="text-2xl font-medium mb-8 text-shadow">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-white/20 border border-white/30 rounded px-3 py-2 text-sm placeholder-white/70 focus:outline-none focus:bg-white/30 focus:border-white/50 transition-all text-shadow"
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/20 border border-white/30 rounded px-3 py-2 text-sm placeholder-white/70 focus:outline-none focus:bg-white/30 focus:border-white/50 transition-all text-shadow"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/20 border border-white/30 rounded px-3 py-2 text-sm placeholder-white/70 focus:outline-none focus:bg-white/30 focus:border-white/50 transition-all text-shadow"
                        required
                    />

                    {error && <div className="text-red-300 text-xs text-center bg-red-900/50 p-1 rounded">{error}</div>}

                    <div className="flex gap-2 mt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-white/20 hover:bg-white/30 flex items-center justify-center py-2 rounded transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : (isLogin ? <ArrowRight size={18} /> : 'Sign Up')}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-white/70 hover:text-white text-xs underline underline-offset-4"
                    >
                        {isLogin ? "No account? Create one." : "Already have an account? Sign in."}
                    </button>
                </div>
            </div>

            {/* Clock */}
            <div className="absolute bottom-16 left-16 z-10 text-white">
                <div className="text-8xl font-thin tracking-tighter">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
                <div className="text-2xl font-light">
                    {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
