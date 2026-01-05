import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  DragOverlay,
  TouchSensor,
  closestCorners,
} from '@dnd-kit/core'
import type { CollisionDetection } from '@dnd-kit/core'
import type { DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'

const SortableItem = ({ children, id, className, customStyle }: { children?: React.ReactNode, id: string | number, className?: string, customStyle?: React.CSSProperties }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: id.toString() })
  
  const style = {
    ...customStyle,
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
    scale: isDragging ? '1.05' : '1',
    ...(
      isDragging 
        ? { 
            opacity: 0.85, 
            zIndex: 1000, 
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          } 
        : { opacity: 1, zIndex: 1, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }
    ),
  }
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      data-id={id}
      {...attributes}
      {...listeners}
      className={twMerge(
        `sortable-item p-4 mb-2 bg-white rounded-lg cursor-grab active:cursor-grabbing flex items-center text-black ${isDragging ? 'dragging border-2 border-blue-500' : 'border border-gray-200'} ${isOver ? 'ring-2 ring-blue-300' : ''}`,
        className
      )}
    >
      <span className="mr-2 cursor-grab" {...listeners}>⋮⋮</span>
      <span>{children}</span>
    </div>
  )
}



const MultipleContainers = () => {
  const [items, setItems] = useState([
    { id: '1', content: '可拖拽项目 1' },
    { id: '2', content: '可拖拽项目 2' },
    { id: '3', content: '可拖拽项目 3' },
    { id: '4', content: '可拖拽项目 4' },
    { id: '5', content: '可拖拽项目 5' },
  ])

  const [activeId, setActiveId] = useState('')

  // 改进的碰撞检测算法，支持更精确的位置交换
  const improvedCollisionDetection: CollisionDetection = (args) => {
    const { collisionRect, droppableRects } = args;
      
    // 使用closestCorners算法，提供更精确的碰撞检测
    const collisions = closestCorners(args);
      
    if (collisions.length <= 1) {
      return collisions;
    }
      
    // 计算拖拽元素的垂直中心
    const activeCenterY = collisionRect.top + collisionRect.height / 2;
    
    // 按垂直位置排序碰撞结果
    const sortedCollisions = collisions.sort((a, b) => {
      const rectA = droppableRects.get(a.id);
      const rectB = droppableRects.get(b.id);
        
      if (!rectA || !rectB) return 0;
        
      // 根据拖拽元素中心与目标元素位置的关系排序
      const distanceA = Math.abs(activeCenterY - (rectA.top + rectA.height / 2));
      const distanceB = Math.abs(activeCenterY - (rectB.top + rectB.height / 2));
        
      return distanceA - distanceB;
    });
      
    return [sortedCollisions[0]];
  };

  // 用于拖拽过程中的实时位置交换
  const handleDragOver = (event: DragMoveEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        if (oldIndex === -1 || newIndex === -1) return items;
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };



  const resetItems = () => {
    setItems([
      { id: '1', content: '可拖拽项目 1' },
      { id: '2', content: '可拖拽项目 2' },
      { id: '3', content: '可拖拽项目 3' },
      { id: '4', content: '可拖拽项目 4' },
      { id: '5', content: '可拖拽项目 5' },
    ])
  }
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MouseSensor),
    useSensor(TouchSensor),
  )
  
  const handleDragStart = (event: DragStartEvent) => {
    const {active} = event
    setActiveId(active.id.toString())
  }
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        if (oldIndex === -1 || newIndex === -1) return items;
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    setActiveId('');
  }
  

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">拖拽排序列表</h3>
        <button 
          onClick={resetItems}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          重置排序
        </button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={improvedCollisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="multiple-containers bg-gray-50 p-4 rounded-lg border border-gray-200">
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {item.content}
            </SortableItem>
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <SortableItem 
              id={activeId} 
              className="!opacity-100 !z-[9999] !shadow-xl !transform !scale-105" 
              customStyle={{ pointerEvents: 'none' }}
            >
              {items.find(item => item.id === activeId)?.content}
            </SortableItem>
          ) : null}
        </DragOverlay>
      </DndContext>
      <div className="mt-4 text-sm text-gray-600">
        <p>• 点击并拖拽 ⋮⋮ 图标来移动项目</p>
        <p>• 释放鼠标完成排序</p>
      </div>
    </div>
  )
}

const Kanban =  () => {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">可拖拽排序组件</h2>
      <MultipleContainers />
    </>
  )
}

export default Kanban
