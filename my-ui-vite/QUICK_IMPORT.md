# 快速导入 UI 文件指南

## 📁 目录结构已创建

项目已准备好接收您的 UI 文件，目录结构如下：

```
src/app/
├── agent-network/
│   ├── loading.tsx  ✅
│   └── page.tsx     ✅
├── command-center/
│   └── page.tsx     ✅
├── intelligence/
│   ├── loading.tsx  ✅
│   └── page.tsx     ✅
├── operations/
│   └── page.tsx     ✅
├── systems/
│   └── page.tsx     ✅
├── layout.tsx       ✅
└── page.tsx         ✅
```

## 🚀 快速导入步骤

### 方法 1：直接复制粘贴（推荐）

1. **打开 UI 编辑器生成的文件**
2. **复制文件内容**
3. **粘贴到对应的文件**：
   - `app/page.tsx` → `src/app/page.tsx`
   - `app/agent-network/page.tsx` → `src/app/agent-network/page.tsx`
   - 以此类推...

### 方法 2：批量复制文件

如果您有完整的 `app` 文件夹：

```powershell
# 在项目根目录执行
# 假设您的 UI 文件在 E:\UI_Files\app
xcopy /E /I "E:\UI_Files\app" "E:\UIproj\my-ui-vite\src\app"
```

## ⚠️ 必须修改的内容

### 1. Next.js → React Router 转换

在粘贴代码后，需要全局替换以下内容：

| Next.js | React Router |
|---------|--------------|
| `import { useRouter } from 'next/navigation'` | `import { useNavigate } from 'react-router-dom'` |
| `const router = useRouter()` | `const navigate = useNavigate()` |
| `router.push('/path')` | `navigate('/path')` |
| `import Link from 'next/link'` | `import { Link } from 'react-router-dom'` |
| `<Link href="/path">` | `<Link to="/path">` |
| `import Image from 'next/image'` | 删除，使用 `<img>` |

### 2. 批量替换脚本（VS Code）

在 VS Code 中按 `Ctrl+Shift+H` 打开查找替换，使用正则表达式：

**查找：** `import Link from 'next/link'`  
**替换：** `import { Link } from 'react-router-dom'`

**查找：** `href="([^"]+)"`  
**替换：** `to="$1"`

**查找：** `import.*useRouter.*from 'next/navigation'`  
**替换：** `import { useNavigate } from 'react-router-dom'`

**查找：** `const router = useRouter\(\)`  
**替换：** `const navigate = useNavigate()`

**查找：** `router\.push\(`  
**替换：** `navigate(`

### 3. 检查导入路径

确保所有导入路径使用 `@/` 别名：
- `@/components/ui/...`
- `@/lib/utils`
- `@/components/...`

## 📝 示例转换

### 转换前（Next.js）：
```tsx
'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Page() {
  const router = useRouter()
  
  return (
    <div>
      <Link href="/dashboard">Go to Dashboard</Link>
      <Button onClick={() => router.push('/agent-network')}>
        Navigate
      </Button>
    </div>
  )
}
```

### 转换后（React Router）：
```tsx
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Page() {
  const navigate = useNavigate()
  
  return (
    <div>
      <Link to="/dashboard">Go to Dashboard</Link>
      <Button onClick={() => navigate('/agent-network')}>
        Navigate
      </Button>
    </div>
  )
}
```

## ✅ 验证步骤

1. 运行 `npm run dev`
2. 访问 `http://localhost:5173`
3. 检查控制台是否有错误
4. 测试各个路由是否正常工作

## 🆘 常见问题

### 问题 1：找不到模块
- 检查导入路径是否正确
- 确保使用了 `@/` 别名

### 问题 2：路由不工作
- 检查 `App.tsx` 中的路由配置
- 确保所有页面组件都已导入

### 问题 3：样式丢失
- 确保 `index.css` 已正确导入
- 检查 Tailwind CSS 配置

## 📞 需要帮助？

如果遇到问题，请检查：
1. 浏览器控制台的错误信息
2. 终端中的编译错误
3. 文件路径是否正确

