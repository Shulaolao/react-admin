import { Outlet } from "react-router-dom"
import Header from "./components/header"
import Main from "./components/main"
import MenuTabs from "./components/menuTabs"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

const Layout = () => {
  return (
    <SidebarProvider>
      <MenuTabs />
      <SidebarInset className="h-screen">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center px-6 shrink-0">
          <Header />
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Main>
            <Outlet />
          </Main>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
