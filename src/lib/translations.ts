export type Lang = 'vi' | 'en';

export const translations = {
  nav: {
    home: { vi: 'Trang chủ', en: 'Home' },
    work: { vi: 'Dự án', en: 'Work' },
    services: { vi: 'Dịch vụ', en: 'Services' },
    blog: { vi: 'Blog', en: 'Blog' },
    about: { vi: 'Về chúng tôi', en: 'About' },
    contact: { vi: 'Liên hệ', en: 'Contact' },
    cta: { vi: 'Bắt đầu ngay', en: "Let's talk" },
  },
  hero: {
    eyebrow: { vi: 'CREATIVE STUDIO · THỦ ĐỨC', en: 'CREATIVE STUDIO · THU DUC' },
    title: { vi: 'Ý tưởng\nthành\nhình ảnh.', en: 'Ideas\nbecome\nvisuals.' },
    desc: { vi: 'CREU biến chiến lược thương hiệu thành hình ảnh, video và trải nghiệm thị giác giàu cảm xúc — từ ý tưởng đến sản phẩm hoàn chỉnh.', en: 'CREU transforms brand strategy into visuals, video, and emotionally rich experiences — from concept to final product.' },
    showreel: { vi: 'Xem showreel', en: 'Play showreel' },
    explore: { vi: 'Khám phá dự án', en: 'Explore our work' },
  },
  works: {
    title: { vi: 'Dự án nổi bật', en: 'Selected Works' },
    viewAll: { vi: 'Xem tất cả dự án', en: 'View all projects' },
  },
  services: {
    title: { vi: 'Dịch vụ', en: 'Services' },
    branding: { vi: 'Thiết kế thương hiệu', en: 'Brand Identity' },
    photo: { vi: 'Nhiếp ảnh', en: 'Photography' },
    video: { vi: 'Video & Film', en: 'Video & Film' },
    web: { vi: 'Website', en: 'Website' },
    marketing: { vi: 'Marketing Outsource', en: 'Marketing Outsource' },
    ai: { vi: 'AI Creative', en: 'AI Creative' },
  },
  blog: {
    title: { vi: 'Góc nhìn Sáng tạo Xu hướng.', en: 'Creative Perspectives & Trends.' },
    subtitle: { vi: 'Góc nhìn sáng tạo, xu hướng thiết kế thương hiệu và bài viết chuyên sâu từ CREU Studio.', en: 'Creative insights, branding trends, and in-depth articles from CREU Studio.' },
    label: { vi: 'CREU BLOG', en: 'CREU BLOG' },
    readMore: { vi: 'Đọc thêm', en: 'Read more' },
    backToBlog: { vi: 'Quay lại Blog', en: 'Back to Blog' },
    publishedOn: { vi: 'Đăng ngày', en: 'Published on' },
    author: { vi: 'Tác giả', en: 'Author' },
    home: { vi: 'Trang chủ', en: 'Home' },
    startProject: { vi: 'Bắt đầu dự án ↗', en: 'Start a project ↗' },
  },
  about: {
    title: { vi: 'Về CREU Studio', en: 'About CREU Studio' },
    desc: { vi: 'Chúng tôi là studio sáng tạo chuyên biệt về hình ảnh thương hiệu, video và trải nghiệm thị giác tại TP. Hồ Chí Minh.', en: 'We are a creative studio specializing in brand visuals, video, and visual experiences in Ho Chi Minh City.' },
  },
  contact: {
    title: { vi: 'Bắt đầu dự án', en: 'Start a project' },
    desc: { vi: 'Hãy kể cho chúng tôi nghe về dự án của bạn.', en: 'Tell us about your project.' },
    name: { vi: 'Họ và tên', en: 'Full name' },
    email: { vi: 'Email', en: 'Email' },
    message: { vi: 'Nội dung', en: 'Message' },
    send: { vi: 'Gửi tin nhắn', en: 'Send message' },
  },
  pricing: {
    title: { vi: 'Gói dịch vụ', en: 'Partnership Plans' },
    popular: { vi: 'Phổ biến nhất', en: 'Most popular' },
    perMonth: { vi: 'USD / month', en: 'USD / month' },
    cta: { vi: 'Chọn gói này', en: 'Get started' },
  },
  brief: {
    btn: { vi: 'Gửi Brief Dự Án 📋', en: 'Submit Project Brief 📋' },
    title: { vi: 'CREU Client Brief Form', en: 'CREU Client Brief Form' },
    subtitle: { vi: 'Điền thông tin chi tiết giúp CREU thấu hiểu và triển khai dự án chính xác nhất.', en: 'Fill in the details to help CREU understand and execute your project perfectly.' },
    sec1: { vi: 'PHẦN 1: THÔNG TIN KHÁCH HÀNG', en: 'PART 1: CLIENT INFORMATION' },
    sec2: { vi: 'PHẦN 2: DỰ ÁN POSTER & THIẾT KẾ', en: 'PART 2: POSTER & DESIGN PROJECT' },
    sec3: { vi: 'PHẦN 3: CHI TIẾT KỸ THUẬT', en: 'PART 3: TECHNICAL SPECIFICATIONS' },
    sec4: { vi: 'PHẦN 4: NỘI DUNG POSTER & VISUAL', en: 'PART 4: POSTER CONTENT & VISUALS' },
    sec5: { vi: 'PHẦN 5: HƯỚNG ĐI CREATIVE', en: 'PART 5: CREATIVE DIRECTION' },
    sec6: { vi: 'PHẦN 6: TIMELINE & BUDGET', en: 'PART 6: TIMELINE & BUDGET' },
    sec7: { vi: 'PHẦN 7: THÔNG TIN THÊM', en: 'PART 7: ADDITIONAL INFORMATION' },
    submit: { vi: 'GỬI BRIEF NGAY 🚀', en: 'SUBMIT BRIEF NOW 🚀' },
    submitting: { vi: 'ĐANG GỬI BRIEF...', en: 'SUBMITTING BRIEF...' },
    success: { vi: 'Đã gửi Brief thành công! CREU sẽ liên hệ bạn ngay.', en: 'Brief submitted successfully! CREU will contact you shortly.' },
  },
  footer: {
    copy: { vi: '© 2026 CREU Studio. All rights reserved.', en: '© 2026 CREU Studio. All rights reserved.' },
  },
};

export function t(key: string, lang: Lang): string {
  const keys = key.split('.');
  let current: any = translations;
  for (const k of keys) {
    if (!current[k]) return key;
    current = current[k];
  }
  return current[lang] ?? current['vi'] ?? key;
}
