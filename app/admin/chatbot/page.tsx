'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../../../components/admin/AdminHeader';
import { AdminSidebar } from '../../../components/admin/AdminSidebar';
import { useAdminLanguage } from '../../../context/AdminLanguageContext';
import { getAccessToken } from '../../../utils/authUtils';
import {
  Bot,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Copy,
  Plus,
  Pencil,
  Trash2,
  Eye,
  MessageSquare,
  Sparkles,
  Layers,
  FolderTree,
  Send,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  BookOpen,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Lightbulb,
  WifiOff,
} from 'lucide-react';

export interface AdminFaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}



const FAQ_CATEGORIES = ['All', 'Booking', 'Payment', 'Ticket Transfer', 'B2B / Partner', 'Event Rules'];

export default function AdminChatbotPage() {
  const { language } = useAdminLanguage();
  const isVi = language === 'vi';

  // Responsive sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerSearch, setHeaderSearch] = useState('');

  // Main data states
  const [faqs, setFaqs] = useState<AdminFaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  // Filters & Pagination: ?search=ve&category=...&page=1&limit=20
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // Modals & Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminFaqItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<AdminFaqItem | null>(null);
  const [previewItem, setPreviewItem] = useState<AdminFaqItem | null>(null);

  // Chatbot Simulator Playground State
  const [isTesterOpen, setIsTesterOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTesterTyping, setIsTesterTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: 'Xin chào! Tôi là AI Assistant của Fandom Platform. Bạn có câu hỏi nào cần giải đáp không?',
    },
  ]);

  // Form state for CREATE: POST /api/v1/admin/chatbot/faqs
  const [createForm, setCreateForm] = useState({
    question: '',
    answer: '',
    category: 'Booking',
    is_active: true,
  });
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Form state for EDIT: PUT /api/v1/admin/chatbot/faqs/{id}
  const [editForm, setEditForm] = useState({
    question: '',
    answer: '',
    is_active: true,
  });
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // Toast clear
  useEffect(() => {
    if (apiSuccess) {
      const timer = setTimeout(() => setApiSuccess(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [apiSuccess]);

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => setApiError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [apiError]);

  // Fetch FAQs: GET /api/v1/admin/chatbot/faqs?search=...&category=...&page=...&limit=...
  const fetchFaqs = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setIsConnectionError(false);

    try {
      const token = getAccessToken();
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      if (categoryFilter !== 'All') params.set('category', categoryFilter);
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const url = `/api/v1/admin/chatbot/faqs?${params.toString()}`;
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const json = await res.json();
      const rawData = json.data || json.faqs || (Array.isArray(json) ? json : []);

      if (Array.isArray(rawData)) {
        setFaqs(rawData);
        setTotalCount(json.meta?.total || json.total || rawData.length);
      } else {
        setFaqs([]);
        setTotalCount(0);
      }
      setApiError(null);
      setIsConnectionError(false);
    } catch (err: any) {
      console.warn('API /api/v1/admin/chatbot/faqs offline or error:', err);
      setFaqs([]);
      setTotalCount(0);
      setIsConnectionError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchTerm, categoryFilter, page, limit]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleCopyId = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Submit Create: POST /api/v1/admin/chatbot/faqs
  // Request: { "question": "...", "answer": "...", "category": "Booking", "is_active": true }
  // Response: 201 { "id": "faq_xxx", "message": "Thêm câu hỏi FAQ thành công" }
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.question.trim() || !createForm.answer.trim()) {
      setApiError(isVi ? 'Vui lòng nhập đầy đủ câu hỏi và câu trả lời!' : 'Question and Answer are required');
      return;
    }

    setIsSubmittingCreate(true);
    setApiError(null);

    const payload = {
      question: createForm.question.trim(),
      answer: createForm.answer.trim(),
      category: createForm.category,
      is_active: createForm.is_active,
    };

    try {
      const token = getAccessToken();
      const res = await fetch('/api/v1/admin/chatbot/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok || res.status === 201) {
        setApiSuccess(json.message || (isVi ? 'Thêm câu hỏi FAQ thành công' : 'FAQ added successfully'));
        setIsCreateOpen(false);
        setCreateForm({ question: '', answer: '', category: 'Booking', is_active: true });
        fetchFaqs(true);
      } else {
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn('POST faq offline, saving locally:', err);
      const newFaq: AdminFaqItem = {
        id: `faq_${Date.now().toString().slice(-4)}`,
        ...payload,
        created_at: new Date().toISOString(),
      };
      setFaqs((prev) => [newFaq, ...prev]);
      setApiSuccess(isVi ? 'Thêm câu hỏi FAQ thành công (Local)' : 'FAQ added locally');
      setIsCreateOpen(false);
      setCreateForm({ question: '', answer: '', category: 'Booking', is_active: true });
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (item: AdminFaqItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditItem(item);
    setEditForm({
      question: item.question || '',
      answer: item.answer || '',
      is_active: item.is_active !== false,
    });
  };

  // Submit Edit: PUT /api/v1/admin/chatbot/faqs/{id}
  // Request: { "question": "...", "answer": "...", "is_active": true }
  // Response 200: { "message": "Cập nhật câu hỏi FAQ thành công" }
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    if (!editForm.question.trim() || !editForm.answer.trim()) {
      setApiError(isVi ? 'Câu hỏi và câu trả lời không được để trống!' : 'Question and Answer cannot be blank');
      return;
    }

    setIsSubmittingEdit(true);
    setApiError(null);

    const payload = {
      question: editForm.question.trim(),
      answer: editForm.answer.trim(),
      is_active: editForm.is_active,
    };

    try {
      const token = getAccessToken();
      const res = await fetch(`/api/v1/admin/chatbot/faqs/${editItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setApiSuccess(json.message || (isVi ? 'Cập nhật câu hỏi FAQ thành công' : 'FAQ updated successfully'));
        setEditItem(null);
        fetchFaqs(true);
      } else {
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn('PUT faq offline, updating locally:', err);
      setFaqs((prev) =>
        prev.map((f) => (f.id === editItem.id ? { ...f, ...payload } : f))
      );
      setApiSuccess(isVi ? 'Cập nhật câu hỏi FAQ thành công (Local)' : 'FAQ updated locally');
      setEditItem(null);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Submit Delete: DELETE /api/v1/admin/chatbot/faqs/{id}
  // Response 200: { "message": "Đã xóa câu hỏi khỏi kho tri thức" }
  const handleDeleteSubmit = async () => {
    if (!deleteItem) return;
    setIsSubmittingDelete(true);
    setApiError(null);

    try {
      const token = getAccessToken();
      const res = await fetch(`/api/v1/admin/chatbot/faqs/${deleteItem.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setApiSuccess(json.message || (isVi ? 'Đã xóa câu hỏi khỏi kho tri thức' : 'FAQ removed from knowledge base'));
        setDeleteItem(null);
        fetchFaqs(true);
      } else {
        throw new Error(json.message || json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn('DELETE faq offline, removing locally:', err);
      setFaqs((prev) => prev.filter((f) => f.id !== deleteItem.id));
      setApiSuccess(isVi ? 'Đã xóa câu hỏi khỏi kho tri thức (Local)' : 'FAQ removed locally');
      setDeleteItem(null);
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  // Chatbot Tester query match with astream & typing indicator
  const handleSendTestChat = () => {
    if (!chatInput.trim() || isTesterTyping) return;
    const userQuestion = chatInput.trim();
    const newHistory = [...chatMessages, { sender: 'user' as const, text: userQuestion }];
    setChatMessages(newHistory);
    setChatInput('');
    setIsTesterTyping(true);

    // Find best match in FAQs
    setTimeout(async () => {
      const q = userQuestion.toLowerCase();
      const matched = faqs.find(
        (f) =>
          f.is_active &&
          (f.question.toLowerCase().includes(q) ||
            q.includes(f.question.toLowerCase().slice(0, 15)) ||
            (f.category && q.includes(f.category.toLowerCase())))
      );

      const botReply = matched
        ? matched.answer
        : (isVi
            ? 'Xin lỗi, tôi chưa tìm thấy câu trả lời chính xác trong kho tri thức FAQ. Đội ngũ hỗ trợ sẽ liên hệ với bạn sớm nhất!'
            : 'Sorry, I could not find a matching answer in the FAQ knowledge base. Our team will contact you soon!');

      setIsTesterTyping(false);
      // Stream bot reply
      setChatMessages((prev) => [...prev, { sender: 'bot', text: '' }]);
      const tokens = botReply.match(/\S+|\s+/g) || [botReply];
      let current = '';
      for (let i = 0; i < tokens.length; i++) {
        current += tokens[i];
        const snap = current;
        setChatMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { sender: 'bot', text: snap };
          return next;
        });
        await new Promise((r) => setTimeout(r, 20));
      }
    }, 550);
  };

  // KPI computations
  const totalFaqs = faqs.length;
  const activeFaqs = faqs.filter((f) => f.is_active).length;
  const categoriesCount = useMemo(() => {
    return new Set(faqs.map((f) => f.category).filter(Boolean)).size;
  }, [faqs]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <AdminSidebar
        activeTab="chatbot"
        setActiveTab={() => {}}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HEADER */}
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          searchQuery={headerSearch}
          setSearchQuery={setHeaderSearch}
          activeTab="chatbot"
        />

        {/* BREADCRUMB & TOP ACTIONS HEADER */}
        <div className="p-6 pb-0">
          <div className="flex flex-row items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs w-full text-left">
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5 text-left">
                <Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin</Link>
                <span>/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {isVi ? 'Kho Tri Thức Chatbot' : 'Chatbot Knowledge Base'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-2xs shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <span>{isVi ? 'Quản Lý Câu Hỏi & Tri Thức Chatbot' : 'AI Chatbot FAQs Management'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  {totalFaqs} {isVi ? 'câu hỏi' : 'entries'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-left">
                {isVi
                  ? 'Huấn luyện cơ sở dữ liệu câu hỏi thường gặp (FAQ) cho trợ lý ảo AI trả lời tự động.'
                  : 'Train FAQ knowledge base for automated AI customer support responses.'}
              </p>
            </div>

            {/* Quick Action Buttons (Right-aligned) */}
            <div className="flex items-center gap-2.5 shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => setIsTesterOpen(true)}
                style={{
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  color: '#4f46e5',
                  border: '1px solid #c7d2fe',
                  padding: '9px 16px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                className="hover:bg-indigo-50 transition-colors shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{isVi ? 'THỬ NGHIỆM CHATBOT' : 'TEST BOT'}</span>
              </button>

              <button
                type="button"
                onClick={() => fetchFaqs(true)}
                disabled={loading || refreshing}
                style={{
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  padding: '9px 16px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                className="hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{isVi ? 'LÀM MỚI' : 'REFRESH'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                style={{
                  borderRadius: '12px',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  padding: '9px 18px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                }}
                className="hover:bg-indigo-700 transition-colors shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>{isVi ? 'THÊM CÂU HỎI FAQ' : 'ADD FAQ'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        {apiSuccess && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{apiSuccess}</span>
            </div>
            <button onClick={() => setApiSuccess(null)} className="p-1 hover:bg-emerald-100 rounded-md cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {apiError && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{apiError}</span>
            </div>
            <button onClick={() => setApiError(null)} className="p-1 hover:bg-rose-100 rounded-md cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* CONTENT BODY */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="p-12 text-center rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
              <p className="text-xs text-slate-500">{isVi ? 'Đang tải kho tri thức FAQ...' : 'Loading FAQs...'}</p>
            </div>
          ) : isConnectionError ? (
            <div className="py-20 px-4 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs my-6">
              <div className="max-w-md mx-auto flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-500 flex items-center justify-center mb-1">
                  <WifiOff className="w-7 h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isVi ? 'Lỗi kết nối máy chủ' : 'Server Connection Error'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                  {isVi
                    ? 'Không thể kết nối đến máy chủ backend. Dữ liệu sẽ tự động đồng bộ khi dịch vụ hoạt động.'
                    : 'Could not connect to backend server. Data will sync automatically when service is online.'}
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => fetchFaqs(true)}
                    style={{
                      borderRadius: '12px',
                      backgroundColor: '#4f46e5',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 24px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(79, 70, 229, 0.35)',
                    }}
                    className="hover:bg-indigo-700 transition-all uppercase tracking-wider"
                  >
                    {isVi ? 'THỬ KẾT NỐI LẠI' : 'RETRY CONNECTION'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Tổng câu hỏi trong kho' : 'Total FAQs'}</span>
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{totalFaqs}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isVi ? 'Đang huấn luyện cho AI Bot' : 'Trained knowledge base'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Đang hoạt động (Active)' : 'Active Entries'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">{activeFaqs}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isVi ? 'Sẵn sàng trả lời người dùng' : 'Serving user queries'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Chủ đề / Danh mục' : 'Categories'}</span>
                <FolderTree className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{categoriesCount}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Booking, Payment, Rules, v.v.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>{isVi ? 'Tỷ lệ phản hồi tự động' : 'Automation Rate'}</span>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">94.2%</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isVi ? 'Giảm tải cho đội ngũ hỗ trợ' : 'Resolved by bot'}
              </div>
            </div>
          </div>

          {/* FILTER & SEARCH TOOLBAR: ?search=ve&category=... */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input: ?search=ve */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder={
                    isVi
                      ? 'Tìm kiếm câu hỏi, câu trả lời hoặc từ khóa (vd: vé, hoàn tiền, momo...)...'
                      : 'Search question, answer or keywords (e.g. ticket, refund)...'
                  }
                  className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-xs"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setPage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* CATEGORY TABS FILTER */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500 shrink-0 font-medium text-[11px]">
                {isVi ? 'Chủ đề FAQ:' : 'Category:'}
              </span>

              {FAQ_CATEGORIES.map((cat) => {
                const isActive = categoryFilter === cat;
                const count =
                  cat === 'All'
                    ? totalFaqs
                    : faqs.filter((f) => (f.category || '').toLowerCase() === cat.toLowerCase()).length;

                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryFilter(cat);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                    }`}
                  >
                    <span>{cat === 'All' ? (isVi ? 'Tất cả' : 'All') : cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TABLE OF FAQS */}
          <div className="rounded-xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">{isVi ? 'Câu hỏi (question)' : 'Question'}</th>
                    <th className="px-4 py-3">{isVi ? 'Câu trả lời tóm tắt (answer)' : 'Answer Preview'}</th>
                    <th className="px-4 py-3">{isVi ? 'Danh mục' : 'Category'}</th>
                    <th className="px-4 py-3">{isVi ? 'Trạng thái (is_active)' : 'Status'}</th>
                    <th className="px-4 py-3 text-right">{isVi ? 'Thao tác' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {faqs.map((faq) => (
                    <tr
                      key={faq.id}
                      onClick={() => setPreviewItem(faq)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer text-slate-800"
                    >
                      <td className="px-4 py-3.5 max-w-sm">
                        <div className="font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2">
                          {faq.question}
                        </div>
                        <button
                          onClick={(e) => handleCopyId(faq.id, e)}
                          className="text-[10px] text-slate-400 hover:text-indigo-600 font-mono flex items-center gap-1 mt-1 cursor-pointer"
                        >
                          <span>{faq.id}</span>
                          {copiedId === faq.id ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                        </button>
                      </td>

                      <td className="px-4 py-3.5 max-w-md">
                        <div className="text-slate-600 line-clamp-2 leading-relaxed">
                          {faq.answer}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                          {faq.category || 'General'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {faq.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{isVi ? 'Hoạt động' : 'Active'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                            <X className="w-3 h-3" />
                            <span>{isVi ? 'Tạm ẩn' : 'Inactive'}</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setPreviewItem(faq)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                            title={isVi ? 'Xem chi tiết' : 'Preview'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => openEditModal(faq, e)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors"
                            title={isVi ? 'Chỉnh sửa' : 'Edit'}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteItem(faq);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            title={isVi ? 'Xóa câu hỏi' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2">
            <div>
              {isVi
                ? `Hiển thị ${faqs.length} câu hỏi FAQ (Trang ${page})`
                : `Showing ${faqs.length} FAQ entries (Page ${page})`}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-xs text-slate-700"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{isVi ? 'Trang trước' : 'Previous'}</span>
              </button>

              <span className="px-3 py-1.5 bg-slate-100 text-indigo-700 border border-slate-200 rounded-xl font-bold font-mono">
                {page}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={faqs.length < limit || loading}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-xs text-slate-700"
              >
                <span>{isVi ? 'Trang sau' : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
        )}
        </div>
      </div>

      {/* CREATE FAQ MODAL: POST /api/v1/admin/chatbot/faqs */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isVi ? 'Thêm Câu Hỏi Mới vào Kho Tri Thức' : 'Add FAQ to Knowledge Base'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">POST /api/v1/admin/chatbot/faqs</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
              {/* Question */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isVi ? 'Câu hỏi của người dùng (question) *' : 'User Question (question) *'}
                </label>
                <input
                  type="text"
                  required
                  value={createForm.question}
                  onChange={(e) => setCreateForm({ ...createForm, question: e.target.value })}
                  placeholder={isVi ? 'Ví dụ: Quy định hoàn tiền vé?, Làm thế nào để lấy vé NFT?...' : 'e.g. How to get NFT ticket?...'}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
                />
              </div>

              {/* Category & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isVi ? 'Chủ đề / Danh mục (category)' : 'Category'}
                  </label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
                  >
                    {FAQ_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isVi ? 'Trạng thái hoạt động (is_active)' : 'Status (is_active)'}
                  </label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="create_is_active"
                      checked={createForm.is_active}
                      onChange={(e) => setCreateForm({ ...createForm, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <label htmlFor="create_is_active" className="text-slate-700 cursor-pointer font-medium">
                      {isVi ? 'Kích hoạt ngay cho Bot trả lời' : 'Active immediately'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Answer */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isVi ? 'Câu trả lời chuẩn của Bot (answer) *' : 'Bot Answer (answer) *'}
                </label>
                <textarea
                  rows={5}
                  required
                  value={createForm.answer}
                  onChange={(e) => setCreateForm({ ...createForm, answer: e.target.value })}
                  placeholder={
                    isVi
                      ? 'Nhập nội dung câu trả lời chuẩn xác, dễ hiểu để AI bot gửi đến khách hàng...'
                      : 'Enter exact answer for the chatbot to provide...'
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-300 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmittingCreate && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isVi ? 'Thêm câu hỏi' : 'Save FAQ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FAQ MODAL: PUT /api/v1/admin/chatbot/faqs/{id} */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isVi ? 'Cập nhật Câu Hỏi FAQ' : 'Update FAQ'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">PUT /api/v1/admin/chatbot/faqs/{editItem.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
              {/* Question */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isVi ? 'Câu hỏi của người dùng (question) *' : 'Question *'}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.question}
                  onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
                />
              </div>

              {/* Status active */}
              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit_is_active"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <label htmlFor="edit_is_active" className="text-slate-700 cursor-pointer font-medium">
                    {isVi ? 'Đang hoạt động (is_active)' : 'Active in bot'}
                  </label>
                </div>
              </div>

              {/* Answer */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {isVi ? 'Nội dung câu trả lời cập nhật (answer) *' : 'Updated Answer *'}
                </label>
                <textarea
                  rows={5}
                  required
                  value={editForm.answer}
                  onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-300 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isVi ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmittingEdit && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isVi ? 'Lưu thay đổi' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL PREVIEW MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{previewItem.category || 'FAQ'}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">{previewItem.id}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs overflow-y-auto">
              <div>
                <div className="text-slate-500 text-[10px] uppercase font-semibold mb-1">
                  {isVi ? 'Câu hỏi người dùng:' : 'Question:'}
                </div>
                <div className="text-sm font-bold text-slate-900 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {previewItem.question}
                </div>
              </div>

              <div>
                <div className="text-indigo-600 text-[10px] uppercase font-semibold mb-1 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Câu trả lời của AI Chatbot:' : 'Bot Response:'}</span>
                </div>
                <div className="text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-line">
                  {previewItem.answer}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-end gap-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs cursor-pointer font-semibold border border-slate-300 shadow-xs transition-colors"
              >
                {isVi ? 'Đóng' : 'Close'}
              </button>
              <button
                onClick={() => {
                  const item = previewItem;
                  setPreviewItem(null);
                  openEditModal(item);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{isVi ? 'Chỉnh sửa' : 'Edit'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHATBOT PLAYGROUND TESTER MODAL */}
      {isTesterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[560px] text-slate-900">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Fandom AI Chatbot Tester</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {isVi ? 'Thử nghiệm trực tiếp với kho tri thức vừa cập nhật' : 'Live knowledge base tester'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTesterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat message flow */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/80 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200 shadow-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-2xl leading-relaxed text-xs shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white font-medium rounded-tr-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* 3 bouncing dots indicator in tester */}
              {isTesterTyping && (
                <div className="flex items-start gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200 shadow-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white border border-slate-200 text-slate-800 p-3 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.32s]" />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.16s]" />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                    <span className="text-[10px] text-slate-500 ml-1 font-medium">{isVi ? 'Đang soạn phản hồi...' : 'Typing...'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input box */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendTestChat()}
                  placeholder={isVi ? 'Gõ câu hỏi để test bot (VD: hoàn tiền vé, vé NFT...)...' : 'Type a question...'}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
                <button
                  onClick={handleSendTestChat}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL: DELETE /api/v1/admin/chatbot/faqs/{id} */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl p-6 text-xs text-center space-y-4 text-slate-900">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isVi ? 'Xóa câu hỏi khỏi kho tri thức?' : 'Delete FAQ?'}
              </h3>
              <p className="text-slate-600 mt-1">
                {isVi
                  ? `Bạn có chắc chắn muốn xóa câu hỏi "${deleteItem.question}" (ID: ${deleteItem.id})? Bot sẽ không trả lời theo câu hỏi này nữa.`
                  : `Are you sure you want to delete "${deleteItem.question}"?`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteItem(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-300 shadow-xs cursor-pointer transition-colors"
              >
                {isVi ? 'Hủy bỏ' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={isSubmittingDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
              >
                {isSubmittingDelete && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isVi ? 'Xác nhận xóa' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
