export type PerformanceRecord = {
  date: string;
  assessmentTest: 'jump-height' | 'sit-ups' | 'run-time' | 'squats' | 'lunges' | 'push-ups';
  score: number;
  age: number;
  gender: 'male' | 'female';
};

export const mockPerformanceData: PerformanceRecord[] = [
  { date: '2024-01-15', assessmentTest: 'jump-height', score: 0.52, age: 22, gender: 'male' },
  { date: '2024-01-20', assessmentTest: 'sit-ups', score: 58, age: 22, gender: 'male' },
  { date: '2024-01-25', assessmentTest: 'squats', score: 50, age: 22, gender: 'male' },
  { date: '2024-02-10', assessmentTest: 'run-time', score: 4.7, age: 22, gender: 'male' },
  { date: '2024-02-12', assessmentTest: 'push-ups', score: 40, age: 22, gender: 'male' },
  { date: '2024-02-18', assessmentTest: 'jump-height', score: 0.55, age: 22, gender: 'male' },
  { date: '2024-02-22', assessmentTest: 'lunges', score: 35, age: 22, gender: 'male' },
  { date: '2024-03-05', assessmentTest: 'sit-ups', score: 62, age: 22, gender: 'male' },
  { date: '2024-03-15', assessmentTest: 'squats', score: 55, age: 22, gender: 'male' },
  { date: '2024-03-22', assessmentTest: 'run-time', score: 4.65, age: 22, gender: 'male' },
  { date: '2024-04-12', assessmentTest: 'jump-height', score: 0.58, age: 23, gender: 'male' },
  { date: '2024-04-18', assessmentTest: 'push-ups', score: 45, age: 23, gender: 'male' },
  { date: '2024-04-25', assessmentTest: 'sit-ups', score: 65, age: 23, gender: 'male' },
  { date: '2024-05-02', assessmentTest: 'lunges', score: 40, age: 23, gender: 'male' },
  { date: '2024-05-15', assessmentTest: 'run-time', score: 4.6, age: 23, gender: 'male' },
  { date: '2024-05-20', assessmentTest: 'squats', score: 60, age: 23, gender: 'male' },
  { date: '2024-05-28', assessmentTest: 'jump-height', score: 0.60, age: 23, gender: 'male' },
  { date: '2024-06-10', assessmentTest: 'sit-ups', score: 68, age: 23, gender: 'male' },
  { date: '2024-06-15', assessmentTest: 'push-ups', score: 50, age: 23, gender: 'male' },
  { date: '2024-06-25', assessmentTest: 'run-time', score: 4.55, age: 23, gender: 'male' },
];


export type LeaderboardEntry = {
    rank: number;
    athleteName: string;
    saiId: string;
    score: number;
    avatar: string;
};

export const mockLeaderboardData: LeaderboardEntry[] = [
    { rank: 1, athleteName: 'Rohan Sharma', saiId: 'SAI-12345', score: 98.5, avatar: 'https://picsum.photos/seed/leader1/100/100' },
    { rank: 2, athleteName: 'Priya Singh', saiId: 'SAI-23456', score: 97.2, avatar: 'https://picsum.photos/seed/leader2/100/100' },
    { rank: 3, athleteName: 'Amit Patel', saiId: 'SAI-34567', score: 96.8, avatar: 'https://picsum.photos/seed/leader3/100/100' },
    { rank: 4, athleteName: 'Athlete 123', saiId: 'SAI-98765', score: 95.5, avatar: 'https://picsum.photos/seed/athlete/100/100' },
    { rank: 5, athleteName: 'Sneha Reddy', saiId: 'SAI-45678', score: 94.1, avatar: 'https://picsum.photos/seed/leader4/100/100' },
    { rank: 6, athleteName: 'Vikram Kumar', saiId: 'SAI-56789', score: 93.9, avatar: 'https://picsum.photos/seed/leader5/100/100' },
    { rank: 7, athleteName: 'Anjali Desai', saiId: 'SAI-67890', score: 92.7, avatar: 'https://picsum.photos/seed/leader6/100/100' },
    { rank: 8, athleteName: 'Karan Mehta', saiId: 'SAI-78901', score: 91.3, avatar: 'https://picsum.photos/seed/leader7/100/100' },
    { rank: 9, athleteName: 'Neha Gupta', saiId: 'SAI-89012', score: 90.8, avatar: 'https://picsum.photos/seed/leader8/100/100' },
    { rank: 10, athleteName: 'Arjun Nair', saiId: 'SAI-90123', score: 89.6, avatar: 'https://picsum.photos/seed/leader9/100/100' },
];

