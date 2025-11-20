# Chrome DevTools 内存泄漏检测指南

## 方法1：Performance Monitor（性能监控器）

### 步骤：
1. 打开 Chrome DevTools（F12）
2. 切换到 **Performance Monitor** 标签（如果没有，点击 `...` 更多工具）
3. 勾选 **JavaScript heap size** 和 **Memory**
4. 观察内存曲线是否持续上升

## 方法2：Memory Profiler（内存分析器）

### 步骤：
1. 打开 Chrome DevTools（F12）
2. 切换到 **Memory** 标签
3. 选择 **Heap snapshot**（堆快照）
4. 点击 **Take snapshot** 拍摄初始快照
5. 等待3-5分钟，让页面运行
6. 再次点击 **Take snapshot** 拍摄第二个快照
7. 在快照下拉菜单中选择 **Comparison**（对比）
8. 查看 **Size Delta** 列，找出内存增长最多的对象

### 重点关注：
- **PerformanceMeasure** - 性能测量对象（最常见的内存泄漏源，通常由 React DevTools 或 Chrome DevTools 产生）
- **Array** - 数组对象是否持续增长
- **Object** - 对象数量是否异常
- **Closure** - 闭包是否泄漏
- **EventListener** - 事件监听器是否未清理
- **Detached DOM tree** - 分离的DOM树

### 如何分析 PerformanceMeasure 泄漏：

1. **点击 PerformanceMeasure 行**，查看详细信息
2. **查看 Retainers（保留者）面板**（在底部）：
   - 这会显示哪些对象持有这些 PerformanceMeasure
   - 常见的保留者包括：
     - `PerformanceObserver` - 性能观察者
     - `React DevTools` - React 开发工具扩展
     - `Chrome DevTools` - Chrome 开发者工具本身
3. **解决方案**：
   - 如果是在开发环境，这是正常的（DevTools 在记录性能数据）
   - 如果是在生产环境，需要清理 Performance API 缓冲区
   - 参见 `PERFORMANCE_MEASURE_FIX.md` 获取详细修复方案

## 方法3：Performance 录制

### 步骤：
1. 打开 Chrome DevTools（F12）
2. 切换到 **Performance** 标签
3. 勾选 **Memory** 选项
4. 点击 **Record**（录制）
5. 等待3-5分钟
6. 点击 **Stop**（停止）
7. 查看内存使用曲线，找出内存持续增长的时间段
8. 点击对应时间段，查看该时间点的活动

## 方法4：Allocation Timeline（分配时间线）

### 步骤：
1. 打开 Chrome DevTools（F12）
2. 切换到 **Memory** 标签
3. 选择 **Allocation instrumentation on timeline**
4. 点击 **Start** 开始录制
5. 等待3-5分钟
6. 点击 **Stop** 停止
7. 查看蓝色条（内存分配），找出持续分配内存的代码位置

## 常见内存泄漏模式

### 1. 未清理的定时器
```javascript
// ❌ 错误：定时器未清理
useEffect(() => {
  setInterval(() => {
    // ...
  }, 1000)
}, [])

// ✅ 正确：清理定时器
useEffect(() => {
  const id = setInterval(() => {
    // ...
  }, 1000)
  return () => clearInterval(id)
}, [])
```

### 2. 未取消的 Promise
```javascript
// ❌ 错误：Promise 未取消
useEffect(() => {
  fetch('/api/data').then(res => {
    setData(res)
  })
}, [])

// ✅ 正确：使用 AbortController
useEffect(() => {
  const controller = new AbortController()
  fetch('/api/data', { signal: controller.signal })
    .then(res => setData(res))
  return () => controller.abort()
}, [])
```

### 3. 闭包持有大对象
```javascript
// ❌ 错误：闭包持有大对象
useEffect(() => {
  const largeData = new Array(1000000).fill(0)
  setInterval(() => {
    console.log(largeData.length) // 闭包持有 largeData
  }, 1000)
}, [])

// ✅ 正确：避免在闭包中持有大对象
useEffect(() => {
  setInterval(() => {
    // 不持有大对象
  }, 1000)
}, [])
```

### 4. 事件监听器未移除
```javascript
// ❌ 错误：事件监听器未移除
useEffect(() => {
  window.addEventListener('resize', handleResize)
}, [])

// ✅ 正确：移除事件监听器
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

## 针对 Recharts 的检查

Recharts 可能内部缓存数据，检查：
1. 在 Heap snapshot 中搜索 "recharts"
2. 查看是否有大量缓存的图表数据
3. 尝试降低更新频率或使用 `key` 属性强制重新渲染

## 快速检查清单

- [ ] 所有 `setInterval` 都有对应的 `clearInterval`
- [ ] 所有 `setTimeout` 都有对应的 `clearTimeout`
- [ ] 所有 `addEventListener` 都有对应的 `removeEventListener`
- [ ] 所有 `fetch` 请求都使用 `AbortController` 取消
- [ ] 组件卸载时清理所有 ref 中的数据
- [ ] 避免在闭包中持有大对象
- [ ] 限制数组和对象的最大大小

