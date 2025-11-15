import { User } from 'lucide-react';

const Header = ({ modelName = "Untitled Model" }) => {
  return (
    <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shadow-sm">
      {/* Left section - empty for now, could add logo */}
      <div className="w-12" />
      
      {/* Center - Model Name */}
      <div className="flex-1 flex justify-center">
        <h1 className="text-base font-medium text-zinc-700">
          {modelName}
        </h1>
      </div>
      
      {/* Right - Profile Menu */}
      <div className="flex items-center gap-3">
        <button
          className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
          aria-label="User profile"
        >
          <User className="w-5 h-5 text-zinc-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
