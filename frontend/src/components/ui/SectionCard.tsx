import React, { type ReactNode } from 'react';
import { cn } from '../../lib/utils'; // Assuming cn exists or I will create it, otherwise I'll use template literals

interface SectionCardProps {
    title?: string;
    subtitle?: string;
    children: ReactNode;
    className?: string;
    action?: ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, subtitle, children, className, action }) => {
    return (
        <section className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden ${className || ''}`}>
            {(title || action) && (
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                        {title && <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>}
                        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </section>
    );
};

export default SectionCard;
