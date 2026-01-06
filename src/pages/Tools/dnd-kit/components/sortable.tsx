import { SortableContext, useSortable } from '@dnd-kit/sortable'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  DragOverlay,
  TouchSensor,
  closestCenter,
  pointerWithin,
  type CollisionDetection,
} from '@dnd-kit/core'
import type { DragStartEvent, DragOverEvent } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { CSS } from '@dnd-kit/utilities'

const SortableItem = ({ children, id, className, customStyle, tagColor, isDragOver }: { children?: React.ReactNode, id: string | number, className?: string, customStyle?: React.CSSProperties, tagColor?: string, isDragOver?: boolean }) => {
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
    transition: transition || 'transform 250ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 250ms ease',
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
        `sortable-item p-4 mb-2 bg-white rounded-lg cursor-grab active:cursor-grabbing flex items-center text-black ${isDragging ? 'dragging border-2 border-blue-500' : 'border border-gray-200'} ${isOver || isDragOver ? 'ring-2 ring-blue-300 drag-over' : ''}`,
        className
      )}
    >
      {tagColor && (
        <div 
          className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
          style={{ backgroundColor: tagColor }}
        />
      )}
      <span>{children}</span>
    </div>
  )
}

interface Item {
  id: string;
  content: string;
  tagColor: string;
}

interface Container {
  id: string;
  title: string;
  tagColor: string;
  items: Item[];
}

