import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Ruler, Quote, Plus, Trash2 } from 'lucide-react';
import { Subject } from '../App';

interface ToolsSectionProps {
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
  isDarkMode: boolean;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ subjects, setSubjects, isDarkMode }) => {
  const [activeTool, setActiveTool] = useState('cgpa');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [loading] = useState(false);

  const techQuotes = [
    { content: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { content: "Move fast and break things.", author: "Mark Zuckerberg" },
    { content: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { content: "Software is eating the world.", author: "Marc Andreessen" },
    { content: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { content: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { content: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { content: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
    { content: "The computer was born to solve problems that did not exist before.", author: "Bill Gates" }
  ];

  const tools = [
    { id: 'cgpa', name: 'CGPA Calculator', icon: Calculator },
    { id: 'converter', name: 'Unit Converter', icon: Ruler },
    { id: 'quotes', name: 'Motivational Quotes', icon: Quote },
  ];

  // Get next quote
  const getNextQuote = React.useCallback(() => {
    setCurrentQuoteIndex((prevIndex) => 
      prevIndex === techQuotes.length - 1 ? 0 : prevIndex + 1
    );
  }, [techQuotes.length]);

  useEffect(() => {
    // Initialize with a random quote
    setCurrentQuoteIndex(Math.floor(Math.random() * techQuotes.length));
  }, [techQuotes.length]);

  // Auto-refresh quote every 30 seconds
  useEffect(() => {
    const interval = setInterval(getNextQuote, 30000);
    return () => clearInterval(interval);
  }, [getNextQuote]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tool Navigation */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTool === tool.id
                ? 'bg-gold text-black'
                : 'bg-dark-card text-gray-300 hover:bg-dark-border light-mode:bg-gray-100 light-mode:text-gray-700 light-mode:hover:bg-gray-200'
            }`}
          >
            <tool.icon className="w-5 h-5" />
            <span>{tool.name}</span>
          </button>
        ))}
      </motion.div>

      {/* Tool Content */}
      <motion.div
        key={activeTool}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="card"
      >
        {activeTool === 'cgpa' && (
          <CGPACalculator subjects={subjects} setSubjects={setSubjects} />
        )}
        {activeTool === 'converter' && (
          <UnitConverter />
        )}
        {activeTool === 'quotes' && (
          <MotivationalQuotes
            quote={`"${techQuotes[currentQuoteIndex].content}" - ${techQuotes[currentQuoteIndex].author}`}
            loading={loading}
            onRefresh={getNextQuote}
          />
        )}
      </motion.div>
    </div>
  );
};

// CGPA Calculator Component
const CGPACalculator: React.FC<{ subjects: Subject[]; setSubjects: (subjects: Subject[]) => void }> = ({ subjects, setSubjects }) => {
  const [newSubject, setNewSubject] = useState({ name: '', credits: '', grade: 'O' });
  const grades = ['O', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];

  const gradePoints: { [key: string]: number } = {
    'O': 10.0, 'A+': 9.0, 'A': 8.0, 'B+': 7.0, 'B': 6.0,
    'C+': 5.0, 'C': 4.0, 'D': 3.0, 'F': 0.0
  };

  const addSubject = () => {
    if (newSubject.name && newSubject.credits && Number(newSubject.credits) > 0) {
      const subject: Subject = {
        id: Date.now().toString(),
        name: newSubject.name,
        credits: Number(newSubject.credits),
        grade: newSubject.grade,
      };
      setSubjects([...subjects, subject]);
      setNewSubject({ name: '', credits: '', grade: 'O' });
    }
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const calculateGPA = () => {
    if (subjects.length === 0) return 0;
    const totalPoints = subjects.reduce((sum, subject) => 
      sum + (gradePoints[subject.grade] * subject.credits), 0
    );
    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gold mb-4 flex items-center">
        <span className="mr-3">🧮</span>
        CGPA Calculator
      </h2>
      
      {/* Indian Grading Scale Info */}
      <div className="mb-6 p-4 bg-dark-card border border-dark-border rounded-lg light-mode:bg-gray-100 light-mode:border-gray-300">
        <h3 className="text-sm font-semibold text-gold mb-2">Indian Grading Scale (10-Point System):</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 text-xs text-gray-400 light-mode:text-gray-600">
          <span><strong className="text-gold">O:</strong> 10.0</span>
          <span><strong className="text-gold">A+:</strong> 9.0</span>
          <span><strong className="text-gold">A:</strong> 8.0</span>
          <span><strong className="text-gold">B+:</strong> 7.0</span>
          <span><strong className="text-gold">B:</strong> 6.0</span>
          <span><strong className="text-gold">C+:</strong> 5.0</span>
          <span><strong className="text-gold">C:</strong> 4.0</span>
          <span><strong className="text-gold">D:</strong> 3.0</span>
          <span><strong className="text-red-400">F:</strong> 0.0</span>
        </div>
      </div>

      {/* Add Subject Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          value={newSubject.name}
          onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
          placeholder="Subject Name"
          className="input-field"
        />
         <input
           type="number"
           value={newSubject.credits}
           onChange={(e) => setNewSubject({ ...newSubject, credits: e.target.value })}
           placeholder="Credits"
           className="input-field"
           min="1"
           max="8"
         />
        <select
          value={newSubject.grade}
          onChange={(e) => setNewSubject({ ...newSubject, grade: e.target.value })}
          className="input-field"
        >
          {grades.map(grade => (
            <option key={grade} value={grade}>{grade}</option>
          ))}
        </select>
        <button onClick={addSubject} className="btn-primary">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Subjects List */}
      <div className="space-y-3 mb-6">
        {subjects.map((subject) => (
          <div key={subject.id} className="flex items-center justify-between p-3 bg-dark-card border border-dark-border rounded-lg light-mode:bg-gray-50 light-mode:border-gold/20">
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-white light-mode:text-gray-800">{subject.name}</span>
              <span className="text-gray-400 light-mode:text-gray-600">{subject.credits} credits</span>
              <span className="text-gold font-bold">{subject.grade}</span>
            </div>
            <button
              onClick={() => deleteSubject(subject.id)}
              className="text-red-400 hover:text-red-300 light-mode:text-red-600 light-mode:hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* GPA Display */}
      <div className="text-center p-6 bg-gold/10 border border-gold/30 rounded-lg light-mode:bg-gold/20 light-mode:border-gold/40">
        <h3 className="text-lg font-semibold text-gold mb-2">Your CGPA</h3>
        <div className="text-4xl font-bold text-gold">{calculateGPA()}</div>
        <p className="text-sm text-gray-400 mt-2 light-mode:text-gray-600">
          Based on {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

// Unit Converter Component
const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<'length' | 'data'>('length');
  const [fromUnit, setFromUnit] = useState('cm');
  const [toUnit, setToUnit] = useState('inch');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  const conversions = {
    length: {
      units: ['cm', 'inch', 'm', 'ft', 'km', 'mile'] as const,
      conversions: {
        'cm': { 'inch': 0.393701, 'm': 0.01, 'ft': 0.0328084, 'km': 0.00001, 'mile': 0.00000621371 },
        'inch': { 'cm': 2.54, 'm': 0.0254, 'ft': 0.0833333, 'km': 0.0000254, 'mile': 0.0000157828 },
        'm': { 'cm': 100, 'inch': 39.3701, 'ft': 3.28084, 'km': 0.001, 'mile': 0.000621371 },
        'ft': { 'cm': 30.48, 'inch': 12, 'm': 0.3048, 'km': 0.0003048, 'mile': 0.000189394 },
        'km': { 'cm': 100000, 'inch': 39370.1, 'm': 1000, 'ft': 3280.84, 'mile': 0.621371 },
        'mile': { 'cm': 160934, 'inch': 63360, 'm': 1609.34, 'ft': 5280, 'km': 1.60934 }
      } as const
    },
    data: {
      units: ['B', 'KB', 'MB', 'GB', 'TB'] as const,
      conversions: {
        'B': { 'KB': 1/1024, 'MB': 1/(1024*1024), 'GB': 1/(1024*1024*1024), 'TB': 1/(1024*1024*1024*1024) },
        'KB': { 'B': 1024, 'MB': 1/1024, 'GB': 1/(1024*1024), 'TB': 1/(1024*1024*1024) },
        'MB': { 'B': 1024*1024, 'KB': 1024, 'GB': 1/1024, 'TB': 1/(1024*1024) },
        'GB': { 'B': 1024*1024*1024, 'KB': 1024*1024, 'MB': 1024, 'TB': 1/1024 },
        'TB': { 'B': 1024*1024*1024*1024, 'KB': 1024*1024*1024, 'MB': 1024*1024, 'GB': 1024 }
      } as const
    }
  };

  const convert = () => {
    if (!value || isNaN(Number(value))) {
      setResult('');
      return;
    }

    const numValue = Number(value);
    let convertedValue = numValue;

    // Use the selected category for conversion
    if (fromUnit !== toUnit) {
      const categoryConversions = conversions[category].conversions as any;
      convertedValue = numValue * categoryConversions[fromUnit][toUnit];
    }

    setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ''));
  };

  useEffect(() => {
    convert();
  }, [value, fromUnit, toUnit, category]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <h2 className="text-2xl font-bold text-gold mb-6 flex items-center">
        <span className="mr-3">📏</span>
        Unit Converter
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as 'length' | 'data');
            setFromUnit(conversions[e.target.value as 'length' | 'data'].units[0]);
            setToUnit(conversions[e.target.value as 'length' | 'data'].units[1]);
          }}
          className="input-field"
        >
          <option value="length">Length</option>
          <option value="data">Data</option>
        </select>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
          className="input-field"
        />
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="input-field"
        >
          {conversions[category].units.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="input-field"
        >
          {conversions[category].units.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>

      {result && (
        <div className="text-center p-6 bg-gold/10 border border-gold/30 rounded-lg light-mode:bg-gold/20 light-mode:border-gold/40">
          <h3 className="text-lg font-semibold text-gold mb-2">Result</h3>
          <div className="text-3xl font-bold text-gold">
            {value} {fromUnit} = {result} {toUnit}
          </div>
        </div>
      )}
    </div>
  );
};

// Motivational Quotes Component
const MotivationalQuotes: React.FC<{ quote: string; loading: boolean; onRefresh: () => void }> = ({ quote, loading, onRefresh }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gold flex items-center">
          <span className="mr-3">💬</span>
          Motivational Quotes
        </h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="btn-primary flex items-center space-x-2"
        >
          <Quote className="w-4 h-4" />
          <span>{loading ? 'Loading...' : 'New Quote'}</span>
        </button>
      </div>

      <div className="text-center p-8 bg-gold/10 border border-gold/30 rounded-lg light-mode:bg-gold/20 light-mode:border-gold/40">
        {loading ? (
          <div className="text-gold">Loading inspirational quote...</div>
        ) : (
          <div>
            <p className="text-xl text-white mb-4 italic light-mode:text-gray-800">"{quote.split('"')[1]}"</p>
            <p className="text-gold font-semibold">- {quote.split(' - ')[1]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsSection;
