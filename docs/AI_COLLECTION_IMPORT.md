# AI Collection 数据导入指南

这套脚本可以帮助你从 [AI Collection](https://github.com/ai-collection/ai-collection) 仓库批量导入 AI 工具数据到你的 Supabase 数据库。

**⚠️ 重要提醒**: 推荐使用带死链检测的新导入流程，详细信息请查看 [导入验证指南](./IMPORT_WITH_VALIDATION.md)。

## 📋 前提条件

1. **环境变量配置**：在 `.env.local` 文件中配置：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **系统要求**：
   - Node.js 18+
   - Git（用于克隆仓库）
   - 网络连接

## 🚀 推荐使用方法（新版带验证）

### 标准导入（推荐）
```bash
# 自动检测死链，只导入有效工具
npm run import-ai-collection-safe /path/to/ai-collection-repo
```

### 快速测试
```bash
# 测试验证功能
npm run test-import-validation
```

### 性能调优选项
```bash
# 网络较慢环境（3个并发）
npm run import-ai-collection-slow /path/to/ai-collection-repo

# 网络良好环境（15个并发）
npm run import-ai-collection-turbo /path/to/ai-collection-repo

# 跳过检测（不推荐，可能导入死链）
npm run import-ai-collection-fast /path/to/ai-collection-repo
```

## 📊 导入报告

每次导入会生成 `import_report.json` 报告，包含：
- 总工具数量和有效率
- 详细的批次处理信息
- 无效工具列表和原因
- 平均响应时间统计

## 🔧 传统使用方法（兼容性）

### 方法一：自动下载并导入

这种方法会自动下载 AI Collection 仓库并导入数据：

```bash
# 1. 下载仓库并生成 JSON 文件
npm run import-ai-collection

# 2. 将 JSON 数据导入到 Supabase
npm run import-to-supabase
```

### 方法二：手动下载后导入

如果你已经手动克隆了 AI Collection 仓库：

```bash
# 1. 先手动克隆仓库
git clone https://github.com/ai-collection/ai-collection.git

# 2. 指定本地路径导入
npm run import-ai-collection-local ./ai-collection

# 3. 导入到 Supabase
npm run import-to-supabase
```

## 📁 输出文件

- **`data/ai-collection-tools.json`**：转换后的工具数据，符合你的 Tool 接口格式
- **控制台输出**：详细的处理日志和统计信息

## 🔄 数据转换说明

脚本会自动处理以下转换：

### 分类映射
AI Collection 的分类会映射到你的分类系统：
- `Art & Image Generator` → `Design & Art`
- `Code & Database Assistant` → `Developer Tools`
- `Copywriting` → `Writing & Content`
- 等等...

### 价格模式识别
- 包含 "free" 且不含 "trial" → `free`
- 包含 "freemium" 或既有免费又有付费 → `freemium`
- 其他情况 → `paid`

### 自动生成字段
- `id`：根据工具名称生成唯一标识
- `shortDescription`：从完整描述中提取前100字符
- `rating`：随机生成 4.0-4.9 的评分
- `reviewCount`：随机生成 10-110 的评论数
- `views` 和 `likes`：随机生成数值

## 📊 处理统计

导入完成后，你会看到：
- 总工具数
- 分类分布
- 定价模式分布
- 错误统计（如有）

## ⚠️ 注意事项

1. **Logo 处理**：脚本会设置默认的 logo 路径 `/logos/{tool-id}.png`，你需要后续补充实际的 logo 文件

2. **数据清理**：脚本会跳过缺少必要字段（name、description、website）的工具

3. **去重处理**：使用 `upsert` 操作，相同 ID 的工具会被更新而不是重复插入

4. **批量处理**：数据会分批插入（每批50个），避免请求过大

5. **错误恢复**：遇到网络错误会自动等待重试

## 🛠️ 故障排除

### 常见错误

1. **`找不到tools目录`**
   - 确保提供的是 AI Collection 仓库的根目录路径
   - 检查仓库是否完整克隆

2. **`Supabase 连接失败`**
   - 检查 `.env.local` 中的环境变量
   - 确认 Supabase 项目状态正常
   - 验证服务角色密钥权限

3. **`JSON文件格式错误`**
   - 删除现有的 `data/ai-collection-tools.json` 重新生成
   - 检查文件是否被意外修改

### 手动检查

```bash
# 检查生成的 JSON 文件
cat data/ai-collection-tools.json | head -20

# 检查 Supabase 表
# 在 Supabase Dashboard 中查看 tools 表
```

## 📈 后续步骤

导入完成后，建议：

1. **验证数据**：在 Supabase Dashboard 中检查导入的数据
2. **补充 Logo**：为工具添加实际的 logo 图片
3. **数据优化**：根据需要调整分类、标签等
4. **测试功能**：确保前端可以正确显示导入的数据

## 🔧 自定义配置

如需修改转换逻辑，可以编辑：
- `src/scripts/importAICollection.ts`：主要转换逻辑
- `CATEGORY_MAPPING`：分类映射关系
- `mapPricingModel`：价格模式识别逻辑
