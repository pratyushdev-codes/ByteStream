import React, { useState, useEffect } from 'react';
import { PlusCircle, Calendar, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { TaskChart } from './TaskChart';
import { TaskColumn } from './TaskColumn';

function ProductBoard() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('kanbanTasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [taskHistory, setTaskHistory] = useState(() => {
    const savedHistory = localStorage.getItem('taskHistory');
    return savedHistory ? JSON.parse(savedHistory) : [
      {
        date: new Date().toLocaleDateString(),
        todo: 0,
        inProgress: 0,
        done: 0
      }
    ];
  });

  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));

    const today = new Date().toLocaleDateString();
    const todayStats = {
      date: today,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'inProgress').length,
      done: tasks.filter(t => t.status === 'done').length
    };

    setTaskHistory(prev => {
      const history = [...prev];
      const todayIndex = history.findIndex(h => h.date === today);

      if (todayIndex >= 0) {
        history[todayIndex] = todayStats;
      } else {
        history.push(todayStats);
      }

      const last7Days = history.slice(-7);
      localStorage.setItem('taskHistory', JSON.stringify(last7Days));
      return last7Days;
    });
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

    setTasks(prev => [...prev, task]);
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

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'inProgress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
<div 
      className="min-h-screen bg-cover bg-center bg-no-repeat opacity-95 text-gray-100 p-8 w-full max-w-full overflow-auto rounded-xl bg-[url('./images/header2.jpg')]">

      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-transparent" style={{
    background: 'linear-gradient(154deg, rgb(221, 230, 232), rgb(221, 230, 232), rgb(51, 152, 219))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}>
            Product Board
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="text-base flex flex-row text-ascent-1 px-4 md:px-4 py-1 md:py-2 border border-[#666] rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9">
                <path d="M680-80v-120H560v-80h120v-120h80v120h120v80H760v120h-80Zm-480-80q-33 0-56.5-23.5T120-240v-480q0-33 23.5-56.5T200-800h40v-80h80v80h240v-80h80v80h40q33 0 56.5 23.5T760-720v244q-20-3-40-3t-40 3v-84H200v320h280q0 20 3 40t11 40H200Zm0-480h480v-80H200v80Zm0 0v-80 80Z" />
              </svg>&nbsp;
              Add Task
            </button>
          </div>
        </div>
        <p className="text-gray-400 mt-2">
        Organize tasks • Analyze work • Track Progress
      </p>
      </div>

      {isFormOpen && (
        <form onSubmit={addTask} className="mb-8 backdrop-blur-lg bg-white/5 p-4 rounded-lg border ">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task title"
              className="flex-1 bg-[#00000019] border border-[#00000019] rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-indigo-400"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-[#00000019] border border-[#00000019]rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-indigo-500"
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

      <div className="flex gap-4 overflow-x-auto pb-4 ">
        <TaskColumn
          status="todo"
          title="To Do"
          icon={ListTodo}
          tasks={tasks}
          onMoveTask={moveTask}
          onDeleteTask={deleteTask}
        />
        <TaskColumn
          status="inProgress"
          title="In Progress"
          icon={Clock}
          tasks={tasks}
          onMoveTask={moveTask}
          onDeleteTask={deleteTask}
        />
        <TaskColumn
          status="done"
          title="Done"
          icon={CheckCircle2}
          tasks={tasks}
          onMoveTask={moveTask}
          onDeleteTask={deleteTask}
        />
      </div>

      <div className="grid gap-4">
        <div className="backdrop-blur-lg bg-white/5 rounded-xl p-6 border border-[#00000019]">
          <h2 className="text-xl font-semibold mb-4 text-white">Progress Dashboard</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="backdrop-blur-lg bg-white/5 p-4 rounded-xl border border-[#00000019]">
              <div className="text-gray-400 mb-1">Total Tasks</div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="backdrop-blur-lg bg-white/5 p-4 rounded-xl  border border-[#00000019]">
              <div className="text-gray-400 mb-1">To Do</div>
              <div className="text-2xl font-bold text-yellow-500">{stats.todo}</div>
            </div>
            <div className="backdrop-blur-lg bg-white/5 p-4 rounded-xl  border border-[#00000019]">
              <div className="text-gray-400 mb-1">In Progress</div>
              <div className="text-2xl font-bold text-blue-500 ">{stats.inProgress}</div>
            </div>
            <div className="backdrop-blur-lg bg-white/5 p-4 rounded-xl  border border-[#00000019]">
              <div className="text-gray-400 mb-1">Completed</div>
              <div className="text-2xl font-bold text-green-500">{stats.done}</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2 bg-[#00000019] rounded-full overflow-hidden">
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
        <div className='w-full h-auto max-w-full overflow-auto'>
          <TaskChart taskHistory={taskHistory} />
        </div>
      </div>
    </div>
  );
}

export default ProductBoard;
