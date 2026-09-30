'use client';
import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { 
  Activity, Server, Zap, Users, ArrowRight, ShieldAlert, 
  Terminal, CheckCircle2, ArrowUpRight, Radio, Compass, RefreshCw,
  Sun, Moon
} from 'lucide-react';

export default function SystemMonitorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sysStatus, setSysStatus] = useState<any>(null);
  const [isLightMode, setIsLightMode] = useState(true); // Default to Bright Mode!

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/system-status.json?t=' + Date.now());
        const data = await res.json();
        setSysStatus(data);
      } catch (e) {
        // file might not exist if script isn't running
      }
    };
    fetchStatus();
    const iv = setInterval(fetchStatus, 300);
    return () => clearInterval(iv);
  }, []);

  const getStatusColor = (status: string, cpu: number) => {
    if (status === 'SCALING_UP') return isLightMode ? 'text-rose-600 border-rose-500 bg-rose-100 animate-pulse font-bold' : 'text-rose-500 border-rose-500 bg-rose-500/10 animate-pulse';
    if (status === 'SCALING_DOWN') return isLightMode ? 'text-amber-700 border-amber-500 bg-amber-100 font-bold' : 'text-amber-500 border-amber-500 bg-amber-500/10';
    if (status === 'BALANCED') return isLightMode ? 'text-blue-700 border-blue-500 bg-blue-100 font-bold' : 'text-blue-400 border-blue-400 bg-blue-500/10';
    if (cpu > 80) return isLightMode ? 'text-red-700 border-red-500 bg-red-100 animate-pulse font-bold' : 'text-red-500 border-red-500 bg-red-500/10 animate-pulse';
    if (cpu > 50) return isLightMode ? 'text-amber-700 border-amber-500 bg-amber-100 font-bold' : 'text-amber-500 border-amber-500 bg-amber-500/10';
    return isLightMode ? 'text-emerald-700 border-emerald-500 bg-emerald-100 font-bold' : 'text-emerald-500 border-emerald-500 bg-emerald-500/10';
  };

  const getCpuBarColor = (cpu: number) => {
    if (cpu > 80) return 'bg-rose-500';
    if (cpu > 50) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const renderServiceCard = (title: string, svcKey: string, description: string, route: string) => {
    const svc = sysStatus?.services?.[svcKey] || { replicas: 0, avgCpu: 0, status: 'OFFLINE', totalRequests: 0, rps: 0, nodes: [] };
    const isActiveHotspot = sysStatus?.hotspot === svcKey;
    const totalSlots = 4;
    const activeNodes = svc.nodes || [];

    return (
      <div className={`p-6 rounded-2xl border-2 transition-all duration-500 flex flex-col justify-between h-full ${
        isActiveHotspot 
          ? isLightMode
            ? 'border-rose-500 bg-white shadow-[0_4px_30px_rgba(244,63,94,0.18)] ring-2 ring-rose-500/20'
            : 'border-rose-500 bg-slate-900/90 shadow-[0_0_25px_rgba(244,63,94,0.25)]' 
          : isLightMode
            ? 'border-slate-200 bg-white shadow-sm hover:shadow-md'
            : 'border-slate-800 bg-slate-900'
      }`}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className={`text-xl font-bold uppercase tracking-wider flex items-center gap-2 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                <Server size={20} className={isActiveHotspot ? 'text-rose-500' : (isLightMode ? 'text-slate-500' : 'text-slate-400')} />
                {title}
              </h3>
              <p className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{description}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(svc.status, svc.avgCpu)}`}>
              {svc.status === 'OFFLINE' ? 'OFFLINE' : svc.status}
            </div>
          </div>

          {/* Route & Request Counter */}
          <div className={`rounded-xl p-3 border mb-4 flex items-center justify-between ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800/80'}`}>
            <div>
              <div className={`text-[10px] font-mono uppercase ${isLightMode ? 'text-slate-500' : 'text-slate-500'}`}>API Route</div>
              <div className={`text-xs font-mono font-bold ${isLightMode ? 'text-blue-600' : 'text-blue-400'}`}>{route}</div>
            </div>
            <div className="text-right">
              <div className={`text-[10px] font-mono uppercase ${isLightMode ? 'text-slate-500' : 'text-slate-500'}`}>Live Ingress Traffic</div>
              <div className={`text-sm font-mono font-bold flex items-center justify-end gap-1.5 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                <span>{svc.totalRequests?.toLocaleString() || 0}</span>
                <span className={`text-[10px] ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>reqs</span>
                {svc.rps > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold animate-pulse ${
                    isLightMode ? 'bg-amber-100 border border-amber-300 text-amber-800' : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                  }`}>
                    {svc.rps} r/s
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className={isLightMode ? 'text-slate-600 font-medium' : 'text-slate-300'}>Cluster CPU Load</span>
              <span className={svc.avgCpu > 80 ? (isLightMode ? 'text-rose-600 font-bold' : 'text-rose-400 font-bold') : (isLightMode ? 'text-emerald-700 font-bold' : 'text-emerald-400 font-bold')}>{svc.avgCpu}%</span>
            </div>
            <div className={`w-full rounded-full h-3 overflow-hidden ${isLightMode ? 'bg-slate-200' : 'bg-slate-800'}`}>
              <div 
                className={`h-full transition-all duration-500 ${getCpuBarColor(svc.avgCpu)}`} 
                style={{ width: `${Math.min(100, Math.max(0, svc.avgCpu))}%` }}
              />
            </div>
          </div>
        </div>

        <div className={`space-y-3 pt-3 border-t ${isLightMode ? 'border-slate-200' : 'border-slate-800/60'}`}>
          <div className="flex items-center justify-between">
            <h4 className={`text-xs uppercase font-bold flex items-center gap-1.5 ${isLightMode ? 'text-slate-700' : 'text-slate-400'}`}>
              <span>Load-Balanced Nodes ({svc.replicas})</span>
              {svc.replicas > 1 && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                  isLightMode ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  AUTOSCALED
                </span>
              )}
            </h4>
            <span className={`text-[10px] font-mono ${isLightMode ? 'text-slate-500' : 'text-slate-500'}`}>Algorithm: Round-Robin</span>
          </div>

          {/* Consistent 4-slot grid (2x2) so layout NEVER drops node to bottom */}
          <div className="grid grid-cols-2 gap-2 content-start">
            {activeNodes.map((node: any, idx: number) => (
              <div 
                key={node.name || idx} 
                className={`border p-2.5 rounded-lg flex flex-col justify-between transition-all duration-500 transform ${
                  idx > 0 && svc.status === 'SCALING_UP'
                    ? isLightMode
                      ? 'border-rose-400 bg-rose-50/80 shadow-md ring-1 ring-rose-400/50 scale-[1.02]'
                      : 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.35)] scale-[1.02] bg-slate-950'
                    : isLightMode
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-2xs'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
                style={{
                  animation: 'nodePopIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 truncate mr-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className={`text-[10px] font-mono font-bold truncate ${isLightMode ? 'text-slate-800' : 'text-slate-300'}`} title={node.name}>
                      Node #{node.name.split('-').pop()}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    node.cpu > 80 
                      ? isLightMode ? 'bg-rose-100 text-rose-700 font-bold' : 'bg-rose-500/20 text-rose-400' 
                      : isLightMode ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {node.cpu}%
                  </span>
                </div>
                <div className={`flex items-center justify-between text-[10px] font-mono pt-1 border-t ${isLightMode ? 'border-slate-200 text-slate-500' : 'border-slate-900 text-slate-500'}`}>
                  <span>Share: {node.share || 100}%</span>
                  <span className={`font-semibold ${isLightMode ? 'text-slate-800' : 'text-slate-300'}`}>{node.requests?.toLocaleString() || 0} reqs</span>
                </div>
              </div>
            ))}

            {/* Standby Slots: Keeps 1-node and 2-node cards perfectly aligned with 4-node cards */}
            {Array.from({ length: Math.max(0, totalSlots - activeNodes.length) }).map((_, sIdx) => {
              const slotNum = activeNodes.length + sIdx + 1;
              return (
                <div 
                  key={`standby-${slotNum}`} 
                  className={`border border-dashed rounded-lg p-2.5 flex flex-col items-center justify-center min-h-[58px] transition-all duration-500 ${
                    isLightMode ? 'border-slate-300 bg-slate-100/50 text-slate-500' : 'border-slate-800/40 bg-slate-950/20 text-slate-600'
                  }`}
                >
                  <span className={`text-[10px] font-mono font-medium ${isLightMode ? 'text-slate-600' : 'text-slate-600'}`}>
                    Standby #{slotNum}
                  </span>
                  <span className={`text-[9px] mt-0.5 ${isLightMode ? 'text-slate-400' : 'text-slate-700'}`}>Scale pool</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${isLightMode ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes nodePopIn {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(8px);
          }
          60% {
            transform: scale(1.03) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}} />
      <AdminSidebar activeTab="system" setActiveTab={() => {}} isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col transition-all duration-300 overflow-hidden">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        
        <div className={`flex-1 overflow-auto p-6 lg:p-10 transition-colors duration-300 ${isLightMode ? 'bg-slate-100/90' : 'bg-slate-950'}`}>
          <div className="max-w-[1400px] mx-auto">
            
            {/* Header section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className={`text-3xl font-black uppercase tracking-tight flex items-center gap-3 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                  <Activity className="text-emerald-500" size={32} />
                  Live System Monitor
                </h1>
                <p className={`mt-2 text-sm ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
                  Kong API Gateway Real-time Routing & Docker Container Auto-Scaling Telemetry
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Theme Switcher Button */}
                <button
                  onClick={() => setIsLightMode(!isLightMode)}
                  type="button"
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                    isLightMode 
                      ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:border-slate-400' 
                      : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
                  }`}
                  title="Chuyển chế độ Giao diện Sáng / Tối"
                >
                  {isLightMode ? (
                    <>
                      <Sun size={16} className="text-amber-500 fill-amber-500" />
                      <span>Giao diện Sáng</span>
                    </>
                  ) : (
                    <>
                      <Moon size={16} className="text-indigo-400" />
                      <span>Giao diện Tối</span>
                    </>
                  )}
                </button>

                <div className={`border px-5 py-3 rounded-xl flex items-center gap-4 flex-1 md:flex-initial shadow-xs ${
                  isLightMode ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                }`}>
                  <Users className="text-blue-500" size={24} />
                  <div>
                    <div className={`text-[10px] uppercase font-bold ${isLightMode ? 'text-slate-500' : 'text-slate-500'}`}>Active User Threads</div>
                    <div className={`text-2xl font-black font-mono ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{sysStatus?.activeUsers?.toLocaleString() || 0}</div>
                  </div>
                </div>

                <div className={`border px-5 py-3 rounded-xl flex items-center gap-4 flex-1 md:flex-initial shadow-xs ${
                  isLightMode ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                }`}>
                  <Zap className="text-amber-500" size={24} />
                  <div>
                    <div className={`text-[10px] uppercase font-bold ${isLightMode ? 'text-slate-500' : 'text-slate-500'}`}>Total Routed Requests</div>
                    <div className={`text-2xl font-black font-mono ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{sysStatus?.totalRequests?.toLocaleString() || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Traffic Pipeline Diagram */}
            <div className={`border-2 rounded-2xl p-6 mb-8 relative overflow-hidden transition-colors ${
              isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <ShieldAlert size={140} className={isLightMode ? 'text-slate-900' : 'text-slate-300'} />
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Compass className="text-blue-500" size={16} />
                  <h3 className={`text-xs font-bold uppercase tracking-widest ${isLightMode ? 'text-slate-700' : 'text-slate-400'}`}>
                    Intelligent Traffic Pipeline & Routing Topology
                  </h3>
                </div>
                {sysStatus?.activeEndpoint && (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                    isLightMode ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                  }`}>
                    <Radio className="text-blue-500 animate-pulse" size={14} />
                    <span className="text-xs font-mono font-bold">TARGET: {sysStatus.activeEndpoint}</span>
                    {sysStatus.requestsPerSec > 0 && (
                      <span className={`text-xs font-mono font-bold ml-2 ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`}>⚡ {sysStatus.requestsPerSec} req/s</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                
                {/* Gateway Box */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-xl shadow-lg z-10 w-full lg:w-72 border border-blue-400/40 text-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded font-mono font-bold">INSPECTOR</span>
                    <span className="text-[10px] text-emerald-300 font-mono flex items-center gap-1 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> ONLINE
                    </span>
                  </div>
                  <div className="text-white font-black text-xl tracking-tight">KONG GATEWAY</div>
                  <div className="text-blue-100 text-xs font-mono mt-1">Port 8080 &bull; Round-Robin Balancer</div>
                  <div className="mt-3 pt-3 border-t border-blue-400/40 flex justify-between text-[11px] font-mono text-blue-100">
                    <span>Active Ingress:</span>
                    <span className="font-bold">{sysStatus?.activeUsers > 0 ? `${sysStatus.activeUsers} Streams` : 'Idle'}</span>
                  </div>
                </div>
                
                {/* Visual Pipeline Beams */}
                <div className="flex-1 flex flex-col items-center justify-center w-full px-4">
                  <div className="w-full flex items-center justify-between text-xs font-mono mb-2">
                    <span className={`text-[11px] font-medium ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>Reverse Proxy Dispatch</span>
                    <span className={`font-bold ${isLightMode ? 'text-amber-700' : 'text-amber-400'}`}>{sysStatus?.requestsPerSec > 0 ? `${sysStatus.requestsPerSec} requests/sec` : 'Standing By'}</span>
                  </div>
                  <div className={`w-full h-2 rounded-full relative overflow-hidden border ${isLightMode ? 'bg-slate-200 border-slate-300' : 'bg-slate-950 border-slate-800'}`}>
                    {sysStatus?.hotspot && (
                      <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 via-rose-500 to-amber-400 animate-pulse" />
                    )}
                  </div>
                  <div className={`flex items-center gap-3 mt-2 text-xs font-mono ${isLightMode ? 'text-slate-600' : 'text-slate-500'}`}>
                    <ArrowRight size={16} className={sysStatus?.hotspot ? 'text-rose-500 animate-bounce' : (isLightMode ? 'text-slate-400' : 'text-slate-600')} />
                    <span>Dynamic Service Resolution</span>
                  </div>
                </div>

                {/* Target Services Stack */}
                <div className="flex flex-col gap-3 w-full lg:w-96 z-10">
                  
                  {/* Event Target */}
                  <div className={`px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all duration-300 ${
                    sysStatus?.hotspot === 'event-service' 
                      ? (isLightMode ? 'bg-rose-50 border-rose-400 text-slate-900 shadow-sm' : 'bg-rose-950/80 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] text-white')
                      : (isLightMode ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200')
                  }`}>
                    <div>
                      <div className={`text-sm font-bold flex items-center gap-2 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                        Event Service
                        {sysStatus?.hotspot === 'event-service' && <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded font-mono font-bold animate-pulse">RECEIVING 100%</span>}
                      </div>
                      <div className={`text-[11px] font-mono mt-0.5 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>/api/v1/events &bull; {sysStatus?.services?.['event-service']?.totalRequests?.toLocaleString() || 0} reqs</div>
                    </div>
                    <span className={`text-xs font-mono font-bold ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{sysStatus?.services?.['event-service']?.replicas || 1} Nodes</span>
                  </div>

                  {/* Booking Target */}
                  <div className={`px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all duration-300 ${
                    sysStatus?.hotspot === 'booking-service' 
                      ? (isLightMode ? 'bg-amber-50 border-amber-400 text-slate-900 shadow-sm' : 'bg-amber-950/80 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-white')
                      : (isLightMode ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200')
                  }`}>
                    <div>
                      <div className={`text-sm font-bold flex items-center gap-2 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                        Booking Service
                        {sysStatus?.hotspot === 'booking-service' && <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded font-mono font-bold animate-pulse">RECEIVING 100%</span>}
                      </div>
                      <div className={`text-[11px] font-mono mt-0.5 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>/api/v1/bookings &bull; {sysStatus?.services?.['booking-service']?.totalRequests?.toLocaleString() || 0} reqs</div>
                    </div>
                    <span className={`text-xs font-mono font-bold ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{sysStatus?.services?.['booking-service']?.replicas || 1} Nodes</span>
                  </div>

                  {/* Payment Target */}
                  <div className={`px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all duration-300 ${
                    sysStatus?.hotspot === 'payment-service' 
                      ? (isLightMode ? 'bg-emerald-50 border-emerald-400 text-slate-900 shadow-sm' : 'bg-emerald-950/80 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white')
                      : (isLightMode ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200')
                  }`}>
                    <div>
                      <div className={`text-sm font-bold flex items-center gap-2 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                        Payment Service
                        {sysStatus?.hotspot === 'payment-service' && <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-mono font-bold animate-pulse">RECEIVING 100%</span>}
                      </div>
                      <div className={`text-[11px] font-mono mt-0.5 ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>/api/v1/payments &bull; {sysStatus?.services?.['payment-service']?.totalRequests?.toLocaleString() || 0} reqs</div>
                    </div>
                    <span className={`text-xs font-mono font-bold ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{sysStatus?.services?.['payment-service']?.replicas || 1} Nodes</span>
                  </div>

                </div>
              </div>
            </div>

            {/* Container Replicas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {renderServiceCard("Event Service", "event-service", "Listing & heavy browse traffic", "/api/v1/events")}
              {renderServiceCard("Booking Service", "booking-service", "Seat reservation & ticket lifecycle", "/api/v1/bookings")}
              {renderServiceCard("Payment Service", "payment-service", "Wallet balance & VNPay checkout", "/api/v1/payments")}
            </div>

            {/* Live Gateway Routing Activity Log */}
            <div className={`border-2 rounded-2xl p-6 transition-colors ${
              isLightMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                  <Terminal className="text-emerald-500" size={18} />
                  Live Kong Gateway Routing Activity
                </div>
                <div className={`flex items-center gap-2 text-xs font-mono ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  <RefreshCw size={12} className="animate-spin text-slate-400" />
                  Streaming Live Telemetry
                </div>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {(Array.isArray(sysStatus?.recentRoutes) ? sysStatus.recentRoutes : (sysStatus?.recentRoutes ? [sysStatus.recentRoutes] : [])).length > 0 ? (
                  (Array.isArray(sysStatus?.recentRoutes) ? sysStatus.recentRoutes : [sysStatus?.recentRoutes]).map((route: any, idx: number) => (
                    <div key={idx} className={`border px-4 py-2.5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-2 transition-colors ${
                      isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={isLightMode ? 'text-slate-500' : 'text-slate-500'}>{route.time}</span>
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          isLightMode ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-blue-900/60 text-blue-300'
                        }`}>{route.gateway}</span>
                        <ArrowRight size={14} className={isLightMode ? 'text-slate-400' : 'text-slate-600'} />
                        <span className={`font-bold ${isLightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>{route.destination}</span>
                        <span className={`text-[11px] ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>({route.algorithm})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={isLightMode ? 'text-slate-700' : 'text-slate-300'}>{route.endpoint}</span>
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          isLightMode ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'text-emerald-400 bg-emerald-950/60 border border-emerald-800'
                        }`}>{route.status}</span>
                        <span className={isLightMode ? 'text-amber-700 font-bold' : 'text-amber-400'}>{route.latency}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`text-center py-6 text-xs ${isLightMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    Gateway idle. Start <code className={isLightMode ? 'text-amber-700 font-bold' : 'text-amber-400'}>python ScenarioLoadTest.py</code> to view live request dispatching stream.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
