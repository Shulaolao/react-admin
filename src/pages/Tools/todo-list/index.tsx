import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { Task } from '@/stores/task'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'
import dayjs from 'dayjs'
import useTaskStore from '@/stores/task'
import { useForm, Controller, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from '@/components/ui/card'

const AddTask = ({ onSubmit }: { onSubmit: (task: string) => void }) => {
  const [task, setTask] = useState('')
  const handleAddTask = () => {
    if (!task.trim()) return
    onSubmit(task)
    setTask('')
  }

  return (
    <div className="relative max-w-80">
      <Input
        type="text"
        placeholder="Add a new task..."
        className="pr-10"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyUpCapture={(e) => e.key === 'Enter' && handleAddTask()}
      />
      <Plus
        className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
        onClick={handleAddTask}
      />
    </div>
  )
}

const formSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be 100 characters or less' }),
  description: z.string(),
  done: z.boolean(),
  ddl: z.string(),
  docs: z.array(z.instanceof(File)).optional(),
})

type TaskFormValues = z.infer<typeof formSchema>

const TaskFormEdit = ({
  control,
  onSubmit,
}: {
  control: Control<TaskFormValues>
  onSubmit: () => void
}) => {
  return (
    <form onSubmit={onSubmit}>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input type="text" {...field} />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input {...field} />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>
          <Field>
            <FieldLabel>DDL</FieldLabel>
            <Controller
              name="ddl"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Popover>
                    <PopoverTrigger>
                      <Input type="date" value={field.value} readOnly />
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        defaultMonth={new Date(field.value)}
                        onSelect={(date) => {
                          field.onChange(dayjs(date!).format('YYYY-MM-DD'))
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>
          <Field>
            <FieldLabel>Docs</FieldLabel>
            <Controller
              name="docs"
              control={control}
              render={({ field: { onChange }, fieldState }) => (
                <>
                  <Input
                    type="file"
                    id="task-docs"
                    name="task-docs"
                    multiple
                    accept=".doc,.docx,.pdf,.wps,.xlsx,.xls,.ppt,.pptx"
                    onChange={(e) =>
                      e.target.files?.length &&
                      onChange(Array.from(e.target.files))
                    }
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </>
              )}
            />
          </Field>
          <Field>
            <div className="flex items-center gap-2">
              <Controller
                name="done"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="task-done"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label
                htmlFor="task-done"
                className="text-sm cursor-pointer select-none"
              >
                Done
              </Label>
            </div>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}

const TaskEditDrawer = ({
  open,
  onClose,
  taskName,
  editingTask,
}: {
  open: boolean
  onClose: () => void
  taskName?: string
  editingTask?: Task | null
}) => {
  const isEditMode = !!editingTask

  const { control, handleSubmit } = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode
      ? {
          id: editingTask.id,
          name: editingTask.name,
          description: editingTask.description,
          done: editingTask.done,
          ddl: editingTask.ddl,
          docs: [],
        }
      : {
          id: crypto.randomUUID(),
          name: taskName || '',
          description: '',
          done: false,
          ddl: dayjs(new Date()).format('YYYY-MM-DD'),
          docs: [],
        },
  })

  const { tasks, setTasks } = useTaskStore()

  const onSubmit = handleSubmit((data) => {
    if (isEditMode) {
      setTasks(tasks.map((t) => (t.id === data.id ? (data as Task) : t)))
    } else {
      setTasks([...tasks, data as Task])
    }
    onClose()
  })

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        dismissible={false}
        direction="right"
      >
        <DrawerContent className="p-4">
          <DrawerHeader>
            <DrawerTitle>{isEditMode ? 'Edit Task' : 'New Task'}</DrawerTitle>
            <DrawerDescription>
              {isEditMode ? 'Edit your task details' : 'Create a new task'}
            </DrawerDescription>
          </DrawerHeader>
          <TaskFormEdit control={control} onSubmit={onSubmit} />
          <DrawerFooter>
            <Field orientation="horizontal">
              <Button
                type="submit"
                className="cursor-pointer"
                onClick={onSubmit}
              >
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={onClose}
              >
                Cancel
              </Button>
            </Field>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

const TodoItem = ({
  task,
  onToggle,
  onClick,
}: {
  task: Task
  onToggle: (id: string, done: boolean) => void
  onClick?: () => void
}) => {
  return (
    <div
      className="group relative p-3 flex items-center gap-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={onClick}
    >
      <Checkbox
        checked={task.done}
        onCheckedChange={(checked) => onToggle(task.id, !!checked)}
        className="shrink-0"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="flex-1 flex items-center justify-start gap-4 min-w-0 space-y-1">
        <h2
          className={`font-medium truncate relative transition-colors duration-300 ${
            task.done ? 'text-muted-foreground' : 'text-foreground'
          }`}
        >
          <span className="relative">
            {task.name}
            <span
              className={`absolute left-0 top-1/2 h-[1.5px] bg-muted-foreground transition-all duration-300 ease-out ${
                task.done ? 'w-full' : 'w-0'
              }`}
            />
          </span>
        </h2>
        {task.description && (
          <p
            className={`text-sm truncate transition-colors duration-300 ${
              task.done ? 'text-muted-foreground/60' : 'text-muted-foreground'
            }`}
          >
            <span className="relative">
              {task.description}
              <span
                className={`absolute left-0 top-1/2 h-[1px] bg-muted-foreground/60 transition-all duration-300 ease-out delay-75 ${
                  task.done ? 'w-full' : 'w-0'
                }`}
              />
            </span>
          </p>
        )}
      </div>
      <div
        className={`shrink-0 text-xs px-2 py-1 rounded-md transition-colors duration-300 ${
          task.done
            ? 'bg-muted text-muted-foreground'
            : dayjs(task.ddl).isBefore(dayjs(), 'day')
            ? 'bg-destructive/10 text-destructive'
            : dayjs(task.ddl).isSame(dayjs(), 'day')
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            : 'bg-primary/10 text-primary'
        }`}
      >
        {dayjs(task.ddl).format('MM/DD')}
      </div>
    </div>
  )
}

const TodoList = ({
  tasks,
  setTasks,
  onClickTask,
}: {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  onClickTask?: (task: Task) => void
}) => {
  const handleToggle = (id: string, done: boolean) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done } : t)))
  }

  return (
    <Card className="mt-4 max-w-lg w-full divide-y p-4">
      {tasks.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground text-sm">
          No tasks yet. Add one above!
        </div>
      ) : (
        tasks.map((item) => (
          <TodoItem
            key={item.id}
            task={item}
            onToggle={handleToggle}
            onClick={() => onClickTask?.(item)}
          />
        ))
      )}
    </Card>
  )
}

const TodoListPage = () => {
  const [taskName, setTaskName] = useState('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [open, setOpen] = useState(false)
  const { tasks, setTasks } = useTaskStore()

  const onAddTask = (taskName: string) => {
    setTaskName(taskName)
    setEditingTask(null)
    setOpen(true)
  }

  const onEditTask = (task: Task) => {
    setEditingTask(task)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingTask(null)
    setTaskName('')
  }

  return (
    <div>
      <AddTask onSubmit={onAddTask} />
      <TodoList tasks={tasks} setTasks={setTasks} onClickTask={onEditTask} />
      <TaskEditDrawer
        key={editingTask?.id || taskName}
        open={open}
        onClose={handleClose}
        taskName={taskName}
        editingTask={editingTask}
      />
    </div>
  )
}

export default TodoListPage
