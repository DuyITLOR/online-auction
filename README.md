# 📦 Online auction
Ứng dụng Sàn Đấu Giá Trực Tuyến cho phép người dùng tham gia đấu giá các sản phẩm thuộc nhiều danh mục khác nhau. Hệ thống bao gồm các phân hệ cho người dùng nặc danh (guest), người mua (bidder), người bán (seller) và quản trị viên (administrator).

## ✨ 1. Các tính năng chính
- Quản lý sản phẩm đấu giá
- Quản lý tài khoản người dùng (đăng ký, đăng nhập, thay đổi thông tin cá nhân)
- Thực hiện ra giá, theo dõi lịch sử đấu giá
- Tính năng đấu giá tự động
- Quản lý hồ sơ cá nhân cho người mua và người bán
- Hệ thống gửi email thông báo cho các bên liên quan về các giao dịch quan trọng

## 📖 Link Đề Bài

Để xem chi tiết yêu cầu và các chức năng cần phát triển cho dự án này, vui lòng tham khảo link dưới đây:

Đề bài chi tiết - [PTUDW - Final Project - Online Auction](https://hackmd.io/@nndkhoa9/S1QJaF3Axx)

## ⚙️ Thiết lập trước khi chạy
### ✅ 1. Cài các node và pnpm

| Công cụ         | Phiên bản khuyến nghị |
| --------------- | --------------------- |
| Node.js         | >= 18.x               |
| pnpm (hoặc npm) | pnpm khuyến khích     |
| Git             | Dùng để clone source  |
| Prisma          | 6.19                  |

**⚠️ Lưu ý:** do đồ án sài bản prisma 6.19 nên trong extension prisma của vscode nhớ chỉnh về phiên bản 6.19

**Kiểm tra nhanh:**

```bash
node -v
pnpm -v      # hoặc npm -v
```


### ✅ 2. Clone repository về máy
```bash
git clone https://github.com/DuyITLOR/online-auction.git
```

### ✅ 3. Cài đặt các dependencies
P/s: install ở thư mục gốc
```bash
cd online-aucation
pnpm install
```

### ✅ 4. Cài đặt môi trường
Cần hai file env cho FE và BE
 - client: .env.local
- server: .env

(Hai file này sẽ được gửi đính kèm ạ)


### ✅ 5. Cài schema prisma
```bash
cd server
pnpm prisma generate
```

## 🎯 Chạy chương trình môi trường dev
### ✅ Chạy client và server
```bash
cd  online-auction
pnpm dev
```

### ✅ Chạy client
```bash
cd  online-auction
pnpm dev:client
```

### ✅ Chạy server
```bash
cd  online-auction
pnpm dev:server
```

### ✅ Cách kéo/đẩy schema của database về
Kéo 
```bash
cd server
pnpm prisma db pull
```

## 🚀 Build và chạy production
Do yêu cầu kiến trúc, client và server được build riêng biệt.

### ✅ Build client
```bash
cd client
pnpm run build
pnpm run preview
```

### ✅ Build server
```bash
cd server
pnpm run build
pnpm start
```



