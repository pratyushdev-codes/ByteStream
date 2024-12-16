import { useState, useEffect } from 'react';

export function useProjectTags() {
  const [projectTags, setProjectTags] = useState([]);

  const fetchProjectTags = () => {
    const projectData = localStorage.getItem('userProjects');
    if (projectData) {
      try {
        const parsedData = JSON.parse(projectData);
        const tagsArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        setProjectTags(tagsArray);
      } catch (error) {
        console.error('Error parsing project data:', error);
      }
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchProjectTags();

    // Set up polling every 4 seconds
    const intervalId = setInterval(fetchProjectTags, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return projectTags;
}
