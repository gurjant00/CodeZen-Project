import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Clock, MapPin } from 'lucide-react';
import { ClassSchedule } from '../App';

interface TimetableProps {
  schedule: ClassSchedule[];
  setSchedule: (schedule: ClassSchedule[]) => void;
}

const Timetable: React.FC<TimetableProps> = ({ schedule, setSchedule }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    day: 'Monday',
    time: '',
    subject: '',
    room: '',
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const addClass = () => {
    if (formData.time && formData.subject && formData.room) {
      const newClass: ClassSchedule = {
        id: Date.now().toString(),
        day: formData.day,
        time: formData.time,
        subject: formData.subject,
        room: formData.room,
      };
      setSchedule([...schedule, newClass]);
      setFormData({ day: 'Monday', time: '', subject: '', room: '' });
      setShowForm(false);
    }
  };

  const deleteClass = (id: string) => {
    setSchedule(schedule.filter(cls => cls.id !== id));
  };

  const getClassesForDay = (day: string) => {
    return schedule.filter(cls => cls.day === day).sort((a, b) => a.time.localeCompare(b.time));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gold flex items-center">
            <span className="mr-3">📅</span>
            Class Timetable
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
        </div>

        {/* Add Class Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 border border-dark-border rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="input-field"
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="input-field"
                />
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Subject"
                  className="input-field"
                />
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="Room"
                  className="input-field"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={addClass}
                  className="btn-primary"
                >
                  Add Class
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timetable Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {days.map((day) => (
            <div key={day} className="space-y-3">
              <h3 className="text-lg font-semibold text-gold text-center">{day}</h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {getClassesForDay(day).map((cls) => (
                    <motion.div
                      key={cls.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-dark-card border border-dark-border rounded-lg p-3 relative group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{cls.time}</span>
                        </div>
                        <button
                          onClick={() => deleteClass(cls.id)}
                          className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <h4 className="font-semibold text-white mb-1">{cls.subject}</h4>
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{cls.room}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {getClassesForDay(day).length === 0 && (
                  <div className="text-center text-gray-500 text-sm py-4">
                    No classes
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {schedule.length === 0 && (
          <motion.div
            className="text-center py-12 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="light-mode:text-gray-600">No classes scheduled yet. Add your first class above!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Timetable;
