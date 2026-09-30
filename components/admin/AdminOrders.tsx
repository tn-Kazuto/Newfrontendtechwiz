'use client';

import React, { useState } from 'react';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  Download,
} from 'lucide-react';

interface AdminOrdersProps {
  searchQuery: string;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ searchQuery: externalSearch }) => {
  const { t } = useAdminLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const activeSearch = externalSearch || searchTerm;

  const orders = [
    {
      id: 'ORD-9842',
      customer: 'Minji Park',
      email: 'minji@fandom.kr',
      country: '🇰🇷 South Korea',
      product: 'NewJeans Supernatural (Drawstring Bag Ver)',
      totalUSD: 28.0,
      totalVND: 700000,
      status: 'paid',
      date: '2026-09-25 10:42',
      itemsCount: 2,
    },
    {
      id: 'ORD-9841',
      customer: 'Sarah Jenkins',
      email: 'sarah@kpopfan.com',
      country: '🇺🇸 United States',
      product: 'BLACKPINK Born Pink Official Lightstick v2',
      totalUSD: 55.0,
      totalVND: 1375000,
      status: 'processing',
      date: '2026-09-25 10:15',
      itemsCount: 1,
    },
    {
      id: 'ORD-9840',
      customer: 'Nguyen Van A',
      email: 'nguyenvana@gmail.com',
      country: '🇻🇳 Vietnam',
      product: 'BTS Proof (Collector Edition Photobook)',
      totalUSD: 45.0,
      totalVND: 1125000,
      status: 'shipped',
      date: '2026-09-25 09:30',
      itemsCount: 3,
    },
    {
      id: 'ORD-9839',
      customer: 'Kenji Sato',
      email: 'kenji@tokyo-hub.jp',
      country: '🇯🇵 Japan',
      product: 'Stray Kids ATE (Limited Edition Accordion Ver)',
      totalUSD: 22.0,
      totalVND: 550000,
      status: 'paid',
      date: '2026-09-25 08:50',
      itemsCount: 1,
    },
    {
      id: 'ORD-9838',
      customer: 'Emily Watson',
      email: 'emily@london-fans.co.uk',
      country: '🇬🇧 United Kingdom',
      product: 'IVE SWITCH Special Photocard Binder Set',
      totalUSD: 35.0,
      totalVND: 875000,
      status: 'cancelled',
      date: '2026-09-24 23:10',
      itemsCount: 2,
    },
  ];

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(activeSearch.toLowerCase()) ||
      ord.customer.toLowerCase().includes(activeSearch.toLowerCase()) ||
      ord.product.toLowerCase().includes(activeSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderRadius: '8px' }}>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('orders')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage fan purchases, shipment tracking numbers, and invoice exports
          </p>
        </div>

        <button
          onClick={() => alert('Exporting orders report...')}
          type="button"
          style={{ borderRadius: '8px' }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{t('exportReport')}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderRadius: '8px' }}>
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders by customer name, order ID, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: '8px' }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ borderRadius: '8px' }}
            className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="paid">{t('statusPaid')}</option>
            <option value="processing">{t('statusProcessing')}</option>
            <option value="shipped">{t('statusShipped')}</option>
            <option value="cancelled">{t('statusCancelled')}</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden" style={{ borderRadius: '8px' }}>
        <div className="overflow-x-auto admin-custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">{t('orderId')}</th>
                <th className="py-3.5 px-4">{t('customer')}</th>
                <th className="py-3.5 px-4">{t('product')}</th>
                <th className="py-3.5 px-4">{t('total')}</th>
                <th className="py-3.5 px-4">{t('status')}</th>
                <th className="py-3.5 px-4">{t('date')}</th>
                <th className="py-3.5 px-4 text-right">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {ord.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{ord.customer}</div>
                    <div className="text-[10px] text-slate-400">{ord.country} • {ord.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300 max-w-xs truncate">
                    {ord.product} ({ord.itemsCount} items)
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                    ${ord.totalUSD.toFixed(2)}
                    <div className="text-[10px] text-slate-400 font-normal">
                      {ord.totalVND.toLocaleString()} ₫
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {ord.status === 'paid' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300" style={{ borderRadius: '8px' }}>
                        <CheckCircle2 className="w-3 h-3" />
                        {t('statusPaid')}
                      </span>
                    )}
                    {ord.status === 'processing' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300" style={{ borderRadius: '8px' }}>
                        <Clock className="w-3 h-3" />
                        {t('statusProcessing')}
                      </span>
                    )}
                    {ord.status === 'shipped' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300" style={{ borderRadius: '8px' }}>
                        <Truck className="w-3 h-3" />
                        {t('statusShipped')}
                      </span>
                    )}
                    {ord.status === 'cancelled' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300" style={{ borderRadius: '8px' }}>
                        <XCircle className="w-3 h-3" />
                        {t('statusCancelled')}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-500 dark:text-slate-400">
                    {ord.date}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Order details for ${ord.id}`)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
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
