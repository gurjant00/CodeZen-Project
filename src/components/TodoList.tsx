import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Task } from '../App';

interface TodoListProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const TodoList: React.FC<TodoListProps> = ({ tasks, setTasks }) => {
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gold mb-6 flex items-center">
          <span className="mr-3">📝</span>
          To-Do List
        </h2>

        {/* Add Task Form */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task..."
            className="input-field flex-1"
          />
          <button
            onClick={addTask}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  task.completed 
                    ? 'bg-dark-card border-green-500/30 light-mode:bg-green-50 light-mode:border-green-400/30' 
                    : 'bg-dark-card border-dark-border light-mode:bg-gray-50 light-mode:border-gold/20'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-gold hover:text-gold-dark transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <span
                    className={`flex-1 ${
                      task.completed 
                        ? 'line-through text-gray-500 light-mode:text-gray-400' 
                        : 'text-white light-mode:text-gray-800'
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-400 hover:text-red-300 transition-colors ml-3 light-mode:text-red-600 light-mode:hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <motion.div
              className="text-center py-8 text-gray-500 light-mode:text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>No tasks yet. Add your first task above!</p>
            </motion.div>
          )}
        </div>

        {/* Stats */}
        {tasks.length > 0 && (
          <div className="mt-6 pt-6 border-t border-dark-border light-mode:border-gold/20">
            <div className="flex justify-between text-sm text-gray-400 light-mode:text-gray-600">
              <span>Total: {tasks.length}</span>
              <span>Completed: {tasks.filter(t => t.completed).length}</span>
              <span>Pending: {tasks.filter(t => !t.completed).length}</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TodoList;
