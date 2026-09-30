'use client';

import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'react-qr-code';
import { 
  X, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  CreditCard,
  QrCode,
  Radio,
  RefreshCw,
  Lock,
  ChevronRight,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';
import { LocationEvent } from '../data/locationEventsData';
import { useCartWishlist } from '../context/CartWishlistContext';

export interface UserTicketRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  tierName: string;
  seats: string[];
  totalPriceVND: number;
  totalPriceUSD: number;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  paymentMethod: string;
  qrToken: string;
  tokenId: string;
  contractAddress: string;
  txHash: string;
  status: 'VALID' | 'CHECKED_IN';
  checkedInAt?: string;
  purchasedAt: string;
}

interface SeatMapBookingModalProps {
  event: LocationEvent | null;
  isOpen: boolean;
  onClose: () => void;
  initialStep?: 'seat_map' | 'payment' | 'wallet';
  initialTicket?: UserTicketRecord | null;
}

export const SeatMapBookingModal: React.FC<SeatMapBookingModalProps> = ({
  event,
  isOpen,
  onClose,
  initialStep = 'seat_map',
  initialTicket = null,
}) => {
  const { formatPrice } = useCartWishlist();

  // Modal Step: 'seat_map' -> 'payment' -> 'wallet'
  const [step, setStep] = useState<'seat_map' | 'payment' | 'wallet'>(initialStep);

  // Seat selection state
  const [selectedZone, setSelectedZone] = useState<'VIP' | 'STANDARD'>('VIP');
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['VIP-A08']);
  
  // Attendee Form
  const [attendeeName, setAttendeeName] = useState('Haerin Star');
  const [attendeeEmail, setAttendeeEmail] = useState('fan_tokki@fanhubplus.com');
  const [attendeePhone, setAttendeePhone] = useState('0988 777 999');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'zalopay' | 'vnpay' | 'applepay' | 'web3'>('momo');

  // 10-Minute Hold Reservation Countdown
  const [reservationSeconds, setReservationSeconds] = useState(600); // 10 minutes = 600s
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // 30-Second Rolling Dynamic QR Countdown
  const [qrRollingSeconds, setQrRollingSeconds] = useState(30);
  const [qrTokenSeed, setQrTokenSeed] = useState(Date.now());
  const [isBlockchainModalOpen, setIsBlockchainModalOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Active / Issued Ticket State
  const [activeTicket, setActiveTicket] = useState<UserTicketRecord | null>(initialTicket);

  // Seat grid definitions
  const vipSeats = useMemo(() => {
    const rows = ['VIP-A', 'VIP-B'];
    const list: { id: string; status: 'available' | 'occupied' | 'selected' }[] = [];
    rows.forEach(r => {
      for (let i = 1; i <= 10; i++) {
        const id = `${r}${i < 10 ? '0' + i : i}`;
        const isOccupied = ['VIP-A03', 'VIP-A04', 'VIP-B01', 'VIP-B06', 'VIP-B07'].includes(id);
        list.push({ id, status: isOccupied ? 'occupied' : 'available' });
      }
    });
    return list;
  }, []);

  const standardSeats = useMemo(() => {
    const rows = ['STD-C', 'STD-D'];
    const list: { id: string; status: 'available' | 'occupied' | 'selected' }[] = [];
    rows.forEach(r => {
      for (let i = 1; i <= 12; i++) {
        const id = `${r}${i < 10 ? '0' + i : i}`;
        const isOccupied = ['STD-C02', 'STD-C05', 'STD-D08', 'STD-D09'].includes(id);
        list.push({ id, status: isOccupied ? 'occupied' : 'available' });
      }
    });
    return list;
  }, []);

  // Sync initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialTicket) {
        setActiveTicket(initialTicket);
        setStep('wallet');
      } else if (initialStep === 'wallet') {
        let loaded: UserTicketRecord | null = null;
        try {
          const raw = localStorage.getItem('fanhub_user_tickets');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              loaded = parsed[0];
            }
          }
        } catch {}
        setActiveTicket(loaded || {
          id: 'TKT-7077',
          eventId: 'ev-loc-1',
          eventTitle: 'SEVENTEEN [RIGHT HERE] World Tour in Hanoi',
          eventDate: '2025-04-12 • 19:30',
          venue: 'Sân vận động Quốc gia Mỹ Đình (Hà Nội)',
          tierName: 'VIP Diamond / VVIP Fanzone',
          seats: ['VIP-A08'],
          totalPriceVND: 2800000,
          totalPriceUSD: 112,
          attendeeName: 'Haerin Star',
          attendeeEmail: 'fan_tokki@fanhubplus.com',
          attendeePhone: '0988 777 999',
          paymentMethod: 'momo',
          qrToken: 'FANHUB-TKT-7077-TOKENID-7077-HASH-0x90703192',
          tokenId: '#7077',
          contractAddress: '0x3B9975Da7c5eA71c84fA6cD3f1cFaE7B620455B2',
          txHash: '0x90703192bf556e4099ce20b92e5cbbad917ea2a37e193ba78c9a33bbca5bfe77',
          status: 'VALID',
          purchasedAt: '2025-04-01 10:30',
        });
        setStep('wallet');
      } else {
        setStep('seat_map');
        setReservationSeconds(600);
        setIsTimerRunning(true);
      }
    }
  }, [isOpen, initialTicket, initialStep]);

  // 10-minute hold countdown timer
  useEffect(() => {
    if (!isOpen || step === 'wallet' || !isTimerRunning) return;
    const interval = setInterval(() => {
      setReservationSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, step, isTimerRunning]);

  // 30-second Dynamic Rolling QR code updater
  useEffect(() => {
    if (!isOpen || step !== 'wallet') return;
    const interval = setInterval(() => {
      setQrRollingSeconds(prev => {
        if (prev <= 1) {
          setQrTokenSeed(Date.now());
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, step]);

  if (!isOpen || (!event && !activeTicket)) return null;

  const currentEvent = event || {
    id: activeTicket?.eventId || 'ev-demo',
    title: activeTicket?.eventTitle || 'Concert Event',
    date: activeTicket?.eventDate || '2025-04-12',
    venue: activeTicket?.venue || 'Stadium Arena',
    address: 'My Dinh, Hanoi',
    priceVND: 1200000,
    priceUSD: 48,
    seatTiers: [
      { name: 'VIP Diamond / VVIP Fanzone', priceVND: 2800000, priceUSD: 112, availableSeats: 45, perks: ['Soundcheck', 'Fast-Track', 'Lightstick'] },
      { name: 'Standard Grandstand', priceVND: 1200000, priceUSD: 48, availableSeats: 250, perks: ['General Seating', 'LED Wristband'] }
    ]
  };

  const currentTier = selectedZone === 'VIP' 
    ? (currentEvent.seatTiers?.[0] || { name: 'VIP Pass', priceVND: 2800000, priceUSD: 112 })
    : (currentEvent.seatTiers?.[1] || currentEvent.seatTiers?.[0] || { name: 'Standard Pass', priceVND: 1200000, priceUSD: 48 });

  const totalVND = currentTier.priceVND * selectedSeats.length;
  const totalUSD = (currentTier.priceUSD || 48) * selectedSeats.length;

  const toggleSeatSelection = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      if (selectedSeats.length > 1) {
        setSelectedSeats(selectedSeats.filter(s => s !== seatId));
      }
    } else {
      if (selectedSeats.length < 4) {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' + mins : mins}:${s < 10 ? '0' + s : s}`;
  };

  // Complete Payment & Mint Blockchain Ticket
  const handleCompletePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);

      const generatedTicket: UserTicketRecord = {
        id: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
        eventId: currentEvent.id || 'ev-unknown',
        eventTitle: currentEvent.title,
        eventDate: (currentEvent as any).date || '2025-04-12',
        venue: (currentEvent as any).venue || 'My Dinh National Stadium',
        tierName: currentTier.name,
        seats: selectedSeats,
        totalPriceVND: totalVND,
        totalPriceUSD: totalUSD,
        attendeeName: attendeeName.trim() || 'Haerin Star',
        attendeeEmail: attendeeEmail.trim() || 'fan_tokki@fanhubplus.com',
        attendeePhone: attendeePhone.trim() || '0988 777 999',
        paymentMethod: paymentMethod.toUpperCase(),
        qrToken: `FANHUB-DYNAMIC-${Date.now()}-${selectedSeats.join('_')}`,
        tokenId: '#7077',
        contractAddress: '0x71C930825B5738d82C745143A8Fa82A549aE49aa',
        txHash: '0x90703192ff97553566b2cd6bf73f916c6b57687d569898a63f161ce47be49aa',
        status: 'VALID',
        purchasedAt: new Date().toLocaleString('vi-VN'),
      };

      // Save to localStorage so Admin Soát Vé can scan and verify
      try {
        const existing = JSON.parse(localStorage.getItem('fanhub_user_tickets') || '[]');
        localStorage.setItem('fanhub_user_tickets', JSON.stringify([generatedTicket, ...existing]));
        localStorage.setItem('fanhub_latest_ticket', JSON.stringify(generatedTicket));
      } catch {}

      setActiveTicket(generatedTicket);
      setStep('wallet');
    }, 1200);
  };

  const dynamicQrValue = activeTicket 
    ? `FANHUB-PASS:${activeTicket.id}:${activeTicket.tokenId}:${qrTokenSeed}:${activeTicket.status}`
    : `FANHUB-DEMO:${qrTokenSeed}`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0c1017] text-white border-2 border-black shadow-[10px_10px_0px_#ff2e93] flex flex-col font-mono"
        style={{ borderRadius: '0px' }}
      >
        {/* Modal Header */}
        <div className="bg-[#ffd60a] text-black px-4 sm:px-6 py-3 border-b-2 border-black flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#ff2e93] border border-black inline-block animate-pulse" />
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider m-0">
              {step === 'seat_map' && '★ STADIUM SEAT MAP // REAL-TIME RESERVATION'}
              {step === 'payment' && '★ E-WALLET PAYMENT // SECURE TRANSACTION'}
              {step === 'wallet' && '★ DIGITAL TICKET WALLET // 30S DYNAMIC QR & BLOCKCHAIN'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-black hover:bg-[#ff2e93] text-white border border-black cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: SEAT MAP & COUNTDOWN (10 PHÚT) */}
        {step === 'seat_map' && (
          <div className="p-4 sm:p-6 space-y-6">
            {/* Top Bar with Event Info & 10-Minute Countdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-black/60 border border-neutral-700">
              <div>
                <span className="text-[10px] font-bold text-[#ff2e93] uppercase tracking-widest block mb-1">
                  CURRENT EVENT SELECTION:
                </span>
                <h3 className="text-base sm:text-lg font-black text-white m-0">
                  {currentEvent.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#ffd60a]" />
                  <span>{(currentEvent as any).venue} • {(currentEvent as any).date}</span>
                </p>
              </div>

              {/* 10-Minute Reservation Timer */}
              <div className="bg-neutral-900 border-2 border-[#ff2e93] p-3 text-center sm:text-right shrink-0 shadow-[3px_3px_0px_#ff2e93]">
                <div className="flex items-center gap-1.5 justify-center sm:justify-end text-[11px] text-neutral-300 font-bold uppercase">
                  <Clock size={13} className="text-[#ffd60a] animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Hold Countdown:</span>
                </div>
                <div className="text-2xl font-black text-[#ffd60a] tracking-widest font-mono mt-0.5">
                  {formatCountdown(reservationSeconds)}
                </div>
                <div className="w-full bg-neutral-800 h-1.5 mt-1.5 overflow-hidden">
                  <div 
                    className="bg-[#ff2e93] h-full transition-all duration-1000"
                    style={{ width: `${(reservationSeconds / 600) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Zone Selector: VIP vs Standard */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedZone('VIP');
                  setSelectedSeats(['VIP-A08']);
                }}
                className={`p-3 sm:p-4 border-2 text-left transition-all cursor-pointer ${
                  selectedZone === 'VIP'
                    ? 'bg-[#1a1429] border-[#ff2e93] shadow-[4px_4px_0px_#ff2e93]'
                    : 'bg-black/40 border-neutral-700 hover:border-neutral-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-[#ff2e93] uppercase">VIP DIAMOND ZONE</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#ff2e93] text-white font-bold">CLOSE TO STAGE</span>
                </div>
                <div className="text-sm sm:text-base font-black text-white">
                  {formatPrice(currentEvent.seatTiers?.[0]?.priceUSD || 112, currentEvent.seatTiers?.[0]?.priceVND || 2800000)}
                  <span className="text-[11px] font-normal text-neutral-400"> / seat</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                  Fanzone A stage front • Soundcheck Pass • Exclusive VIP gift pack
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedZone('STANDARD');
                  setSelectedSeats(['STD-C07']);
                }}
                className={`p-3 sm:p-4 border-2 text-left transition-all cursor-pointer ${
                  selectedZone === 'STANDARD'
                    ? 'bg-[#102027] border-[#00f0ff] shadow-[4px_4px_0px_#00f0ff]'
                    : 'bg-black/40 border-neutral-700 hover:border-neutral-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-[#00f0ff] uppercase">STANDARD GRANDSTAND</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#00f0ff] text-black font-bold">STAND A/B</span>
                </div>
                <div className="text-sm sm:text-base font-black text-white">
                  {formatPrice(currentEvent.seatTiers?.[1]?.priceUSD || 48, currentEvent.seatTiers?.[1]?.priceVND || 1200000)}
                  <span className="text-[11px] font-normal text-neutral-400"> / seat</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                  Direct central sightline • Panoramic stadium view • LED wristband
                </p>
              </button>
            </div>

            {/* Stadium Visual Layout & Seat Map Grid */}
            <div className="p-5 bg-black/90 border-2 border-neutral-800 text-center relative overflow-hidden">
              {/* STAGE GRAPHIC */}
              <div className="max-w-md mx-auto mb-8">
                <div className="py-2.5 px-6 bg-[#ffd60a] text-black border-2 border-black text-xs font-black tracking-widest uppercase shadow-[3px_3px_0px_#fff]">
                  ★ MAIN STAGE // CATWALK &amp; RUNWAY ★
                </div>
                <div className="w-16 h-8 mx-auto bg-gradient-to-b from-[#ffd60a] to-transparent opacity-40 border-x border-[#ffd60a]" />
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 text-[11px] mb-6 font-bold flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-neutral-700 border border-neutral-500 inline-block" />
                  <span className="text-neutral-400">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-[#ff2e93] border border-white inline-block shadow-[1px_1px_0px_#fff]" />
                  <span className="text-[#ff2e93]">Selected ({selectedSeats.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-neutral-900 border border-neutral-800 opacity-40 inline-block" />
                  <span className="text-neutral-600">Reserved</span>
                </div>
              </div>

              {/* SEAT GRID */}
              <div className="space-y-3 max-w-xl mx-auto">
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                  {selectedZone === 'VIP' ? 'VIP DIAMOND ZONE (ROW A & ROW B - FRONT OF STAGE)' : 'STANDARD GRANDSTAND ZONE (ROW C & ROW D)'}
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-3 bg-neutral-950/80 border border-neutral-800">
                  {(selectedZone === 'VIP' ? vipSeats : standardSeats).map(seat => {
                    const isSelected = selectedSeats.includes(seat.id);
                    const isOccupied = seat.status === 'occupied';

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => toggleSeatSelection(seat.id)}
                        className={`py-2 px-1 text-[10px] font-black border transition-all cursor-pointer ${
                          isOccupied
                            ? 'bg-neutral-900 text-neutral-700 border-neutral-800 cursor-not-allowed opacity-40'
                            : isSelected
                            ? selectedZone === 'VIP'
                              ? 'bg-[#ff2e93] text-white border-white shadow-[2px_2px_0px_#ffd60a] scale-105'
                              : 'bg-[#00f0ff] text-black border-white shadow-[2px_2px_0px_#00ff66] scale-105'
                            : 'bg-neutral-800 text-neutral-300 border-neutral-600 hover:border-white hover:text-white'
                        }`}
                      >
                        {seat.id.split('-')[1]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-[11px] text-neutral-500 mt-4">
                * Maximum 4 seats per booking. Selected seats will be automatically released if countdown timer expires.
              </p>
            </div>

            {/* Bottom Summary & Proceed Button */}
            <div className="p-4 bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-[11px] text-neutral-400">
                  Selected Seats: <span className="text-[#ffd60a] font-bold">{selectedSeats.join(', ')}</span> ({selectedSeats.length} passes)
                </div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
                  Total: <span className="text-[#ff2e93]">{formatPrice(totalUSD, totalVND)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('payment')}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#ff2e93] hover:bg-pink-600 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#ffd60a] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>PROCEED TO E-WALLET PAYMENT</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: E-WALLET PAYMENT */}
        {step === 'payment' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="bg-black/60 border border-neutral-700 p-4">
              <span className="text-[10px] font-bold text-[#ffd60a] uppercase tracking-widest block mb-1">
                CONCERT TICKET ORDER SUMMARY:
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <h3 className="text-base font-black text-white m-0">{currentEvent.title}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Tier: <strong className="text-white">{currentTier.name}</strong> • Seats: <strong className="text-[#ffd60a]">{selectedSeats.join(', ')}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-[#ff2e93] font-mono">
                    {formatPrice(totalUSD, totalVND)}
                  </div>
                </div>
              </div>

              {/* Attendee Form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">Attendee Full Name:</label>
                  <input
                    type="text"
                    value={attendeeName}
                    onChange={e => setAttendeeName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#ff2e93]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">Delivery Email for QR Pass:</label>
                  <input
                    type="email"
                    value={attendeeEmail}
                    onChange={e => setAttendeeEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#ff2e93]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-400 block mb-1">Contact Phone:</label>
                  <input
                    type="text"
                    value={attendeePhone}
                    onChange={e => setAttendeePhone(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#ff2e93]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <span className="text-xs font-black text-white uppercase tracking-wider block">
                SELECT E-WALLET PAYMENT METHOD:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'momo', name: 'MoMo E-Wallet (Recommended)', desc: 'Instant checkout via MoMo QR application', color: 'border-[#d82d8b] bg-[#3b0a24]/50' },
                  { id: 'zalopay', name: 'ZaloPay Wallet', desc: 'Fast biometric authorization without re-entering card details', color: 'border-[#008fe5] bg-[#002f52]/50' },
                  { id: 'vnpay', name: 'VNPAY-QR Gateway', desc: 'Supports QR scan across over 40 major banking apps', color: 'border-[#005ba6] bg-[#001c38]/50' },
                  { id: 'applepay', name: 'Apple Pay / Credit Cards', desc: 'Visa, MasterCard, JCB with 3D Secure Protection', color: 'border-neutral-500 bg-neutral-900' },
                  { id: 'web3', name: 'Web3 Crypto (Polygon / Sepolia)', desc: 'Pay on-chain using MetaMask / Web3 Smart Contract', color: 'border-[#8247e5] bg-[#220e42]/50' },
                ].map(p => (
                  <label
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`p-3.5 border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === p.id 
                        ? `${p.color} shadow-[3px_3px_0px_#fff]` 
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_opt"
                      checked={paymentMethod === p.id}
                      onChange={() => setPaymentMethod(p.id as any)}
                      className="mt-1 accent-[#ff2e93]"
                    />
                    <div>
                      <div className="text-xs font-black text-white">{p.name}</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">{p.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setStep('seat_map')}
                className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold uppercase border border-neutral-700 cursor-pointer"
              >
                ← Back to Seat Map
              </button>

              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleCompletePayment}
                className="px-6 py-3.5 bg-[#00f0ff] hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#00ff66] transition-all cursor-pointer flex items-center gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>AUTHENTICATING E-WALLET...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>COMPLETE ORDER &amp; OPEN WALLET →</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: VÍ VÉ (TICKET WALLET) - DYNAMIC 30S QR & BLOCKCHAIN VERIFICATION */}
        {step === 'wallet' && activeTicket && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#ffd60a] text-black border-2 border-black mx-auto flex items-center justify-center shadow-[3px_3px_0px_#fff] mb-2">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                YOUR DIGITAL TICKET IS READY!
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                Encrypted on Smart Contract with 30-second rolling dynamic QR code to block unauthorized scalpers and counterfeit duplicate entry.
              </p>
            </div>

            {/* HOLOGRAPHIC PASS CARD */}
            <div className="max-w-md mx-auto bg-gradient-to-b from-neutral-900 to-black border-2 border-white p-5 shadow-[8px_8px_0px_#ff2e93] relative">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-neutral-700 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 bg-[#ffd60a] text-black font-black border border-black">
                    FANHUB+ VERIFIED
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    ID: {activeTicket.id}
                  </span>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 border ${
                  activeTicket.status === 'CHECKED_IN'
                    ? 'bg-neutral-800 text-rose-400 border-rose-500'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                }`}>
                  {activeTicket.status === 'CHECKED_IN' ? 'CHECKED IN' : 'VALID (GATE READY)'}
                </span>
              </div>

              {/* Event Title & Details */}
              <h4 className="text-lg font-black text-white mb-2 leading-tight">
                {activeTicket.eventTitle}
              </h4>
              <div className="text-xs text-neutral-300 space-y-1 mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#ff2e93]" />
                  <span>{activeTicket.venue}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-[#ffd60a]" />
                  <span>Time: {activeTicket.eventDate}</span>
                </div>
                <div className="text-[11px] text-neutral-400 pt-1">
                  Ticket Holder: <strong className="text-white">{activeTicket.attendeeName}</strong> ({activeTicket.attendeeEmail})
                </div>
                <div className="text-[11px] text-neutral-400">
                  Tier: <strong className="text-[#ffd60a]">{activeTicket.tierName}</strong> | Seat: <strong className="text-[#ff2e93]">{activeTicket.seats.join(', ')}</strong>
                </div>
              </div>

              {/* DYNAMIC ROLLING QR CODE */}
              <div className="bg-white p-4 border-2 border-black flex flex-col items-center justify-center text-center my-4 relative">
                <div className="relative">
                  <QRCode
                    value={dynamicQrValue}
                    size={170}
                    style={{ height: 'auto', maxWidth: '100%', width: '170px' }}
                    viewBox="0 0 170 170"
                  />
                  {/* Anti-screenshot scanline bar animation */}
                  <div className="absolute inset-0 border-2 border-black/10 pointer-events-none" />
                </div>

                {/* 30-Second Countdown Indicator */}
                <div className="mt-3 flex items-center justify-between w-full pt-2 border-t border-dashed border-neutral-300 text-[10px] font-mono text-black font-black">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <RefreshCw size={11} className="animate-spin" />
                    QR Refreshes In:
                  </span>
                  <span className="px-1.5 py-0.5 bg-black text-[#ffd60a]">
                    {qrRollingSeconds} SECONDS
                  </span>
                </div>
                <div className="w-full bg-neutral-200 h-1 mt-1 overflow-hidden">
                  <div 
                    className="bg-[#d82d8b] h-full transition-all duration-1000"
                    style={{ width: `${(qrRollingSeconds / 30) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] text-neutral-600 mt-1 uppercase">
                  ANTI-SCALP DYNAMIC ENCRYPTION PROTOCOL
                </span>
              </div>

              {/* BLOCKCHAIN TELEMETRY STRIP */}
              <div className="p-3 bg-neutral-950 border border-neutral-800 text-[11px] space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="flex items-center gap-1 text-[#ffd60a]">
                    <ShieldCheck size={13} />
                    <span>SMART CONTRACT VERIFIED</span>
                  </span>
                  <span className="text-emerald-400 font-bold">ERC-721 NFT</span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span className="text-neutral-500">Token ID:</span>
                  <span className="text-[#ff2e93] font-black">{activeTicket.tokenId}</span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span className="text-neutral-500">TxHash:</span>
                  <span className="text-cyan-300 truncate max-w-[190px]">{activeTicket.txHash}</span>
                </div>
              </div>

              {/* ACTION: XÁC THỰC BLOCKCHAIN BUTTON */}
              <button
                type="button"
                onClick={() => setIsBlockchainModalOpen(true)}
                className="w-full mt-3 py-2.5 bg-[#ffd60a] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#fff] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck size={14} />
                <span>VERIFY ON BLOCKCHAIN (SMART CONTRACT)</span>
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase border border-neutral-600 cursor-pointer"
              >
                Close Ticket Wallet
              </button>
            </div>
          </div>
        )}

        {/* BLOCKCHAIN VERIFICATION POPUP MODAL */}
        {isBlockchainModalOpen && activeTicket && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="max-w-lg w-full bg-[#12161f] border-2 border-white p-5 shadow-[8px_8px_0px_#00f0ff] font-mono text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-400" />
                  <h4 className="text-sm font-black text-white uppercase m-0">
                    ON-CHAIN SMART CONTRACT VERIFICATION
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBlockchainModalOpen(false)}
                  className="w-6 h-6 flex items-center justify-center bg-black text-white hover:bg-rose-600"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2.5 text-neutral-300">
                <div className="p-3 bg-black/80 border border-neutral-800 space-y-2">
                  <div className="text-[10px] text-neutral-500 uppercase">Blockchain Network:</div>
                  <div className="text-white font-bold flex items-center justify-between">
                    <span>Ethereum Sepolia / Polygon POS Mainnet</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500">MINTED ✓</span>
                  </div>
                </div>

                <div className="p-3 bg-black/80 border border-neutral-800 space-y-1">
                  <div className="text-[10px] text-neutral-500 uppercase">Smart Contract Address:</div>
                  <div className="text-cyan-300 font-bold break-all">{activeTicket.contractAddress}</div>
                </div>

                <div className="p-3 bg-black/80 border border-neutral-800 space-y-1">
                  <div className="text-[10px] text-neutral-500 uppercase">Token ID (ERC-721 NFT):</div>
                  <div className="text-[#ffd60a] font-bold text-sm">{activeTicket.tokenId}</div>
                </div>

                <div className="p-3 bg-black/80 border border-neutral-800 space-y-1">
                  <div className="text-[10px] text-neutral-500 uppercase">Transaction Hash (TxHash):</div>
                  <div className="text-pink-400 font-bold break-all flex items-center justify-between gap-2">
                    <span className="truncate">{activeTicket.txHash}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(activeTicket.txHash);
                        setCopiedHash(true);
                        setTimeout(() => setCopiedHash(false), 2000);
                      }}
                      className="shrink-0 p-1 bg-neutral-800 hover:bg-neutral-700 text-white"
                      title="Copy TxHash"
                    >
                      {copiedHash ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <a
                  href={`https://sepolia.etherscan.io/tx/${activeTicket.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#00f0ff] hover:underline"
                >
                  <ExternalLink size={13} />
                  <span>Open in Etherscan Explorer</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsBlockchainModalOpen(false)}
                  className="px-4 py-1.5 bg-white text-black font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
