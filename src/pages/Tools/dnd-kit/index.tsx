import { Tabs } from "antd"
import Kanban from "./components/sortable"
import DraggableGrid from "./components/draggable"

const tabItems = [
  {
    key: 'sortable',
    label: 'Sortable',
    children: <Kanban />,
  },
  {
    key: 'draggable',
    label: 'Draggable',
    children: <DraggableGrid />,
  },
  {
    key: 'droppable',
    label: 'Droppable',
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
