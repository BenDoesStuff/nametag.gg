import React from "react";

interface StatBlockProps {
  label: string;
  value: string | number;
}

const StatBlock: React.FC<StatBlockProps> = ({ label, value }) => (
  <div className="flex flex-col items-center bg-gray-800 rounded-lg px-4 py-2 shadow border border-gray-700">
    <span className="text-neon-green text-lg font-bold">{value}</span>
    <span className="text-gray-400 text-xs uppercase tracking-wider mt-1">{label}</span>
  </div>
);

export default StatBlock; 