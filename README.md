# YT ClipMind Website

基于Figma设计的原生HTML/CSS/JavaScript网站实现

## 项目结构

```
ytclipmind-web/
│
├── main.html          # 主页
├── terms.html         # 服务条款页面
├── privacy.html       # 隐私政策页面
├── refund.html        # 退款政策页面
│
├── css/
│   └── style.css      # 统一样式文件
│
├── js/
│   └── script.js      # 交互脚本
│
└── assets/            # 图片资源文件夹
    ├── 需要手动从Figma下载的图片...
```

## 需要下载的图片资源及命名方式

请从Figma中下载以下图片并保存到 `assets/` 文件夹：

### 轮播截图图片
1. **Free Plan 轮播图片 (3张)**
   - `free-screenshot-1.png`
   - `free-screenshot-2.png` 
   - `free-screenshot-3.png`

2. **Pro Plan 轮播图片 (4张)**
   - `pro-screenshot-1.png`
   - `pro-screenshot-2.png`
   - `pro-screenshot-3.png`
   - `pro-screenshot-4.png`

### 其他图片资源
3. **Logo和图标**
   - `ytclipmind-logo.png` (Footer中的logo)
   - `user-icon.png` (用户图标)

4. **背景和装饰图片**
   - `diagram-background.svg` (中间的流程图背景)

### Figma原始图片URL对应关系
以下是从Figma获取的原始图片URL，您可以根据这些来下载对应图片：

- 主要截图: `https://www.figma.com/api/mcp/asset/144f60f8-337a-490f-a0d6-c1b45cb99bbf.png`
- 截图2: `https://www.figma.com/api/mcp/asset/d6fe547b-0349-4ca8-81bc-13da2d0ff10c.png`
- Logo: `https://www.figma.com/api/mcp/asset/736932e9-9078-4cff-acdf-1df2b8fbf332.png`
- 背景多边形: `https://www.figma.com/api/mcp/asset/815c89cb-2364-46cb-bd11-82fef1747686.svg`
- 圆形元素: 
  - `https://www.figma.com/api/mcp/asset/956b6b89-d72d-43b6-95ea-e7df0882762e.svg`
  - `https://www.figma.com/api/mcp/asset/084d6f1a-e50c-484a-95f0-9059a7588479.svg`

## 实现的交互功能

### 1. 轮播功能
- **Free Plan**: 3张图片自动轮播 (3秒间隔)
- **Pro Plan**: 4张图片自动轮播 (3秒间隔)
- 小圆点指示器，支持点击切换
- 平滑的淡入淡出过渡效果
- 点击圆点时重置自动播放计时器

### 2. Footer交互
- **法律页面链接**: Hover颜色变化效果
- **链接跳转**: 
  - Terms: `https://ytclipmind.com/terms-of-service` (新窗口)
  - Privacy: `https://ytclipmind.com/privacy-policy` (新窗口)  
  - Refund: `https://ytclipmind.com/refund-policy` (新窗口)
- **Contact Us**: `mailto:support@ytclipmind.com` (同窗口)

### 3. 移动端支持
- 响应式设计，适配手机和平板
- 触摸滑动支持轮播切换
- 键盘导航支持 (左右箭头键)

### 4. 性能优化
- 图片懒加载
- 轮播暂停优化
- 平滑的CSS过渡动画

## 技术栈

- **HTML5**: 语义化标签结构
- **CSS3**: 现代样式，支持响应式设计
- **Vanilla JavaScript**: 原生JS实现所有交互，无框架依赖
- **字体**: Roboto字体家族 (通过系统字体回退)

## 部署说明

1. 将所有文件上传到网站根目录
2. 确保图片资源已正确放置在 `assets/` 文件夹
3. 网站可直接通过 `main.html` 访问
4. 支持GitHub Pages等静态网站托管服务

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

支持现代浏览器的所有功能，包括CSS Grid、Flexbox和ES6语法。

## 开发注意事项

1. 所有图片路径都是相对路径，便于部署
2. JavaScript使用模块化结构，易于维护和扩展
3. CSS使用了CSS自定义属性 (CSS变量) 便于主题定制
4. 遵循Web标准和无障碍性最佳实践