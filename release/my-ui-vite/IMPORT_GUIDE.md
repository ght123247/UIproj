# UI 文件导入指南

## 步骤 1：复制文件

将您从 UI 编辑器生成的文件复制到以下位置：

```
my-ui-vite/src/app/
├── agent-network/
│   ├── loading.tsx
│   └── page.tsx
├── command-center/
│   └── page.tsx
├── intelligence/
│   ├── loading.tsx
│   └── page.tsx
├── operations/
│   └── page.tsx
├── systems/
│   └── page.tsx
├── layout.tsx
└── page.tsx
```

## 步骤 2：转换 Next.js 代码为 Vite/React Router

### 需要修改的地方：

1. **移除 Next.js 特定导入**
   - 删除 `import { useRouter } from 'next/navigation'`
   - 删除 `import Link from 'next/link'`
   - 删除 `import Image from 'next/image'`

2. **替换为 React Router**
   ```tsx
   // Next.js
   import { useRouter } from 'next/navigation'
   const router = useRouter()
   router.push('/path')
   
   // React Router
   import { useNavigate } from 'react-router-dom'
   const navigate = useNavigate()
   navigate('/path')
   ```

3. **替换 Link 组件**
   ```tsx
   // Next.js
   import Link from 'next/link'
   <Link href="/path">Link</Link>
   
   // React Router
   import { Link } from 'react-router-dom'
   <Link to="/path">Link</Link>
   ```

4. **替换 Image 组件**
   ```tsx
   // Next.js
   import Image from 'next/image'
   <Image src="/image.png" alt="..." />
   
   // React Router (使用普通 img)
   <img src="/image.png" alt="..." />
   ```

5. **layout.tsx 处理**
   - 将 `layout.tsx` 转换为路由布局组件
   - 或将其内容合并到 `App.tsx`

## 步骤 3：更新路由配置

在 `src/App.tsx` 中取消注释相应的路由：

```tsx
import AgentNetworkPage from './app/agent-network/page'
import CommandCenterPage from './app/command-center/page'
// ... 其他导入

<Route path="/agent-network" element={<AgentNetworkPage />} />
<Route path="/command-center" element={<CommandCenterPage />} />
// ... 其他路由
```

## 步骤 4：检查依赖

确保所有使用的组件和库都已安装：
- shadcn/ui 组件
- lucide-react 图标
- recharts（如果使用图表）
- 其他 UI 库

## 快速导入脚本

如果您有所有文件，可以：
1. 直接复制整个 `app` 文件夹到 `src/app`
2. 运行查找替换来批量修改导入语句
3. 更新 `App.tsx` 中的路由配置

