import { Moon, Sun, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

const Header = () => {
  const getInitialTheme = () => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const [isDark, setIsDark] = useState(() => {
    const shouldBeDark = getInitialTheme()
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    }
    return shouldBeDark
  })

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">

        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
      </div>
      <div className="flex gap-4 items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9"
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">切换主题</span>
        </Button>
        {/* 头像下拉菜单 */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition-colors cursor-pointer"
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Avatar>

                <AvatarImage src="/src/assets/avatar.png" />
              </Avatar>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-popover shadow-lg py-1 z-50">
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium">shulao</p>
                <p className="text-xs text-muted-foreground">shulao@example.com</p>
              </div>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors cursor-pointer"
              >
                <User className="h-4 w-4" />
                个人资料
              </button>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                设置
              </button>
              <div className="border-t my-1" />
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
