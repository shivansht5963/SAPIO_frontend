const mockDashboard = {
  stats: {
    activeTasks: {
      value: 142,
      trend: '+12%',
      trendLabel: 'from yesterday',
      trendDirection: 'up',
    },
    techniciansAvailable: {
      value: 38,
      subtitle: 'Out of 50 total',
    },
    completionRate: {
      value: 94,
      unit: '%',
      progressBar: true,
    },
    highRiskFlags: {
      value: 7,
      subtitle: 'Requires immediate attention',
    },
  },
  criticalTasks: [
    {
      id: 1,
      taskId: 'TSK-8901',
      title: 'Main Grid Substation Repair',
      assignee: 'Sarah Jenkins',
      status: 'overdue',
    },
    {
      id: 2,
      taskId: 'TSK-8902',
      title: 'Fiber Optic Line Splicing',
      assignee: 'Mike Chen',
      status: 'in_progress',
    },
    {
      id: 3,
      taskId: 'TSK-8903',
      title: 'Routine Equipment Maintenance',
      assignee: 'David Miller',
      status: 'completed',
    },
    {
      id: 4,
      taskId: 'TSK-8904',
      title: 'Emergency Generator Audit',
      assignee: 'Elena Rodriguez',
      status: 'in_progress',
    },
  ],
  recentActivity: [
    {
      id: 1,
      user: 'John Doe',
      action: 'updated task status to In Progress',
      timestamp: '2026-05-20T14:32:01Z',
    },
    {
      id: 2,
      user: 'System',
      action: 'auto-assigned asset to Sarah Jenkins',
      timestamp: '2026-05-20T14:15:44Z',
    },
    {
      id: 3,
      user: 'David Miller',
      action: 'completed visit for Equipment Maintenance',
      timestamp: '2026-05-20T12:15:00Z',
    },
    {
      id: 4,
      user: 'Elena Rostova',
      action: 'started visit for Camera Network Overhaul',
      timestamp: '2026-05-20T11:00:00Z',
    },
    {
      id: 5,
      user: 'Admin User',
      action: 'created Emergency Substation Audit task',
      timestamp: '2026-05-20T08:00:00Z',
    },
  ],
};

export default mockDashboard;
