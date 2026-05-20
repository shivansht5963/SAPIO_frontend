import { VISIT_STATUS, RISK_LEVELS } from '../utils/constants';

const mockVisits = [
  {
    id: 1,
    taskId: 1,
    taskTitle: 'Main Grid Substation Repair',
    startedBy: 2,
    startedByName: 'Sarah Jenkins',
    status: VISIT_STATUS.COMPLETED,
    startTime: '2026-05-20T09:00:00Z',
    endTime: '2026-05-20T13:30:00Z',
    visitNotes: 'Routine check completed. Slight hum noticed near Bay C, but thermals were within normal operating parameters at the time. Flagged for secondary review.',
    aiSummary: 'Correlation detected between current voltage anomaly and Sarah Jenkins\' note regarding audible hum in Bay C. High probability of degrading dielectric fluid or localized coil fault.',
    aiRecommendation: 'Bring portable thermal imaging unit (FLIR). Pre-authorize bypass routing for Sector 4 to minimize downtime during inspection.',
    aiRiskFlag: RISK_LEVELS.HIGH,
    createdAt: '2026-05-20T09:00:00Z',
  },
  {
    id: 2,
    taskId: 3,
    taskTitle: 'Routine Equipment Maintenance',
    startedBy: 6,
    startedByName: 'David Miller',
    status: VISIT_STATUS.COMPLETED,
    startTime: '2026-05-20T10:00:00Z',
    endTime: '2026-05-20T12:15:00Z',
    visitNotes: 'All equipment checked and cataloged. Three voltage meters need calibration. Two safety harnesses past expiry — flagged for replacement.',
    aiSummary: 'Standard maintenance findings. Equipment in overall good condition with minor items requiring attention.',
    aiRecommendation: 'Schedule calibration for voltage meters within 7 days. Replace expired safety harnesses before next field deployment.',
    aiRiskFlag: RISK_LEVELS.LOW,
    createdAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 3,
    taskId: 9,
    taskTitle: 'Pipeline Integrity Assessment',
    startedBy: 4,
    startedByName: 'John Doe',
    status: VISIT_STATUS.COMPLETED,
    startTime: '2026-05-19T09:00:00Z',
    endTime: '2026-05-19T14:00:00Z',
    visitNotes: 'Ultrasonic testing completed on 12km stretch. Found wall thinning at junction J-7 (from 8mm to 5.2mm). Corrosion pattern suggests external factors. Soil samples taken for lab analysis.',
    aiSummary: 'Critical wall thinning detected at J-7 junction exceeding safe operating thresholds. Rate of degradation suggests 6-8 month timeline before intervention required.',
    aiRecommendation: 'Immediate follow-up inspection at J-7. Consider cathodic protection upgrade. Schedule repair window within 3 months.',
    aiRiskFlag: RISK_LEVELS.HIGH,
    createdAt: '2026-05-19T09:00:00Z',
  },
  {
    id: 4,
    taskId: 2,
    taskTitle: 'Fiber Optic Line Splicing',
    startedBy: 3,
    startedByName: 'Mike Chen',
    status: VISIT_STATUS.STARTED,
    startTime: '2026-05-20T14:00:00Z',
    endTime: null,
    visitNotes: '',
    aiSummary: '',
    aiRecommendation: '',
    aiRiskFlag: RISK_LEVELS.LOW,
    createdAt: '2026-05-20T14:00:00Z',
  },
  {
    id: 5,
    taskId: 8,
    taskTitle: 'Security Camera Network Overhaul',
    startedBy: 8,
    startedByName: 'Elena Rostova',
    status: VISIT_STATUS.STARTED,
    startTime: '2026-05-20T11:00:00Z',
    endTime: null,
    visitNotes: '',
    aiSummary: '',
    aiRecommendation: '',
    aiRiskFlag: RISK_LEVELS.LOW,
    createdAt: '2026-05-20T11:00:00Z',
  },
  {
    id: 6,
    taskId: 4,
    taskTitle: 'Emergency Generator Audit',
    startedBy: 5,
    startedByName: 'Elena Rodriguez',
    status: VISIT_STATUS.COMPLETED,
    startTime: '2026-05-20T08:30:00Z',
    endTime: '2026-05-20T14:00:00Z',
    visitNotes: 'Completed audit of 5 generator units. Unit G3 failed auto-start test — control board issue. Fuel levels adequate across all units except G5 (30% remaining).',
    aiSummary: 'One critical failure identified in generator G3 auto-start sequence. Fuel management requires attention for unit G5.',
    aiRecommendation: 'Replace control board on G3 immediately — this is a critical backup system. Refuel G5 within 48 hours. Schedule next audit for 30 days.',
    aiRiskFlag: RISK_LEVELS.MEDIUM,
    createdAt: '2026-05-20T08:30:00Z',
  },
];

export default mockVisits;

export function getVisitsByTaskId(taskId) {
  return mockVisits.filter(v => v.taskId === taskId);
}

export function getVisitById(id) {
  return mockVisits.find(v => v.id === id);
}
