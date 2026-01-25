import React, { type ReactNode } from 'react';
import { Activity, HelpCircle, User, Menu } from 'lucide-react';

interface AppShellProps {
    children: ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-100 dark:selection:bg-blue-900">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20">
                            <Activity size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                Clinical Risk Predictor
                            </h1>
                            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10">
                                SOTA Ensemble v1
                            </span>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Documentation</a>
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</a>
                        </nav>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

                        <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors" aria-label="Help">
                            <HelpCircle size={20} />
                        </button>

                        <button className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" aria-label="User Profile">
                            <User size={16} />
                        </button>

                        <button className="md:hidden text-slate-500" aria-label="Menu">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {children}
            </main>
        </div>
    );
};

export default AppShell;
