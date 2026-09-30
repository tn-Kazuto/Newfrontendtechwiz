'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  QrCode, 
  RefreshCw, 
  Ticket, 
  User, 
  MapPin, 
  Calendar,
  Lock,
  Zap,
  Volume2
} from 'lucide-react';
import { UserTicketRecord } from '../SeatMapBookingModal';

interface AdminTicketCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminTicketCheckinModal: React.FC<AdminTicketCheckinModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    status: 'SUCCESS' | 'ALREADY_USED' | 'INVALID';
    ticket?: UserTicketRecord;
    message: string;
    timestamp: string;
  } | null>(null);

  const [useWebcam, setUseWebcam] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize or mock webcam
  useEffect(() => {
    if (!isOpen) {
      setScanResult(null);
      return;
    }

    if (useWebcam && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(() => {
          setUseWebcam(false);
        });
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isOpen, useWebcam]);

  if (!isOpen) return null;

  // Process a ticket code
  const processCheckIn = (codeOrId: string) => {
    setIsScanning(false);

    // Retrieve saved user tickets
    let tickets: UserTicketRecord[] = [];
    try {
      tickets = JSON.parse(localStorage.getItem('fanhub_user_tickets') || '[]');
    } catch {}

    // If no tickets in storage, create a default fallback ticket for testing
    if (tickets.length === 0) {
      tickets = [
        {
          id: 'TKT-707788',
          eventId: 'ev-hn-svt-right-here',
          eventTitle: 'SEVENTEEN [RIGHT HERE] World Tour in Hanoi',
          eventDate: '2025-04-12',
          venue: 'My Dinh National Stadium, Hanoi',
          tierName: 'VIP CARAT Soundcheck (Fanzone A)',
          seats: ['VIP-A08'],
          totalPriceVND: 3500000,
          totalPriceUSD: 140,
          attendeeName: 'Haerin Star ⭐',
          attendeeEmail: 'fan_tokki@fanhubplus.com',
          attendeePhone: '0988 777 999',
          paymentMethod: 'MOMO',
          qrToken: 'FANHUB-DYNAMIC-7077',
          tokenId: '#7077',
          contractAddress: '0x71C930825B5738d82C745143A8Fa82A549aE49aa',
          txHash: '0x90703192ff97553566b2cd6bf73f916c6b57687d569898a63f161ce47be49aa',
          status: 'VALID',
          purchasedAt: 'Vừa xong',
        }
      ];
      localStorage.setItem('fanhub_user_tickets', JSON.stringify(tickets));
    }

    // Match ticket
    const trimmed = (codeOrId || '').trim().toLowerCase();
    const foundIndex = tickets.findIndex(t => 
      t.id.toLowerCase().includes(trimmed) || 
      t.tokenId.toLowerCase().includes(trimmed) ||
      t.qrToken.toLowerCase().includes(trimmed) ||
      trimmed.includes(t.tokenId.toLowerCase()) ||
      trimmed === '' // if quick scanned
    );

    if (foundIndex === -1) {
      setScanResult({
        status: 'INVALID',
        message: 'TICKET CODE DOES NOT EXIST OR DIGITAL SIGNATURE INVALID!',
        timestamp: new Date().toLocaleTimeString('en-US'),
      });
      return;
    }

    const matched = tickets[foundIndex];

    if (matched.status === 'CHECKED_IN') {
      setScanResult({
        status: 'ALREADY_USED',
        ticket: matched,
        message: `WARNING: TICKET WAS ALREADY CHECKED IN AT ${matched.checkedInAt || 'EARLIER'}. ENTRY DENIED!`,
        timestamp: new Date().toLocaleTimeString('en-US'),
      });
    } else {
      // SUCCESS CHECK-IN: Lock ticket status to CHECKED_IN
      const nowStr = new Date().toLocaleTimeString('en-US');
      const updatedTicket: UserTicketRecord = {
        ...matched,
        status: 'CHECKED_IN',
        checkedInAt: nowStr,
      };

      tickets[foundIndex] = updatedTicket;
      localStorage.setItem('fanhub_user_tickets', JSON.stringify(tickets));
      localStorage.setItem('fanhub_latest_ticket', JSON.stringify(updatedTicket));

      setScanResult({
        status: 'SUCCESS',
        ticket: updatedTicket,
        message: 'VALID PASS - CHECK-IN SUCCESSFUL! TICKET STATUS LOCKED ON-CHAIN.',
        timestamp: nowStr,
      });
    }
  };

  const handleResetScanner = () => {
    setIsScanning(true);
    setScanResult(null);
    setManualCode('');
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0f141c] text-white border-2 border-black shadow-[8px_8px_0px_#00ff66] font-mono flex flex-col"
        style={{ borderRadius: '0px' }}
      >
        {/* Modal Top Header */}
        <div className="bg-[#00ff66] text-black px-4 sm:px-6 py-3 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera size={18} className="text-black" />
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider m-0">
              ★ EVENT GATE TICKET CHECK-IN // DYNAMIC QR CAMERA SCANNER
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-black hover:bg-white text-white hover:text-black border border-black cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* CAMERA SCANNER VIEWFINDER */}
          <div className="relative aspect-video max-w-lg mx-auto bg-black border-2 border-neutral-700 overflow-hidden flex flex-col items-center justify-center">
            {useWebcam ? (
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            ) : (
              <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center p-4 text-center">
                <QrCode size={64} className="text-neutral-600 mb-2" />
                <div className="text-xs font-bold text-neutral-400">CAMERA VIEWFINDER ACTIVE</div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  Detecting 30-second rolling dynamic QR from attendee ticket pass...
                </div>
              </div>
            )}

            {/* Scanning Laser Beam Effect */}
            {isScanning && (
              <div className="absolute inset-x-4 h-0.5 bg-[#00ff66] shadow-[0_0_12px_#00ff66] animate-bounce z-10" />
            )}

            {/* Target Reticle */}
            <div className="absolute w-44 h-44 border-2 border-dashed border-[#00ff66]/80 rounded-none pointer-events-none flex items-center justify-center">
              <span className="text-[9px] text-[#00ff66] font-bold tracking-widest uppercase bg-black/60 px-1.5 py-0.5">
                ALIGN QR IN FRAME
              </span>
            </div>

            {/* HUD Status Bar */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono bg-black/80 px-2 py-1 text-white border border-neutral-800">
              <span className="flex items-center gap-1 text-[#00ff66]">
                <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
                SCANNER GATE 01: READY
              </span>
              <button
                type="button"
                onClick={() => setUseWebcam(!useWebcam)}
                className="text-cyan-300 hover:underline cursor-pointer"
              >
                {useWebcam ? '[Disable Webcam]' : '[Enable Webcam]'}
              </button>
            </div>
          </div>

          {/* Quick Simulation Buttons for Demo */}
          {isScanning && (
            <div className="p-3 bg-neutral-900 border border-neutral-800 space-y-2 text-center">
              <div className="text-[11px] font-black text-[#ffd60a] uppercase tracking-wider">
                ONE-TOUCH GATE SCANNER ACTIONS:
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => processCheckIn('#7077')}
                  className="px-4 py-2.5 bg-[#00ff66] hover:bg-emerald-400 text-black font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer flex items-center gap-1.5"
                >
                  <Camera size={14} />
                  <span>SCAN PURCHASED TICKET PASS (TOKEN #7077)</span>
                </button>

                <button
                  type="button"
                  onClick={() => processCheckIn('TKT-DEMO')}
                  className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold border border-neutral-600 cursor-pointer"
                >
                  Simulate Sample Pass
                </button>
              </div>
            </div>
          )}

          {/* SCAN RESULT POPUP BANNER */}
          {scanResult && (
            <div className="animate-in zoom-in-95 duration-200">
              {scanResult.status === 'SUCCESS' && scanResult.ticket && (
                <div className="p-4 sm:p-5 bg-emerald-950 border-3 border-[#00ff66] text-white shadow-[6px_6px_0px_#00ff66] space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#00ff66] text-black border-2 border-black flex items-center justify-center font-black">
                      <CheckCircle2 size={28} />
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-black text-[#00ff66] uppercase tracking-wider">
                        VALID PASS - CHECK-IN SUCCESSFUL!
                      </div>
                      <div className="text-xs text-neutral-300 mt-0.5">
                        Status: <strong className="text-emerald-400">LOCKED (ANTI-REUSE ACTIVE)</strong> • Scanned: {scanResult.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Scanned Attendee & Seat Info */}
                  <div className="p-3 bg-black/80 border border-emerald-500/40 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Attendee:</span>
                      <strong className="text-white text-sm">{scanResult.ticket.attendeeName}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Event:</span>
                      <strong className="text-[#ffd60a]">{scanResult.ticket.eventTitle}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Tier / Seat:</span>
                      <strong className="text-[#ff2e93]">{scanResult.ticket.tierName} — Seat: {scanResult.ticket.seats.join(', ')}</strong>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-neutral-800 text-[11px]">
                      <span className="text-neutral-400">Blockchain Token ID:</span>
                      <span className="text-cyan-300 font-bold">{scanResult.ticket.tokenId} ({scanResult.ticket.id})</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleResetScanner}
                      className="px-4 py-2 bg-white text-black font-black text-xs uppercase border-2 border-black hover:bg-neutral-200 cursor-pointer"
                    >
                      Scan Next Ticket Pass →
                    </button>
                  </div>
                </div>
              )}

              {scanResult.status === 'ALREADY_USED' && (
                <div className="p-4 sm:p-5 bg-rose-950 border-3 border-rose-500 text-white shadow-[6px_6px_0px_#ff2e93] space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-500 text-white border-2 border-black flex items-center justify-center font-black">
                      <AlertTriangle size={28} />
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-black text-rose-300 uppercase tracking-wider">
                        WARNING: TICKET HAS ALREADY BEEN CHECKED IN!
                      </div>
                      <div className="text-xs text-rose-200 mt-0.5">
                        Pass already admitted at {scanResult.ticket?.checkedInAt || scanResult.timestamp}. Entry denied!
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-black/80 border border-rose-500/40 text-xs">
                    <p className="m-0 text-neutral-300 text-[11px]">
                      The gate security protocol locks the pass immediately upon initial admission to prevent duplicate scalper QR passes.
                    </p>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleResetScanner}
                      className="px-4 py-2 bg-rose-500 text-white font-black text-xs uppercase border-2 border-black hover:bg-rose-600 cursor-pointer"
                    >
                      Scan Another Ticket →
                    </button>
                  </div>
                </div>
              )}

              {scanResult.status === 'INVALID' && (
                <div className="p-4 bg-amber-950 border-2 border-amber-500 text-white space-y-2">
                  <div className="text-sm font-black text-amber-300">{scanResult.message}</div>
                  <button
                    type="button"
                    onClick={handleResetScanner}
                    className="px-3 py-1.5 bg-amber-500 text-black font-bold text-xs"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="text-[11px] text-neutral-500">
              FanHubPlus Gate Security Protocol v2.6 • Realtime Gate Access
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase border border-neutral-600 cursor-pointer"
            >
              Close Scanner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
