import { Outlet } from "react-router-dom"
import Header from "./components/header"
import Main from "./components/main"
import MenuTabs from "./components/menuTabs"

const Layout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#141414] border-r border-[#303030] flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-[#303030]">
          <span className="text-xl font-bold text-white">Logo</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <MenuTabs />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-[#141414] border-b border-[#303030] flex items-center px-6 shrink-0">
          <Header />
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-6">
          <Main>
            <Outlet />
          </Main>
        </main>
      </div>
    </div>
  )
}


export default Layout