const SortableContainer = ({ 
  title, 
  items, 
  containerId,
  dragOverId,
  isDragOver
}: { 
  title?: string, 
  items: Item[],
  containerId: string,
  dragOverId?: string | null,
  isDragOver?: boolean
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: containerId });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: transition || 'transform 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
    boxShadow: isDragging ? '0 10px 25px rgba(0, 0, 0, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
  };
  
  return (
    <div
      ref={setNodeRef} 
      style={style}
      className={`w-full max-w-md max-h-[80vh] mx-auto overflow-y-auto bg-gray-50 p-2 shadow-md rounded-lg select-none ${isDragging ? 'dragging-container border-2 border-blue-500' : 'border border-gray-200'} ${isDragOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
    >
      <div className="flex justify-between items-center p-2 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <div className="text-lg font-semibold text-black">{title}</div>
      </div>
      <div className="multiple-containers p-4 rounded-lg border border-gray-200" data-container-id={containerId}>
        <SortableContext items={items}>
          {items.map((item) => (
            <SortableItem 
              key={item.id} 
              id={item.id} 
              tagColor={item.tagColor}
              isDragOver={dragOverId === item.id}
            >
              {item.content}
            </SortableItem>
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

const customCollisionDetection: CollisionDetection = (args) => {
  // 首先使用默认的closestCenter检测
  const collisions = closestCenter(args);
  
  // 如果拖拽的是容器，使用更精确的检测方法
  const { active } = args;
  
  // 检查是否是容器拖拽 - 检查ID是否以'container-'开头
  const isContainerDrag = typeof active.id === 'string' && active.id.startsWith('container-');
  
  if (isContainerDrag) {
    // 对于容器拖拽，使用pointerWithin检测以获得更精确的中心位置检测
    const pointerCollisions = pointerWithin(args);
    return pointerCollisions && pointerCollisions.length > 0 ? pointerCollisions : collisions;
  }
  
  return collisions;
};

const MultipleContainers = ({ containers }: { containers?: { label: string, tagColor: string }[] }) => {
  // 初始化容器数据
  const initialContainers: Container[] = containers?.map((container, index) => ({
    id: `container-${index}`,
    title: container.label,
    tagColor: container.tagColor,
    items: [
      { id: `${index}-1`, content: `可拖拽项目 ${index + 1}-1`, tagColor: container.tagColor },
      { id: `${index}-2`, content: `可拖拽项目 ${index + 1}-2`, tagColor: container.tagColor },
      { id: `${index}-3`, content: `可拖拽项目 ${index + 1}-3`, tagColor: container.tagColor },
      { id: `${index}-4`, content: `可拖拽项目 ${index + 1}-4`, tagColor: container.tagColor },
      { id: `${index}-5`, content: `可拖拽项目 ${index + 1}-5`, tagColor: container.tagColor },
    ]
  })) || [];

  const [containerData, setContainerData] = useState<Container[]>(initialContainers);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null); // 新增状态追踪拖拽经过的项目
  const [dragOverContainerId, setDragOverContainerId] = useState<string | null>(null); // 新增状态追踪拖拽经过的容器

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      activationConstraint: {
        autoScrollEnabled: false,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;

    // 检查是否是容器拖拽
    const isContainerDrag = containerData.some(container => container.id === activeIdStr);
    
    if (isContainerDrag) {
      // 更新拖拽经过的容器ID
      setDragOverContainerId(overIdStr);
      
      // 容器之间的拖拽
      setContainerData(prev => {
        const newContainers = [...prev];
        const activeIndex = newContainers.findIndex(c => c.id === activeIdStr);
        const overIndex = newContainers.findIndex(c => c.id === overIdStr);
        
        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
          return arrayMove(newContainers, activeIndex, overIndex);
        }
        return newContainers;
      });
      return;
    } else {
      // 更新拖拽经过的项目ID
      setDragOverId(overIdStr);
    }
    
    // 项目拖拽逻辑
    // 找到活动项目的源容器
    const sourceContainer = containerData.find(container => 
      container.items.some(item => item.id === activeIdStr)
    );
    
    if (!sourceContainer) return;
    
    const activeItem = sourceContainer.items.find(item => item.id === activeIdStr);
    if (!activeItem) return;
    
    // 检查是否拖拽到容器内（即拖拽到容器中的某个项目上）
    let targetContainer = null;
    let targetItem = null;
    
    // 检查是否拖拽到项目上
    for (const container of containerData) {
      const item = container.items.find(item => item.id === overIdStr);
      if (item) {
        targetContainer = container;
        targetItem = item;
        break;
      }
    }
    
    // 如果没有拖拽到项目上，但overId是容器id，则是拖拽到容器上
    if (!targetContainer && containerData.some(c => c.id === overIdStr)) {
      targetContainer = containerData.find(c => c.id === overIdStr) || sourceContainer;
    }
    
    // 如果没有找到目标容器，使用源容器
    if (!targetContainer) {
      targetContainer = sourceContainer;
    }
    
    setContainerData(prev => {
      const newContainers = [...prev];
      
      // 如果拖拽到同一个容器内
      if (sourceContainer.id === targetContainer.id) {
        const containerIndex = newContainers.findIndex(c => c.id === sourceContainer.id);
        if (containerIndex !== -1) {
          const itemIndex = newContainers[containerIndex].items.findIndex(item => item.id === activeIdStr);
          const overIndex = newContainers[containerIndex].items.findIndex(item => item.id === overIdStr);
          
          // 确保overIndex不是-1且与itemIndex不同
          if (itemIndex !== -1 && overIndex !== -1 && itemIndex !== overIndex) {
            const newItems = arrayMove(newContainers[containerIndex].items, itemIndex, overIndex);
            newContainers[containerIndex] = {
              ...newContainers[containerIndex],
              items: newItems
            };
          }
        }
      } else {
        // 如果拖拽到不同容器
        const sourceContainerIndex = newContainers.findIndex(c => c.id === sourceContainer.id);
        const destContainerIndex = newContainers.findIndex(c => c.id === targetContainer.id);
        
        if (sourceContainerIndex !== -1 && destContainerIndex !== -1) {
          // 从源容器移除项目
          const sourceItems = newContainers[sourceContainerIndex].items.filter(item => item.id !== activeIdStr);
          
          // 找到目标容器中的目标位置
          let targetIndex = newContainers[destContainerIndex].items.length; // 默认添加到末尾
          if (targetItem) { // 如果是拖拽到某个项目上
            const overIndex = newContainers[destContainerIndex].items.findIndex(item => item.id === overIdStr);
            if (overIndex !== -1) {
              targetIndex = overIndex;
            }
          }
          
          // 创建新目标容器的项目列表
          const destItems = [...newContainers[destContainerIndex].items];
          // 确保项目保留其原始颜色
          destItems.splice(targetIndex, 0, activeItem);
          
          // 更新容器数据
          newContainers[sourceContainerIndex] = {
            ...newContainers[sourceContainerIndex],
            items: sourceItems
          };
          
          newContainers[destContainerIndex] = {
            ...newContainers[destContainerIndex],
            items: destItems
          };
        }
      }
      
      return newContainers;
    });
  };

  const handleDragEnd = () => {
    setActiveId(null);
    setDragOverId(null);
    setDragOverContainerId(null);
  };

  const activeItemContent = activeId 
    ? containerData.flatMap(container => container.items).find(item => item.id === activeId)?.content 
    : null;

  const activeDragItem = activeId
    ? containerData.flatMap(container => container.items).find(item => item.id === activeId)
    : null;

  return (
    <div className='grid grid-cols-4 gap-4 p-4'>
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={containerData}>
          {containerData.map((container) => (
            <SortableContainer 
              key={container.id} 
              title={container.title} 
              items={container.items}
              containerId={container.id}
              dragOverId={dragOverId}
              isDragOver={dragOverContainerId === container.id}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <div className={`max-h-[80vh] p-4 mb-2 bg-white rounded-lg cursor-grab active:cursor-grabbing flex items-center text-black border-2 border-blue-500 opacity-100 z-[9999] shadow-xl transform scale-105 ${containerData.some(c => c.id === activeId) ? 'w-full max-w-md min-h-[50vh]' : ''}`}>
              {(activeDragItem as Item)?.tagColor && (
                <div 
                  className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                  style={{ backgroundColor: (activeDragItem as Item)?.tagColor }}
                />
              )}
              <span>{activeItemContent}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
};

const Kanban =  () => {
  return (
    <div className='p-2'>
      <h2 className="text-xl font-bold">可拖拽排序组件</h2>
      <MultipleContainers containers={[
        {
          label: '可拖拽排序组件1',
          tagColor: '#3b82f6',
        },
        {
          label: '可拖拽排序组件2',
          tagColor: '#ef4444',
        },
        {
          label: '可拖拽排序组件3',
          tagColor: '#10b981',
        },
      ]}>
      </MultipleContainers>
    </div>
  )
}

export default Kanban