import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskGaugeProps {
    riskScore: number; // 0 to 1
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ riskScore }) => {
    const percentage = Math.round(riskScore * 100);

    // Data for the half-pie chart
    // We use 3 sections: Low (Green), Medium (Yellow), High (Red) for the background
    // And a needle or simple value display. 
    // For simplicity, let's use a single value pie chart that fills up to the score.

    const data = [
        { name: 'Score', value: percentage },
        { name: 'Remaining', value: 100 - percentage },
    ];

    // Color interpolation could be better, but simple thresholds for now
    let color = '#22c55e'; // Green
    if (riskScore > 0.33) color = '#eab308'; // Yellow
    if (riskScore > 0.66) color = '#ef4444'; // Red

    const cx = "50%";
    const cy = "70%";
    const iR = 60;
    const oR = 100;

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            dataKey="value"
                            startAngle={180}
                            endAngle={0}
                            data={data}
                            cx={cx}
                            cy={cy}
                            innerRadius={iR}
                            outerRadius={oR}
                            fill="#8884d8"
                            stroke="none"
                        >
                            <Cell fill={color} />
                            <Cell fill="#e5e7eb" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 text-center">
                    <span className="text-4xl font-bold" style={{ color }}>
                        {percentage}%
                    </span>
                    <p className="text-sm text-gray-500 font-medium">
                        {riskScore < 0.33 ? 'Low Risk' : riskScore < 0.66 ? 'Medium Risk' : 'High Risk'}
                    </p>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-[-20px] text-center max-w-[200px]">
                Based on the provided clinical features.
            </p>
        </div>
    );
};

export default RiskGauge;
