import React, { useState, useEffect } from 'react';
import { PlusCircle, Calendar, CheckCircle2, Clock, ListTodo, ChevronDown, Trash2 } from 'lucide-react';

function ProductBoard() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('kanbanTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task = {
      id: Date.now().toString(),
      title: newTask,
      status: 'todo',
      dueDate: dueDate || new Date().toISOString().split('T')[0],
    };

    setTasks([...tasks, task]);
    setNewTask('');
    setDueDate('');
    setIsFormOpen(false);
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getColumnTasks = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const stats = {
    total: tasks.length,
    todo: getColumnTasks('todo').length,
    inProgress: getColumnTasks('inProgress').length,
    done: getColumnTasks('done').length,
  };

  const TaskColumn = ({ status, title, icon: Icon }) => (
    <div className="flex-1 min-w-[300px] bg-gray-900 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
        <span className="ml-auto bg-gray-800 text-gray-400 px-2 py-1 rounded-full text-sm">
          {getColumnTasks(status).length}
        </span>
      </div>
      <div className="space-y-3">
        {getColumnTasks(status).map(task => (
          <div key={task.id} className="bg-gray-800 p-3 rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-200 font-medium">{task.title}</h3>
              <button 
                onClick={() => deleteTask(task.id)}
                className="text-gray-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center text-sm text-gray-400 mb-3">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{task.dueDate}</span>
            </div>
            <div className="flex gap-2">
              {status !== 'todo' && (
                <button
                  onClick={() => moveTask(task.id, 'todo')}
                  className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  To Do
                </button>
              )}
              {status !== 'inProgress' && (
                <button
                  onClick={() => moveTask(task.id, 'inProgress')}
                  className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  In Progress
                </button>
              )}
              {status !== 'done' && (
                <button
                  onClick={() => moveTask(task.id, 'done')}
                  className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Project Kanban</h1>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Add Task
          </button>
        </div>

        {isFormOpen && (
          <form onSubmit={addTask} className="mb-8 bg-gray-900 p-4 rounded-lg">
            <div className="flex gap-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task title"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </form>
        )}

        <div className="flex gap-6 mb-8 overflow-x-auto pb-4">
          <TaskColumn status="todo" title="To Do" icon={ListTodo} />
          <TaskColumn status="inProgress" title="In Progress" icon={Clock} />
          <TaskColumn status="done" title="Done" icon={CheckCircle2} />
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Progress Dashboard</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 mb-1">Total Tasks</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 mb-1">To Do</div>
              <div className="text-2xl font-bold">{stats.todo}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 mb-1">In Progress</div>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 mb-1">Completed</div>
              <div className="text-2xl font-bold">{stats.done}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{
                  width: `${stats.total ? (stats.done / stats.total) * 100 : 0}%`
                }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {stats.total ? Math.round((stats.done / stats.total) * 100) : 0}% Complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductBoard;
