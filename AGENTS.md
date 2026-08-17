<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Quy trình Upload hình ảnh trên Web CREU

Khi nhận câu lệnh có dạng:
> "Up hình [tên file] lên Cloudinary, dùng làm [thumbnail/hình trong bài/wallpaper/banner] cho [tên bài/trang], build và push."

Thực hiện theo các bước sau:

1. **Upload hình lên Cloudinary**:
   - Tải file ảnh lên Cloudinary (qua API/Script hoặc lấy URL Cloudinary tương ứng).
   - Copy URL của ảnh sau khi upload.

2. **Cập nhật theo mục đích sử dụng**:
   - **A. THUMBNAIL bài blog**:
     - Vào Redis/Database → Tìm bài có slug `[tên bài]`.
     - Update field `thumbnail` = URL Cloudinary.
   - **B. HÌNH TRONG BÀI VIẾT**:
     - Vào Redis/Database → Tìm bài có slug `[tên bài]`.
     - Tìm vị trí tương ứng trong `content_vi` → Thêm cú pháp markdown: `![mô tả hình](URL_cloudinary)`.
   - **C. HÌNH WALLPAPER**:
     - Upload lên Cloudinary folder `/wallpaper/[tone-màu]/`.
     - Kiểm tra/Cập nhật danh sách wallpaper trong codebase nếu cần.
   - **D. BACKGROUND / BANNER**:
     - Cập nhật URL trong cấu hình Admin / Promotion & Banner field `Background Image`.

3. **Build & Push**:
   - Chạy `npm run build` để kiểm tra build.
   - Commit và push: `git push origin main`.

