import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Calendar as CalendarIcon, Clock, AlignLeft } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: ''
  });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevDate = new Date(year, month, 0 - i);
      days.unshift(prevDate);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
    setEditingEvent(null);
    setEventForm({ title: '', description: '' });
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, title: eventForm.title, description: eventForm.description }
          : event
      ));
    } else {
      const newEvent = {
        id: Date.now().toString(),
        date: selectedDate,
        title: eventForm.title,
        description: eventForm.description
      };
      setEvents([...events, newEvent]);
    }
    setIsModalOpen(false);
    setEventForm({ title: '', description: '' });
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description
    });
    setSelectedDate(event.date);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = getDaysInMonth(currentDate);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-1">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-1 border border-gray-700/50">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <CalendarIcon className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                {monthNames[currentMonth]} {currentYear}
              </h2>
            </div>
            <div className="flex space-x-1">
              <button 
                onClick={handlePrevMonth}
                className="p-2.5 hover:bg-gray-600 rounded-full text-gray-300 hover:text-white transition-all duration-200"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-2.5 hover:bg-gray-600 rounded-full text-gray-300 hover:text-white transition-all duration-200  "
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-gray-400 font-medium py-2 text-sm tracking-wider">
                {day}
              </div>
            ))}
            
            {days.map((date, index) => {
              const isCurrentMonth = date.getMonth() === currentMonth;
              const isToday = date.toDateString() === new Date().toDateString();
              const dateEvents = getEventsForDate(date);
              
              return (
                <div 
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`
                    relative min-h-[1px] p-1 rounded-xl border transition-all duration-200
                    ${isCurrentMonth 
                      ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600' 
                      : 'bg-gray-900/30 border-gray-800/30 opacity-50 hover:bg-gray-800/30'}
                    ${isToday ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                    cursor-pointer group
                  `}
                >
                  <div className="flex justify-between items-start">
                    <span className={`
                      text-sm font-medium px-2 py-1 rounded-lg
                      ${isCurrentMonth ? 'text-gray-200' : 'text-gray-500'}
                      ${isToday ? 'bg-blue-500 text-white' : ''}
                    `}>
                      {date.getDate()}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateClick(date);
                      }}
                      className="p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-600/50 rounded-lg"
                    >
                      <Plus size={16} className="text-blue-400" />
                    </button>
                  </div>
                  <div className="mt-1 space-y-1">
                    {dateEvents.map(event => (
                      <div 
                        key={event.id}
                        className="bg-blue-500/20 border border-blue-500/30 text-white text-sm p-2 rounded-lg mb-1 group/event hover:bg-blue-500/30 transition-colors duration-200"
                      >
                        <div className="truncate">{event.title}</div>
                        <div className="flex justify-end space-x-1 mt-1 opacity-0 group-hover/event:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEvent(event);
                            }}
                            className="p-1 hover:bg-blue-400/20 rounded-md transition-colors"
                          >
                            <Edit2 size={14} className="text-blue-300" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(event.id);
                            }}
                            className="p-1 hover:bg-red-400/20 rounded-md transition-colors"
                          >
                            <Trash2 size={14} className="text-red-300" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-gray-800/90 bg-[#141618] rounded-2xl p-2 w-full max-w-md border border-gray-700/50 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-white">
                  {editingEvent ? 'Edit Event' : 'New Event'}
                </h3>
              </div>
              <form onSubmit={handleEventSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center text-gray-300 mb-2 text-sm">
                    <AlignLeft size={16} className="mr-2" />
                    Title
                  </label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full bg-gray-700/50 text-black rounded-lg p-3 border border-gray-600/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="Enter event title"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center text-gray-300 mb-2 text-sm">
                    <AlignLeft size={16} className="mr-2" />
                    Description
                  </label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full bg-gray-700/50 text-gray-900 rounded-lg p-3 border border-gray-600/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    rows={3}
                    placeholder="Enter event description"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-all duration-200 border border-gray-600/50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus size={18} />
                    <span>{editingEvent ? 'Update' : 'Add'} Event</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;