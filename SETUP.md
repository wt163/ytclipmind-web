# 快速设置指南

## 立即测试网站

1. **打开主页**
   - 双击 `main.html` 在浏览器中打开
   - 或右键选择"打开方式" → 选择浏览器

2. **测试功能**
   - 轮播功能：网站会自动处理缺失的图片
   - Footer链接：hover效果和跳转功能已实现
   - 响应式：调整浏览器窗口大小测试移动端效果

## 下载图片资源

### 方法1：从Figma手动下载
1. 在Figma中选择对应的图片
2. 右键选择"Export" 
3. 选择适当格式 (PNG/SVG)
4. 按照README.md中的命名规则保存到 `assets/` 文件夹

### 方法2：使用提供的URL
README.md中包含了Figma图片的直接URL，你可以：
1. 复制URL到浏览器
2. 右键保存图片
3. 重命名并放到 `assets/` 文件夹

## 图片尺寸建议

为了获得最佳效果，请确保图片尺寸：

- **轮播截图**: 750px × 370px (16:8 比例)
- **Logo**: 312px × 312px (正方形)
- **用户图标**: 48px × 48px (正方形)
- **背景图**: 保持原始SVG矢量格式

## 自定义配置

### 修改轮播设置
在 `js/script.js` 中找到这行：
```javascript
this.autoPlayDelay = 3000; // 3 seconds
```
修改数值来改变轮播间隔时间 (毫秒)

### 修改颜色主题
在 `css/style.css` 中搜索颜色值进行自定义：
- 主色调: `#ff4c4c` (红色)
- 渐变: `#ff8c8c` 到 `#fff2f2`
- 链接hover: `#007bff` (蓝色)

### 修改字体
在CSS顶部修改font-family：
```css
font-family: 'Your-Font', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

## 常见问题

**Q: 轮播不工作？**
A: 检查浏览器控制台是否有JavaScript错误，确保图片路径正确

**Q: 样式显示不正确？**  
A: 确保CSS文件路径正确，检查浏览器开发者工具的Network标签

**Q: 在手机上显示异常？**
A: 网站已优化响应式设计，确保使用现代浏览器

**Q: 图片加载缓慢？**
A: 优化图片大小，推荐使用WebP格式提高性能

## 部署到线上

### GitHub Pages
1. 创建GitHub仓库
2. 上传所有文件
3. 在设置中启用GitHub Pages
4. 选择main分支作为源

### 其他托管服务
- **Netlify**: 拖拽文件夹到netlify.app
- **Vercel**: 连接GitHub仓库自动部署
- **传统主机**: 通过FTP上传所有文件

## 性能优化建议

1. **压缩图片**: 使用TinyPNG等工具压缩PNG图片
2. **启用Gzip**: 服务器端启用文件压缩
3. **CDN**: 使用CDN加速图片和静态资源加载
4. **缓存**: 设置适当的浏览器缓存策略