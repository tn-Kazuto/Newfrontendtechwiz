export type Language = 'en' | 'vi';

export interface TranslationDictionary {
  // Common & Navigation
  brandTitle: string;
  adminPortal: string;
  dashboard: string;
  catalog: string;
  orders: string;
  customers: string;
  users: string;
  events: string;
  analytics: string;
  aiSupport: string;
  settings: string;
  backToStorefront: string;
  systemOperational: string;
  searchPlaceholder: string;
  notifications: string;
  language: string;
  theme: string;
  profile: string;
  logout: string;
  
  // Dashboard Overview
  overviewTitle: string;
  overviewSubtitle: string;
  timeRangeToday: string;
  timeRange7Days: string;
  timeRange30Days: string;
  timeRangeYear: string;
  
  // KPI Cards
  totalRevenue: string;
  totalOrders: string;
  activeFandomMembers: string;
  albumsSold: string;
  aiQueries: string;
  vsLastPeriod: string;
  hanteoSynced: string;
  satisfactionRate: string;
  
  // Charts & Visuals
  revenueSalesTrend: string;
  salesByArtist: string;
  topSellingAlbums: string;
  regionalBreakdown: string;
  monthlyRevenue: string;
  monthlyOrders: string;
  unitsSold: string;
  share: string;
  
  // Tables & Feeds
  recentOrders: string;
  viewAllOrders: string;
  orderId: string;
  customer: string;
  product: string;
  total: string;
  status: string;
  date: string;
  action: string;
  
  statusPaid: string;
  statusProcessing: string;
  statusShipped: string;
  statusCancelled: string;

  inventoryAlerts: string;
  addNewAlbum: string;
  albumTitle: string;
  artist: string;
  price: string;
  stockRemaining: string;
  tag: string;
  delete: string;
  edit: string;

  liveActivityFeed: string;
  newOrderNotice: string;
  newMemberNotice: string;
  reviewNotice: string;
  stockAlertNotice: string;
  
  // Modal & Form Labels
  createAlbumTitle: string;
  enterAlbumTitle: string;
  selectArtist: string;
  priceUSD: string;
  priceVND: string;
  stockQuantity: string;
  albumTag: string;
  cancel: string;
  saveAlbum: string;
  
  // Stats summary labels
  quickActions: string;
  exportReport: string;
  refreshData: string;
  filterByArtist: string;
  allArtists: string;
  
  // Settings Tab
  settingsTitle: string;
  generalSettings: string;
  storeName: string;
  hanteoIntegration: string;
  hanteoDescription: string;
  autoSync: string;
  emailAlerts: string;
  saveChanges: string;
  changesSaved: string;

  // Live Dashboard & API Integration
  pendingEvents: string;
  pendingApproval: string;
  financialReports: string;
  registeredUsers: string;
  connectedToBackend: string;
  connectingToApi: string;
  connectionError: string;
  retryConnection: string;
  viewAllEvents: string;
  viewAllUsers: string;
  eventTitle: string;
  venue: string;
  reportTitle: string;
  amount: string;
  role: string;
  noPendingEvents: string;
  noFinancialReports: string;
  noUsers: string;
  manageEvents: string;
  manageUsers: string;
  quickNavigation: string;
  liveApiSynced: string;
  reviewEvent: string;
  exportCsv: string;
  viewReport: string;
  reportsCount: string;
  eventsCount: string;
  usersCount: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brandTitle: 'Fan Hub Plus',
    adminPortal: 'Admin Portal',
    dashboard: 'Dashboard Overview',
    catalog: 'Products & Albums',
    orders: 'Orders Management',
    customers: 'Customers & Fandom',
    users: 'User Management',
    events: 'Event Management',
    analytics: 'Analytics & Revenue',
    aiSupport: 'AI Support & Telemetry',
    settings: 'System Settings',
    backToStorefront: 'Back to Main Store',
    systemOperational: 'System Operational 100%',
    searchPlaceholder: 'Search orders, customers, albums, SKUs...',
    notifications: 'Notifications',
    language: 'Language',
    theme: 'Theme',
    profile: 'Admin Profile',
    logout: 'Sign Out',
    
