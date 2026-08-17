const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../src/content/posts');
const siteDataPath = path.join(__dirname, '../src/data/siteData.json');

const wallpaperPosts = [
  {
    slug: 'hinh-nen-dien-thoai-dep',
    title: '100+ Hình Nền Điện Thoại Đẹp 4K Miễn Phí Tải Về Mới Nhất 2026',
    title_en: '100+ Best Free 4K Phone Wallpapers Download 2026',
    date: '2026-08-09',
    description: 'Tổng hợp 100+ hình nền điện thoại đẹp 4K sắc nét nhất 2026. Đa dạng tone màu: Dark, Minimal, Pastel, Aesthetic. Tải file gốc 100% miễn phí từ CREU Studio.',
    description_en: 'Collection of 100+ free 4K phone wallpapers by CREU Studio. Available in Dark, Minimal, Pastel, and Aesthetic color tones.',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    category: 'WALLPAPER',
    author: 'CREU Studio',
    content_vi: `# 100+ Hình Nền Điện Thoại Đẹp 4K Miễn Phí Tải Về Mới Nhất 2026

Bạn đang tìm kiếm hình nền điện thoại đẹp 4K sắc nét, không bị vỡ nét và phản ánh đúng phong cách cá nhân?

Một chiếc hình nền điện thoại không chỉ là bức ảnh trang trí màn hình — nó là điểm chạm visual đầu tiên mỗi khi bạn bật máy, tạo cảm hứng sáng tạo và thể hiện gu thẩm mỹ tinh tế.

CREU Studio tổng hợp và thiết kế bộ sưu tập **100+ hình nền điện thoại 4K miễn phí**, phân loại khoa học theo từng tone màu nghệ thuật giúp bạn dễ dàng chọn lựa.

---

## Tại Sao Nên Chọn Hình Nền Điện Thoại Chuẩn 4K Tại CREU Studio?

**Độ phân giải siêu nét 4K:** Tất cả hình ảnh tại CREU đều được thiết kế và render theo tỷ lệ chuẩn 9:16 (1080x1920 hoặc 2160x3840), đảm bảo nét căng trên mọi dòng màn hình iOS (iPhone 13, 14, 15, 16 Pro Max) và Android (Samsung Galaxy, Xiaomi, Pixel).

**Không dán watermark che hình:** File ảnh tải về là file gốc sạch, có logo CREU nhỏ tinh tế ở góc dưới không ảnh hưởng đến nội dung màn hình khóa hay màn hình chính.

**Phân loại theo Tone màu (Color Tone Filtering):** Dễ dàng lọc và tải hình nền theo gu màu sắc yêu thích: Dark Moody, Minimal White, Purple Aesthetic, Pastel Pink, Blue Ocean, Nature Green, Warm Amber, Black & Gold.

---

## Các Tone Màu Hình Nền Điện Thoại Được Yêu Thích Nhất 2026

### 1. 🖤 Dark Moody — Sang Trọng & Bí Ẩn
Dành cho người yêu thích phong cách tối giản, huyền bí và muốn tiết kiệm pin cho màn hình OLED/AMOLED.

### 2. 🤍 Minimal White — Tinh Tế & Nhẹ Nhàng
Hình nền tone trắng tối giản với hiệu ứng đổ bóng kiến trúc, đường nét line art tạo cảm giác thư thái mỗi khi mở điện thoại.

### 3. 💜 Purple Aesthetic — Mộng Mơ & Futuristic
Tone tím neon, thiên văn học vũ trụ và Cyberpunk cực kỳ ấn tượng dành cho các bạn trẻ sáng tạo.

### 4. 🩷 Pastel Pink — Ngọt Ngào & Thơ Mộng
Tone hồng pastel nhẹ dịu kết hợp mây trời, hoa lá tạo không gian màn hình ấm áp.

---

## Hướng Dẫn Tải Hình Nền Nhanh Tại CREU Studio

1. Truy cập trực tiếp trang [**Kho Hình Nền CREU Wallpaper**](/wallpaper).
2. Chọn Tag màu sắc yêu thích (Dark, Minimal, Pastel, Purple...).
3. Bấm **Preview** để xem thử màn hình hoặc bấm **Tải File 4K** để tải trực tiếp file gốc từ Google Drive miễn phí.

[**Khám phá kho hình nền điện thoại CREU ngay**](/wallpaper)

*Small Prints, Big Waves.*`,
    content_en: `# 100+ Best Free 4K Phone Wallpapers Download 2026

Looking for high-resolution 4K phone wallpapers that look crisp without pixelation?

A phone wallpaper is more than just a background image — it's the first visual touchpoint every time you unlock your screen.

CREU Studio compiles and designs a collection of **100+ free 4K phone wallpapers**, categorized by aesthetic color tones for easy downloading.

---

## Explore Free 4K Wallpapers by CREU Studio

- **Dark Moody 🖤:** Perfect for AMOLED screens and sleek dark mode lovers.
- **Minimal White 🤍:** Clean, architectural, and relaxing light shadows.
- **Purple Aesthetic 💜:** Cosmic nebula, neon violet, and futuristic vibes.
- **Pastel Pink 🩷:** Gentle blush clouds and soft dreamscapes.

[**Browse CREU Wallpaper Vault Now**](/wallpaper)

*Small Prints, Big Waves.*`
  },
  {
    slug: 'wallpaper-aesthetic-phone',
    title: 'Wallpaper Aesthetic Phone: Xu Hướng Hình Nền Điện Thoại Nổi Bật 2026',
    title_en: 'Wallpaper Aesthetic Phone: Top Phone Background Trends 2026',
    date: '2026-08-09',
    description: 'Khám phá xu hướng Wallpaper Aesthetic Phone 2026: sự kết hợp giữa nghệ thuật tối giản, màu sắc hoài niệm và nhiếp ảnh kiến trúc. Tải hình nền aesthetic miễn phí tại CREU Studio.',
    description_en: 'Explore 2026 Phone Aesthetic Wallpaper trends: blend of minimal art, nostalgic tones, and architectural photography. Free download at CREU Studio.',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    category: 'WALLPAPER',
    author: 'CREU Studio',
    content_vi: `# Wallpaper Aesthetic Phone: Xu Hướng Hình Nền Điện Thoại Nổi Bật 2026

Từ khóa **"Wallpaper Aesthetic Phone"** luôn nằm trong top tìm kiếm hàng đầu trên Pinterest và Google visual search.

Một chiếc wallpaper aesthetic không chỉ đẹp về mặt bố cục mà còn truyền tải một cảm xúc (mood) rất riêng: sự bình yên, nguồn cảm hứng làm việc, hay góc nhìn kiến trúc đầy tính nghệ thuật.

---

## 4 Xu Hướng Wallpaper Aesthetic Được Săn Đón Nhất

### 1. Cyberpunk Violet & Neon City
Sự kết hợp giữa ánh đèn neon tím hồng rực rỡ và những góc phố đêm hiện đại.

### 2. Architectural Shadow & Clean Shapes
Nhiếp ảnh kiến trúc tối giản tận dụng ánh sáng tự nhiên và vệt nắng qua khe cửa.

### 3. Cosmic Vaporwave & Galaxy Dream
Hình ảnh dải ngân hà, bầu trời đêm huyền ảo được phối màu pastel huyền bí.

### 4. Vintage Grain & Film Color
Màu ảnh phim hoài niệm mang lại cảm giác thân thuộc và ấm áp.

---

## Lưu Trực Tiếp Vào Pinterest Hoặc Tải Về Điện Thoại

Tại trang [**CREU Wallpaper**](/wallpaper), bạn có thể:
- Bấm **📌 Save to Pinterest** để lưu ngay vào bảng yêu thích trên Pinterest.
- Bấm **Tải File 4K** để lưu bản sắc nét nhất vào album ảnh điện thoại.

[**Ghé thăm trang CREU Wallpaper ngay**](/wallpaper)

*Small Prints, Big Waves.*`,
    content_en: `# Wallpaper Aesthetic Phone: Top Phone Background Trends 2026

"Wallpaper Aesthetic Phone" remains a top trending search query on Pinterest and Google Visual Search.

An aesthetic wallpaper conveys a unique mood: tranquility, creative inspiration, or architectural elegance.

[**Visit CREU Wallpaper Vault**](/wallpaper)

*Small Prints, Big Waves.*`
  },
  {
    slug: 'hinh-nen-dark-mode',
    title: 'Top Hình Nền Dark Mode Cho Điện Thoại OLED & AMOLED Siêu Tiết Kiệm Pin',
    title_en: 'Top Dark Mode Wallpapers for OLED & AMOLED Phones (Battery Saving)',
    date: '2026-08-09',
    description: 'BST hình nền dark mode siêu chất cho điện thoại màn hình OLED / AMOLED. Tối ưu điểm đen sâu (true black), giúp tiết kiệm pin hiệu quả và bảo vệ mắt đêm khuya.',
    description_en: 'Top dark mode wallpapers for OLED/AMOLED screens. True black background for maximum battery saving and eye comfort.',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    category: 'WALLPAPER',
    author: 'CREU Studio',
    content_vi: `# Top Hình Nền Dark Mode Cho Điện Thoại OLED & AMOLED Siêu Tiết Kiệm Pin

Màn hình OLED và Super AMOLED trên iPhone và các dòng máy flagship Android tắt hoàn toàn các điểm ảnh màu đen (True Black) để hiển thị.

Chính vì vậy, sử dụng **hình nền Dark Mode chuẩn True Black** giúp điện thoại của bạn tiết kiệm tới 15-25% dung lượng pin hàng ngày, đồng thời mang lại trải nghiệm êm mắt tuyệt đối khi dùng máy ban đêm.

---

## Đặc Điểm Của Bộ Hình Nền Dark Mode Tại CREU

- **Nền đen sẫm True Black:** Điểm đen tối ưu giúp tắt bớt pixel phát sáng.
- **Điểm nhấn màu sắc vừa phải:** Sử dụng ánh sáng neon, vàng kim (Black & Gold) hoặc ánh tím huyền bí làm điểm nhấn.
- **Giữ chi tiết sắc nét:** Không bị méo hay vỡ ảnh khi cài làm Lockscreen.

[**Tải trọn bộ hình nền Dark Mode 4K tại CREU Wallpaper**](/wallpaper)

*Small Prints, Big Waves.*`,
    content_en: `# Top Dark Mode Wallpapers for OLED & AMOLED Phones (Battery Saving)

OLED & Super AMOLED displays turn off black pixels completely for true black rendering. Using True Black wallpapers saves up to 15-25% daily battery consumption while reducing eye strain.

[**Download Dark Mode 4K Wallpapers at CREU**](/wallpaper)

*Small Prints, Big Waves.*`
  },
  {
    slug: 'hinh-nen-pastel',
    title: 'BST Hình Nền Pastel Điện Thoại Đẹp Nhẹ Nhàng & Tinh Tế 2026',
    title_en: 'Beautiful Soft Pastel Phone Wallpapers Collection 2026',
    date: '2026-08-09',
    description: 'Tải hình nền pastel điện thoại đẹp nhẹ nhàng: sắc hồng baby, xanh mint, tím nhạt và cam đào. Hình ảnh 4K mịn màng mang lại nguồn năng lượng tích cực mỗi ngày.',
    description_en: 'Download soft pastel phone wallpapers: baby pink, mint green, lavender, and peach tones. Smooth 4K visuals by CREU Studio.',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    category: 'WALLPAPER',
    author: 'CREU Studio',
    content_vi: `# BST Hình Nền Pastel Điện Thoại Đẹp Nhẹ Nhàng & Tinh Tế 2026

Gam màu Pastel luôn được ưa chuộng nhờ sự dịu mát, trong trẻo và thanh lịch.

Bộ sưu tập **hình nền Pastel điện thoại 2026** của CREU Studio tổng hợp những gam màu nhẹ nhàng nhất: hồng phấn, xanh baby, cam đào và tím nhạt lavender.

[**Khám phá bộ sưu tập Pastel tại CREU Wallpaper**](/wallpaper)

*Small Prints, Big Waves.*`,
    content_en: `# Beautiful Soft Pastel Phone Wallpapers Collection 2026

Pastel tones remain timelessly popular due to their soothing, clean, and elegant aesthetic.

[**Browse Pastel Collection at CREU Wallpaper**](/wallpaper)

*Small Prints, Big Waves.*`
  },
  {
    slug: 'tai-hinh-nen-mien-phi',
    title: 'Tải Hình Nền Điện Thoại Miễn Phí Chất Lượng Cao 4K Tại CREU Studio',
    title_en: 'Download Free High Quality 4K Phone Wallpapers at CREU Studio',
    date: '2026-08-09',
    description: 'Hướng dẫn tải hình nền điện thoại miễn phí file gốc chất lượng cao 4K từ kho Google Drive của CREU Studio. Không quảng cáo rác, không mất phí.',
    description_en: 'Guide to downloading free original 4K phone wallpapers from CREU Studio Google Drive vault. Fast, direct, and ad-free.',
    thumbnail: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=80',
    category: 'WALLPAPER',
    author: 'CREU Studio',
    content_vi: `# Tải Hình Nền Điện Thoại Miễn Phí Chất Lượng Cao 4K Tại CREU Studio

Bạn chán nản vì các trang tải hình nền hiện nay đầy quảng cáo rác, bấm tải thì bị giảm chất lượng ảnh hoặc dán logo chật màn hình?

CREU Studio xây dựng trang [**Wallpaper**](/wallpaper) với tiêu chí: **Trải nghiệm nhanh - Xem preview mượt - Tải file gốc Google Drive 100% miễn phí**.

---

## 3 Bước Tải Ảnh 4K Đơn Giản

1. Mở trang [**creu.vn/wallpaper**](/wallpaper).
2. Lọc theo tone màu bạn thích hoặc xem tất cả.
3. Bấm **Tải File 4K** để tải trực tiếp hình nền về máy.

[**Tải hình nền điện thoại 4K ngay**](/wallpaper)

*Small Prints, Big Waves.*`,
    content_en: `# Download Free High Quality 4K Phone Wallpapers at CREU Studio

Tired of wallpaper websites filled with popups and compressed images?

CREU Studio built the [**Wallpaper Vault**](/wallpaper) for fast browsing, smooth previews, and direct 4K Google Drive downloads.

[**Go to CREU Wallpaper Vault**](/wallpaper)

*Small Prints, Big Waves.*`
  }
];

