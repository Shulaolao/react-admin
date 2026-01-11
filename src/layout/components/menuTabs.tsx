import { useNavigate, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Home, FolderTree, Wrench, ChevronDown } from "lucide-react"
import reactLogo from "@/assets/react.svg"

const menuItems = [
  {
    label: '首页',
    key: '/',
  },
  {
    label: '路由',
    key: 'route',
    children: [
      {
        label: '路由1',
        key: '/route1',
      },
      {
        label: '路由2',
        key: '/route2',
      },
    ],
  },
  {
    label: '工具',
    key: 'tools',
    children: [
      {
        label: '拖拽排序',
        key: '/tools/dnd-kit',
      },
      {
        label: '待办事项清单',
        key: '/tools/todo-list',
      },
    ],
  },
]

const MenuTabs = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenuClick = (key: string) => {
    navigate(key)
  }

  const isActive = (key: string) => {
    return location.pathname === key
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex justify-center items-center gap-2 px-2 py-2">
          <img src={reactLogo} alt="React Logo" className="h-8 w-8" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarMenu>
              {menuItems.map((item) => {
                // 没有子菜单的项
                if (!item.children) {
                  return (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        onClick={() => handleMenuClick(item.key)}
                        isActive={isActive(item.key)}
                      >
                        {item.key === '/' && <Home />}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                // 有子菜单的项（折叠式）
                return (
                  <Collapsible key={item.key} asChild className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          {item.key === 'route' && <FolderTree />}
                          {item.key === 'tools' && <Wrench />}
                          <span>{item.label}</span>
                          <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.key}>
                              <SidebarMenuSubButton
                                onClick={() => handleMenuClick(child.key)}
                                isActive={isActive(child.key)}
                              >
                                <span>{child.label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

export default MenuTabs
