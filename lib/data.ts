export type Partner = {
  id: string;
  name: string;
  mbti: string;
  animal: string;
  avatarEmoji: string;
  birth: { date: string; time: string; place: string };
  chart: Record<string, string>;
  romanceStyle: string;
  attraction: string;
  compatibility: Record<string, number>;
  notes: string[];
};

export const userProfile = {
  name: '희재',
  appName: 'Love!Love!Love!',
  mbti: 'ENFP',
  birth: { date: '1991-09-23', time: '12:25', place: 'Daegu, KR' },
  summary:
    '분석적 디테일과 감성적 직관이 동시에 강한 타입. 겉으로는 사랑스럽고 장난스럽지만, 실제 연애에서는 태도·일관성·존중을 매우 세밀하게 본다. 설렘은 빠르게 느끼지만 깊이 들어갈수록 객관적인 근거를 찾으려는 편이다.',
  chart: {
    asc: 'Sagittarius 15°04’',
    sun: 'Virgo 29°37’ · 10H',
    moon: 'Pisces 20°01’ · 4H',
    mercury: 'Virgo 20°47’ · 10H',
    venus: 'Leo 22°45’ · 9H',
    mars: 'Libra 14°13’ · 11H',
    jupiter: 'Virgo 2°16’ · 10H',
    saturn: 'Aquarius 0°18’ Rx · 3H',
  },
  notes: [
    'Sun opposite Moon: 이성과 감성이 서로를 견제하면서도 관계 해석을 깊게 만든다.',
    'Sun trine Saturn: 감정이 커도 결국 책임감과 현실성으로 귀결된다.',
    'Venus square Pluto: 관계 몰입도가 높고 확신 욕구가 강해질 수 있다.',
    'Mars in Libra: 공격보다 관계의 균형과 합의를 중요시한다.',
    'Fortune in Gemini 7H: 연락, 타이밍, 상호작용의 리듬이 연애 운의 핵심이다.',
  ],
};

export const partners: Partner[] = [
  {
    id: 'p1',
    name: '민준',
    mbti: 'INTJ',
    animal: 'Snow Fox',
    avatarEmoji: '🦊',
    birth: { date: '1990-11-14', time: '21:10', place: 'Seoul, KR' },
    chart: { sun: 'Scorpio 22° · 5H', moon: 'Taurus 7° · 11H', venus: 'Sagittarius 3° · 6H', mars: 'Capricorn 11° · 7H', asc: 'Cancer' },
    romanceStyle: '감정은 깊고 느리게 열리지만, 시작되면 통제력과 책임감이 동시에 강해지는 타입. 상대를 시험하듯 관찰하는 경향이 있어 초반 템포는 느릴 수 있다.',
    attraction: '자기 세계가 분명하면서도 감정적 허세가 없는 사람에게 끌린다. 표현보다 일관성, 호들갑보다 진심을 선호한다.',
    compatibility: { chemistry: 84, stability: 72, communication: 67, timing: 78, trust: 70 },
    notes: [
      '너의 Venus in Leo와 그의 Scorpio Sun은 자극과 몰입을 강하게 만든다.',
      '확신이 생기기 전에는 견제와 해석 과잉이 발생하기 쉽다.',
      '연락은 감정 폭발형보다 짧아도 일관된 리듬형이 더 잘 맞는다.',
    ],
  },
  {
    id: 'p2',
    name: '도윤',
    mbti: 'ENTP',
    animal: 'Otter',
    avatarEmoji: '🦦',
    birth: { date: '1993-05-03', time: '08:40', place: 'Busan, KR' },
    chart: { sun: 'Taurus 12° · 1H', moon: 'Gemini 17° · 2H', venus: 'Aries 29° · 12H', mars: 'Leo 14° · 4H', asc: 'Taurus' },
    romanceStyle: '반응이 빠르고 재치가 좋아 썸의 점화력은 높다. 다만 감정보다 흥미를 먼저 따라가므로 관계 깊이가 붙기 전까진 변동성이 있다.',
    attraction: '표현력이 좋고, 대화 핑퐁이 빠르며, 함께 놀 수 있는 사람에게 강하게 끌린다.',
    compatibility: { chemistry: 88, stability: 58, communication: 91, timing: 69, trust: 61 },
    notes: [
      'Gemini 7H Fortune과 잘 맞아 대화·연락의 재미는 높다.',
      '장기적 확정감은 따로 확인해야 한다.',
      '재미있는 시작과 깊이 있는 지속은 다른 문제다.',
    ],
  },
];

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

export const eventLogs = [
  { date: '2026-03-26', partner: '민준', tag: '연락', text: '밤에 갑자기 연락이 와서 40분 정도 길게 대화함. 일 얘기에서 시작해서 꽤 사적인 이야기까지 넘어감.' },
  { date: '2026-03-29', partner: '민준', tag: '만남', text: '짧게 커피를 마셨는데 표정은 차분했지만 질문이 많았고 관찰하는 느낌이 강했음.' },
  { date: '2026-03-30', partner: '도윤', tag: '썸', text: '농담 섞인 연락 빈도는 높았지만 약속 확정은 미뤄짐.' },
];

export const calendarScores = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  score: [68, 71, 66, 72, 75, 77, 64, 69, 74, 73, 79, 82, 78, 76, 81, 84, 72, 70, 74, 80, 85, 83, 77, 71, 69, 74, 79, 82, 84, 78][i],
}));
