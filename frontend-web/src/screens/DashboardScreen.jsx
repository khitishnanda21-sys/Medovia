import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/medovia-icon.png';
import dashboardBg from '../assets/medovia-dashboard-bg.png';
import {
  Home, Calendar, FileText, CreditCard, Bot, Star,
  ChevronsRight, ChevronDown, Bell, Settings, HelpCircle,
  User, TrendingUp, Stethoscope, Clock,
} from 'lucide-react';

const navItems = [
  { key: 'dashboard', title: 'Dashboard', icon: Home },
  { key: 'find-doctors', title: 'Find doctors', icon: Stethoscope },
  { key: 'appointments', title: 'Appointments', icon: Calendar, notifs: 2 },
  { key: 'prescriptions', title: 'Prescriptions', icon: FileText },
  { key: 'payments', title: 'Payments', icon: CreditCard },
  { key: 'dr-matrix', title: 'Dr. Matrix', icon: Bot },
  { key: 'reviews', title: 'Reviews', icon: Star },
];

const stats = [
  { label: 'Upcoming appointments', value: '2', trend: '+1 this week', icon: Calendar, color: 'blue' },
  { label: 'Active prescriptions', value: '3', trend: '1 refill due', icon: FileText, color: 'green' },
  { label: 'Pending payments', value: '₹0', trend: 'All settled', icon: CreditCard, color: 'purple' },
  { label: 'Consultations this year', value: '12', trend: '+3 vs last year', icon: Stethoscope, color: 'orange' },
];

const recentActivity = [
  { icon: Calendar, title: 'Appointment confirmed', desc: 'Dr. Riya Mehta • Oncology', time: 'Today, 4:00 PM', color: 'blue' },
  { icon: Clock, title: 'Appointment pending', desc: 'Dr. Aman Verma • Cardiology', time: 'Tomorrow, 10:30 AM', color: 'orange' },
  { icon: FileText, title: 'Prescription issued', desc: 'Dr. Sara Khan • General checkup', time: '2 days ago', color: 'green' },
  { icon: Star, title: 'Review submitted', desc: 'Rated Dr. Vikram Rao 5 stars', time: '4 days ago', color: 'purple' },
];

const colorMap = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
};

function Sidebar({ active, onNav, onLogout, displayName }) {
  const [open, setOpen] = useState(true);

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-gray-200 bg-white p-2 shadow-sm relative z-10`}
    >
      {/* Logo / title */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3 p-2">
          <img src={logo} alt="Medovia" className="w-9 h-9 shrink-0 object-contain" />
          {open && (
            <div>
              <span className="block text-sm font-semibold text-[#0F3D3E]">MEDOVIA</span>
              <span className="block text-xs text-gray-400">{displayName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1 mb-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isSelected = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNav(item.key)}
              className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#e7f2ef] text-[#0F3D3E] border-l-2 border-[#0F3D3E]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="grid h-full w-12 place-content-center">
                <Icon className="h-4 w-4" />
              </div>
              {open && <span className="text-sm font-medium">{item.title}</span>}
              {item.notifs && open && (
                <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#0F3D3E] text-xs text-white font-medium">
                  {item.notifs}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {open && (
        <div className="border-t border-gray-200 pt-4 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Account</div>
          <button className="flex h-11 w-full items-center rounded-md text-gray-600 hover:bg-gray-50 cursor-pointer">
            <div className="grid h-full w-12 place-content-center"><Settings className="h-4 w-4" /></div>
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button className="flex h-11 w-full items-center rounded-md text-gray-600 hover:bg-gray-50 cursor-pointer">
            <div className="grid h-full w-12 place-content-center"><HelpCircle className="h-4 w-4" /></div>
            <span className="text-sm font-medium">Help & Support</span>
          </button>
          <button onClick={onLogout} className="flex h-11 w-full items-center rounded-md text-[#D85A30] hover:bg-red-50 cursor-pointer">
            <div className="grid h-full w-12 place-content-center">🚪</div>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="absolute bottom-0 left-0 right-0 border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
      >
        <div className="flex items-center p-3">
          <div className="grid size-10 place-content-center">
            <ChevronsRight className={`h-4 w-4 transition-transform duration-300 text-gray-500 ${open ? 'rotate-180' : ''}`} />
          </div>
          {open && <span className="text-sm font-medium text-gray-600">Hide</span>}
        </div>
      </button>
    </nav>
  );
}

function DashboardScreen() {
  const navigate = useNavigate();
  const [active, setActive] = useState('dashboard');
  const { currentUser } = useAuth();
  const displayName = currentUser?.email ? currentUser.email.split('@')[0] : 'User';
  const avatarLetter = displayName[0]?.toUpperCase() || 'U';

  const handleNav = (key) => {
    setActive(key);
    if (key !== 'dashboard') navigate(`/${key}`);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div
      className="flex min-h-screen w-full"
      style={{
        backgroundImage: `url(${dashboardBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Sidebar active={active} onNav={handleNav} onLogout={handleLogout} displayName={displayName} />

      <div className="flex-1 p-6 overflow-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0F3D3E]">Welcome back, {displayName}</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your care today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-900 cursor-pointer">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f2ef] text-[#0F3D3E] font-bold cursor-pointer"
            >
              {avatarLetter}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            const colors = colorMap[s.color];
            return (
              <div key={i} className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 ${colors.bg} rounded-lg`}>
                    <Icon className={`h-5 w-5 ${colors.text}`} />
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <h3 className="font-medium text-gray-600 mb-1">{s.label}</h3>
                <p className="text-2xl font-bold text-[#0F3D3E]">{s.value}</p>
                <p className="text-sm text-green-600 mt-1">{s.trend}</p>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#0F3D3E]">Recent Activity</h3>
                <button onClick={() => navigate('/appointments')} className="text-sm text-[#0F3D3E] hover:opacity-70 font-medium cursor-pointer">
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((a, i) => {
                  const Icon = a.icon;
                  const colors = colorMap[a.color];
                  return (
                    <div key={i} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className={`p-2 rounded-lg ${colors.bg}`}>
                        <Icon className={`h-4 w-4 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
                        <p className="text-xs text-gray-500 truncate">{a.desc}</p>
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap">{a.time}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats + Upcoming */}
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0F3D3E] mb-4">Health Snapshot</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Checkup completion</span>
                    <span className="text-sm font-medium text-[#0F3D3E]">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#0F3D3E] h-2 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Prescription adherence</span>
                    <span className="text-sm font-medium text-[#0F3D3E]">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Profile completeness</span>
                    <span className="text-sm font-medium text-[#0F3D3E]">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0F3D3E] mb-4">Upcoming Appointments</h3>
              <div className="space-y-3">
                {[
                  { doctor: 'Dr. Riya Mehta', when: 'Today, 4:00 PM' },
                  { doctor: 'Dr. Aman Verma', when: 'Tomorrow, 10:30 AM' },
                ].map((appt, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">{appt.doctor}</span>
                    <span className="text-sm font-medium text-[#0F3D3E]">{appt.when}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardScreen;