'use client';

import React, { useState, useEffect, useRef } from 'react';
import { messaging, getToken, onMessage } from '../utils/firebase';
import { Bell, CheckCircle2, Ticket, Star, MessageSquare, X } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'ticket' | 'system' | 'social' | 'event';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Toggle Dropdown
  const handleToggle = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real Firebase FCM Integration
  useEffect(() => {
    const fetchHistory = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;
      try {
        const res = await fetch('/api/v1/notifications', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          // map backend notification format
          setNotifications(data.items.map((n: any) => ({
            id: n.notificationId,
            type: n.type.toLowerCase(),
            title: n.title,
            message: n.message,
            timestamp: new Date(n.createdAt).toLocaleString('vi-VN'),
            read: !!n.readAt
          })));
        }
      } catch (e) {
        console.error('Failed to load notification history', e);
      }
    };

    const setupFirebase = async () => {
      try {
        const msg = await messaging();
        if (!msg) {
          console.warn('Firebase Messaging not supported on this browser.');
          return;
        }

        // Xin quyền gửi thông báo (hiển thị popup trình duyệt)
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          // Lấy token thiết bị
          let swRegistration: ServiceWorkerRegistration | undefined;
          if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          }
          const token = await getToken(msg, {
            serviceWorkerRegistration: swRegistration,
          });
          
          const accessToken = localStorage.getItem('access_token');
          if (token && accessToken) {
            console.log('FCM Token acquired, sending to backend...');
            // Gửi Token này lên POST /api/v1/notifications/device-token
            let deviceId = localStorage.getItem('device_id');
            if (!deviceId) {
              deviceId = crypto.randomUUID();
              localStorage.setItem('device_id', deviceId);
            }
            
            await fetch('/api/v1/notifications/device-token', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              },
              body: JSON.stringify({
                provider: 'FCM',
                deviceId: deviceId,
                token: token,
                isActive: true
              })
            });
          }

          // Lắng nghe thông báo khi đang mở web (Foreground)
          onMessage(msg, (payload) => {
            console.log('Received foreground message:', payload);
            const newNotif = {
              id: payload.data?.notificationId || `notif-${Date.now()}`,
              type: payload.data?.type?.toLowerCase() || 'system',
              title: payload.notification?.title || 'New Notification',
              message: payload.notification?.body || '',
              timestamp: new Date().toLocaleString('en-US'),
              read: false
            };
            setNotifications(prev => [newNotif, ...prev]);
          });

          // Listen to internal custom events
          window.addEventListener('fanhub_local_push', ((e: CustomEvent) => {
            const payload = e.detail;
            console.log('Received local push:', payload);
            const newNotif = {
              id: `notif-local-${Date.now()}`,
              type: payload.type || 'system',
              title: payload.title || 'New Notification',
              message: payload.message || '',
              timestamp: new Date().toLocaleString('en-US'),
              read: false
            };
            setNotifications(prev => [newNotif, ...prev]);
            
            // Push to browser OS if granted
            if (Notification.permission === 'granted') {
              new Notification(newNotif.title, { body: newNotif.message });
            }
          }) as EventListener);        }
      } catch (error) {
        console.error('Error setting up Firebase:', error);
      }
    };

    fetchHistory();
    setupFirebase();
  }, []);

  const markAllAsRead = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      await fetch(`/api/v1/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ticket': return <Ticket size={16} className="text-emerald-500" />;
      case 'event': return <Star size={16} className="text-amber-500" />;
      case 'social': return <MessageSquare size={16} className="text-blue-500" />;
      default: return <Bell size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer border-0 bg-transparent transition-colors relative"
        title="Notifications"
      >
        <Bell size={20} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 transform origin-top-right transition-all">
          
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              Live Notifications
              <span className="bg-emerald-100 text-emerald-600 text-[9px] px-2 py-0.5 rounded-full font-bold">LIVE</span>
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide cursor-pointer flex items-center gap-1"
              >
                <CheckCircle2 size={12} /> Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                You have no notifications.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notifications.map(notif => (
                  <li 
                    key={notif.id} 
                    className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                    onClick={() => {
                      if (!notif.read) {
                        const accessToken = localStorage.getItem('access_token');
                        if (accessToken) {
                          fetch(`/api/v1/notifications/${notif.id}/read`, {
                            method: 'PUT',
                            headers: { 'Authorization': `Bearer ${accessToken}` }
                          });
                        }
                      }
                      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                    }}
                  >
                    <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                      {getIcon(notif.type)}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                        {notif.timestamp}
                      </span>
                    </div>
                    {!notif.read && (
                      <div className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5 ml-auto"></div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