    overviewTitle: 'Admin Overview Dashboard',
    overviewSubtitle: 'Real-time sales analytics, Hanteo chart sync telemetry, and fandom performance.',
    timeRangeToday: 'Today',
    timeRange7Days: 'Last 7 Days',
    timeRange30Days: 'Last 30 Days',
    timeRangeYear: 'This Year',
    
    totalRevenue: 'Total Revenue',
    totalOrders: 'Total Orders',
    activeFandomMembers: 'Active Fandom Members',
    albumsSold: 'Albums & Merch Sold',
    aiQueries: 'AI Queries Resolved',
    vsLastPeriod: 'vs previous period',
    hanteoSynced: '100% Hanteo Chart Synced',
    satisfactionRate: 'Satisfaction Rating',
    
    revenueSalesTrend: 'Revenue & Sales Trend (2026)',
    salesByArtist: 'Sales Breakdown by Artist',
    topSellingAlbums: 'Top Performing Albums',
    regionalBreakdown: 'Regional Fandom Sales',
    monthlyRevenue: 'Monthly Revenue ($)',
    monthlyOrders: 'Monthly Orders',
    unitsSold: 'units sold',
    share: 'share',
    
    recentOrders: 'Recent Customer Orders',
    viewAllOrders: 'View All Orders',
    orderId: 'Order ID',
    customer: 'Customer',
    product: 'Product / Album',
    total: 'Total',
    status: 'Status',
    date: 'Date',
    action: 'Action',
    
    statusPaid: 'Paid',
    statusProcessing: 'Processing',
    statusShipped: 'Shipped',
    statusCancelled: 'Cancelled',

    inventoryAlerts: 'Inventory Catalog & Stock',
    addNewAlbum: 'Add New Album',
    albumTitle: 'Album Title',
    artist: 'Artist / Group',
    price: 'Price',
    stockRemaining: 'Stock Left',
    tag: 'Status Tag',
    delete: 'Delete',
    edit: 'Edit',

    liveActivityFeed: 'Live Fandom Activity',
    newOrderNotice: 'New order #ORD-9842 placed for NewJeans Supernatural (Photobook Ver)',
    newMemberNotice: 'New fandom VIP member registered from Tokyo, Japan',
    reviewNotice: '5-star review submitted for BLACKPINK Born Pink vinyl',
    stockAlertNotice: 'Low stock warning: BTS Proof (Collector Edition) - 12 units remaining',
    
    createAlbumTitle: 'Create New Album Entry',
    enterAlbumTitle: 'e.g. Supernatural (Single Album)',
    selectArtist: 'Select Artist',
    priceUSD: 'Price ($ USD)',
    priceVND: 'Price (₫ VND)',
    stockQuantity: 'Stock Quantity',
    albumTag: 'Status Tag',
    cancel: 'Cancel',
    saveAlbum: 'Save Album to Catalog',
    
    quickActions: 'Quick Management Actions',
    exportReport: 'Export Sales CSV',
    refreshData: 'Refresh Telemetry',
    filterByArtist: 'Filter by Artist',
    allArtists: 'All Artists',
    
    settingsTitle: 'Admin Portal Settings',
    generalSettings: 'General Configuration',
    storeName: 'Store Name',
    hanteoIntegration: 'Hanteo & Circle Chart API Integration',
    hanteoDescription: 'Automatically report all album purchases directly to official chart telemetry.',
    autoSync: 'Enable Real-time Chart Auto-sync',
    emailAlerts: 'Email Stock Alerts to Admin',
    saveChanges: 'Save Configuration',
    changesSaved: 'Settings updated successfully!',

