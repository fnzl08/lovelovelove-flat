'use client';
import type { Partner } from './data';

type AvatarColors = { body: string; accent: string; iris: string; inner: string };

// 원소별 색 팔레트
function getColors(sunSign: string): AvatarColors {
  if (/양자리|사자자리|사수자리|aries|leo|sagittarius/i.test(sunSign))
    return { body: '#c4856a', accent: '#a06348', iris: '#fbbf24', inner: '#fff0e0' };
  if (/황소자리|처녀자리|염소자리|taurus|virgo|capricorn/i.test(sunSign))
    return { body: '#8fa870', accent: '#6e8752', iris: '#6ee7b7', inner: '#f0f7e6' };
  if (/쌍둥이자리|천칭자리|물병자리|gemini|libra|aquarius/i.test(sunSign))
    return { body: '#90b0cc', accent: '#6890ae', iris: '#c084fc', inner: '#e8f4ff' };
  // Water signs (Cancer, Scorpio, Pisces)
  return { body: '#7b88b8', accent: '#5a6898', iris: '#93c5fd', inner: '#e0e8ff' };
}

// MBTI → 동물 매핑
export function getAvatarAnimal(mbti: string, sunSign = ''): 'fox' | 'rabbit' | 'wolf' | 'otter' {
  const m = mbti.toUpperCase();
  if (/INT[JP]|ENT[JP]/.test(m)) return 'fox';
  if (/INF[JP]|ENF[JP]/.test(m)) return 'rabbit';
  if (/IST[JP]|EST[JP]/.test(m)) return 'wolf';
  if (/ISF[JP]|ESF[JP]/.test(m)) return 'otter';
  // MBTI 없을 때 태양별자리 원소로 파생
  if (/양자리|사자자리|사수자리|aries|leo|sagittarius/i.test(sunSign)) return 'fox';
  if (/황소자리|처녀자리|염소자리|taurus|virgo|capricorn/i.test(sunSign)) return 'wolf';
  if (/쌍둥이자리|천칭자리|물병자리|gemini|libra|aquarius/i.test(sunSign)) return 'rabbit';
  if (/게자리|전갈자리|물고기자리|cancer|scorpio|pisces/i.test(sunSign)) return 'otter';
  return 'otter';
}

export function getAvatarLabel(mbti: string, sunSign = '') {
  const a = getAvatarAnimal(mbti, sunSign);
  return { fox: '여우', rabbit: '토끼', wolf: '늑대', otter: '수달' }[a];
}

