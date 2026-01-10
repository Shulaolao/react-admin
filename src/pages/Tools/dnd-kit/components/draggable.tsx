import { useState, useCallback, useEffect } from "react";
import {
  useDraggable,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragMoveEvent,
} from "@dnd-kit/core";

interface Position {
  x: number;
  y: number;
}

const Grid = ({ gridSize = 20 }: { gridSize?: number }) => {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* 水平线 */}
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{
          backgroundImage: `linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)` ,
          backgroundSize: `100% ${gridSize}px`,
        }}
      />
      {/* 垂直线 */}
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px)` ,
          backgroundSize: `${gridSize}px 100%`,
        }}
      />
      {/* 对角线辅助线（可选） */}
      <div 
        className="absolute inset-0 w-full h-full opacity-30" 
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            hsl(var(--muted)) 10px,
            hsl(var(--muted)) 11px
          )` ,
        }}
      />
    </div>
  );
};

const DraggableButton = ({ 
  position, 
  gridSize,
}: { 
  position: Position; 
  gridSize: number;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: 'draggable-button',
    data: {
      type: 'button',
      gridSize,
    },
  });
  
  // 使用 dnd-kit 提供的 transform 进行实时位置更新，并限制边界
  const getTransformStyle = () => {
    if (transform) {
      // 获取容器边界
      const container = document.querySelector('.draggable-container') as HTMLElement;
      const containerRect = container?.getBoundingClientRect();
      const containerWidth = containerRect?.width || window.innerWidth;
      const containerHeight = containerRect?.height || window.innerHeight * 0.5;
      const buttonWidth = 240;
      const buttonHeight = 120;
      
      // 计算拖拽后的实际位置
      const nextX = position.x + transform.x;
      const nextY = position.y + transform.y;
      
      // 边界限制
      const boundedX = Math.max(0, Math.min(nextX, containerWidth - buttonWidth));
      const boundedY = Math.max(0, Math.min(nextY, containerHeight - buttonHeight));
      
      // 计算实际允许的 transform（反推）
      const constrainedTransformX = boundedX - position.x;
      const constrainedTransformY = boundedY - position.y;
      
      // 应用网格对齐
      const gridAlignedTransform = {
        x: Math.round(constrainedTransformX / gridSize) * gridSize,
        y: Math.round(constrainedTransformY / gridSize) * gridSize,
      };
      
      return {
        x: gridAlignedTransform.x,
        y: gridAlignedTransform.y,
      };
    } 
    return { x: 0, y: 0 };
  };
  
  const currentTransform = getTransformStyle();
  
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: `translate3d(${currentTransform.x}px, ${currentTransform.y}px, 0)`,
    backgroundColor: 'hsl(var(--primary))',
    color: 'hsl(var(--primary-foreground))',
    border: 'none',
    width: '240px',
    height: '120px',
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'scale 0.2s ease',
    boxShadow: isDragging 
      ? '0 10px 25px rgba(0, 0, 0, 0.2)' 
      : '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: isDragging ? 1000 : 1,
    touchAction: 'none',
    opacity: isDragging ? 0.5 : 1, // 拖拽时原位置半透明
    outline: 0,
  };

  // 调试日志：监控拖拽状态变化
  useEffect(() => {
    console.log('DraggableButton 状态变化:', { isDragging, transform, position });
  }, [isDragging, transform, position]);
  
  return (
    <button
      ref={setNodeRef}
      className="rounded-lg px-4 py-2 font-medium select-none shadow-md outline-0 hover:shadow-lg active:scale-105"
      style={style}
      {...listeners}
      {...attributes}
    >
      {isDragging ? '拖拽中...' : '拖拽我'}
    </button>
  );
};

