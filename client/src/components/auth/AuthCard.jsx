import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiInfo, FiCheck } from 'react-icons/fi';

const AuthCard = ({ mode = 'login' }) => {
    const { login, register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [tab, setTab] = useState(mode === 'register' ? 'register' : 'login');
    useEffect(() => setTab(mode === 'register' ? 'register' : 'login'), [mode]);

    useEffect(() => {
        if (user) {
            navigate(user.userType === 'admin' ? '/admin/dashboard' : '/');
        }
    }, [user, navigate]);

    const [loginState, setLoginState] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const [registerState, setRegisterState] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPasswordLogin, setShowPasswordLogin] = useState(false);
    const [showPasswordRegister, setShowPasswordRegister] = useState(false);

    const passwordRules = useMemo(() => {
        const p = registerState.password;
        return [
            { label: 'At least 6 characters', valid: (p || '').length >= 6 },
            {
                label: 'Passwords match',
                valid: p && registerState.confirmPassword && p === registerState.confirmPassword,
            },
        ];
    }, [registerState.password, registerState.confirmPassword]);

    const submitLogin = async (e) => {
        e.preventDefault();
        setError('');
        setServerError('');

        const { email, password } = loginState;
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const data = await login(email, password);
            navigate(data?.userType === 'admin' ? '/admin/dashboard' : '/');
        } catch (err) {
            setServerError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const validateRegister = () => {
        const s = registerState;
        const errs = [];
        if (!s.firstName.trim()) errs.push('First name is required');
        if (!s.lastName.trim()) errs.push('Last name is required');
        if (!s.email.trim()) errs.push('Email is required');
        if (s.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) errs.push('Please enter a valid email');
        if (!s.password) errs.push('Password is required');
        if (s.password && s.password.length < 6) errs.push('Password must be at least 6 characters');
        if (!s.confirmPassword) errs.push('Please confirm your password');
        if (s.password && s.confirmPassword && s.password !== s.confirmPassword) errs.push('Passwords do not match');

        return errs;
    };

    const submitRegister = async (e) => {
        e.preventDefault();
        setError('');
        setServerError('');

        const errs = validateRegister();
        if (errs.length) {
            setServerError(errs[0]);
            return;
        }

        setLoading(true);
        try {
            const username = `${registerState.firstName.trim()} ${registerState.lastName.trim()}`;
            const data = await register(username, registerState.email, registerState.password);
            navigate(data?.userType === 'admin' ? '/admin/dashboard' : '/');
        } catch (err) {
            setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-on-surface font-body-md overflow-x-hidden selection:bg-primary-fixed selection:text-primary flex items-center justify-center p-4 py-12 md:py-24">
            <main className="w-full max-w-md mx-auto bg-white rounded-3xl border border-outline-variant/30 shadow-xl p-8 py-10">
                <div className="w-full">
                        {/* Logo */}
                        <div className="mb-4">
                            <Link to="/" className="flex items-center gap-2.5 mb-3">
                                <img
                                    src="/shopez-logo.png"
                                    alt="ShopEZ"
                                    className="h-9 w-9 object-contain"
                                />
                                <span className="font-display-lg text-[22px] font-bold text-primary tracking-tight">
                                    ShopEZ
                                </span>
                            </Link>
                            <div id="auth-header">
                                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1" id="form-title">
                                    {tab === 'register' ? 'Create an account' : 'Welcome back'}
                                </h2>
                                <p className="text-on-surface-variant font-body-sm text-[13px]" id="form-subtitle">
                                    {tab === 'register'
                                        ? 'Start your premium shopping journey today.'
                                        : 'Enter your credentials to access your account.'}
                                </p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-surface-container-low p-1 rounded-xl flex mb-4 border border-outline-variant/30">
                            <button
                                className={`flex-1 py-2 font-label-caps text-label-caps rounded-lg transition-all duration-300 ${
                                    tab === 'login' ? 'bg-white shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                                type="button"
                                onClick={() => { setTab('login'); setServerError(''); setError(''); }}
                            >
                                LOGIN
                            </button>
                            <button
                                className={`flex-1 py-2 font-label-caps text-label-caps rounded-lg transition-all duration-300 ${
                                    tab === 'register' ? 'bg-white shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                                type="button"
                                onClick={() => { setTab('register'); setServerError(''); setError(''); }}
                            >
                                REGISTER
                            </button>
                        </div>

                        {/* Forms Container */}
                        <div className="relative">
                            {serverError && (
                                <div className="mb-6 p-4 bg-error/10 border border-error/20 text-error rounded-xl text-sm font-semibold flex items-center gap-2">
                                    <FiInfo className="w-5 h-5 flex-shrink-0" />
                                    <span>{serverError}</span>
                                </div>
                            )}

                            {/* Login Form */}
                            <form
                                onSubmit={submitLogin}
                                className={`form-transition space-y-3 ${tab === 'login' ? '' : 'hidden'}`}
                            >
                                <div className="space-y-1">
                                    <label className="font-label-caps text-label-caps text-on-surface-variant block px-1 text-[11px]" htmlFor="login-email">
                                        Email Address
                                    </label>
                                    <input
                                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all input-focus-effect font-body-md text-sm"
                                        id="login-email"
                                        placeholder="name@example.com"
                                        required
                                        type="email"
                                        value={loginState.email}
                                        onChange={(e) => setLoginState((s) => ({ ...s, email: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="font-label-caps text-label-caps text-on-surface-variant block text-[11px]" htmlFor="login-password">
                                            Password
                                        </label>
                                        <a className="text-[11px] font-semibold text-primary hover:text-secondary transition-colors" href="#">
                                            Forgot password?
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <input
                                            className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all input-focus-effect font-body-md text-sm"
                                            id="login-password"
                                            placeholder="••••••••"
                                            required
                                            type={showPasswordLogin ? 'text' : 'password'}
                                            value={loginState.password}
                                            onChange={(e) => setLoginState((s) => ({ ...s, password: e.target.value }))}
                                        />
                                        <button
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                                            type="button"
                                            aria-label={showPasswordLogin ? 'Hide password' : 'Show password'}
                                            onClick={() => setShowPasswordLogin((v) => !v)}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">{showPasswordLogin ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-1">
                                    <input
                                        className="w-3.5 h-3.5 text-primary border-outline-variant rounded focus:ring-primary"
                                        id="remember"
                                        type="checkbox"
                                        checked={loginState.remember}
                                        onChange={(e) => setLoginState((s) => ({ ...s, remember: e.target.checked }))}
                                    />
                                    <label className="font-body-md text-[13px] text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                                        Remember Me
                                    </label>
                                </div>
                                <button
                                    className="w-full py-3 bg-primary text-white font-headline-sm text-[15px] rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20 mt-2"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </form>

                            {/* Register Form */}
                            <form
                                onSubmit={submitRegister}
                                className={`form-transition space-y-2.5 ${tab === 'register' ? '' : 'hidden'}`}
                            >
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="font-label-caps text-label-caps text-on-surface-variant block px-1 text-[11px]">First Name</label>
                                        <input
                                            className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all input-focus-effect font-body-md text-sm"
                                            placeholder="John"
                                            required
                                            type="text"
                                            value={registerState.firstName}
                                            onChange={(e) => setRegisterState((s) => ({ ...s, firstName: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-label-caps text-label-caps text-on-surface-variant block px-1 text-[11px]">Last Name</label>
                                        <input
                                            className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all input-focus-effect font-body-md text-sm"
                                            placeholder="Doe"
                                            required
                                            type="text"
                                            value={registerState.lastName}
                                            onChange={(e) => setRegisterState((s) => ({ ...s, lastName: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="font-label-caps text-label-caps text-on-surface-variant block px-1 text-[11px]">Email Address</label>
                                    <input
                                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all input-focus-effect font-body-md text-sm"
                                        placeholder="john@example.com"
                                        required
                                        type="email"
                                        value={registerState.email}
                                        onChange={(e) => setRegisterState((s) => ({ ...s, email: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-label-caps text-label-caps text-on-surface-variant block px-1 text-[11px]">Password</label>
                                    <div className="relative">
                                        <input
                                            className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all input-focus-effect font-body-md text-sm"
                                            placeholder="Create a password"
                                            required
                                            type={showPasswordRegister ? 'text' : 'password'}
                                            value={registerState.password}
                                            onChange={(e) => setRegisterState((s) => ({ ...s, password: e.target.value }))}
                                        />
                                        <button
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                                            type="button"
                                            aria-label={showPasswordRegister ? 'Hide password' : 'Show password'}
                                            onClick={() => setShowPasswordRegister((v) => !v)}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">{showPasswordRegister ? 'visibility_off' : 'visibility'}</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="font-label-caps text-label-caps text-on-surface-variant block px-1 text-[11px]">Confirm Password</label>
                                    <input
                                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all input-focus-effect font-body-md text-sm"
                                        placeholder="Confirm your password"
                                        required
                                        type="password"
                                        value={registerState.confirmPassword}
                                        onChange={(e) => setRegisterState((s) => ({ ...s, confirmPassword: e.target.value }))}
                                    />
                                </div>
                                {registerState.password && (
                                    <div className="space-y-1 pt-0.5">
                                        {passwordRules.map((rule) => (
                                            <div key={rule.label} className="flex items-center gap-2 text-[11px]">
                                                <FiCheck className={`w-3.5 h-3.5 ${rule.valid ? 'text-emerald-500' : 'text-on-surface-variant/30'}`} />
                                                <span className={rule.valid ? 'text-emerald-600 font-semibold' : 'text-on-surface-variant/60 font-medium'}>
                                                    {rule.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="text-[11px] text-on-surface-variant px-1">
                                    By creating an account, you agree to our{' '}
                                    <a className="text-primary hover:underline" href="#">Terms of Service</a> and{' '}
                                    <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
                                </p>
                                <button
                                    className="w-full py-3 bg-primary text-white font-headline-sm text-[15px] rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20 mt-2"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </form>
                        </div>

                        <footer className="mt-5 text-center">
                            <p className="text-[13px] text-on-surface-variant opacity-80">
                                © 2026 ShopEZ Premium E-commerce.<br />All rights reserved.
                            </p>
                        </footer>

                        <div className="mt-6 text-center">
                            <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-semibold text-sm">
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Home
                            </Link>
                        </div>
                    </div>
            </main>

            <style>{`
                .form-transition { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                .input-focus-effect:focus { box-shadow: 0 0 0 4px rgba(53, 37, 205, 0.1); }
            `}</style>
        </div>
    );
};

export default AuthCard;
