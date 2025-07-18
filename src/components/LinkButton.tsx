import React from "react";

interface LinkButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-3 py-2 rounded bg-gray-800 hover:bg-neon-green/20 text-gray-200 hover:text-neon-green transition-colors border border-gray-700 hover:border-neon-green shadow"
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </a>
);

export default LinkButton; 