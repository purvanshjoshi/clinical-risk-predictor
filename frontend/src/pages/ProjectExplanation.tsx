import React from 'react';

const ProjectExplanation: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-slate-800">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary to-blue-800 text-white py-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-5 max-w-7xl mx-auto rounded-full blur-3xl transform -translate-y-10 translate-x-10"></div>
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-semibold tracking-wide uppercase shadow-sm">
                        Praxis 2.0 Submission
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                        Clinical Risk <span className="text-secondary">Predictor</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mb-10 leading-relaxed font-light">
                        Revolutionizing healthcare with <strong className="text-white font-semibold">Generative AI</strong> and <strong className="text-white font-semibold">Machine Learning</strong>.
                        Empowering clinicians with precision and patients with clarity.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-8 py-4 bg-secondary hover:bg-emerald-400 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-shadow-sm">
                            Explore Dashboard
                        </button>
                        <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-lg font-semibold text-lg transition-all">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* Core Concept Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">The Core Concept</h2>
                    <div className="h-1 w-24 bg-accent mx-auto rounded-full"></div>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                        Addressing the silence of chronic diseases through intelligent early detection and personalized communication.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-slate-100 group">
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-800">Risk Scoring</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Advanced ML algorithms stratify patients by risk level, providing confidence intervals to quantify uncertainty and aid clinical judgment.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-slate-100 group">
                        <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-800">Explainability</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Black-box no more. We use SHAP values to rank contributing factors, telling you exactly <em>why</em> a risk score was assigned.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-slate-100 group">
                        <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-slate-800">Generative Insight</h3>
                        <p className="text-slate-600 leading-relaxed">
                            LLMs transform complex data into plain-language summaries for patients and detailed technical reports for clinicians.
                        </p>
                    </div>
                </div>
            </section>

            {/* Theme Showcase Section */}
            <section className="bg-white py-20 px-6 border-t border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold mb-6 text-slate-900">Design Philosophy & Theme</h2>
                            <p className="text-lg text-slate-600 mb-6">
                                Our design language balances <strong>clinical precision</strong> with <strong>human warmth</strong>.
                                We utilize a palette that inspires trust and promotes healing.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary shadow-md"></div>
                                    <div>
                                        <strong className="block text-slate-800">Deep Sky Blue (Primary)</strong>
                                        <span className="text-sm text-slate-500">Represents trust, technology, and professionalism.</span>
                                    </div>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-secondary shadow-md"></div>
                                    <div>
                                        <strong className="block text-slate-800">Emerald Teal (Secondary)</strong>
                                        <span className="text-sm text-slate-500">Symbolizes health, growth, and positive outcomes.</span>
                                    </div>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-accent shadow-md"></div>
                                    <div>
                                        <strong className="block text-slate-800">Soft Rose (Accent)</strong>
                                        <span className="text-sm text-slate-500">Highlights critical alerts and calls to action without alarm.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="md:w-1/2 relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl blur-lg opacity-70"></div>
                            <div className="relative bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                                <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    <span className="ml-auto text-xs font-mono text-slate-400">UI Preview</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-8 w-3/4 bg-slate-100 rounded animate-pulse"></div>
                                    <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                                    <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse"></div>
                                    <div className="flex gap-3 mt-6">
                                        <div className="h-10 w-24 bg-primary rounded-lg opacity-90"></div>
                                        <div className="h-10 w-24 bg-secondary rounded-lg opacity-90"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center">
                <p className="mb-2">© 2025 Clinical Risk Predictor Team.</p>
                <p className="text-sm">Built for the GenAI + Machine Learning Innovation Showcase.</p>
            </footer>
        </div>
    );
};

export default ProjectExplanation;
