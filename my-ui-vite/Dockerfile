# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# 安装 pnpm（如果使用 pnpm）
RUN npm install -g pnpm || true

# 安装依赖
RUN if [ -f pnpm-lock.yaml ]; then pnpm install; else npm install; fi

# 复制源代码
COPY . .

# 构建应用
RUN if [ -f pnpm-lock.yaml ]; then pnpm run build; else npm run build; fi

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

