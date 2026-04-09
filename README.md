# Eyecare Glass Website

Website thương mại điện tử bán kính mắt, hướng đến học sinh/sinh viên và người trẻ.
Dự án gồm frontend React, backend Spring Boot và cấu hình Firebase để đồng bộ dữ liệu.

## Mục tiêu dự án
- Trải nghiệm mua kính hiện đại, mobile-first
- Luồng mua hàng nhanh: xem sản phẩm -> giỏ hàng -> checkout
- Hỗ trợ tính năng e-commerce đầy đủ: auth, cart, order, admin, wishlist, feedback, review

## Kiến trúc hệ thống
- `frontend/`: React 18 + React Router + Context (Auth/Cart/Wishlist)
- `backend/`: Spring Boot + Spring Security (JWT) + JPA
- `database/`: Firebase config + rules + schema tham chiếu

## Cấu trúc thư mục
```text
eyecare-glass-website/
├── frontend/                  # UI client
├── backend/                   # REST API server
├── database/                  # Firebase config/rules/schema
├── docs/                      # Tài liệu cốt lõi
├── eyeclass-website-...json   # Firebase service account (local)
├── package.json               # Script chạy nhanh toàn dự án
└── README.md
```

## Chạy nhanh dự án

### 1. Frontend
```bash
cd frontend
npm install
npm start
```
Frontend chạy tại: `http://localhost:3000`

### 2. Backend (dev profile)
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```
Backend chạy tại: `http://localhost:8080/api`

## Scripts ở root
```bash
npm run frontend:install
npm run frontend:start
npm run frontend:build
npm run backend:install
npm run backend:start
npm run backend:build
npm run setup
```

## API và chức năng chính
- Auth: đăng ký, đăng nhập, JWT
- Product: listing/filter/sort/detail
- Cart: thêm/sửa/xóa sản phẩm
- Checkout/Order: đặt đơn, theo dõi trạng thái
- Admin: quản lý user/order/product
- Firebase sync endpoint cho dữ liệu tổng hợp

## Tài liệu cốt lõi
- [SETUP_GUIDE](docs/SETUP_GUIDE.md)
- [SYSTEM_DESIGN](docs/SYSTEM_DESIGN.md)
- [API_CONTRACT](docs/API_CONTRACT.md)
- [DATABASE_SCHEMA](docs/DATABASE_SCHEMA.md)

## Lưu ý bảo mật
- File service account Firebase (`eyeclass-website-firebase-adminsdk-*.json`) chỉ dùng local/dev.
- Không nên commit key thật lên repository public.
