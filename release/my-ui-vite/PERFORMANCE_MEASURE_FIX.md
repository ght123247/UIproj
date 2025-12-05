# PerformanceMeasure 内存泄漏修复指南

## 问题分析

从 Chrome DevTools 的堆快照对比可以看到：
- **PerformanceMeasure** 对象增加了 **417,045 个实例**
- 占用了 **50.5 MB** 内存
- 这是导致内存持续上升的主要原因

## PerformanceMeasure 的来源

`PerformanceMeasure` 对象通常由以下原因产生：

1. **React DevTools 扩展** - 自动记录组件渲染性能
2. **Chrome DevTools Performance 标签** - 如果启用了性能录制
3. **第三方库** - 某些库可能使用 Performance API 进行性能监控
4. **浏览器自动记录** - Chrome 可能自动记录某些操作

## 解决方案

### 方案1：清理 Performance API 缓冲区（推荐）

在应用启动时和定期清理 Performance API 的缓冲区：

```javascript
// 清理所有性能标记和测量
if (performance.clearMarks) {
  performance.clearMarks()
}
if (performance.clearMeasures) {
  performance.clearMeasures()
}
if (performance.clearResourceTimings) {
  performance.clearResourceTimings()
}
```

### 方案2：限制 Performance API 的使用

如果不需要性能监控，可以禁用或限制：

```javascript
// 禁用 Performance Observer（如果存在）
if (window.PerformanceObserver) {
  // 可以尝试移除所有观察者
}
```

### 方案3：在 Chrome DevTools 中禁用

1. 打开 Chrome DevTools
2. 进入 **Settings** (⚙️ 图标)
3. 在 **Preferences** 中找到 **Performance** 部分
4. 取消勾选 **Enable performance monitoring**

## 在 DevTools 中进一步分析

### 步骤1：查看 PerformanceMeasure 的引用链

1. 在堆快照对比中，点击 **PerformanceMeasure** 行
2. 在底部查看 **Retainers**（保留者）面板
3. 这会显示哪些对象持有这些 PerformanceMeasure，阻止垃圾回收

### 步骤2：查看具体来源

1. 在 **Retainers** 面板中，展开引用链
2. 查找：
   - `PerformanceObserver` - 性能观察者
   - `React DevTools` - React 开发工具
   - `Chrome DevTools` - Chrome 开发者工具本身
   - 其他第三方库

### 步骤3：确定是否需要这些性能数据

- 如果是在开发环境，这些性能数据可能是有用的
- 如果在生产环境，应该清理或禁用

## 临时解决方案

如果问题紧急，可以在控制台运行：

```javascript
// 清理所有性能数据
performance.clearMarks()
performance.clearMeasures()
performance.clearResourceTimings()

// 强制垃圾回收（仅在开发环境有效）
if (window.gc) {
  window.gc()
}
```

## 长期解决方案

在应用代码中添加定期清理逻辑（见代码修复）

