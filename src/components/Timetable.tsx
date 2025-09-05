import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Clock, MapPin, Camera } from 'lucide-react';
import { ClassSchedule } from '../App';
import { createWorker } from 'tesseract.js';
import { useAuth } from './AuthContext';

interface TimetableProps {
  schedule: ClassSchedule[];
  setSchedule: (schedule: ClassSchedule[]) => void;
}

const Timetable: React.FC<TimetableProps> = ({ schedule, setSchedule }) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    day: 'Monday',
    time: '',
    subject: '',
    room: '',
  });
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Helper function to get user-specific storage keys
  const getStorageKey = (key: string) => {
    if (!user) return key;
    const userKey = user.isGuest ? 'guest_studybuddy' : `user_${user.id}_studybuddy`;
    return `${userKey}_${key}`;
  };

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

  // Parse OCR text to extract timetable data
  const parseTimetableText = (text: string): ClassSchedule[] => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const parsedClasses: ClassSchedule[] = [];
    
    console.log('OCR Text lines:', lines);
    
    // Enhanced day patterns
    const dayPatterns = {
      'monday': 'Monday', 'mon': 'Monday',
      'tuesday': 'Tuesday', 'tue': 'Tuesday', 'tues': 'Tuesday',
      'wednesday': 'Wednesday', 'wed': 'Wednesday',
      'thursday': 'Thursday', 'thu': 'Thursday', 'thurs': 'Thursday',
      'friday': 'Friday', 'fri': 'Friday',
      'saturday': 'Saturday', 'sat': 'Saturday',
      'sunday': 'Sunday', 'sun': 'Sunday'
    };
    
    // Enhanced time patterns to catch various formats
    const timePatterns = [
      /\b(\d{1,2}[:.]\d{2})[-–—](\d{1,2}[:.]\d{2})\b/g,  // 9:30-10:20, 9.30-10.20
      /\b(\d{1,2})[:.]?(\d{2})\s*[-–—]\s*(\d{1,2})[:.]?(\d{2})\b/g,  // More flexible
      /\b(\d{1,2}:\d{2})\b/g  // Just start times
    ];
    
    // Find time header row (contains multiple time slots)
    let timeSlots: string[] = [];
    const timeHeaderPattern = /\b\d{1,2}[:.]\d{2}[-–—]\d{1,2}[:.]\d{2}\b/g;
    
    for (const line of lines) {
      const timeMatches = line.match(timeHeaderPattern);
      if (timeMatches && timeMatches.length >= 3) { // Multiple time slots in one line
        timeSlots = timeMatches.map(time => {
          // Extract start time from range
          const match = time.match(/(\d{1,2}[:.]\d{2})/);
          return match ? match[1].replace('.', ':') : time;
        });
        console.log('Found time slots:', timeSlots);
        break;
      }
    }
    
    // If no clear time header, try to extract from multiple lines
    if (timeSlots.length === 0) {
      const allTimes = new Set<string>();
      for (const line of lines) {
        for (const pattern of timePatterns) {
          const matches = Array.from(line.matchAll(pattern));
          for (const match of matches) {
            if (match[1]) {
              allTimes.add(match[1].replace('.', ':'));
            }
          }
        }
      }
      timeSlots = Array.from(allTimes).sort();
      console.log('Extracted time slots:', timeSlots);
    }
    
    let currentDay = '';
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Check if line contains a day
      for (const [pattern, day] of Object.entries(dayPatterns)) {
        if (lowerLine.includes(pattern)) {
          currentDay = day;
          console.log('Found day:', currentDay, 'in line:', line);
          break;
        }
      }
      
      // If we have a current day, look for subjects in this line
      if (currentDay) {
        // Enhanced subject patterns
        const subjectPatterns = [
          /\b(Physics|Chemistry|Mathematics|Math|English|Computer|Programming|HVPE|QA&LR|Mentor)\b/gi,
          /\b[A-Z]{2,}\b/g, // Subject codes like DC, IP, EP, HVPE
          /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+Lab\b/gi, // Labs
          /\bLab\b/gi
        ];
        
        const roomPatterns = [
          /\b[LR][-\s]?\d{3}\b/gi, // L-313, R-201, etc.
          /\bNFI\b/gi, // Room codes like NFI
          /\b\d{3}\b/g // 3-digit room numbers
        ];
        
        // Look for subjects in this line
        const subjects: string[] = [];
        const rooms: string[] = [];
        
        for (const pattern of subjectPatterns) {
          const matches = line.match(pattern);
          if (matches) {
            subjects.push(...matches.map(m => m.trim()));
          }
        }
        
        for (const pattern of roomPatterns) {
          const matches = line.match(pattern);
          if (matches) {
            rooms.push(...matches.map(m => m.trim()));
          }
        }
        
        console.log('Found subjects:', subjects, 'rooms:', rooms, 'for day:', currentDay);
        
        // Create classes for each subject found
        if (subjects.length > 0) {
          const dayForClasses = currentDay; // Capture the current day value
          subjects.forEach((subject, index) => {
            // Try to assign appropriate time slot
            let timeSlot = '09:00'; // Default
            if (timeSlots.length > index) {
              timeSlot = timeSlots[index];
            } else if (timeSlots.length > 0) {
              timeSlot = timeSlots[0];
            }
            
            // Assign room if available
            let room = 'TBD';
            if (rooms.length > index) {
              room = rooms[index];
            } else if (rooms.length > 0) {
              room = rooms[0];
            }
            
            // Skip very short or generic subjects
            if (subject.length >= 2 && !['Dr', 'Ms', 'Mr'].includes(subject)) {
              parsedClasses.push({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                day: dayForClasses,
                time: timeSlot,
                subject: subject,
                room: room
              });
            }
          });
        }
        
        // Reset current day after processing line
        // currentDay = ''; // Don't reset - day might span multiple lines
      }
    }
    
    console.log('Parsed classes:', parsedClasses);
    
    // If primary parsing didn't find much, try fallback method
    if (parsedClasses.length < 3) {
      const fallbackClasses = fallbackParseTimetable(text);
      if (fallbackClasses.length > 0) {
        console.log('Using fallback parser results:', fallbackClasses);
        return fallbackClasses;
      }
    }
    
    return parsedClasses;
  };
  
  // Fallback parser for complex grid-based timetables
  const fallbackParseTimetable = (text: string): ClassSchedule[] => {
    const parsedClasses: ClassSchedule[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    // Look for common timetable keywords and create sample entries
    const subjects: string[] = [];
    const rooms: string[] = [];
    const times: string[] = [];
    const days: string[] = [];
    
    // Extract all potential subjects
    const subjectKeywords = ['Physics', 'Chemistry', 'Mathematics', 'Math', 'English', 'Computer', 'Programming', 'HVPE', 'DC', 'IP', 'EP', 'QA&LR', 'Mentor', 'Lab'];
    const roomKeywords = /\b[LR][-\s]?\d{3}\b|\bNFI\b|\b\d{3}\b/g;
    const timeKeywords = /\b\d{1,2}[:.]\d{2}\b/g;
    const dayKeywords = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (const line of lines) {
      // Find subjects
      for (const keyword of subjectKeywords) {
        if (line.includes(keyword) && !subjects.includes(keyword)) {
          subjects.push(keyword);
        }
      }
      
      // Find rooms
      const roomMatches = line.match(roomKeywords);
      if (roomMatches) {
        rooms.push(...roomMatches.filter(room => !rooms.includes(room)));
      }
      
      // Find times
      const timeMatches = line.match(timeKeywords);
      if (timeMatches) {
        times.push(...timeMatches.filter(time => !times.includes(time)));
      }
      
      // Find days
      for (const day of dayKeywords) {
        if (line.toLowerCase().includes(day.toLowerCase()) && !days.includes(day)) {
          days.push(day);
        }
      }
    }
    
    console.log('Fallback extraction:', { subjects, rooms, times, days });
    
    // Create classes based on extracted data
    const workingDays = days.length > 0 ? days : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const workingTimes = times.length > 0 ? times.slice(0, 5) : ['09:30', '10:20', '11:10', '12:00', '14:00'];
    
    let subjectIndex = 0;
    let roomIndex = 0;
    
    for (const day of workingDays.slice(0, 5)) { // Max 5 days
      for (let i = 0; i < Math.min(2, workingTimes.length); i++) { // Max 2 classes per day
        if (subjectIndex < subjects.length) {
          parsedClasses.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            day: day,
            time: workingTimes[i],
            subject: subjects[subjectIndex],
            room: rooms[roomIndex % Math.max(1, rooms.length)] || 'TBD'
          });
          
          subjectIndex++;
          roomIndex++;
        }
      }
    }
    
    return parsedClasses;
  };

  // Handle image upload and OCR processing
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    setOcrProgress(0);

    try {
      const worker = await createWorker('eng', 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      console.log('OCR Text:', text);
      
      // Parse the extracted text
      const newClasses = parseTimetableText(text);
      
      if (newClasses.length > 0) {
        // Add new classes to existing schedule (avoid duplicates)
        const existingClassKeys = schedule.map(cls => `${cls.day}-${cls.time}-${cls.subject}`);
        const uniqueNewClasses = newClasses.filter(cls => 
          !existingClassKeys.includes(`${cls.day}-${cls.time}-${cls.subject}`)
        );
        
        if (uniqueNewClasses.length > 0) {
          setSchedule([...schedule, ...uniqueNewClasses]);
          // Mark for Study Buddy achievement (only for non-guest users)
          if (user && !user.isGuest) {
            localStorage.setItem(getStorageKey('usedOCR'), 'true');
          }
          alert(`🎉 Successfully imported ${uniqueNewClasses.length} classes from the image!\n\nYou can now view and edit them in your timetable.`);
        } else {
          alert('⚠️ No new classes found in the image (all classes already exist).');
        }
      } else {
        alert(`❌ Could not extract timetable data from the image.\n\n💡 Tips for better results:\n• Use good lighting\n• Ensure text is clear and readable\n• Try cropping to show just the timetable\n• Make sure the image isn't blurry\n\nYou can also add classes manually using the "Add Class" button.`);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      alert(`🚔 Failed to process the image.\n\n🔧 Possible solutions:\n• Try a different image\n• Check if the image file is not corrupted\n• Ensure the image contains a timetable\n• Use JPG or PNG format\n\nYou can always add classes manually using the "Add Class" button.`);
    } finally {
      setIsProcessingImage(false);
      setOcrProgress(0);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
          <div className="flex gap-3">
            <button
              onClick={handleUploadClick}
              disabled={isProcessingImage}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              <span>Import from Image</span>
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Class</span>
            </button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* OCR Processing Indicator */}
        <AnimatePresence>
          {isProcessingImage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-3 border-gold border-t-transparent rounded-full animate-spin"></div>
                <div className="flex-1">
                  <p className="text-gold font-semibold mb-1">Processing Timetable Image...</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ocrProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{ocrProgress}% complete</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                      className="bg-dark-card border border-dark-border rounded-lg p-3 relative group light-mode:bg-gray-50 light-mode:border-gold/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-400 light-mode:text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{cls.time}</span>
                        </div>
                        <button
                          onClick={() => deleteClass(cls.id)}
                          className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity light-mode:text-red-600 light-mode:hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <h4 className="font-semibold text-white mb-1 light-mode:text-gray-800">{cls.subject}</h4>
                      <div className="flex items-center space-x-1 text-sm text-gray-400 light-mode:text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{cls.room}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {getClassesForDay(day).length === 0 && (
                  <div className="text-center text-gray-500 text-sm py-4 light-mode:text-gray-600">
                    No classes
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {schedule.length === 0 && (
          <motion.div
            className="text-center py-12 text-gray-500 light-mode:text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="mb-4">No classes scheduled yet. Add your first class above!</p>
            <div className="text-left max-w-md mx-auto bg-dark-card border border-dark-border rounded-lg p-4 text-sm light-mode:bg-gray-50 light-mode:border-gold/20">
              <h4 className="text-gold font-semibold mb-2 flex items-center">
                <Camera className="w-4 h-4 mr-2" />
                Import from Image Tips:
              </h4>
              <ul className="text-gray-400 space-y-1 text-xs light-mode:text-gray-600">
                <li>• Upload a clear photo of your timetable</li>
                <li>• Works with college/school timetables</li>
                <li>• Automatically detects times, subjects, and rooms</li>
                <li>• Supports formats like "9:30-10:20"</li>
                <li>• You can edit imported classes after</li>
              </ul>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Timetable;
