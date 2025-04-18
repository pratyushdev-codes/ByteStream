import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const tagColors = [
  'bg-[#045AD8]',
  'bg-[#A855F7]',
  'bg-[#EC4899]',
  'bg-[#EAB308]',
  'bg-[#EF4444]',
  'bg-[#6366F1]',
  'bg-[#F97316]',
];

const ProjectTags = () => {
  const [projects, setProjects] = useState(() => {
    // Initialize state with localStorage data
    try {
      const savedProjects = localStorage.getItem('userProjects');
      return savedProjects ? JSON.parse(savedProjects) : [];
    } catch (error) {
      console.error('Error loading initial projects:', error);
      return [];
    }
  });
  const [newProject, setNewProject] = useState('');
  const [selectedColor, setSelectedColor] = useState(tagColors[0]);
  const [isAdding, setIsAdding] = useState(false);

  // Save to localStorage whenever projects change
  useEffect(() => {
    try {
      localStorage.setItem('userProjects', JSON.stringify(projects));
      console.log('Projects saved:', projects);
    } catch (error) {
      console.error('Error saving projects:', error);
      toast.error('Failed to save projects');
    }
  }, [projects]);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (newProject.trim()) {
      const newProjectItem = {
        id: Date.now().toString(),
        name: newProject.trim(),
        color: selectedColor,
      };
      setProjects(prevProjects => [...prevProjects, newProjectItem]);
      setNewProject('');
      setIsAdding(false);
      toast.success("New Project Tag Added");
    }
  };

  const handleDeleteProject = (id) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
    toast.success("Project Tag Deleted");
  };

  return (
    <div className='w-full flex flex-col gap-3'>
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className='flex items-center gap-2 text-blue hover:text-opacity-80 transition-colors text-sm'
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
          </svg>
          Add Project
        </button>
      ) : (
        <form onSubmit={handleAddProject} className='flex flex-col gap-2'>
          <input
            type='text'
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            placeholder='Enter project name'
            className='w-full px-2 py-1.5 bg-[#333333] text-ascent-1 rounded-2xl outline-none text-sm'
          />
          <div className='flex items-center gap-2'>
            <div className='flex gap-1'>
              {tagColors.map((color) => (
                <button
                  key={color}
                  type='button'
                  onClick={() => setSelectedColor(color)}
                  className={`w-5 h-5 rounded-full ${color} ${
                    selectedColor === color ? 'ring-2 ring-ascent-1 ring-offset-1 ring-offset-[#222222]' : ''
                  }`}
                />
              ))}
            </div>
            <div className='flex gap-2 ml-auto'>
              <button
                type='submit'
                className='px-3 py-1 bg-blue text-white text-sm rounded-2xl hover:bg-opacity-80'
              >
                Add
              </button>
              <button
                type='button'
                onClick={() => setIsAdding(false)}
                className='px-3 py-1 bg-[#333333] text-ascent-2 text-sm rounded-2xl hover:bg-opacity-80'
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className='flex flex-wrap gap-2'>
        {projects.map((project) => (
          <div
            key={project.id}
            className={`${project.color} text-white px-3 py-1 rounded-2xl flex items-center gap-2 text-sm`}
          >
            <span>{project.name}</span>
            <button
              onClick={() => handleDeleteProject(project.id)}
              className='hover:bg-white/20 rounded-full p-0.5 transition-colors'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          </div>
        ))}
      </div>

      {projects.length === 0 && !isAdding && (
        <p className='text-ascent-2 text-sm'>No projects added yet</p>
      )}
    </div>
  );
};

export default ProjectTags;