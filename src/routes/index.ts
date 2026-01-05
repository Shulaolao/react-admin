import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Route1 from '../pages/Route1';
import Route2 from '../pages/Route2';
import Layout from '../layout';
import Kanban from '../pages/Tools/dnd-kit-dragable';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { path: '', Component: Home },
      { path: 'route1', Component: Route1 },
      { path: 'route2', Component: Route2 },
      { path: 'tools/dnd-kit-dragable', Component: Kanban },
    ]
  },
])
