import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dashboard } from './components/Dashboard'
import './App.css'

// 导入页面组件
import AgentNetworkPage from './app/agent-network/page'
import CommandCenterPage from './app/command-center/page'
import IntelligencePage from './app/intelligence/page'
import OperationsPage from './app/operations/page'
import SystemsPage from './app/systems/page'
import HomePage from './app/page'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 首页路由 */}
        <Route path="/" element={<HomePage />} />
        
        {/* Dashboard 路由 */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* 其他页面路由 */}
        <Route path="/agent-network" element={<AgentNetworkPage />} />
        <Route path="/command-center" element={<CommandCenterPage />} />
        <Route path="/intelligence" element={<IntelligencePage />} />
        <Route path="/operations" element={<OperationsPage />} />
        <Route path="/systems" element={<SystemsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
