import { DndContext, type DragEndEvent, type DragOverEvent, DragOverlay, MouseSensor, PointerSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

const Droppable = ({ id, children, isOver }: { id: string; children?: React.ReactNode; isOver?: boolean }) => {
  const {
    setNodeRef,
  } = useDroppable({
    id,
  });

  return <div ref={setNodeRef} className={`${id} relative flex justify-center items-center w-50 h-50 rounded-lg transition-all duration-200 ${
    isOver 
      ? 'bg-blue-100 ring-2 ring-blue-500 shadow-lg scale-105' 
      : 'bg-blue-50 border-2 border-dashed border-blue-300'
  }`}>
    {children}
  </div>
};

const Draggable = ({ id }: { id: string }) => {
  const {
    isDragging,
    setNodeRef,
    transform,
    attributes,
    listeners,
  } = useDraggable({
    id,
  });

  const style: React.CSSProperties = {
    backgroundColor: '#60a5fa',
    color: 'white',
    transform: CSS.Translate.toString(transform),
    outline: 'none',
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <button
      ref={setNodeRef}
      id={id}
      style={style}
      className="rounded-lg px-4 py-2 font-medium select-none shadow-md hover:shadow-lg active:scale-105"
      {...attributes}
      {...listeners}
    >{isDragging ? '拖拽中' : '拖拽我'}</button>
  )
}

const MultipleDroppable = () => {
  const [parent, setParent] = useState<string | null>(null);
  const [overParent, setOverParent] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartParent, setDragStartParent] = useState<string | null>(null)
  
  // 配置多种传感器以支持鼠标、触摸和指针设备
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // 移动10px后激活拖拽
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  
  const sensors = useSensors(mouseSensor, touchSensor, pointerSensor);

  const handleDragStart = () => {
    setIsDragging(true)
    setDragStartParent(parent)
  }

  const handleDragMove = (event: DragOverEvent) => {
    const { over } = event
    if (over?.id) {
      setOverParent(over.id as string)
    } else {
      setOverParent(null)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    setOverParent(null)
    setIsDragging(false)
    setDragStartParent(null)

    if (over) {
      setParent(over.id as string);
    }
  }

  const draggableMarkup = <Draggable id='draggable-button' />;

  return (
    <div className="h-[70vh] p-4 bg-gray-100">
      <h1 className="text-black mb-4 text-2xl font-bold">Droppable 拖拽放置示例</h1>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        autoScroll={false}
      >
        <div className="grid grid-cols-2 gap-4 h-full">
          <Droppable id='originBox' isOver={overParent === 'originBox'}>
            {isDragging && (dragStartParent === null || dragStartParent === 'originBox') ? (
              <button
                style={{
                  backgroundColor: '#60a5fa',
                  color: 'white',
                  cursor: 'grabbing',
                }}
                className="rounded-lg px-4 py-2 font-medium select-none shadow-2xl opacity-50"
              >
                拖拽中
              </button>
            ) : (parent === null || parent === 'originBox') ? draggableMarkup : <p className="text-gray-400">按钮已被拖走</p>}
          </Droppable>
          <div className="flex gap-4 h-full">
            <Droppable id='droppable-box1' isOver={overParent === 'droppable-box1'}>
              {
                isDragging && dragStartParent === 'droppable-box1' ? (
                  <button
                    style={{
                      backgroundColor: '#60a5fa',
                      color: 'white',
                      cursor: 'grabbing',
                    }}
                    className="rounded-lg px-4 py-2 font-medium select-none shadow-2xl opacity-50"
                  >
                    拖拽中
                  </button>
                ) : parent === 'droppable-box1' ? draggableMarkup
                  : overParent === 'droppable-box1' ? <p className="text-gray-400">释放以放置</p> : null
              }
            </Droppable>
            <Droppable id='droppable-box2' isOver={overParent === 'droppable-box2'}>
              {
                isDragging && dragStartParent === 'droppable-box2' ? (
                  <button
                    style={{
                      backgroundColor: '#60a5fa',
                      color: 'white',
                      cursor: 'grabbing',
                    }}
                    className="rounded-lg px-4 py-2 font-medium select-none shadow-2xl opacity-50"
                  >
                    拖拽中
                  </button>
                ) : parent === 'droppable-box2' ? draggableMarkup
                  : overParent === 'droppable-box2' ? <p className="text-gray-400">释放以放置</p> : null
              }
            </Droppable>
          </div>
        </div>
        <DragOverlay>
          <button
            style={{
              backgroundColor: '#60a5fa',
              color: 'white',
              cursor: 'grabbing',
            }}
            className="rounded-lg px-4 py-2 font-medium select-none shadow-2xl"
          >
            拖拽中
          </button>
        </DragOverlay>
      </DndContext>
    </div>
  )
};

export default MultipleDroppable