    // Live Dashboard & API Integration
    pendingEvents: 'Pending Events',
    pendingApproval: 'Pending Approval',
    financialReports: 'Financial Reports',
    registeredUsers: 'Registered Users',
    connectedToBackend: 'Connected to Backend API',
    connectingToApi: 'Connecting to API...',
    connectionError: 'Backend Connection Offline',
    retryConnection: 'Retry Connection',
    viewAllEvents: 'View All Events',
    viewAllUsers: 'View All Users',
    eventTitle: 'Event Title',
    venue: 'Venue & Location',
    reportTitle: 'Report Title',
    amount: 'Amount',
    role: 'Role',
    noPendingEvents: 'No pending events found.',
    noFinancialReports: 'No financial reports found.',
    noUsers: 'No users found.',
    manageEvents: 'Manage Events',
    manageUsers: 'Manage Users',
    quickNavigation: 'Quick Navigation Hub',
    liveApiSynced: 'Live Telemetry Synced',
    reviewEvent: 'Review Event',
    exportCsv: 'Export CSV',
    viewReport: 'View Report',
    reportsCount: 'reports generated',
    eventsCount: 'events awaiting review',
    usersCount: 'registered users',
  },
  vi: {
    brandTitle: 'Fan Hub Plus',
    adminPortal: 'Cổng Quản Trị',
    dashboard: 'Trang Chủ Admin',
    catalog: 'Sản Phẩm & Album',
    orders: 'Quản Lý Đơn Hàng',
    customers: 'Khách Hàng & Fandom',
    users: 'Quản lý người dùng',
    events: 'Quản lý sự kiện',
    analytics: 'Thống Kê & Doanh Thu',
    aiSupport: 'Hỗ Trợ AI & Nhật Ký',
    settings: 'Cài Đặt Hệ Thống',
    backToStorefront: 'Quay Lại Cửa Hàng',
    systemOperational: 'Hệ thống hoạt động 100%',
    searchPlaceholder: 'Tìm kiếm đơn hàng, khách hàng, album, mã SKU...',
    notifications: 'Thông báo',
    language: 'Ngôn ngữ',
    theme: 'Giao diện',
    profile: 'Hồ sơ Admin',
    logout: 'Đăng xuất',
    
    overviewTitle: 'Bảng Tổng Quan Quản Trị',
    overviewSubtitle: 'Phân tích doanh số thời gian thực, đồng bộ Hanteo chart và hiệu suất fandom.',
    timeRangeToday: 'Hôm nay',
    timeRange7Days: '7 ngày qua',
    timeRange30Days: '30 ngày qua',
    timeRangeYear: 'Năm nay',
    
    totalRevenue: 'Tổng Doanh Thu',
    totalOrders: 'Tổng Đơn Hàng',
    activeFandomMembers: 'Thành Viên Fandom Active',
    albumsSold: 'Sản Phẩm Đã Bán',
    aiQueries: 'Yêu Cầu AI Đã Xử Lý',
    vsLastPeriod: 'so với kỳ trước',
    hanteoSynced: 'Đã đồng bộ 100% BXH Hanteo',
    satisfactionRate: 'Tỷ lệ hài lòng',
    
    revenueSalesTrend: 'Xu Hướng Doanh Thu & Đơn Hàng (2026)',
    salesByArtist: 'Doanh Số Theo Nghệ Sĩ / Nhóm Nhạc',
    topSellingAlbums: 'Album Bán Chạy Nhất',
    regionalBreakdown: 'Doanh Số Theo Khu Vực Fandom',
    monthlyRevenue: 'Doanh thu hàng tháng ($)',
    monthlyOrders: 'Số đơn hàng hàng tháng',
    unitsSold: 'sản phẩm bán ra',
    share: 'tỷ lệ',
    
    recentOrders: 'Đơn Hàng Mới Nhất',
    viewAllOrders: 'Xem Tất Cả Đơn Hàng',
    orderId: 'Mã Đơn',
    customer: 'Khách Hàng',
    product: 'Sản Phẩm / Album',
    total: 'Tổng Tiền',
    status: 'Trạng Thái',
    date: 'Ngày Tạo',
    action: 'Thao Tác',
    
    statusPaid: 'Đã thanh toán',
    statusProcessing: 'Đang xử lý',
    statusShipped: 'Đã giao hàng',
    statusCancelled: 'Đã hủy',

    inventoryAlerts: 'Quản Lý Kho & Album Catalog',
    addNewAlbum: 'Thêm Album Mới',
    albumTitle: 'Tên Album',
    artist: 'Nghệ Sĩ / Nhóm',
    price: 'Giá Bán',
    stockRemaining: 'Tồn Kho',
    tag: 'Nhãn Trạng Thái',
    delete: 'Xóa',
    edit: 'Sửa',

    liveActivityFeed: 'Hoạt Động Fandom Trực Tuyến',
    newOrderNotice: 'Đơn hàng mới #ORD-9842 đã đặt NewJeans Supernatural (Photobook Ver)',
    newMemberNotice: 'Thành viên VIP Fandom mới đăng ký từ Tokyo, Nhật Bản',
    reviewNotice: 'Đánh giá 5 sao cho đĩa than BLACKPINK Born Pink vinyl',
    stockAlertNotice: 'Cảnh báo tồn kho thấp: BTS Proof (Collector Edition) - Còn 12 sản phẩm',
    
    createAlbumTitle: 'Thêm Album Mới Vào Danh Mục',
    enterAlbumTitle: 'VD: Supernatural (Single Album)',
    selectArtist: 'Chọn Nghệ Sĩ',
    priceUSD: 'Giá ($ USD)',
    priceVND: 'Giá (₫ VND)',
    stockQuantity: 'Số Lượng Tồn Kho',
    albumTag: 'Nhãn Trạng Thái',
    cancel: 'Hủy Bỏ',
    saveAlbum: 'Lưu Album Vào Danh Mục',
    
    quickActions: 'Thao Tác Nhanh',
    exportReport: 'Xuất Báo Cáo CSV',
    refreshData: 'Làm Mới Dữ Liệu',
    filterByArtist: 'Lọc Theo Nghệ Sĩ',
    allArtists: 'Tất Cả Nghệ Sĩ',
    
    settingsTitle: 'Cài Đặt Cổng Quản Trị',
    generalSettings: 'Cấu Hình Chung',
    storeName: 'Tên Cửa Hàng',
    hanteoIntegration: 'Tích Hợp BXH Hanteo & Circle Chart API',
    hanteoDescription: 'Tự động báo cáo đơn hàng album trực tiếp lên bảng xếp hạng âm nhạc chính thức.',
    autoSync: 'Bật đồng bộ tự động thời gian thực',
    emailAlerts: 'Gửi cảnh báo kho hàng qua email cho Admin',
    saveChanges: 'Lưu Cấu Hình',
    changesSaved: 'Đã cập nhật cài đặt thành công!',

    // Live Dashboard & API Integration
    pendingEvents: 'Sự kiện chờ duyệt',
    pendingApproval: 'Chờ phê duyệt',
    financialReports: 'Báo cáo doanh thu',
    registeredUsers: 'Người dùng hệ thống',
    connectedToBackend: 'Đã kết nối API Backend',
    connectingToApi: 'Đang kết nối tới API...',
    connectionError: 'Lỗi kết nối Backend',
    retryConnection: 'Thử kết nối lại',
    viewAllEvents: 'Xem tất cả sự kiện',
    viewAllUsers: 'Xem tất cả người dùng',
    eventTitle: 'Tên sự kiện',
    venue: 'Địa điểm tổ chức',
    reportTitle: 'Tên báo cáo',
    amount: 'Số tiền',
    role: 'Vai trò',
    noPendingEvents: 'Không có sự kiện chờ duyệt nào.',
    noFinancialReports: 'Không có báo cáo tài chính nào.',
    noUsers: 'Không có người dùng nào.',
    manageEvents: 'Quản lý sự kiện',
    manageUsers: 'Quản lý người dùng',
    quickNavigation: 'Trung tâm điều hướng nhanh',
    liveApiSynced: 'Đồng bộ dữ liệu thời gian thực',
    reviewEvent: 'Kiểm duyệt sự kiện',
    exportCsv: 'Xuất file CSV',
    viewReport: 'Xem báo cáo',
    reportsCount: 'báo cáo đã tạo',
    eventsCount: 'sự kiện chờ duyệt',
    usersCount: 'người dùng đã đăng ký',
  },
};
