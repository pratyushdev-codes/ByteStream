import React from 'react';
import { X } from 'lucide-react';
import { useProjectTags } from '../components/hooks/useProjectTags';

export function ProjectTags() {
  const projectTags = useProjectTags();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Tag Projects Button */}
      <button className="text-base flex flex-row text-ascent-1 px-3 mb-2mmd:px-4 py-1 md:py-1 text-[gray] border border-[#666] rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg"  color='gray' height="24px" viewBox="0 -960 960 960" width="24px" fill="gray"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
        &nbsp;Tag Projects
      </button>

      {/* Project Tags */}
      {projectTags.map((tag) => (
        <div
          key={tag.id}
          className={`bg-[#27282A] px-3 py-1 rounded-full flex items-center gap-1 text-base text-blue`}
        >
          <span>{tag.name}</span>
          
        </div>
      ))}
    </div>
  );
}