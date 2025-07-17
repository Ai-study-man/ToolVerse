# Spaceship域名DNS配置指南

## 🎯 关键问题解答

### Q: 域名服务器需要添加到Spaceship吗？
**A: 有两种方法，您只需要选择一种：**

#### 方法1: 保持Spaceship DNS，添加A记录（推荐）
- **不需要**更改域名服务器
- 在Spaceship中添加A记录即可
- 保持对域名的完全控制

#### 方法2: 使用Vercel域名服务器
- 将域名服务器更改为Vercel的
- 不需要手动添加DNS记录
- Vercel自动管理

## 🚀 方法1：在Spaceship添加A记录（推荐）

### 步骤1: 登录并找到域名
1. 登录 [spaceship.com](https://spaceship.com)
2. 点击右上角头像 → "My Account"
3. 左侧菜单 → "Domain Names"
4. 找到 `toolsverse.tools` → 点击 "Manage"

### 步骤2: 寻找DNS管理界面
在域名管理页面，寻找以下名称的选项：
- **"DNS Management"**
- **"DNS Records"** 
- **"DNS Zone"**
- **"Name Servers & DNS"**
- **"Advanced DNS"**

### 步骤3: 添加A记录
1. 点击 "Add Record" 或 "Add New Record"
2. 填写信息：
   ```
   Record Type: A
   Host/Name: @ (或留空)
   Value/Points to: 216.198.79.1
   TTL: Auto (或3600)
   ```
3. 点击 "Save" 或 "Add"

### 🔧 如果找不到DNS管理选项

**可能原因**：
1. 域名状态不是"Active"
2. 域名还在转移过程中
3. Spaceship界面设计不同

**解决方案**：
1. **检查域名状态**：确保显示为"Active"
2. **联系客服**：Spaceship有在线客服，可以询问DNS管理位置
3. **使用方法2**：改用Vercel域名服务器

## 🌐 方法2：使用Vercel域名服务器

### 如果在Spaceship中确实找不到DNS管理

1. **在Spaceship中更改域名服务器**：
   - 找到域名的"Name Servers"设置
   - 更改为：
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```

2. **等待生效**：
   - 域名服务器更改需要24-48小时
   - 生效后Vercel会自动管理DNS

## ✅ 推荐使用方法1的原因

1. **保持控制权**：您仍然控制域名DNS
2. **配置简单**：只需添加一条A记录
3. **灵活性高**：可以随时添加其他DNS记录
4. **生效更快**：A记录通常10-30分钟生效

## 🔍 验证配置成功

配置完成后，检查：

1. **DNS解析检查**：
   ```bash
   nslookup toolsverse.tools
   ```
   应该返回：216.198.79.1

2. **Vercel状态检查**：
   - 在Vercel项目中查看域名状态
   - 应该从"Invalid"变为"Active"

3. **在线工具检查**：
   - 访问 whatsmydns.net
   - 输入域名查看A记录

## 📞 获取帮助

如果仍然找不到DNS管理：
1. **Spaceship客服**：询问DNS记录管理的具体位置
2. **发送截图**：将Spaceship域名管理页面截图，我可以帮您分析
3. **备选方案**：使用方法2（Vercel域名服务器）

## 总结

**最简单的方法**：在Spaceship中找到DNS管理，添加一条A记录指向 `216.198.79.1` 即可，无需更改域名服务器。