// Write MDX files
for (const post of wallpaperPosts) {
  const fileContent = `---
title: "${post.title.replace(/"/g, '\\"')}"
title_en: "${post.title_en.replace(/"/g, '\\"')}"
slug: "${post.slug}"
date: "${post.date}"
description: "${post.description.replace(/"/g, '\\"')}"
description_en: "${post.description_en.replace(/"/g, '\\"')}"
thumbnail: "${post.thumbnail}"
category: "${post.category}"
author: "${post.author}"
---

${post.content_vi}

<!-- EN -->

${post.content_en}
`;

  const mdxPath = path.join(postsDir, `${post.slug}.mdx`);
  fs.writeFileSync(mdxPath, fileContent, 'utf8');
  console.log(`Created MDX wallpaper post: ${post.slug}.mdx`);
}

// Update siteData.json as well
const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));
if (!siteData.blogPosts) siteData.blogPosts = [];

for (const post of wallpaperPosts) {
  const existingIdx = siteData.blogPosts.findIndex((p) => p.slug === post.slug);
  const formattedPost = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    slug: post.slug,
    title: post.title,
    titleEn: post.title_en,
    date: post.date,
    description: post.description,
    descriptionEn: post.description_en,
    thumbnail: post.thumbnail,
    category: post.category,
    author: post.author,
    content_vi: post.content_vi,
    content_en: post.content_en,
    content: `${post.content_vi}\n\n<!-- EN -->\n\n${post.content_en}`,
  };

  if (existingIdx !== -1) {
    siteData.blogPosts[existingIdx] = formattedPost;
  } else {
    siteData.blogPosts.unshift(formattedPost);
  }
}

fs.writeFileSync(siteDataPath, JSON.stringify(siteData, null, 2), 'utf8');
console.log('Successfully added 5 Wallpaper SEO posts!');
