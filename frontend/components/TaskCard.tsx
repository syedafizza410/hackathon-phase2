// components/TaskCard.tsx
import React from 'react';
import { Task } from '@/types';
import Card from './Card';
import { CardContent } from './Card';
import Button from './Button';
import { Badge } from './Badge';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Pencil, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onToggleComplete: (taskId: number, completed: boolean) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const handleToggle = () => {
    onToggleComplete(task.id, !task.completed);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        animateOnHover={!task.completed}
        className={`relative overflow-hidden transition-all duration-300 ${
          task.completed 
            ? 'opacity-80 border-l-4 border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10' 
            : 'border-l-4 border-blue-500 hover:shadow-lg'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggle}
              className="mt-1 flex-shrink-0"
            >
              {task.completed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                </motion.div>
              ) : (
                <Circle className="h-6 w-6 text-gray-900" />
              )}
            </motion.button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={`text-lg font-medium truncate ${
                    task.completed 
                      ? 'line-through text-gray-900 dark:text-gray-500' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {task.title}
                </h3>
                {task.completed && (
                  <Badge variant="secondary">Completed</Badge>
                )}
              </div>
              {task.description && (
                <p 
                  className={`mt-2 text-gray-900 dark:text-gray-400 ${
                    task.completed ? 'line-through' : ''
                  } truncate`}
                >
                  {task.description}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-900 dark:text-gray-400">
                <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                {task.updatedAt !== task.createdAt && (
                  <span>
                    Updated: {new Date(task.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(task)}
                  aria-label="Edit task"
                  className="rounded-full"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(task.id)}
                  aria-label="Delete task"
                  className="rounded-full text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
