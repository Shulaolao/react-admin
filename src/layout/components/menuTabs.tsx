import { Menu } from "antd"
import { useNavigate, useLocation } from "react-router-dom"

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
      }
    ],
  },
]

const MenuTabs = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Menu
      mode="inline"
      items={menuItems}
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      style={{ borderRight: 0, background: 'transparent' }}
    />
  )
}

export default MenuTabs
