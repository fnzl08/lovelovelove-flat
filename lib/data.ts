export type Partner = {
  id: string;
  name: string;
  mbti: string;
  animal: string;
  birth: { date: string; time: string; place: string };
  chart: Record<string, string>;
  romanceStyle: string;
  attraction: string;
  compatibility: { chemistry: number; stability: number; communication: number; timing: number; trust: number };
  notes: string[];
};

export const userProfile = {
  name: '희재',
  mbti: 'ENFP',
  birth: { date: '1991-09-23', time: '12:25', place: 'Daegu, KR' },
  summary:
    '분석적 디테일과 감성적 직관이 강하게 공존하는 타입. 사회적 매력은 밝고 장난스럽지만, 관계의 본질과 진정성을 매우 예민하게 본다. 연애에서는 설렘을 빠르게 감지하지만, 실제로는 상대의 태도·일관성·존중 여부를 오래 관찰한 뒤에 마음을 깊게 건다.',
  chart: {
    asc: '사수자리 15° · ASC',
    sun: '처녀자리 29° · 10H',
    moon: '물고기자리 20° · 4H',
    mercury: '처녀자리 20° · 10H',
    venus: '사자자리 22° · 9H',
    mars: '천칭자리 14° · 11H',
    jupiter: '처녀자리 2° · 10H',
    saturn: '물병자리 0° Rx · 3H',
  },
  notes: [
    'Sun opposite Moon: 이성과 감성의 당김-밀림. 스스로도 마음의 결론이 늦어질 수 있음.',
    'Sun trine Saturn: 관계를 가볍게 소비하지 않고, 결국 책임감과 현실성으로 귀결됨.',
    'Venus in 사자자리 square Pluto: 사랑은 크고 뜨겁지만, 권력감·집착·확신 욕구를 경계할 필요.',
    'Mars in 천칭자리: 직접적인 공격성보다 관계의 균형과 분위기를 중요시함.',
    'Fortune in 쌍둥이자리 7H: 말, 연락, 타이밍, 상호작용이 관계 운의 핵심 매개체.',
  ],
};

export const partners: Partner[] = [];

export const monthSeries = [
  { day: '4/01', romance: 71, contact: 62 },
  { day: '4/05', romance: 76, contact: 68 },
  { day: '4/09', romance: 73, contact: 59 },
  { day: '4/13', romance: 81, contact: 74 },
  { day: '4/17', romance: 79, contact: 70 },
  { day: '4/21', romance: 85, contact: 77 },
  { day: '4/25', romance: 75, contact: 64 },
  { day: '4/29', romance: 82, contact: 71 },
];

export const weekSeries = [
  { day: 'Mon', contact: 58 },
  { day: 'Tue', contact: 64 },
  { day: 'Wed', contact: 71 },
  { day: 'Thu', contact: 67 },
  { day: 'Fri', contact: 74 },
  { day: 'Sat', contact: 61 },
  { day: 'Sun', contact: 55 },
];

export const calendarScores = [
  { day: 1, score: 71 }, { day: 2, score: 69 }, { day: 3, score: 73 },
  { day: 4, score: 75 }, { day: 5, score: 76 }, { day: 6, score: 68 },
  { day: 7, score: 66 }, { day: 8, score: 72 }, { day: 9, score: 73 },
  { day: 10, score: 74 }, { day: 11, score: 77 }, { day: 12, score: 80 },
  { day: 13, score: 81 }, { day: 14, score: 78 }, { day: 15, score: 76 },
  { day: 16, score: 74 }, { day: 17, score: 79 }, { day: 18, score: 82 },
  { day: 19, score: 83 }, { day: 20, score: 81 }, { day: 21, score: 85 },
  { day: 22, score: 84 }, { day: 23, score: 80 }, { day: 24, score: 78 },
  { day: 25, score: 75 }, { day: 26, score: 76 }, { day: 27, score: 79 },
  { day: 28, score: 81 }, { day: 29, score: 82 }, { day: 30, score: 84 },
];

export const eventLogs: { date: string; partner: string; tag: string; text: string }[] = [];
