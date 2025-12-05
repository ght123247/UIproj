# 侧栏和页面标题编辑指南

## 📍 文件位置

所有侧栏和标题的配置都在以下文件中：

### 主文件：`src/app/page.tsx`

---

## 🎯 侧栏编辑

### 1. **侧栏标题和版本号**

**位置：** `src/app/page.tsx` 第 23-24 行

```tsx
<h1 className="text-orange-500 font-bold text-lg tracking-wider">TACTICAL OPS</h1>
<p className="text-neutral-500 text-xs">v2.1.7 CLASSIFIED</p>
```

**修改方法：**
- 修改 `TACTICAL OPS` 为你的应用名称
- 修改 `v2.1.7 CLASSIFIED` 为你的版本号或副标题

---

### 2. **侧栏菜单项**

**位置：** `src/app/page.tsx` 第 39-44 行

```tsx
{[
  { id: "overview", icon: Monitor, label: "COMMAND CENTER" },
  { id: "agents", icon: Users, label: "AGENT NETWORK" },
  { id: "operations", icon: Target, label: "OPERATIONS" },
  { id: "intelligence", icon: Shield, label: "INTELLIGENCE" },
  { id: "systems", icon: Settings, label: "SYSTEMS" },
].map((item) => (
```

**修改方法：**
- 修改 `label` 来改变菜单项显示的文字
- 修改 `icon` 来改变图标（从 `lucide-react` 导入）
- 修改 `id` 来改变对应的页面（需要与下面的条件匹配）

**添加新菜单项示例：**
```tsx
{ id: "reports", icon: FileText, label: "REPORTS" },
```

然后在第 104-108 行添加对应的页面：
```tsx
{activeSection === "reports" && <ReportsPage />}
```

---

### 3. **侧栏状态信息**

**位置：** `src/app/page.tsx` 第 61-72 行

```tsx
<div className="mt-8 p-4 bg-neutral-800 border border-neutral-700 rounded">
  <div className="flex items-center gap-2 mb-2">
    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
    <span className="text-xs text-white">SYSTEM ONLINE</span>
  </div>
  <div className="text-xs text-neutral-500">
    <div>UPTIME: 72:14:33</div>
    <div>AGENTS: 847 ACTIVE</div>
    <div>MISSIONS: 23 ONGOING</div>
  </div>
</div>
```

**修改方法：**
- 修改 `SYSTEM ONLINE` 为你的状态文字
- 修改 `UPTIME`、`AGENTS`、`MISSIONS` 等数据

---

## 📄 顶部工具栏标题

**位置：** `src/app/page.tsx` 第 85-89 行

```tsx
<div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
  <div className="flex items-center gap-4">
    <div className="text-sm text-neutral-400">
      TACTICAL COMMAND / <span className="text-orange-500">OVERVIEW</span>
    </div>
  </div>
```

**修改方法：**
- 修改 `TACTICAL COMMAND` 为你的主标题
- 修改 `OVERVIEW` 为当前页面的名称（需要根据 `activeSection` 动态显示）

**动态标题示例：**
```tsx
const getPageTitle = (section: string) => {
  const titles: Record<string, string> = {
    overview: "COMMAND CENTER",
    agents: "AGENT NETWORK",
    operations: "OPERATIONS",
    intelligence: "INTELLIGENCE",
    systems: "SYSTEMS",
  }
  return titles[section] || "OVERVIEW"
}

// 在 JSX 中使用：
<div className="text-sm text-neutral-400">
  TACTICAL COMMAND / <span className="text-orange-500">{getPageTitle(activeSection)}</span>
</div>
```

---

## 📝 各页面标题

### Command Center
**文件：** `src/app/command-center/page.tsx`  
**位置：** 在组件内部，没有单独的标题（由主页面控制）

### Agent Network
**文件：** `src/app/agent-network/page.tsx`  
**位置：** 第 107 行
```tsx
<h1 className="text-2xl font-bold text-white tracking-wider">AGENT NETWORK</h1>
```

### Operations
**文件：** `src/app/operations/page.tsx`  
**位置：** 第 142 行
```tsx
<h1 className="text-2xl font-bold text-white tracking-wider">OPERATIONS CENTER</h1>
```

### Intelligence
**文件：** `src/app/intelligence/page.tsx`  
**位置：** 第 141 行
```tsx
<h1 className="text-2xl font-bold text-white tracking-wider">INTELLIGENCE CENTER</h1>
```

### Systems
**文件：** `src/app/systems/page.tsx`  
**位置：** 第 179 行
```tsx
<h1 className="text-2xl font-bold text-white tracking-wider">SYSTEMS MONITOR</h1>
```

---

## 🎨 样式修改

### 侧栏背景色
**位置：** `src/app/page.tsx` 第 18 行
```tsx
className="... bg-neutral-900 ..."
```
修改 `bg-neutral-900` 为其他颜色

### 侧栏宽度
**位置：** `src/app/page.tsx` 第 18 行
```tsx
className={`${sidebarCollapsed ? "w-16" : "w-70"} ...`}
```
- `w-16` - 折叠时的宽度
- `w-70` - 展开时的宽度（注意：`w-70` 不是标准 Tailwind 类，可能需要自定义）

### 菜单项高亮颜色
**位置：** `src/app/page.tsx` 第 51 行
```tsx
? "bg-orange-500 text-white"
```
修改 `bg-orange-500` 为其他颜色类

---

## 🔧 快速修改示例

### 修改应用名称
```tsx
// 第 23 行
<h1 className="text-orange-500 font-bold text-lg tracking-wider">我的应用名称</h1>
```

### 修改菜单项
```tsx
// 第 40-44 行
{[
  { id: "overview", icon: Monitor, label: "控制中心" },
  { id: "agents", icon: Users, label: "代理网络" },
  // ... 其他项
]}
```

### 修改顶部标题
```tsx
// 第 88 行
<div className="text-sm text-neutral-400">
  我的系统 / <span className="text-orange-500">概览</span>
</div>
```

---

## 💡 提示

1. **图标选择**：可以从 `lucide-react` 导入任何图标
   ```tsx
   import { Home, Settings, User, ... } from "lucide-react"
   ```

2. **动态标题**：可以让顶部标题根据当前页面动态变化

3. **国际化**：如果需要多语言，可以创建翻译文件并引用

4. **样式一致性**：保持所有标题使用相同的样式类以确保一致性

