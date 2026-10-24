import { LogOut, Menu, Search, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onLogout: () => void;
}

const Navbar = ({ search, onSearchChange, sidebarOpen = false, onToggleSidebar, onLogout }: NavbarProps) => (
  <header className="flex items-center justify-between gap-4 bg-slate-700 px-6 py-3 text-white">
    {onToggleSidebar ? (
      <button
        type="button"
        aria-label={sidebarOpen ? 'Collapse filters' : 'Open filters'}
        aria-expanded={sidebarOpen}
        onClick={onToggleSidebar}
        className="shrink-0 rounded p-1 hover:bg-slate-600"
      >
        <Menu size={28} />
      </button>
    ) : (
      <Link to="/products" className="shrink-0 font-semibold text-white hover:text-blue-200">
        Product Explorer
      </Link>
    )}

    <div className="relative w-full max-w-xl">
      <Search
        size={20}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
      />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-md bg-white py-2 pl-10 pr-3 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    <div className="flex shrink-0 items-center gap-5">
      <Link to="/products" aria-label="Browse products" className="hover:text-blue-200">
        <ShoppingBag size={24} />
      </Link>
      <button
        type="button"
        aria-label="Sign out"
        onClick={onLogout}
        className="rounded p-1 hover:bg-slate-600"
      >
        <LogOut size={23} />
      </button>
    </div>
  </header>
);

export default Navbar;