export type Badge = {
    id: string;
    name: string;
    description: string;
    icon: string;
    isEarned: boolean;
};

export const mockBadgesData: Badge[] = [
    { id: 'first-assessment', name: 'First Step', description: 'Complete your first performance assessment.', icon: 'Footprints', isEarned: true },
    { id: 'perfect-form', name: 'Form Master', description: 'Achieve perfect form in a posture correction session.', icon: 'PersonStanding', isEarned: true },
    { id: 'top-performer', name: 'Top Performer', description: 'Reach the top 10% in any benchmark.', icon: 'Trophy', isEarned: true },
    { id: 'consistent-effort', name: 'Consistent Effort', description: 'Complete assessments for 3 consecutive weeks.', icon: 'CalendarCheck', isEarned: false },
    { id: 'goal-oriented', name: 'Goal Getter', description: 'Generate your first personalized AI plan.', icon: 'BrainCircuit', isEarned: true },
    { id: 'mindful-athlete', name: 'Mindful Athlete', description: 'Use the mental wellness journal for 5 days.', icon: 'Heart', isEarned: false },
    { id: 'peak-power', name: 'Peak Power', description: 'Achieve a top-tier score in the vertical jump test.', icon: 'Zap', isEarned: false },
    { id: 'endurance-engine', name: 'Endurance Engine', description: 'Excel in the sit-ups or run-time test.', icon: 'Flame', isEarned: true },
    { id: 'quick-learner', name: 'Quick Learner', description: 'Use the AI chatbot for the first time.', icon: 'Bot', isEarned: true },
    { id: 'ar-visionary', name: 'AR Visionary', description: 'Engage with the next generation of athlete tech.', icon: 'ScanFace', isEarned: false },
];

export type CommunityChallenge = {
    id: string;
    title: string;
    description: string;
    goal: number;
    currentProgress: number;
    unit: string;
    daysLeft: number;
    participants: number;
    status: 'active' | 'completed';
    isJoined: boolean;
};

export const mockCommunityChallenges: CommunityChallenge[] = [
    { id: 'pushup-challenge', title: 'The 100k Push-up Challenge', description: 'Join athletes across SAI to collectively complete 100,000 push-ups.', goal: 100000, currentProgress: 75234, unit: 'push-ups', daysLeft: 12, participants: 482, status: 'active', isJoined: true },
    { id: 'squat-a-thon', title: 'Squat-a-Thon', description: 'How many squats can our community do in a month? Let\'s find out!', goal: 250000, currentProgress: 112890, unit: 'squats', daysLeft: 20, participants: 612, status: 'active', isJoined: false },
    { id: 'mindful-may', title: 'Mindful May', description: 'Complete a journal entry every day for the month of May to build a habit of mindfulness.', goal: 10000, currentProgress: 10000, unit: 'entries', daysLeft: 0, participants: 350, status: 'completed', isJoined: true },
    { id: 'vertical-leap', title: 'Vertical Leap', description: 'Collectively add 5,000 meters to our total jump height.', goal: 5000, currentProgress: 2890, unit: 'meters', daysLeft: 15, participants: 250, status: 'active', isJoined: false },
    { id: 'run-the-distance', title: 'Run the Distance', description: 'A community challenge to collectively run 10,000 kilometers.', goal: 10000, currentProgress: 10000, unit: 'km', daysLeft: 0, participants: 850, status: 'completed', isJoined: false },
];
