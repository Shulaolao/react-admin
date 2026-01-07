import { Tabs } from "antd"
import Kanban from "./components/sortable"
import DraggableGrid from "./components/draggable"
import Droppable from "./components/droppable"

const tabItems = [
  {
    key: 'droppable',
    label: 'Droppable',
    children: <Droppable />
  },
  {
    key: 'draggable',
    label: 'Draggable',
    children: <DraggableGrid />,
  },
  {
    key: 'sortable',
    label: 'Sortable',
    children: <Kanban />,
  },
]

const DndKit = () => {
  return (
    <>
      <Tabs items={tabItems} />
    </>
  )
}

export default DndKit
