#!/bin/bash

# O Play 部署脚本
# 使用方法: ./deploy.sh

set -e

echo "🚀 开始部署 O Play..."

# 配置变量
APP_DIR="/var/www/play-store"
REPO_URL="https://github.com/JQ2020/O_PLAY.git"

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
  echo "请使用 sudo 运行此脚本"
  exit 1
fi

# 1. 安装系统依赖
echo "📦 安装系统依赖..."
apt update
apt install -y curl git nginx

# 2. 安装 Node.js 20
if ! command -v node &> /dev/null; then
  echo "📦 安装 Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi

echo "Node.js 版本: $(node -v)"
echo "npm 版本: $(npm -v)"

# 3. 安装 PM2
if ! command -v pm2 &> /dev/null; then
  echo "📦 安装 PM2..."
  npm install -g pm2
fi

# 4. 创建应用目录
echo "📁 创建应用目录..."
mkdir -p $APP_DIR
mkdir -p /var/log/play-store

# 5. 克隆或更新代码
if [ -d "$APP_DIR/.git" ]; then
  echo "📥 更新代码..."
  cd $APP_DIR
  git pull origin main
else
  echo "📥 克隆代码..."
  git clone $REPO_URL $APP_DIR
  cd $APP_DIR
fi

# 6. 安装依赖
echo "📦 安装项目依赖..."
npm install

# 7. 生成 Prisma Client
echo "🔧 生成 Prisma Client..."
npx prisma generate

# 8. 初始化数据库
echo "🗄️ 初始化数据库..."
npx prisma db push

# 9. 填充种子数据（如果是首次部署）
if [ ! -f "$APP_DIR/prisma/dev.db" ] || [ ! -s "$APP_DIR/prisma/dev.db" ]; then
  echo "🌱 填充种子数据..."
  npx prisma db seed
fi

# 10. 构建项目
echo "🔨 构建项目..."
npm run build

# 11. 启动/重启 PM2
echo "🚀 启动应用..."
pm2 delete play-store 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root

# 12. 配置 Nginx
echo "🌐 配置 Nginx..."
cat > /etc/nginx/sites-available/play-store << 'NGINX'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
NGINX

# 启用站点
ln -sf /etc/nginx/sites-available/play-store /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试并重启 Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

echo ""
echo "✅ 部署完成！"
echo ""
echo "📍 访问地址: http://$(curl -s ifconfig.me)"
echo "📍 本地访问: http://localhost"
echo ""
echo "常用命令:"
echo "  pm2 logs play-store    # 查看日志"
echo "  pm2 restart play-store # 重启应用"
echo "  pm2 status             # 查看状态"
