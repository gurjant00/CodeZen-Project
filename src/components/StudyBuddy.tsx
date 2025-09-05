import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Zap, Target, BookOpen, Brain, 
  Award, Flame, Calendar, Sparkles, Lightbulb
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  xp: number;
  category: 'productivity' | 'learning' | 'consistency' | 'milestone';
}

interface StudyBuddyProps {
  tasksCount: number;
  notesCount: number;
  subjectsCount: number;
  scheduleCount: number;
}

const StudyBuddy: React.FC<StudyBuddyProps> = ({ 
  tasksCount, 
  notesCount, 
  subjectsCount, 
  scheduleCount 
}) => {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [buddyMood, setBuddyMood] = useState<'happy' | 'excited' | 'proud' | 'encouraging'>('happy');

  const xpForNextLevel = level * 100;
  const xpProgress = (xp / xpForNextLevel) * 100;

  const buddyMessages = useMemo(() => ({
    welcome: [
      "🌟 Hey there, study champion! Ready to conquer your goals?",
      "✨ Your AI Study Buddy is here to help you succeed!",
      "🚀 Let's make today productive and amazing!"
    ],
    taskComplete: [
      "🎉 Amazing! You're crushing those tasks!",
      "💪 That's the spirit! Keep the momentum going!",
      "⭐ Another task down! You're unstoppable!"
    ],
    milestone: [
      "🏆 Incredible milestone reached! You're a productivity superstar!",
      "🎊 Wow! Your dedication is truly inspiring!",
      "💎 You've unlocked your potential! Keep shining!"
    ],
    encouraging: [
      "🌈 Every small step counts! You're doing great!",
      "💫 Believe in yourself - I do! Let's keep going!",
      "🌸 Progress over perfection! You're on the right path!"
    ]
  }), []);

  // Progressive tips that appear after completing achievements
  const achievementTips = useMemo(() => ({
    first_task: {
      tip: "Great start! 🎯 Tip: Break larger tasks into smaller, manageable chunks. This makes them less overwhelming and gives you more completion wins!",
      nextGoal: "Try creating your first note to boost your learning! 📝"
    },
    note_taker: {
      tip: "Excellent note-taking! 📚 Tip: Use the Cornell Note-Taking method - divide your notes into main notes, cues, and summary sections for better retention!",
      nextGoal: "Time to track your academic progress - try the CGPA Calculator! 🧮"
    },
    grade_tracker: {
      tip: "Smart move tracking your grades! 📊 Tip: Set target grades for each subject and review them weekly to stay on track with your academic goals!",
      nextGoal: "Now let's organize your time - add your class schedule! 📅"
    },
    scheduler: {
      tip: "Amazing scheduling skills! ⏰ Tip: Color-code your subjects and add buffer time between classes for transitions and quick reviews!",
      nextGoal: "Ready to level up? Try the AI-powered OCR feature to quickly import timetables! 🤖"
    },
    task_master: {
      tip: "You're a productivity powerhouse! 🚀 Tip: Use the 'Pomodoro Technique' - work for 25 minutes, then take a 5-minute break. Repeat for maximum efficiency!",
      nextGoal: "Keep building that consistency streak - daily app usage leads to success! 🔥"
    },
    ai_pioneer: {
      tip: "Welcome to the future! 🌟 Tip: OCR works best with clear, well-lit photos. Hold your device steady and ensure the text is clearly visible!",
      nextGoal: "You're becoming a study expert! Keep using all features to build consistency! 💎"
    },
    consistency_king: {
      tip: "Incredible dedication! 👑 Tip: Consistency beats intensity. Your daily habits are building the foundation for long-term academic success!",
      nextGoal: "You've mastered the basics! Now focus on maintaining this amazing routine! 🌟"
    }
  }), []);

  // Achievement icons mapping
  const achievementIcons = useMemo(() => ({
    first_task: <Target className="w-5 h-5" />,
    task_master: <Trophy className="w-5 h-5" />,
    note_taker: <BookOpen className="w-5 h-5" />,
    grade_tracker: <Brain className="w-5 h-5" />,
    scheduler: <Calendar className="w-5 h-5" />,
    ai_pioneer: <Sparkles className="w-5 h-5" />,
    consistency_king: <Flame className="w-5 h-5" />
  }), []);

  // Achievement data (without icons for localStorage compatibility)
  const achievementData = useMemo(() => [
    {
      id: 'first_task',
      title: 'Getting Started',
      description: 'Complete your first task',
      unlocked: false,
      xp: 50,
      category: 'productivity' as const
    },
    {
      id: 'task_master',
      title: 'Task Master',
      description: 'Complete 10 tasks',
      unlocked: false,
      xp: 200,
      category: 'productivity' as const
    },
    {
      id: 'note_taker',
      title: 'Note Taker',
      description: 'Create your first note',
      unlocked: false,
      xp: 150,
      category: 'learning' as const
    },
    {
      id: 'grade_tracker',
      title: 'Grade Tracker',
      description: 'Use CGPA Calculator',
      unlocked: false,
      xp: 100,
      category: 'learning' as const
    },
    {
      id: 'scheduler',
      title: 'Master Scheduler',
      description: 'Add your first class to timetable',
      unlocked: false,
      xp: 250,
      category: 'milestone' as const
    },
    {
      id: 'ai_pioneer',
      title: 'AI Pioneer',
      description: 'Use OCR to import timetable',
      unlocked: false,
      xp: 300,
      category: 'milestone' as const
    },
    {
      id: 'consistency_king',
      title: 'Consistency King',
      description: 'Use app for 7 consecutive days',
      unlocked: false,
      xp: 500,
      category: 'consistency' as const
    }
  ], []);

  // Combine data with icons for display
  const allAchievements: Achievement[] = useMemo(() => 
    achievementData.map(data => ({
      ...data,
      icon: achievementIcons[data.id as keyof typeof achievementIcons]
    }))
  , [achievementData, achievementIcons]);

  // AddXp function wrapped in useCallback to prevent re-creation on every render
  const addXp = useCallback((points: number) => {
    const newXp = xp + points;
    const newTotalXp = totalXp + points;
    const newLevel = Math.floor(newTotalXp / 100) + 1;

    if (newLevel > level) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
      setCurrentMessage(`🌟 Level Up! You're now Level ${newLevel}! Keep up the amazing work!`);
      setBuddyMood('excited');
    }

    setXp(newXp % xpForNextLevel);
    setTotalXp(newTotalXp);
    setLevel(newLevel);

    localStorage.setItem('studyBuddyLevel', newLevel.toString());
    localStorage.setItem('studyBuddyXp', (newXp % xpForNextLevel).toString());
    localStorage.setItem('studyBuddyTotalXp', newTotalXp.toString());
  }, [xp, totalXp, level, xpForNextLevel]);

  // Initialize achievements
  useEffect(() => {
    const savedAchievements = localStorage.getItem('achievements');
    const savedLevel = localStorage.getItem('studyBuddyLevel');
    const savedXp = localStorage.getItem('studyBuddyXp');
    const savedTotalXp = localStorage.getItem('studyBuddyTotalXp');

    if (savedAchievements) {
      const savedData = JSON.parse(savedAchievements);
      // Merge saved data with icons
      const mergedAchievements = savedData.map((data: any) => ({
        ...data,
        icon: achievementIcons[data.id as keyof typeof achievementIcons]
      }));
      setAchievements(mergedAchievements);
    } else {
      setAchievements(allAchievements);
    }

    if (savedLevel) setLevel(Number(savedLevel));
    if (savedXp) setXp(Number(savedXp));
    if (savedTotalXp) setTotalXp(Number(savedTotalXp));

    // Welcome message
    setCurrentMessage(buddyMessages.welcome[Math.floor(Math.random() * buddyMessages.welcome.length)]);
  }, [allAchievements, buddyMessages.welcome, achievementIcons]);

  // Check for achievements
  useEffect(() => {
    // Skip if achievements array is empty (not initialized yet)
    if (achievements.length === 0) {
      return;
    }
    
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.unlocked) return achievement;

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_task':
          shouldUnlock = tasksCount >= 1;
          break;
        case 'task_master':
          shouldUnlock = tasksCount >= 10;
          break;
        case 'note_taker':
          shouldUnlock = notesCount >= 1;
          break;
        case 'grade_tracker':
          shouldUnlock = subjectsCount >= 1;
          break;
        case 'scheduler':
          shouldUnlock = scheduleCount >= 1;
          break;
        case 'ai_pioneer':
          shouldUnlock = localStorage.getItem('usedOCR') === 'true';
          break;
      }

      if (shouldUnlock && !achievement.unlocked) {
        // Achievement unlocked!
        setTimeout(() => {
          setCurrentMessage(`🎊 Achievement Unlocked: ${achievement.title}! +${achievement.xp} XP`);
          setBuddyMood('proud');
        }, 500);
        
        // Show progressive tip after 3 seconds
        const achievementTip = achievementTips[achievement.id as keyof typeof achievementTips];
        if (achievementTip) {
          setTimeout(() => {
            setCurrentMessage(achievementTip.tip);
            setBuddyMood('encouraging');
          }, 3500);
          
          // Show next goal after another 5 seconds
          setTimeout(() => {
            setCurrentMessage(achievementTip.nextGoal);
            setBuddyMood('encouraging');
          }, 8500);
        }
        
        addXp(achievement.xp);
        return { ...achievement, unlocked: true };
      }

      return achievement;
    });

    setAchievements(updatedAchievements);
    // Save achievements without icons to avoid circular reference
    const achievementsToSave = updatedAchievements.map(({ icon, ...data }) => data);
    localStorage.setItem('achievements', JSON.stringify(achievementsToSave));
  }, [tasksCount, notesCount, subjectsCount, scheduleCount, achievements, addXp, achievementTips, achievementIcons]);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalAchievements = achievements.length;

  const getBuddyEmoji = () => {
    switch (buddyMood) {
      case 'excited': return '🤩';
      case 'proud': return '😊';
      case 'encouraging': return '🌟';
      default: return '✨';
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        className="card mb-6 bg-gradient-to-br from-gold/10 to-purple-500/10 border border-gold/30 light-mode:from-gold/20 light-mode:to-purple-500/20 light-mode:border-gold/40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gold flex items-center">
            <Sparkles className="w-7 h-7 mr-3 animate-pulse" />
            AI Study Buddy
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">Level {level}</div>
              <div className="text-xs text-gray-400 light-mode:text-gray-600">Study Master</div>
            </div>
          </div>
        </div>

        {/* Buddy Avatar & Message */}
        <div className="flex items-start space-x-4 mb-6">
          <motion.div
            className="text-6xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {getBuddyEmoji()}
          </motion.div>
          <div className="flex-1">
            <div className="bg-dark-card border border-dark-border rounded-xl p-4 relative light-mode:bg-white light-mode:border-gray-200">
              <div className="absolute -left-2 top-4 w-4 h-4 bg-dark-card border-l border-t border-dark-border transform rotate-45 light-mode:bg-white light-mode:border-gray-200"></div>
              <p className="text-white font-medium light-mode:text-gray-800">{currentMessage}</p>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300 light-mode:text-gray-600">Experience Points</span>
            <span className="text-sm text-gold">{xp} / {xpForNextLevel} XP</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden light-mode:bg-gray-300">
            <motion.div
              className="h-3 bg-gradient-to-r from-gold to-yellow-400 rounded-full relative overflow-hidden"
              style={{ width: `${xpProgress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-dark-card border border-dark-border rounded-lg light-mode:bg-white light-mode:border-gray-200">
            <Target className="w-6 h-6 text-gold mx-auto mb-1" />
            <div className="text-xl font-bold text-white light-mode:text-gray-900">{tasksCount}</div>
            <div className="text-xs text-gray-400 light-mode:text-gray-600">Tasks</div>
          </div>
          <div className="text-center p-3 bg-dark-card border border-dark-border rounded-lg light-mode:bg-white light-mode:border-gray-200">
            <BookOpen className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <div className="text-xl font-bold text-white light-mode:text-gray-900">{notesCount}</div>
            <div className="text-xs text-gray-400 light-mode:text-gray-600">Notes</div>
          </div>
          <div className="text-center p-3 bg-dark-card border border-dark-border rounded-lg light-mode:bg-white light-mode:border-gray-200">
            <Calendar className="w-6 h-6 text-green-400 mx-auto mb-1" />
            <div className="text-xl font-bold text-white light-mode:text-gray-900">{scheduleCount}</div>
            <div className="text-xs text-gray-400 light-mode:text-gray-600">Classes</div>
          </div>
          <div className="text-center p-3 bg-dark-card border border-dark-border rounded-lg light-mode:bg-white light-mode:border-gray-200">
            <Trophy className="w-6 h-6 text-purple-400 mx-auto mb-1" />
            <div className="text-xl font-bold text-white light-mode:text-gray-900">{unlockedAchievements.length}</div>
            <div className="text-xs text-gray-400 light-mode:text-gray-600">Achievements</div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div>
          <h3 className="text-lg font-semibold text-gold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Achievements ({unlockedAchievements.length}/{totalAchievements})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  achievement.unlocked
                    ? 'bg-gold/10 border-gold/30 shadow-lg shadow-gold/20 light-mode:bg-gold/20 light-mode:border-gold/40'
                    : 'bg-gray-800 border-gray-600 opacity-60 light-mode:bg-gray-200 light-mode:border-gray-300'
                }`}
                whileHover={achievement.unlocked ? { scale: 1.02, y: -2 } : {}}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    achievement.unlocked ? 'bg-gold text-black' : 'bg-gray-600 text-gray-400 light-mode:bg-gray-300 light-mode:text-gray-500'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      achievement.unlocked ? 'text-gold' : 'text-gray-400 light-mode:text-gray-500'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-400 mb-2 light-mode:text-gray-600">
                      {achievement.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400">{achievement.xp} XP</span>
                      {achievement.unlocked && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                          ✓ Unlocked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Beginner Guide for New Users */}
        {unlockedAchievements.length === 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gold mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Getting Started Guide
            </h3>
            <motion.div
              className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 light-mode:from-green-500/20 light-mode:to-blue-500/20 light-mode:border-green-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center light-mode:bg-green-500/30">
                    <span className="text-green-400 font-bold light-mode:text-green-600">1</span>
                  </div>
                  <p className="text-gray-300 light-mode:text-gray-700">
                    <strong className="text-green-400 light-mode:text-green-600">Start with a Task:</strong> Add your first task using the Tasks section to unlock your first achievement!
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center light-mode:bg-blue-500/30">
                    <span className="text-blue-400 font-bold light-mode:text-blue-600">2</span>
                  </div>
                  <p className="text-gray-300 light-mode:text-gray-700">
                    <strong className="text-blue-400 light-mode:text-blue-600">Take Notes:</strong> Use the Notes feature to jot down important study materials and boost your learning!
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center light-mode:bg-purple-500/30">
                    <span className="text-purple-400 font-bold light-mode:text-purple-600">3</span>
                  </div>
                  <p className="text-gray-300 light-mode:text-gray-700">
                    <strong className="text-purple-400 light-mode:text-purple-600">Build Your Schedule:</strong> Add your classes to the Timetable to stay organized!
                  </p>
                </div>
                <div className="mt-4 p-3 bg-gray-700/30 rounded-lg light-mode:bg-gray-300/50">
                  <p className="text-sm text-yellow-300 flex items-center light-mode:text-yellow-600">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Tip: Each action earns XP and unlocks personalized study tips to help you succeed!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Study Tips Section */}
        {unlockedAchievements.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gold mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Your Study Tips & Progress Guide
            </h3>
            <div className="space-y-3">
              {unlockedAchievements.map((achievement) => {
                const tip = achievementTips[achievement.id as keyof typeof achievementTips];
                if (!tip) return null;
                
                return (
                  <motion.div
                    key={`tip-${achievement.id}`}
                    className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 light-mode:from-blue-500/20 light-mode:to-purple-500/20 light-mode:border-blue-500/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-full shrink-0 light-mode:bg-blue-500/30">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-blue-300 light-mode:text-blue-600">{achievement.title}</h4>
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full light-mode:bg-green-500/30 light-mode:text-green-600">
                            Completed!
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-3 light-mode:text-gray-700">{tip.tip}</p>
                        <div className="bg-gray-700/50 rounded-lg p-3 light-mode:bg-gray-300/50">
                          <p className="text-sm text-yellow-300 flex items-center light-mode:text-yellow-600">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Next Goal: {tip.nextGoal}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-r from-gold to-yellow-400 text-black px-8 py-4 rounded-xl font-bold text-2xl shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', damping: 10 }}
            >
              <div className="flex items-center space-x-3">
                <Zap className="w-8 h-8" />
                <span>LEVEL UP! 🎉</span>
                <Zap className="w-8 h-8" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyBuddy;