// ── 여우 (NT) ──────────────────────────────────
function FoxSvg({ c }: { c: AvatarColors }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="11,36 20,6 32,33" fill={c.body}/>
      <polygon points="48,33 60,6 69,36" fill={c.body}/>
      <polygon points="16,34 21,13 29,32" fill={c.inner}/>
      <polygon points="51,32 59,13 64,34" fill={c.inner}/>
      <ellipse cx="40" cy="46" rx="25" ry="23" fill={c.body}/>
      <ellipse cx="40" cy="53" rx="13" ry="9" fill={c.inner}/>
      <ellipse cx="29" cy="42" rx="6.5" ry="7" fill="white"/>
      <ellipse cx="51" cy="42" rx="6.5" ry="7" fill="white"/>
      <ellipse cx="29" cy="42" rx="4.5" ry="5.5" fill={c.iris}/>
      <ellipse cx="51" cy="42" rx="4.5" ry="5.5" fill={c.iris}/>
      <ellipse cx="29" cy="42" rx="2.5" ry="3.5" fill="#0f172a"/>
      <ellipse cx="51" cy="42" rx="2.5" ry="3.5" fill="#0f172a"/>
      <circle cx="27" cy="40" r="1.4" fill="white"/>
      <circle cx="49" cy="40" r="1.4" fill="white"/>
      <ellipse cx="40" cy="51" rx="3.5" ry="2.5" fill={c.accent}/>
      <path d="M37 53 Q40 56.5 43 53" stroke={c.accent} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ── 토끼 (NF) ──────────────────────────────────
function RabbitSvg({ c }: { c: AvatarColors }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="27" cy="18" rx="7" ry="16" fill={c.body}/>
      <ellipse cx="53" cy="18" rx="7" ry="16" fill={c.body}/>
      <ellipse cx="27" cy="18" rx="4" ry="12" fill="#fca5a5"/>
      <ellipse cx="53" cy="18" rx="4" ry="12" fill="#fca5a5"/>
      <circle cx="40" cy="50" r="24" fill={c.body}/>
      <ellipse cx="40" cy="56" rx="15" ry="11" fill={c.inner}/>
      <circle cx="30" cy="46" r="7" fill="white"/>
      <circle cx="50" cy="46" r="7" fill="white"/>
      <circle cx="30" cy="46" r="5" fill={c.iris}/>
      <circle cx="50" cy="46" r="5" fill={c.iris}/>
      <circle cx="30" cy="46" r="2.8" fill="#0f172a"/>
      <circle cx="50" cy="46" r="2.8" fill="#0f172a"/>
      <circle cx="28" cy="44" r="1.5" fill="white"/>
      <circle cx="48" cy="44" r="1.5" fill="white"/>
      <ellipse cx="40" cy="55" rx="3" ry="2" fill={c.accent}/>
      <path d="M37.5 57 Q40 59.5 42.5 57" stroke={c.accent} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ── 수달 (SF) ──────────────────────────────────
function OtterSvg({ c }: { c: AvatarColors }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="19" cy="26" r="9" fill={c.body}/>
      <circle cx="61" cy="26" r="9" fill={c.body}/>
      <circle cx="19" cy="26" r="5.5" fill={c.inner}/>
      <circle cx="61" cy="26" r="5.5" fill={c.inner}/>
      <circle cx="40" cy="46" r="26" fill={c.body}/>
      <ellipse cx="40" cy="52" rx="18" ry="14" fill={c.inner}/>
      <circle cx="29" cy="42" r="7.5" fill="white"/>
      <circle cx="51" cy="42" r="7.5" fill="white"/>
      <circle cx="29" cy="42" r="5.5" fill={c.iris}/>
      <circle cx="51" cy="42" r="5.5" fill={c.iris}/>
      <circle cx="29" cy="42" r="3" fill="#0f172a"/>
      <circle cx="51" cy="42" r="3" fill="#0f172a"/>
      <circle cx="27" cy="40" r="1.5" fill="white"/>
      <circle cx="49" cy="40" r="1.5" fill="white"/>
      <ellipse cx="40" cy="52" rx="4" ry="3" fill={c.accent}/>
      <path d="M36.5 55 Q40 58.5 43.5 55" stroke={c.accent} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <line x1="8" y1="51" x2="33" y2="52.5" stroke={c.accent} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      <line x1="8" y1="55" x2="33" y2="54.5" stroke={c.accent} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      <line x1="72" y1="51" x2="47" y2="52.5" stroke={c.accent} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      <line x1="72" y1="55" x2="47" y2="54.5" stroke={c.accent} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}

// ── 늑대 (ST) ──────────────────────────────────
function WolfSvg({ c }: { c: AvatarColors }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="13,34 22,10 33,32" fill={c.body}/>
      <polygon points="47,32 58,10 67,34" fill={c.body}/>
      <polygon points="18,32 23,16 30,31" fill={c.inner}/>
      <polygon points="50,31 57,16 62,32" fill={c.inner}/>
      <ellipse cx="40" cy="46" rx="25" ry="23" fill={c.body}/>
      <ellipse cx="40" cy="52" rx="14" ry="9" fill={c.inner}/>
      <ellipse cx="29" cy="42" rx="7" ry="6.5" fill="white"/>
      <ellipse cx="51" cy="42" rx="7" ry="6.5" fill="white"/>
      <ellipse cx="29" cy="42" rx="5" ry="4.5" fill={c.iris}/>
      <ellipse cx="51" cy="42" rx="5" ry="4.5" fill={c.iris}/>
      <ellipse cx="29" cy="42" rx="3" ry="3" fill="#0f172a"/>
      <ellipse cx="51" cy="42" rx="3" ry="3" fill="#0f172a"/>
      <circle cx="27" cy="40" r="1.4" fill="white"/>
      <circle cx="49" cy="40" r="1.4" fill="white"/>
      <ellipse cx="40" cy="50" rx="3.5" ry="2.5" fill={c.accent}/>
      <path d="M37 52 Q40 55 43 52" stroke={c.accent} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <line x1="9" y1="50" x2="33" y2="51" stroke={c.accent} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <line x1="9" y1="54" x2="33" y2="53" stroke={c.accent} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <line x1="71" y1="50" x2="47" y2="51" stroke={c.accent} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <line x1="71" y1="54" x2="47" y2="53" stroke={c.accent} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────
export function PartnerAvatar({ partner }: { partner: Partner }) {
  const sunSign = partner.chart?.sun ?? '';
  const colors = getColors(sunSign);
  const animal = getAvatarAnimal(partner.mbti, sunSign);
  if (animal === 'fox') return <FoxSvg c={colors} />;
  if (animal === 'rabbit') return <RabbitSvg c={colors} />;
  if (animal === 'wolf') return <WolfSvg c={colors} />;
  return <OtterSvg c={colors} />;
}
