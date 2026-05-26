import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../services/authService';
import { LogOut, History as HistoryIcon, User } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-20">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/history"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <HistoryIcon className="h-4 w-4" />
            History
          </Link>
          
          <div className="h-4 w-px bg-slate-200 mx-1" />
          
          <div className="flex items-center gap-2 text-slate-600">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">
              {user?.displayName || user?.email?.split('@')[0]}
            </span>
          </div>

          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
