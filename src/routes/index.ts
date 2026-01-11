import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import Route1 from '../pages/Route/route1'
import Route2 from '../pages/Route/route2'
import Layout from '../layout'
import DndKit from '../pages/Tools/dnd-kit/index'
import TodoList from '@/pages/Tools/todo-list'

const routes = [
  { path: '', Component: Home },
  { path: 'route1', Component: Route1 },
  { path: 'route2', Component: Route2 },
  { path: 'tools/dnd-kit', Component: DndKit },
  { path: 'tools/todo-list', Component: TodoList },
]

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [...routes],
  },
])
