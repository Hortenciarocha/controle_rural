import { Outlet } from 'react-router-dom'
import { PropriedadeProvider } from '@/contexts/PropriedadeContext'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { TopBar } from '@/components/layout/TopBar'

export function AppLayout() {
  return (
    <PropriedadeProvider>
      <div className="flex min-h-dvh bg-neutral-50">
        <Sidebar />
        <div className="flex min-h-dvh flex-1 flex-col">
          <TopBar />
          <main className="flex-1 px-4 py-5 pb-20 md:pb-6">
            <Outlet />
          </main>
          <BottomNav />
        </div>
      </div>
    </PropriedadeProvider>
  )
}
