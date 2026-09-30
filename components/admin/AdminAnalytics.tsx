'use client';

import React from 'react';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import { BarChart3, TrendingUp, ShieldCheck, Download, RefreshCw } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { t } = useAdminLanguage();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('analytics')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deep dive into Hanteo & Circle chart reporting, fan conversion metrics, and revenue breakdown
          </p>
        </div>

        <button
          onClick={() => alert('Refreshing chart telemetry...')}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 dark:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t('refreshData')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Hanteo Family Chart Real-time Sync
            </h3>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Active 100%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Every album purchase on Fan Hub Plus is reported live to Hanteo Chart (Korea) and Circle Chart for official comeback ranking.
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>Total Units Synced This Month:</span>
              <span className="text-sky-600 dark:text-sky-400">28,690 units</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Sync Failure Rate:</span>
              <span className="text-emerald-600">0.00%</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Last Batch API Response:</span>
              <span className="text-slate-500">200 OK (30s ago)</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
            AI Assistant Conversion & Telemetry
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Performance stats for AI assistant handling album recommendations and pre-order queries.
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>Queries Answered:</span>
              <span className="text-purple-600">19,530</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Cart Additions via AI Bot:</span>
              <span className="text-emerald-600">4,120 items</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>User Satisfaction Score:</span>
              <span className="text-amber-500 font-black">4.9 / 5.0 ⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
