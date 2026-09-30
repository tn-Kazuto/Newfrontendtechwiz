'use client';

import React, { useState } from 'react';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import { Users, Search, Award, ShieldCheck, Heart, Mail } from 'lucide-react';

interface AdminCustomersProps {
  searchQuery: string;
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ searchQuery: externalSearch }) => {
  const { t } = useAdminLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const activeSearch = externalSearch || searchTerm;

  const fandomMembers = [
    {
      id: 'USR-101',
      name: 'Minji Park',
      bias: 'NewJeans (Haerin)',
      email: 'minji@fandom.kr',
      country: '🇰🇷 South Korea',
      tier: 'VIP Gold Fan',
      pocaPoints: 4850,
      totalSpentUSD: 1420,
      ordersCount: 18,
    },
    {
      id: 'USR-102',
      name: 'Sarah Jenkins',
      bias: 'BLACKPINK (Jennie)',
      email: 'sarah@kpopfan.com',
      country: '🇺🇸 United States',
      tier: 'VIP Platinum',
      pocaPoints: 8200,
      totalSpentUSD: 2650,
      ordersCount: 32,
    },
    {
      id: 'USR-103',
      name: 'Nguyen Van A',
      bias: 'BTS (V)',
      email: 'nguyenvana@gmail.com',
      country: '🇻🇳 Vietnam',
      tier: 'Silver Fan',
      pocaPoints: 1250,
      totalSpentUSD: 380,
      ordersCount: 5,
    },
    {
      id: 'USR-104',
      name: 'Kenji Sato',
      bias: 'Stray Kids (Felix)',
      email: 'kenji@tokyo-hub.jp',
      country: '🇯🇵 Japan',
      tier: 'VIP Gold Fan',
      pocaPoints: 5100,
      totalSpentUSD: 1680,
      ordersCount: 22,
    },
    {
      id: 'USR-105',
      name: 'Emily Watson',
      bias: 'IVE (Wonyoung)',
      email: 'emily@london-fans.co.uk',
      country: '🇬🇧 United Kingdom',
      tier: 'Bronze Fan',
      pocaPoints: 800,
      totalSpentUSD: 240,
      ordersCount: 3,
    },
  ];

  const filtered = fandomMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(activeSearch.toLowerCase()) ||
      m.bias.toLowerCase().includes(activeSearch.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('customers')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor fandom loyalty tiers, POCA point rewards balance, and fan profiles
        </p>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search members by name, bias group, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-transparent rounded-xl outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Favorite Bias</th>
                <th className="py-3.5 px-4">Loyalty Tier</th>
                <th className="py-3.5 px-4">POCA Points</th>
                <th className="py-3.5 px-4">Total Lifetime Spent</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 dark:text-white">{user.name}</div>
                    <div className="text-[10px] text-slate-400">{user.country} • {user.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                    <span>{user.bias}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      {user.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-amber-600 dark:text-amber-400">
                    ⭐ {user.pocaPoints.toLocaleString()} pts
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                    ${user.totalSpentUSD.toLocaleString()} ({user.ordersCount} orders)
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Sending message to ${user.name}`)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 cursor-pointer"
                      title="Send Message"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
