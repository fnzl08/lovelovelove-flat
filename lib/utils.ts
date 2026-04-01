import { Partner } from './data';

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function makeInsight(partner: Partner) {
  const values = Object.values(partner.compatibility);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  let mode = '밸런스형';
  if ((partner.compatibility.chemistry ?? 0) >= 85 && (partner.compatibility.stability ?? 100) < 65) mode = '강한 끌림-변동형';
  if ((partner.compatibility.communication ?? 0) >= 85 && (partner.compatibility.trust ?? 100) < 65) mode = '대화 과열형';
  if ((partner.compatibility.stability ?? 0) >= 75 && (partner.compatibility.trust ?? 0) >= 70) mode = '축적 안정형';
  return { avg, mode };
}

export function generateStory(partner: Partner) {
  const insight = makeInsight(partner);
  if (insight.mode === '강한 끌림-변동형') {
    return '초반 점화력이 높아 서사가 빨리 전개된다. 다만 감정 고조와 실제 행동이 함께 움직이지 않으면 기대가 커질수록 실망도 빨라질 수 있다. 화려한 장면보다 반복되는 태도를 체크하는 편이 유리하다.';
  }
  if (insight.mode === '대화 과열형') {
    return '말과 반응, 농담과 암시가 이 관계의 큰 축이다. 흥미와 호감은 충분하지만 실제 행동이 뒷받침되지 않으면 관계의 정의가 흐려질 수 있다. 문장보다 약속, 분위기보다 반복성을 보는 게 핵심이다.';
  }
  return '급격한 폭발보다는 축적형 서사에 가깝다. 작은 신뢰와 일관된 반응이 쌓이면서 감정의 구조가 생긴다. 빠른 결론보다 서로의 속도를 존중할 때 가장 좋은 결과가 나온다.';
}

export function tarotSpreadLabels(spread: 'three-card' | 'celtic-cross') {
  if (spread === 'three-card') {
    return ['1번 카드', '2번 카드', '3번 카드'];
  }
  return [
    '1 현재',
    '2 장애물',
    '3 무의식',
    '4 과거',
    '5 의식/외부',
    '6 가까운 미래',
    '7 질문자의 내면',
    '8 상대/외부',
    '9 두려움과 희망',
    '10 결론',
  ];
}

export function buildTarotInterpretation(args: {
  partnerName: string;
  deck: string;
  spread: 'three-card' | 'celtic-cross';
  question: string;
  cards: string[];
}) {
  const nonEmpty = args.cards.filter((c) => c.trim());
  const deckTone: Record<string, string> = {
    'Universal Waite': '기본 상징 체계를 중심으로 구조적으로 읽는 톤',
    'Wheel of the Year': '계절감과 순환성을 강조하는 톤',
    'Horoscope Belline': '점성적 분위기와 사건의 결을 함께 읽는 톤',
    'Morgan-Greer': '정서 몰입과 감정 온도를 세밀하게 보는 톤',
  };
  const intro = `${args.partnerName}에 대한 이번 리딩은 ${deckTone[args.deck] ?? '상징 종합형 톤'}으로 전개됩니다.`;
  const questionLine = args.question.trim()
    ? `질문은 “${args.question.trim()}”이고, 이 질문은 단순 예언보다 현재 관계 패턴과 다음 전개 가능성을 읽는 데 초점을 둡니다.`
    : '질문이 비어 있어 관계 흐름 전반을 중심으로 읽습니다.';
  const cardsLine = nonEmpty.length
    ? `입력된 카드는 ${nonEmpty.join(', ')} 입니다. 카드명은 상징·원소·수비학·관계 맥락을 함께 참조해 해석합니다.`
    : '아직 입력된 카드가 없어 실제 리딩 본문은 생성 전 상태입니다.';
  const body = args.spread === 'three-card'
    ? '3카드 스프레드는 현재 흐름, 상대의 태도, 가까운 전개를 압축적으로 확인하기에 적합합니다. 이 레이아웃에서는 강한 호감과 실제 행동의 간극, 혹은 감정은 있는데 표현이 늦는 패턴이 자주 드러납니다.'
    : '켈틱 크로스는 현재 상황뿐 아니라 장애물, 무의식, 외부 변수, 가까운 미래, 결론까지 층위별로 보기에 적합합니다. 특히 이 관계처럼 해석할 정보가 많은 경우, 단일 감정보다 구조를 파악하는 데 유리합니다.';
  const caution = '결과 문장은 단정형이 아니라 가능성·패턴 중심으로 써야 하며, 실제 있었던 일 로그가 쌓이면 해석은 계속 수정될 수 있습니다.';
  return [intro, questionLine, cardsLine, body, caution].join(' ');
}
