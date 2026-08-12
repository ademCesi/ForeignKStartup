import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Users, Target, AlertTriangle, ChevronDown, ChevronRight, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

const projectData = {
  title: "Foreign Entrepreneur Helper App",
  subtitle: "외국인 창업 도우미 앱",
  team: ["Adem Bensalem", "Mathis Cornic", "Justin Edon"],
  supervisor: "Prof. Seokyoung Ahn",
  startDate: "2026-06-01",
  deadline: "2026-08-14",
  endDate: "2026-09-25"
};

const initialMilestones = [
  {
    id: 1,
    week: "Week 1-2",
    dateRange: "Jun 1 - Jun 14",
    title: "Research & Planning",
    titleKr: "조사 및 기획",
    tasks: [
      { id: 101, text: "Research Korean startup regulations for foreigners", done: true },
      { id: 102, text: "Study visa requirements (D-8, F-2-7, etc.)", done: true },
      { id: 103, text: "Analyze existing apps/services", done: true },
      { id: 104, text: "Define app features and user stories", done: true },
      { id: 105, text: "Create project timeline", done: true }
    ]
  },
  {
    id: 2,
    week: "Week 3-4",
    dateRange: "Jun 15 - Jun 28",
    title: "Design & Architecture",
    titleKr: "설계 및 아키텍처",
    tasks: [
      { id: 201, text: "Design UI/UX wireframes", done: false },
      { id: 202, text: "Define database schema", done: false },
      { id: 203, text: "Choose tech stack (React Native / Flutter)", done: false },
      { id: 204, text: "Set up development environment", done: false },
      { id: 205, text: "Create API specifications", done: false }
    ]
  },
  {
    id: 3,
    week: "Week 5-6",
    dateRange: "Jun 29 - Jul 12",
    title: "Core Development",
    titleKr: "핵심 기능 개발",
    tasks: [
      { id: 301, text: "Implement user authentication", done: false },
      { id: 302, text: "Build startup checklist module", done: false },
      { id: 303, text: "Create visa information section", done: false },
      { id: 304, text: "Develop government office locator", done: false },
      { id: 305, text: "Build document checklist feature", done: false }
    ]
  },
  {
    id: 4,
    week: "Week 7-8",
    dateRange: "Jul 13 - Jul 26",
    title: "Advanced Features",
    titleKr: "고급 기능 개발",
    tasks: [
      { id: 401, text: "Implement funding information module", done: false },
      { id: 402, text: "Add multi-language support (EN/KR/FR)", done: false },
      { id: 403, text: "Create notification system", done: false },
      { id: 404, text: "Build community/FAQ section", done: false },
      { id: 405, text: "Integrate Korean business registration API", done: false }
    ]
  },
  {
    id: 5,
    week: "Week 9-10",
    dateRange: "Jul 27 - Aug 9",
    title: "Testing & Refinement",
    titleKr: "테스트 및 개선",
    tasks: [
      { id: 501, text: "Conduct user testing", done: false },
      { id: 502, text: "Fix bugs and issues", done: false },
      { id: 503, text: "Optimize performance", done: false },
      { id: 504, text: "Prepare demo version", done: false },
      { id: 505, text: "Write user documentation", done: false }
    ]
  },
  {
    id: 6,
    week: "Week 11",
    dateRange: "Aug 10 - Aug 14",
    title: "Final Delivery",
    titleKr: "최종 제출",
    tasks: [
      { id: 601, text: "Final presentation preparation", done: false },
      { id: 602, text: "Code review and cleanup", done: false },
      { id: 603, text: "Submit source code and documentation", done: false },
      { id: 604, text: "Present to Prof. Ahn", done: false }
    ]
  }
];

const keyDates = [
  { date: "2026-06-30", event: "Monthly Progress Report #1", type: "report" },
  { date: "2026-07-15", event: "Mid-project Review Meeting", type: "meeting" },
  { date: "2026-07-31", event: "Monthly Progress Report #2", type: "report" },
  { date: "2026-08-14", event: "🎯 Final Deadline", type: "deadline" },
  { date: "2026-08-21", event: "Final Presentation", type: "presentation" },
  { date: "2026-09-25", event: "Internship Ends", type: "end" }
];

