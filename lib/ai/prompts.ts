import { userProfile } from '@/lib/data';
import type { AiRequestPayload, TarotPayload, PartnerStoryPayload, AspectAnalysisPayload, EventLogPayload } from './types';

export function buildSystemPrompt(): string {
  const chart = Object.entries(userProfile.chart)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');
  const notes = userProfile.notes.join('\n- ');

  return `당신은 점성술과 타로에 능숙한 감성적 연애 리더입니다. 항상 같은 목소리와 톤으로 말합니다.

[사용자 프로필]
이름: ${userProfile.name}
MBTI: ${userProfile.mbti}
생년월일: ${userProfile.birth.date} ${userProfile.birth.time} (${userProfile.birth.place})
네이탈 차트: ${chart}
핵심 애스팩트 메모:
- ${notes}

[응답 규칙]
- 항상 한국어로 답변합니다.
- 단정형 예언("~할 것이다", "~이다")이 아닌 가능성·패턴 언어("~일 수 있다", "~하는 경향이 보인다", "~로 읽힌다")를 씁니다.
- 좋다/나쁘다 이분법을 피하고, 매력·안정성·소통·타이밍·신뢰를 구분해서 봅니다.
- 감성적이되 지나치게 신비주의적이지 않게, 실용적인 인사이트를 담습니다.
- 마크다운(**, ##, - 등) 없이 자연스러운 문장형 단락으로 작성합니다.
- 200~400자 사이로 간결하게 유지합니다.`;
}

export function buildUserMessage(payload: AiRequestPayload): string {
  switch (payload.feature) {
    case 'tarot':
      return buildTarotMessage(payload);
    case 'partnerStory':
      return buildPartnerStoryMessage(payload);
    case 'aspectAnalysis':
      return buildAspectAnalysisMessage(payload);
    case 'eventLog':
      return buildEventLogMessage(payload);
  }
}

function buildTarotMessage(p: TarotPayload): string {
  const cardLines = p.spreadLabels
    .map((label, i) => `${label}: ${p.cards[i]?.trim() || '(미입력)'}`)
    .join('\n');

  const chartSummary = Object.entries(p.partnerChart)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  const compatSummary = Object.entries(p.partnerCompatibility)
    .map(([k, v]) => `${k} ${v}`)
    .join(', ');

  return `타로 리딩 요청입니다.

상대: ${p.partnerName}${p.partnerMbti ? ` (${p.partnerMbti})` : ''}
${chartSummary ? `상대 차트: ${chartSummary}` : ''}
${compatSummary ? `궁합 수치: ${compatSummary}` : ''}

사용 덱: ${p.deck}
스프레드: ${p.spread === 'three-card' ? '3카드' : '켈틱 크로스'}
질문: ${p.question.trim() || '(질문 없음 — 관계 흐름 전반을 중심으로 읽어주세요)'}

카드 배치:
${cardLines}

위 정보를 바탕으로 이 관계의 현재 패턴과 흐름을 해석해주세요. 선택된 덱(${p.deck})의 분위기를 반영해 읽어주세요.`;
}

function buildPartnerStoryMessage(p: PartnerStoryPayload): string {
  const chartSummary = Object.entries(p.partnerChart)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  const compatSummary = Object.entries(p.partnerCompatibility)
    .map(([k, v]) => `${k} ${v}`)
    .join(', ');

  const eventsText = p.recentEvents.length > 0
    ? p.recentEvents.map((e) => `[${e.date}] ${e.tag}: ${e.text}`).join('\n')
    : '(기록된 일화 없음)';

  const notesText = p.partnerNotes.length > 0
    ? p.partnerNotes.join(', ')
    : '(메모 없음)';

  return `파트너 스토리 해석 요청입니다.

상대: ${p.partnerName}${p.partnerMbti ? ` (${p.partnerMbti})` : ''}
${chartSummary ? `상대 차트: ${chartSummary}` : ''}
${compatSummary ? `궁합 수치: ${compatSummary}` : ''}
메모: ${notesText}

최근 일화:
${eventsText}

이 관계의 전체 서사를 분석해주세요. 궁합 패턴, 두 사람의 차트가 만들어내는 역학, 현재 흐름의 특징을 중심으로 읽어주세요.`;
}

function buildAspectAnalysisMessage(p: AspectAnalysisPayload): string {
  const chartSummary = Object.entries(p.partnerChart)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const notesText = p.partnerNotes.length > 0
    ? p.partnerNotes.join('\n- ')
    : '';

  return `애스팩트 분석 요청입니다.

상대: ${p.partnerName}
${chartSummary ? `상대 차트:\n${chartSummary}` : '(차트 정보 없음)'}
${notesText ? `\n상대 메모:\n- ${notesText}` : ''}

나의 네이탈 차트와 ${p.partnerName}의 차트를 비교해서, 두 차트 사이에서 읽히는 핵심 시너지와 긴장 포인트를 분석해주세요. 실용적인 관계 인사이트를 중심으로 해주세요.`;
}

function buildEventLogMessage(p: EventLogPayload): string {
  const compatSummary = Object.entries(p.partnerCompatibility)
    .map(([k, v]) => `${k} ${v}`)
    .join(', ');

  return `일화 로그 해석 요청입니다.

상대: ${p.partnerName}
${compatSummary ? `궁합 수치: ${compatSummary}` : ''}

새로운 일화 [${p.eventTag}]:
${p.eventText}

이 일화를 관계 패턴의 맥락에서 재해석해주세요. 단순한 사건 설명이 아니라, 이 일이 두 사람의 관계 흐름에서 어떤 의미를 가질 수 있는지 인사이트를 주세요.`;
}
