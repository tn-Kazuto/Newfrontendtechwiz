'use client';

import React, { useState } from 'react';
import { useAdminLanguage } from '../../context/AdminLanguageContext';
import { Settings, Globe, ShieldCheck, Bell, CheckCircle2, Save } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { t, language, setLanguage } = useAdminLanguage();
  const [autoSync, setAutoSync] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('settingsTitle')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure default language options, chart reporting parameters, and notification alerts
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{t('changesSaved')}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {/* Language Preference Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Globe className="w-5 h-5 text-sky-500" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {t('language')} Settings / Language Preferences
            </h3>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Default Admin Language
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Admin default is English. You can switch between English and Vietnamese anytime using the top header pill or below.
            </p>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="adminLanguage"
                  value="en"
                  checked={language === 'en'}
                  onChange={() => setLanguage('en')}
                  className="w-4 h-4 text-sky-500"
                />
                <span>English (Default) 🇬🇧</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                <input
                  type="radio"
                  name="adminLanguage"
                  value="vi"
                  checked={language === 'vi'}
                  onChange={() => setLanguage('vi')}
                  className="w-4 h-4 text-sky-500"
                />
                <span>Vietnamese 🇻🇳</span>
              </label>
            </div>
          </div>
        </div>

        {/* Chart Sync Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {t('hanteoIntegration')}
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('hanteoDescription')}
          </p>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500"
              />
              <span>{t('autoSync')}</span>
            </label>

            <label className="flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500"
              />
              <span>{t('emailAlerts')}</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{t('saveChanges')}</span>
        </button>
      </form>
    </div>
  );
};
