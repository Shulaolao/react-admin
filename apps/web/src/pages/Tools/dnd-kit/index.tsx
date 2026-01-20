import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
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
      <Tabs defaultValue="droppable">
        <TabsList>
          {tabItems.map((item) => (
            <TabsTrigger key={item.key} value={item.key}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabItems.map((item) => (
          <TabsContent key={item.key} value={item.key}>
            {item.children}
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}

export default DndKit