const DraggableGrid = () => {
  const [position, setPosition] = useState<Position>({ x: 50, y: 30 });
  const [gridSize, setGridSize] = useState<number>(20);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // 设置传感器
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // 鼠标移动5px后激活拖拽
      },
    }),
    useSensor(TouchSensor, {
    })
  );
  
  const handlePositionChange = useCallback((currentPosition: Position, transform: { x: number; y: number }) => {
    console.log('handlePositionChange 被调用:', { currentPosition, transform });
    
    // 先计算拖拽后的位置（不对齐网格）
    const rawX = currentPosition.x + transform.x;
    const rawY = currentPosition.y + transform.y;
    
    // 获取容器边界
    const container = document.querySelector('.draggable-container') as HTMLElement;
    const containerRect = container?.getBoundingClientRect();
    const containerWidth = containerRect?.width || window.innerWidth;
    const containerHeight = containerRect?.height || window.innerHeight * 0.5;
    const buttonWidth = 100;
    const buttonHeight = 40;
    
    // 先做边界限制
    const boundedX = Math.max(0, Math.min(rawX, containerWidth - buttonWidth));
    const boundedY = Math.max(0, Math.min(rawY, containerHeight - buttonHeight));
    
    // 再对齐到网格（在边界内对齐）
    const gridAlignedX = Math.round(boundedX / gridSize) * gridSize;
    const gridAlignedY = Math.round(boundedY / gridSize) * gridSize;
    
    // 确保对齐后仍在边界内
    const finalX = Math.max(0, Math.min(gridAlignedX, containerWidth - buttonWidth));
    const finalY = Math.max(0, Math.min(gridAlignedY, containerHeight - buttonHeight));
    
    console.log('计算出的最终位置:', { 
      raw: { x: rawX, y: rawY },
      bounded: { x: boundedX, y: boundedY },
      gridAligned: { x: gridAlignedX, y: gridAlignedY },
      final: { x: finalX, y: finalY }
    });
    setPosition({ x: finalX, y: finalY });
  }, [gridSize]);
  
  const handleDragStart = useCallback(() => {
    console.log('DndContext onDragStart 被调用', position);
    setIsDragging(true);
  }, [position]);
  
  
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    console.log('DndContext onDragEnd 被调用:', event);
    setIsDragging(false);
    
    // 从 event 中获取 delta （拖拽的偏移量）
    const { delta } = event;
    console.log('delta:', delta);
    
    if (delta && (delta.x !== 0 || delta.y !== 0)) {
      handlePositionChange(position, delta);
    }
  }, [position, handlePositionChange]);
  
  const handleDragMove = useCallback((event: DragMoveEvent) => {
    // 这里不需要更新 state，只是用于实时边界检查
    // 实际的边界限制在 DraggableButton 的 getTransformStyle 中完成
    console.log('DndContext onDragMove:', event.delta);
  }, []);
  
  const handleGridSizeChange = (size: number) => {
    setGridSize(size);
    // 调整当前位置到新的网格对齐
    const alignedX = Math.round(position.x / size) * size;
    const alignedY = Math.round(position.y / size) * size;
    setPosition({ x: alignedX, y: alignedY });
  };
  
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      autoScroll={false}
    >
      <div className="p-6 mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">可拖拽网格组件 (dnd-kit版)</h2>
          <p className="text-muted-foreground mb-4">基于 dnd-kit useDraggable Hook 实现的拖拽功能</p>
          <div className="flex flex-wrap gap-4 items-center bg-card p-4 rounded-lg shadow-sm border border-border">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground">网格大小:</label>
              <select 
                value={gridSize}
                onChange={(e) => handleGridSizeChange(Number(e.target.value))}
                className="px-3 py-1 border border-border rounded-md text-sm text-foreground focus:outline-0 focus:ring-2 focus:ring-primary"
              >
                <option value={10}>10px</option>
                <option value={20}>20px</option>
                <option value={30}>30px</option>
                <option value={40}>40px</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">当前位置:</span>
              <span className="px-2 py-1 bg-muted rounded text-sm text-foreground">
                X: {position.x}px, Y: {position.y}px
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">状态:</span>
              <span className={`px-2 py-1 rounded text-sm ${isDragging ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-muted text-muted-foreground'}`}>
                {isDragging ? '拖拽中' : '空闲'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="relative bg-card w-full min-h-120 rounded-lg shadow-lg border border-border overflow-hidden draggable-container">
          <Grid gridSize={gridSize} />
          <DraggableButton 
            position={position} 
            gridSize={gridSize}
          />

          <DragOverlay 
            dropAnimation={null}
            modifiers={[
              // 自定义 modifier：固定 DragOverlay 在拖拽开始位置
              (args) => {
                return {
                  ...args.transform,
                  x: 0,
                  y: 0,
                };
              }
            ]}
          >
            {isDragging ? (
              <div 
                className="rounded-lg px-4 py-2 font-medium select-none shadow-2xl"
                style={{
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  minWidth: '240',
                  minHeight: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'grabbing',
                  transform: 'scale(1.05)',
                  outline: 0,
                }}
              >
                拖拽中...
              </div>
            ) : null}
          </DragOverlay>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p><strong>dnd-kit 版本特性:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>使用官方 useDraggable Hook 实现</li>
            <li>支持鼠标和触摸设备</li>
            <li>内置传感器配置和激活约束</li>
            <li>更好的性能和兼容性</li>
            <li>保持原有的网格对齐和边界限制功能</li>
          </ul>
        </div>
      </div>
    </DndContext>
  );
};

export default DraggableGrid;
