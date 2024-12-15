import React from 'react';
import { Trash2 } from 'lucide-react';


export function TaskColumn({ status, title, icon: Icon, tasks, onMoveTask, onDeleteTask }) {
  const columnTasks = tasks.filter(task => task.status === status);

  return (
    <div className="flex-1 min-w-[300px] backdrop-blur-lg bg-white/5 rounded-lg p-4 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
        <span className="ml-auto bg-gray-800/50 text-gray-400 px-2 py-1 rounded-full text-sm">
          {columnTasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {columnTasks.map(task => (
          <div key={task.id} className="backdrop-blur-lg bg-white/5 p-3 rounded-lg shadow-lg border border-white/10">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-200 font-medium">{task.title}</h3>
              <button 
                onClick={() => onDeleteTask(task.id)}
                className="text-gray-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center text-sm text-gray-400 mb-3">
              <span>{task.dueDate}</span>
            </div>
            <div className="flex gap-2">
              {status !== 'todo' && (
                <button
                  onClick={() => onMoveTask(task.id, 'todo')}
                  className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300 hover:bg-white/20"
                >
                  To Do
                </button>
              )}
              {status !== 'inProgress' && (
                <button
                  onClick={() => onMoveTask(task.id, 'inProgress')}
                  className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300 hover:bg-white/20"
                >
                  In Progress
                </button>
              )}
              {status !== 'done' && (
                <button
                  onClick={() => onMoveTask(task.id, 'done')}
                  className="text-xs px-2 py-1 rounded-full  bg-white/10 text-gray-300 hover:bg-white/20"
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
}