export default function ProjectDashboard() {
  const [milestones, setMilestones] = useState([]);
  const [expandedMilestones, setExpandedMilestones] = useState({});
  const [notes, setNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [newTaskText, setNewTaskText] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");

  // Load data from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const milestonesResult = await window.storage.get('cesi-milestones');
        const notesResult = await window.storage.get('cesi-notes');
        
        if (milestonesResult?.value) {
          setMilestones(JSON.parse(milestonesResult.value));
        } else {
          setMilestones(initialMilestones);
        }
        
        if (notesResult?.value) {
          setNotes(notesResult.value);
        }
        
        // Expand first incomplete milestone by default
        const expanded = {};
        initialMilestones.forEach(m => {
          expanded[m.id] = true;
        });
        setExpandedMilestones(expanded);
      } catch (e) {
        setMilestones(initialMilestones);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Save milestones
  const saveMilestones = async (newMilestones) => {
    setMilestones(newMilestones);
    try {
      await window.storage.set('cesi-milestones', JSON.stringify(newMilestones));
      setSaveStatus("Saved!");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (e) {
      setSaveStatus("Save failed");
    }
  };

  // Save notes
  const saveNotes = async () => {
    try {
      await window.storage.set('cesi-notes', notes);
      setIsEditingNotes(false);
      setSaveStatus("Notes saved!");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (e) {
      setSaveStatus("Save failed");
    }
  };

  // Toggle task completion
  const toggleTask = (milestoneId, taskId) => {
    const newMilestones = milestones.map(m => {
      if (m.id === milestoneId) {
        return {
          ...m,
          tasks: m.tasks.map(t => 
            t.id === taskId ? { ...t, done: !t.done } : t
          )
        };
      }
      return m;
    });
    saveMilestones(newMilestones);
  };

  // Add new task
  const addTask = (milestoneId) => {
    const text = newTaskText[milestoneId];
    if (!text?.trim()) return;
    
    const newMilestones = milestones.map(m => {
      if (m.id === milestoneId) {
        const newId = Math.max(...m.tasks.map(t => t.id), 0) + 1;
        return {
          ...m,
          tasks: [...m.tasks, { id: newId, text: text.trim(), done: false }]
        };
      }
      return m;
    });
    saveMilestones(newMilestones);
    setNewTaskText({ ...newTaskText, [milestoneId]: "" });
  };

  // Delete task
  const deleteTask = (milestoneId, taskId) => {
    const newMilestones = milestones.map(m => {
      if (m.id === milestoneId) {
        return {
          ...m,
          tasks: m.tasks.filter(t => t.id !== taskId)
        };
      }
      return m;
    });
    saveMilestones(newMilestones);
  };

  // Calculate progress
  const totalTasks = milestones.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedTasks = milestones.reduce((acc, m) => acc + m.tasks.filter(t => t.done).length, 0);
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate days remaining
  const today = new Date();
  const deadline = new Date(projectData.deadline);
  const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  // Get milestone progress
  const getMilestoneProgress = (milestone) => {
    const done = milestone.tasks.filter(t => t.done).length;
    const total = milestone.tasks.length;
    return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{projectData.title}</h1>
              <p className="text-blue-100 text-lg">{projectData.subtitle}</p>
              <div className="flex items-center gap-2 mt-2 text-blue-100">
                <Users size={16} />
                <span className="text-sm">{projectData.team.join(" • ")}</span>
              </div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{daysRemaining}</div>
                <div className="text-blue-100 text-sm">days until deadline</div>
                <div className="text-white/80 text-xs mt-1">🎯 Aug 14, 2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Status */}
        {saveStatus && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            {saveStatus}
          </div>
        )}

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400">Overall Progress</span>
              <Target className="text-blue-400" size={20} />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{progressPercent}%</div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-slate-400 text-sm mt-2">{completedTasks} / {totalTasks} tasks</div>
          </div>

          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400">Current Phase</span>
              <Clock className="text-yellow-400" size={20} />
            </div>
            {milestones.map(m => {
              const progress = getMilestoneProgress(m);
              if (progress.percent < 100) {
                return (
                  <div key={m.id}>
                    <div className="text-xl font-bold text-white">{m.title}</div>
                    <div className="text-slate-400 text-sm">{m.week} • {m.dateRange}</div>
                  </div>
                );
              }
              return null;
            }).find(Boolean) || <div className="text-green-400 text-xl font-bold">All Complete! 🎉</div>}
          </div>

          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400">Team</span>
              <Users className="text-green-400" size={20} />
            </div>
            <div className="space-y-1">
              {projectData.team.map((member, i) => (
                <div key={i} className="text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  {member}
                </div>
              ))}
            </div>
            <div className="text-slate-500 text-sm mt-2">Supervisor: {projectData.supervisor}</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Milestones & Tasks */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar size={24} />
              Project Milestones
            </h2>
            
            {milestones.map(milestone => {
              const progress = getMilestoneProgress(milestone);
              const isExpanded = expandedMilestones[milestone.id];
              
              return (
                <div key={milestone.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer hover:bg-slate-750 transition-colors"
                    onClick={() => setExpandedMilestones({ ...expandedMilestones, [milestone.id]: !isExpanded })}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isExpanded ? <ChevronDown className="text-slate-400" size={20} /> : <ChevronRight className="text-slate-400" size={20} />}
                        <div>
                          <div className="font-semibold text-white">{milestone.title}</div>
                          <div className="text-slate-400 text-sm">{milestone.titleKr} • {milestone.week}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-sm">{progress.done}/{progress.total}</span>
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${progress.percent === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                        {progress.percent === 100 && <CheckCircle2 className="text-green-400" size={20} />}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-700 pt-3">
                      <div className="text-slate-500 text-xs mb-3">{milestone.dateRange}</div>
                      <div className="space-y-2">
                        {milestone.tasks.map(task => (
                          <div key={task.id} className="flex items-center gap-3 group">
                            <button 
                              onClick={() => toggleTask(milestone.id, task.id)}
                              className="flex-shrink-0"
                            >
                              {task.done ? 
                                <CheckCircle2 className="text-green-400" size={20} /> : 
                                <Circle className="text-slate-500 hover:text-blue-400" size={20} />
                              }
                            </button>
                            <span className={`flex-grow ${task.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                              {task.text}
                            </span>
                            <button 
                              onClick={() => deleteTask(milestone.id, task.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        
                        {/* Add new task */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700">
                          <input
                            type="text"
                            placeholder="Add new task..."
                            value={newTaskText[milestone.id] || ""}
                            onChange={(e) => setNewTaskText({ ...newTaskText, [milestone.id]: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && addTask(milestone.id)}
                            className="flex-grow bg-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button 
                            onClick={() => addTask(milestone.id)}
                            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Key Dates */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-yellow-400" />
                Key Dates
              </h3>
              <div className="space-y-3">
                {keyDates.map((item, i) => {
                  const date = new Date(item.date);
                  const isPast = date < today;
                  const isUpcoming = date > today && date < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  
                  return (
                    <div key={i} className={`flex items-start gap-3 ${isPast ? 'opacity-50' : ''}`}>
                      <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                        item.type === 'deadline' ? 'bg-red-500' :
                        item.type === 'meeting' ? 'bg-yellow-500' :
                        item.type === 'report' ? 'bg-blue-500' :
                        item.type === 'presentation' ? 'bg-purple-500' :
                        'bg-slate-500'
                      }`} />
                      <div>
                        <div className={`text-sm ${isUpcoming ? 'text-yellow-400 font-semibold' : 'text-white'}`}>
                          {item.event}
                        </div>
                        <div className="text-slate-500 text-xs">
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Notes */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Team Notes</h3>
                {isEditingNotes ? (
                  <div className="flex gap-2">
                    <button onClick={saveNotes} className="text-green-400 hover:text-green-300">
                      <Save size={18} />
                    </button>
                    <button onClick={() => setIsEditingNotes(false)} className="text-red-400 hover:text-red-300">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditingNotes(true)} className="text-slate-400 hover:text-white">
                    <Edit2 size={18} />
                  </button>
                )}
              </div>
              {isEditingNotes ? (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add team notes, blockers, ideas..."
                  className="w-full h-40 bg-slate-700 text-white p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              ) : (
                <div className="text-slate-300 text-sm whitespace-pre-wrap min-h-[100px]">
                  {notes || <span className="text-slate-500 italic">Click edit to add notes...</span>}
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-5 border border-slate-600">
              <h3 className="text-lg font-bold text-white mb-3">📍 Location</h3>
              <div className="text-slate-300 text-sm space-y-1">
                <div>PNU V-Space (Makerspace)</div>
                <div>School of Mechanical Engineering</div>
                <div>Pusan National University</div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-600">
                <div className="text-slate-400 text-xs">Supervisor Contact</div>
                <div className="text-white">Prof. Seokyoung Ahn</div>
                <div className="text-slate-400 text-sm">sahn@pusan.ac.kr</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          CESI La Rochelle × PNU V-Space Internship Project 2026
        </div>
      </div>
    </div>
  );
}
