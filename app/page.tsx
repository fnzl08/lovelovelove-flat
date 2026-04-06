'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  CalendarDays,
  Cat,
  Heart,
  MessageCircleHeart,
  NotebookPen,
  PawPrint,
  Plus,
  ScrollText,
  Stars,
  UserRound,
  WandSparkles,
} from 'lucide-react';
import {
  Line,
  LineChart,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  CartesianGrid,
} from 'recharts';
import { calendarScores, userProfile, weekSeries, monthSeries } from '@/lib/data';
import type { Partner } from '@/lib/data';
import { clamp, makeInsight, tarotSpreadLabels, translateZodiac } from '@/lib/utils';
import { PartnerAvatar, getAvatarLabel } from '@/lib/avatars';
import { useAiStream } from '@/lib/hooks/useAiStream';
import type { TarotPayload, PartnerStoryPayload, AspectAnalysisPayload, EventLogPayload, PartnerProfilePayload } from '@/lib/ai/types';
import { supabase } from '@/lib/supabase';

const tabs = [
  { id: 'mypage', label: '마이페이지' },
  { id: 'partners', label: '상대 목록' },
  { id: 'detail', label: '상대 상세' },
  { id: 'tarot', label: '타로' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function Page() {
  const [tab, setTab] = useState<TabId>('mypage');
  const [partnerList, setPartnerList] = useState<Partner[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [tarotDeck, setTarotDeck] = useState('Universal Waite');
  const [tarotSpread, setTarotSpread] = useState<'three-card' | 'celtic-cross'>('three-card');
  const [question, setQuestion] = useState('');
  const [tarotCards, setTarotCards] = useState<string[]>(['', '', '']);

  // 상대 추가 폼 상태
  const [newName, setNewName] = useState('');
  const [newMbti, setNewMbti] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [newBirthTime, setNewBirthTime] = useState('');
  const [newBirthPlace, setNewBirthPlace] = useState('');
  const [newChartText, setNewChartText] = useState('');

  // 일화 로그 상태
  const [logs, setLogs] = useState<{ date: string; partner: string; tag: string; text: string }[]>([]);
  const [newEventText, setNewEventText] = useState('');
  const [newEventTag, setNewEventTag] = useState('일화');

  // Supabase에서 초기 데이터 로드
  useEffect(() => {
    supabase.from('partners').select('*').order('created_at').then(({ data }) => {
      if (!data) return;
      setPartnerList(data.map((r) => ({
        id: r.id,
        name: r.name,
        mbti: r.mbti ?? '',
        animal: r.animal ?? '',
        birth: { date: r.birth_date ?? '', time: r.birth_time ?? '', place: r.birth_place ?? '' },
        chart: r.chart ?? {},
        romanceStyle: r.romance_style ?? '',
        attraction: r.attraction ?? '',
        compatibility: r.compatibility ?? { chemistry: 0, stability: 0, communication: 0, timing: 0, trust: 0 },
        notes: r.notes ?? [],
      })));
    });
    supabase.from('event_logs').select('*').order('created_at').then(({ data }) => {
      if (!data) return;
      setLogs(data.map((r) => ({ date: r.date, partner: r.partner_name, tag: r.tag, text: r.text })));
    });
  }, []);

  // AI 훅
  const tarotAi = useAiStream();
  const storyAi = useAiStream();
  const aspectAi = useAiStream();
  const eventAi = useAiStream();
  const profileAi = useAiStream();
  const [generatingProfileFor, setGeneratingProfileFor] = useState('');

  function savePartner() {
    if (!newName.trim()) return;
    const mbti = newMbti.trim().toUpperCase();
    // 차트 텍스트에서 별자리 간단 파싱
    const chart: Record<string, string> = {};
    const signList = ['양자리','황소자리','쌍둥이자리','게자리','사자자리','처녀자리','천칭자리','전갈자리','사수자리','염소자리','물병자리','물고기자리','Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
    const planetKeys = [['sun','Sun'],['moon','Moon'],['venus','Venus'],['mars','Mars'],['asc','ASC'],['mercury','Mercury'],['jupiter','Jupiter'],['saturn','Saturn']];
    for (const [key, label] of planetKeys) {
      const rx = new RegExp(`${label}[^\\n]*?(${signList.join('|')})`, 'i');
      const m = newChartText.match(rx);
      if (m) chart[key] = translateZodiac(m[1]);
    }
    const newPartner: Partner = {
      id: Date.now().toString(),
      name: newName.trim(),
      mbti,
      animal: getAvatarLabel(mbti),
      birth: { date: newBirthDate, time: newBirthTime, place: newBirthPlace },
      chart,
      romanceStyle: '',
      attraction: '',
      compatibility: { chemistry: 0, stability: 0, communication: 0, timing: 0, trust: 0 },
      notes: [],
    };
    setPartnerList(prev => [...prev, newPartner]);
    setSelectedPartnerId(newPartner.id);
    setNewName(''); setNewMbti(''); setNewBirthDate(''); setNewBirthTime(''); setNewBirthPlace(''); setNewChartText('');
    supabase.from('partners').insert({
      id: newPartner.id,
      name: newPartner.name,
      mbti: newPartner.mbti,
      animal: newPartner.animal,
      birth_date: newPartner.birth.date,
      birth_time: newPartner.birth.time,
      birth_place: newPartner.birth.place,
      chart: newPartner.chart,
      romance_style: newPartner.romanceStyle,
      attraction: newPartner.attraction,
      compatibility: newPartner.compatibility,
      notes: newPartner.notes,
    }).then(({ error }) => { if (error) console.error('파트너 저장 실패:', error.message); });
  }

  const partner = useMemo(
    () => partnerList.find((p) => p.id === selectedPartnerId) ?? null,
    [partnerList, selectedPartnerId]
  );
  const labels = tarotSpreadLabels(tarotSpread);

  // 파트너 상세 탭 진입 시 자동 생성
  useEffect(() => {
    if (partner && tab === 'detail') {
      const storyPayload: PartnerStoryPayload = {
        feature: 'partnerStory',
        partnerName: partner.name,
        partnerMbti: partner.mbti,
        partnerChart: partner.chart,
        partnerCompatibility: partner.compatibility,
        partnerNotes: partner.notes,
        recentEvents: logs.filter((e) => e.partner === partner.name).slice(-5),
      };
      storyAi.run(storyPayload);

      // 연애스타일/끌리는타입/점수 미생성 시 자동 생성
      if (!partner.romanceStyle && Object.keys(partner.chart).length > 0) {
        const profilePayload: PartnerProfilePayload = {
          feature: 'partnerProfile',
          partnerName: partner.name,
          partnerMbti: partner.mbti,
          partnerChart: partner.chart,
        };
        setGeneratingProfileFor(partner.id);
        profileAi.run(profilePayload);
      }

      // 애스팩트 분석 미생성 시 자동 실행
      if (partner.notes.length === 0) {
        const aspectPayload: AspectAnalysisPayload = {
          feature: 'aspectAnalysis',
          partnerName: partner.name,
          partnerChart: partner.chart,
          partnerNotes: partner.notes,
        };
        aspectAi.run(aspectPayload);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partner?.id, tab]);

  // profileAi 완료 시 파싱 → 상태 업데이트 → Supabase 저장
  useEffect(() => {
    if (!profileAi.loading && profileAi.text && generatingProfileFor) {
      const raw = profileAi.text;
      const romanceMatch = raw.match(/\[연애스타일\]\s*([\s\S]*?)(?=\[끌리는타입\]|\[점수\]|$)/);
      const attractionMatch = raw.match(/\[끌리는타입\]\s*([\s\S]*?)(?=\[점수\]|$)/);
      const scoreMatch = raw.match(/chemistry:(\d+)\s+stability:(\d+)\s+communication:(\d+)\s+timing:(\d+)\s+trust:(\d+)/);

      const romanceStyle = romanceMatch ? romanceMatch[1].trim() : '';
      const attraction = attractionMatch ? attractionMatch[1].trim() : '';
      const compatibility = scoreMatch
        ? {
            chemistry: Number(scoreMatch[1]),
            stability: Number(scoreMatch[2]),
            communication: Number(scoreMatch[3]),
            timing: Number(scoreMatch[4]),
            trust: Number(scoreMatch[5]),
          }
        : null;

      const pid = generatingProfileFor;
      setGeneratingProfileFor('');

      if (romanceStyle || attraction || compatibility) {
        setPartnerList((prev) =>
          prev.map((p) =>
            p.id === pid
              ? {
                  ...p,
                  romanceStyle: romanceStyle || p.romanceStyle,
                  attraction: attraction || p.attraction,
                  compatibility: compatibility ?? p.compatibility,
                }
              : p
          )
        );
        supabase
          .from('partners')
          .update({
            ...(romanceStyle && { romance_style: romanceStyle }),
            ...(attraction && { attraction }),
            ...(compatibility && { compatibility }),
          })
          .eq('id', pid)
          .then(({ error }) => { if (error) console.error('프로필 저장 실패:', error.message); });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileAi.loading, profileAi.text]);

  function onChangeSpread(next: 'three-card' | 'celtic-cross') {
    setTarotSpread(next);
    setTarotCards(next === 'three-card' ? ['', '', ''] : Array.from({ length: 10 }, () => ''));
  }

  function updateCard(index: number, value: string) {
    const next = [...tarotCards];
    next[index] = value;
    setTarotCards(next);
  }

  const insight = partner ? makeInsight(partner) : null;
  const radarData = partner
    ? [
        { subject: '끌림', value: partner.compatibility.chemistry },
        { subject: '안정성', value: partner.compatibility.stability },
        { subject: '소통', value: partner.compatibility.communication },
        { subject: '타이밍', value: partner.compatibility.timing },
        { subject: '신뢰', value: partner.compatibility.trust },
      ]
    : [];
  const concentrationRisk = partner
    ? clamp(Math.round((100 - partner.compatibility.trust + (100 - partner.compatibility.stability)) / 3), 12, 68)
    : 0;

  return (
    <main className="container">
      <section className="pixel-card section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, paddingBottom: 12, borderBottom: '1px solid var(--line)', marginBottom: 14 }}>
          <Heart size={18} color="#ff73ae" fill="#ff73ae" />
          <span className="site-title">Love!Love!Love!</span>
          <Heart size={18} color="#ff73ae" fill="#ff73ae" />
        </div>
        <div className="flex gap-16" style={{ alignItems: 'center' }}>
          <div className="hero-avatar">
            <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="14,34 21,12 30,32" fill="#94a3b8"/>
              <polygon points="50,32 59,12 66,34" fill="#94a3b8"/>
              <polygon points="18,32 21,17 28,31" fill="#fca5a5"/>
              <polygon points="52,31 59,17 62,32" fill="#fca5a5"/>
              <ellipse cx="40" cy="46" rx="26" ry="24" fill="#94a3b8"/>
              <ellipse cx="40" cy="39" rx="19" ry="13" fill="#b8c5cc"/>
              <ellipse cx="30" cy="43" rx="7" ry="7.5" fill="white"/>
              <ellipse cx="50" cy="43" rx="7" ry="7.5" fill="white"/>
              <ellipse cx="30" cy="43" rx="5" ry="5.5" fill="#7dd3fc"/>
              <ellipse cx="50" cy="43" rx="5" ry="5.5" fill="#7dd3fc"/>
              <ellipse cx="30" cy="43" rx="2.5" ry="3.5" fill="#0f172a"/>
              <ellipse cx="50" cy="43" rx="2.5" ry="3.5" fill="#0f172a"/>
              <circle cx="27.5" cy="41" r="1.4" fill="white"/>
              <circle cx="47.5" cy="41" r="1.4" fill="white"/>
              <path d="M38 53 L40 51 L42 53 Z" fill="#f9a8d4"/>
              <path d="M37 54.5 Q40 57.5 43 54.5" stroke="#64748b" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              <line x1="8" y1="50" x2="33" y2="52" stroke="#64748b" strokeWidth="1" strokeLinecap="round"/>
              <line x1="8" y1="54" x2="33" y2="53.5" stroke="#64748b" strokeWidth="1" strokeLinecap="round"/>
              <line x1="72" y1="50" x2="47" y2="52" stroke="#64748b" strokeWidth="1" strokeLinecap="round"/>
              <line x1="72" y1="54" x2="47" y2="53.5" stroke="#64748b" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="right-note">pixel love simulator · gray cat heroine</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{userProfile.name}</div>
            <div className="subtitle">회색 고양이 ENFP</div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="kv-grid">
              {(['sun','moon','venus','asc'] as const).map(k => (
                <div key={k} className="kv">
                  <div className="k">{k.toUpperCase()}</div>
                  <div className="v">{userProfile.chart[k]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 16 }} />

      <div className="tabs">
        {tabs.map((item) => (
          <button
            key={item.id}
            className={`tab ${tab === item.id ? 'active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ height: 16 }} />

      {tab === 'mypage' && (
        <div className="grid-2">
          <section className="pixel-card section">
            <div className="panel-title">
              <Cat size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
              마이페이지 요약
            </div>
            <div className="panel-desc">네이탈 차트, 관계 성향, 해석 기준</div>
            <div className="text-box box-pink">{userProfile.summary}</div>
            <div style={{ height: 12 }} />
            <div className="kv-grid">
              {Object.entries(userProfile.chart).map(([k, v]) => (
                <div key={k} className="kv">
                  <div className="k">{k}</div>
                  <div className="v">{v}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="pixel-card section">
            <div className="panel-title">
              <ScrollText size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
              종합 해석
            </div>
            <div className="panel-desc">마이페이지 본문용 문장형 콘텐츠</div>
            <div className="space-y">
              <div className="text-box box-violet">
                희재의 차트는 공적인 영역에서의 정교함과 사적인 영역에서의 감수성이 뚜렷하게 대비됩니다. 처녀자리
                10하우스의 태양·수성·목성은 관계를 구조와 패턴으로 읽게 만들고, 물고기자리 Moon은 표면 아래의 정서 흐름을 크게 체감하게 합니다.
              </div>
              <div className="text-box box-amber">
                Venus in 사자자리는 사랑을 표현할 때 따뜻함·품격·선명한 애정을 원하게 하지만, square Pluto는 마음이 걸리면 단순 호감 이상으로 크게 몰입하게 만들 수 있습니다.
                그래서 겉보기보다 훨씬 진지하고, 관계가 애매할수록 더 오래 해석하려는 경향이 있습니다.
              </div>
              <div className="text-box box-sky">
                이 앱에서는 좋다/나쁘다 식 단정 대신, 매력·안정성·소통·타이밍·신뢰를 분리해서 보여주고, 일화 로그가 쌓일수록 해석이 서사적으로 업데이트되도록 설계합니다.
              </div>
            </div>
            <div style={{ height: 16 }} />
            <table className="soft-table">
              <thead>
                <tr>
                  <th>영역</th>
                  <th>강점</th>
                  <th>주의점</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>연애 시작</td>
                  <td>호감 포착이 빠름</td>
                  <td>가능성 과해석</td>
                </tr>
                <tr>
                  <td>연락</td>
                  <td>디테일 기억, 반응 예민</td>
                  <td>리듬 불균형에 예민</td>
                </tr>
                <tr>
                  <td>애정 표현</td>
                  <td>따뜻하고 센스 있음</td>
                  <td>확신 전 감정 기복</td>
                </tr>
                <tr>
                  <td>관계 유지</td>
                  <td>일관성, 책임감 중시</td>
                  <td>애매함 장기화에 취약</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="pixel-card section" style={{ gridColumn: '1 / -1' }}>
            <div className="panel-title">
              <Stars size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
              핵심 애스펙트 메모
            </div>
            <div className="grid-3">
              {userProfile.notes.map((note) => (
                <div className="kv" key={note}>
                  {note}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === 'partners' && (
        <div className="grid-2">
          <section className="pixel-card section">
            <div className="panel-title">
              <UserRound size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
              상대방 목록
            </div>
            <div className="panel-desc">저장된 상대 아바타와 이름, MBTI, 핵심 궁합 지표</div>
            <div className="space-y">
              {partnerList.length === 0 ? (
                <div className="text-box box-sky">아직 저장된 상대가 없습니다. 아래에서 새 상대를 추가해 주세요.</div>
              ) : (
                partnerList.map((p) => {
                  const localInsight = makeInsight(p);
                  return (
                    <button
                      key={p.id}
                      className="list-item"
                      onClick={() => {
                        setSelectedPartnerId(p.id);
                        setTab('detail');
                      }}
                    >
                      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="flex gap-12" style={{ alignItems: 'center' }}>
                          <div className="hero-avatar" style={{ width: 60, height: 60 }}>
                            <PartnerAvatar partner={p} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700 }}>{p.name}</div>
                            <div className="subtitle">
                              {p.animal} · {p.mbti}
                            </div>
                          </div>
                        </div>
                        <span className="badge">{localInsight.avg}점</span>
                      </div>
                      <div style={{ marginTop: 10, fontSize: 14, color: '#6b7280' }}>{localInsight.mode}</div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section className="pixel-card section">
            <div className="panel-title">
              <Plus size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
              상대 추가
            </div>
            <div className="panel-desc">출생정보 입력 또는 astro-seek 스타일 텍스트 붙여넣기 보조창</div>
            <div className="grid-2">
              <input className="input" placeholder="이름" value={newName} onChange={e => setNewName(e.target.value)} />
              <input className="input" placeholder="MBTI" value={newMbti} onChange={e => setNewMbti(e.target.value)} />
              <input className="input" placeholder="생년월일 (YYYY-MM-DD)" value={newBirthDate} onChange={e => setNewBirthDate(e.target.value)} />
              <input className="input" placeholder="출생시간 (HH:mm)" value={newBirthTime} onChange={e => setNewBirthTime(e.target.value)} />
            </div>
            <div style={{ height: 12 }} />
            <input className="input" placeholder="출생지" value={newBirthPlace} onChange={e => setNewBirthPlace(e.target.value)} />
            <div style={{ height: 12 }} />
            <textarea
              className="textarea"
              placeholder="astro-seek 스타일 차트 텍스트를 그대로 붙여넣으면, 파싱해서 테이블화하고 해석에 반영하는 구조&#10;예: Sun in Scorpio, Moon in Taurus, ASC in Cancer..."
              value={newChartText}
              onChange={e => setNewChartText(e.target.value)}
            />
            <div style={{ height: 12 }} />
            <div className="panel-desc">저장 시 MBTI와 태양별자리를 기반으로 동물 아바타가 자동 생성됩니다.</div>
            <div style={{ height: 8 }} />
            <button className="btn primary" onClick={savePartner}>상대 저장</button>
          </section>
        </div>
      )}

      {tab === 'detail' && (
        <>
          {!partner ? (
            <section className="pixel-card section">
              <div className="panel-title">
                <PawPrint size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
                상대 상세
              </div>
              <div className="panel-desc">상대를 저장하면 상세 페이지가 여기 표시됩니다.</div>
            </section>
          ) : (
            <div className="grid-2">
              <section className="pixel-card section">
                <div className="panel-title">
                  <PawPrint size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
                  {partner.name} 상세페이지
                </div>
                <div className="panel-desc" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-block', width: 28, height: 28 }}><PartnerAvatar partner={partner} /></span>
                  {partner.animal} · 차트 패턴 기반 상징 동물
                </div>
                <div className="kv-grid">
                  {Object.entries(partner.chart).map(([k, v]) => (
                    <div key={k} className="kv">
                      <div className="k">{k}</div>
                      <div className="v">{translateZodiac(v)}</div>
                    </div>
                  ))}
                </div>
                <div style={{ height: 12 }} />
                <div className="text-box box-pink">
                  <strong>연애 스타일</strong>
                  <br />
                  {profileAi.loading && !partner.romanceStyle && (
                    <motion.span
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                    >
                      ✨ 분석 중...
                    </motion.span>
                  )}
                  {profileAi.error && !partner.romanceStyle && (
                    <span style={{ color: '#f87171' }}>{profileAi.error}</span>
                  )}
                  {partner.romanceStyle || (!profileAi.loading && !profileAi.error && (
                    <button className="btn" style={{ marginTop: 4 }} onClick={() => {
                      const payload: PartnerProfilePayload = {
                        feature: 'partnerProfile',
                        partnerName: partner.name,
                        partnerMbti: partner.mbti,
                        partnerChart: partner.chart,
                      };
                      setGeneratingProfileFor(partner.id);
                      profileAi.run(payload);
                    }}>AI 프로필 생성</button>
                  ))}
                </div>
                <div style={{ height: 12 }} />
                <div className="text-box box-violet">
                  <strong>끌리는 타입</strong>
                  <br />
                  {profileAi.loading && !partner.attraction && (
                    <motion.span
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                    >
                      ✨ 분석 중...
                    </motion.span>
                  )}
                  {partner.attraction}
                </div>
                <div style={{ height: 12 }} />
                <div className="text-box box-sky">
                  <strong>스토리 해석</strong>
                  <br />
                  {storyAi.loading && (
                    <motion.span
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                    >
                      ✨ 리딩 중...
                    </motion.span>
                  )}
                  {storyAi.error && <span style={{ color: '#f87171' }}>{storyAi.error}</span>}
                  {storyAi.text && <span>{storyAi.text}</span>}
                  {!storyAi.loading && !storyAi.text && !storyAi.error && (
                    <button className="btn" onClick={() => {
                      const payload: PartnerStoryPayload = {
                        feature: 'partnerStory',
                        partnerName: partner.name,
                        partnerMbti: partner.mbti,
                        partnerChart: partner.chart,
                        partnerCompatibility: partner.compatibility,
                        partnerNotes: partner.notes,
                        recentEvents: logs.filter((e) => e.partner === partner.name).slice(-5),
                      };
                      storyAi.run(payload);
                    }}>AI 스토리 리딩</button>
                  )}
                </div>
              </section>

              <div className="grid">
                <section className="pixel-card section">
                  <div className="panel-title">
                    <BarChart3 size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
                    궁합 대시보드
                  </div>
                  <div className="panel-desc">매력·안정성·소통·타이밍·신뢰를 분리 표기</div>
                  <div className="grid-2">
                    <div>
                      {Object.entries(partner.compatibility).map(([label, value]) => (
                        <div className="metric" key={label}>
                          <div className="metric-row">
                            <span>{label}</span>
                            <span>{value}</span>
                          </div>
                          <div className="progress">
                            <div style={{ width: `${value}%` }} />
                          </div>
                        </div>
                      ))}
                      <div className="kv">
                        <div className="k">종합</div>
                        <div className="v">
                          {insight?.avg}점 · {insight?.mode}
                        </div>
                      </div>
                    </div>
                    <div style={{ height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis domain={[0, 100]} />
                          <Radar dataKey="value" fill="#f89fc8" stroke="#f89fc8" fillOpacity={0.26} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </section>

                <div className="cards-row">
                  <section className="score-card">
                    <div className="subtitle">오늘 연락운</div>
                    <div className="score-number">71%</div>
                    <div className="subtitle" style={{ marginTop: 8 }}>
                      답장은 오는 편. 다만 깊은 감정 확인보다 분위기 체크성일 수 있음.
                    </div>
                  </section>
                  <section className="score-card">
                    <div className="subtitle">관계 외부 변수 추정</div>
                    <div className="score-number">{concentrationRisk}%</div>
                    <div className="subtitle" style={{ marginTop: 8 }}>
                      사실 판정이 아니라 관심·에너지 분산 가능성을 중립적으로 표현한 값.
                    </div>
                  </section>
                  <section className="score-card">
                    <div className="subtitle">이번 달 애정운 평균</div>
                    <div className="score-number">79점</div>
                    <div className="subtitle" style={{ marginTop: 8 }}>
                      감정 흐름은 우상향. 확정 이벤트는 후반부가 유리한 패턴.
                    </div>
                  </section>
                </div>
              </div>

              <section className="pixel-card section" style={{ gridColumn: '1 / -1' }}>
                <div className="panel-title">
                  <CalendarDays size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
                  한 달 애정운 · 일주일 연락운
                </div>
                <div className="grid-2">
                  <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthSeries}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[40, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="romance" stroke="#ff89ba" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weekSeries}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[30, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="contact" stroke="#d5bbff" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={{ height: 16 }} />
                <div className="month-calendar">
                  {calendarScores.map((d) => (
                    <div key={d.day} className="day-cell">
                      <div className="day-num">4/{d.day}</div>
                      <div className="day-score">{d.score}</div>
                      <div className="subtitle">애정운</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="pixel-card section" style={{ gridColumn: '1 / -1' }}>
                <div className="panel-title">
                  <Stars size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
                  핵심 애스팩트 분석
                </div>
                <div className="panel-desc">{partner.name}의 나탈 배치 특성 · 시너지 패턴</div>
                {partner.notes.length > 0 ? (
                  <div className="grid-3">
                    {partner.notes.map((note) => (
                      <div className="kv" key={note}>{note}</div>
                    ))}
                  </div>
                ) : (
                  <div className="text-box box-sky">
                    {aspectAi.loading && (
                      <motion.span
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                      >
                        ✨ 애스팩트 분석 중...
                      </motion.span>
                    )}
                    {aspectAi.error && <span style={{ color: '#f87171' }}>{aspectAi.error}</span>}
                    {aspectAi.text && <span>{aspectAi.text}</span>}
                    {!aspectAi.loading && !aspectAi.text && !aspectAi.error && (
                      <>
                        <span>차트 텍스트를 저장하면 AI 애스팩트 분석을 실행할 수 있습니다.</span>
                        <div style={{ marginTop: 10 }}>
                          <button className="btn" onClick={() => {
                            const payload: AspectAnalysisPayload = {
                              feature: 'aspectAnalysis',
                              partnerName: partner.name,
                              partnerChart: partner.chart,
                              partnerNotes: partner.notes,
                            };
                            aspectAi.run(payload);
                          }}>AI 애스팩트 분석</button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </section>

              <section className="pixel-card section" style={{ gridColumn: '1 / -1' }}>
                <div className="panel-title">
                  <NotebookPen size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
                  일화 로그와 스토리 리빌드
                </div>
                <div className="panel-desc">실제 있었던 일을 넣으면 해석 문장이 갱신되는 구조</div>
                <div className="grid-2">
                  <div className="space-y">
                    {logs.filter((e) => e.partner === partner.name).map((log) => (
                      <div key={log.date + log.text} className="log-item">
                        <div className="flex" style={{ justifyContent: 'space-between' }}>
                          <strong>{log.tag}</strong>
                          <span className="subtitle">{log.date}</span>
                        </div>
                        <div style={{ marginTop: 8, lineHeight: 1.7, fontSize: 14 }}>{log.text}</div>
                      </div>
                    ))}
                    <input
                      className="input"
                      placeholder="태그 (예: 대화, 약속, SNS 반응)"
                      value={newEventTag}
                      onChange={(e) => setNewEventTag(e.target.value)}
                    />
                    <textarea
                      className="textarea"
                      placeholder="새로운 일화 추가: 그날 있었던 대화, 분위기, 상대의 표정, 약속의 확정/취소, SNS 반응 등"
                      value={newEventText}
                      onChange={(e) => setNewEventText(e.target.value)}
                    />
                    <button
                      className="btn primary"
                      onClick={() => {
                        if (!newEventText.trim()) return;
                        const entry = {
                          date: new Date().toISOString().slice(0, 10),
                          partner: partner.name,
                          tag: newEventTag.trim() || '일화',
                          text: newEventText.trim(),
                        };
                        setLogs((prev) => [...prev, entry]);
                        supabase.from('event_logs').insert({
                          partner_name: entry.partner,
                          tag: entry.tag,
                          text: entry.text,
                          date: entry.date,
                        }).then(({ error }) => { if (error) console.error('로그 저장 실패:', error.message); });
                        const payload: EventLogPayload = {
                          feature: 'eventLog',
                          eventText: entry.text,
                          eventTag: entry.tag,
                          partnerName: partner.name,
                          partnerChart: partner.chart,
                          partnerCompatibility: partner.compatibility,
                        };
                        eventAi.run(payload);
                        setNewEventText('');
                        setNewEventTag('일화');
                      }}
                    >
                      로그 저장 후 해석 갱신
                    </button>
                  </div>
                  <div className="text-box box-violet">
                    {eventAi.loading && (
                      <motion.span
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                      >
                        ✨ 일화 해석 중...
                      </motion.span>
                    )}
                    {eventAi.error && <span style={{ color: '#f87171' }}>{eventAi.error}</span>}
                    {eventAi.text && <span>{eventAi.text}</span>}
                    {!eventAi.loading && !eventAi.text && !eventAi.error && (
                      <span>일화를 저장하면 AI가 관계 맥락에서 해석해드립니다.</span>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}
        </>
      )}

      {tab === 'tarot' && (
        <div className="grid-2">
          <section className="pixel-card section">
            <div className="panel-title">
              <WandSparkles size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
              타로 스튜디오
            </div>
            <div className="panel-desc">카드 이미지를 넣지 않고, 자리별 카드명을 텍스트로 입력하는 방식</div>

            <div className="grid-2">
              <div>
                <div className="panel-desc" style={{ marginBottom: 8 }}>상대 선택</div>
                <select className="select" value={selectedPartnerId} onChange={(e) => setSelectedPartnerId(e.target.value)}>
                  {partnerList.length === 0 ? (
                    <option value="">저장된 상대 없음</option>
                  ) : (
                    partnerList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <div className="panel-desc" style={{ marginBottom: 8 }}>카드덱</div>
                <select className="select" value={tarotDeck} onChange={(e) => setTarotDeck(e.target.value)}>
                  <option>Universal Waite</option>
                  <option>Wheel of the Year</option>
                  <option>Horoscope Belline</option>
                  <option>Morgan-Greer</option>
                </select>
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div className="grid-2">
              <button className={`btn ${tarotSpread === 'three-card' ? 'primary' : ''}`} onClick={() => onChangeSpread('three-card')}>
                3카드
              </button>
              <button className={`btn ${tarotSpread === 'celtic-cross' ? 'primary' : ''}`} onClick={() => onChangeSpread('celtic-cross')}>
                켈틱 크로스
              </button>
            </div>

            <div style={{ height: 12 }} />
            <textarea
              className="textarea"
              placeholder="질문 입력: 예) 지금 이 관계가 가까워질 수 있는지, 상대가 나를 어떤 흐름으로 보고 있는지"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div style={{ height: 12 }} />
            <div className="space-y">
              {labels.map((label, idx) => (
                <div key={label}>
                  <div className="panel-desc" style={{ marginBottom: 8 }}>{label}</div>
                  <input
                    className="input"
                    placeholder="예: The Star 정방향 / Cups 2 / Seven of Swords 역방향"
                    value={tarotCards[idx] ?? ''}
                    onChange={(e) => updateCard(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="pixel-card section">
            <div className="panel-title">
              <MessageCircleHeart size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />
              해석 결과
            </div>
            <div className="panel-desc">상황·상대 특성·질문·입력 카드 조합형 해석</div>

            <button
              className="btn primary"
              style={{ width: '100%', marginBottom: 12 }}
              disabled={tarotAi.loading}
              onClick={() => {
                const payload: TarotPayload = {
                  feature: 'tarot',
                  deck: tarotDeck,
                  spread: tarotSpread,
                  spreadLabels: labels,
                  question,
                  cards: tarotCards,
                  partnerName: partner?.name ?? '상대',
                  partnerChart: partner?.chart ?? {},
                  partnerMbti: partner?.mbti ?? '',
                  partnerCompatibility: partner?.compatibility ?? {},
                };
                tarotAi.run(payload);
              }}
            >
              {tarotAi.loading ? '리딩 중...' : '✨ 리딩 시작'}
            </button>

            {tarotAi.loading && (
              <motion.div
                initial={{ opacity: 0.7, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                className="loading-box"
              >
                ✨ 카드와 로그, 차트 패턴을 조합해서 스토리 리딩 중...
              </motion.div>
            )}
            {tarotAi.error && (
              <div className="text-box box-amber" style={{ marginBottom: 12 }}>{tarotAi.error}</div>
            )}
            {tarotAi.text && (
              <>
                <div style={{ height: 12 }} />
                <div className="text-box box-amber">{tarotAi.text}</div>
              </>
            )}
            {!tarotAi.loading && !tarotAi.text && !tarotAi.error && (
              <>
                <div style={{ height: 12 }} />
                <div className="text-box box-sky">
                  <strong>입력 방식 요약</strong>
                  <br />
                  3카드면 1, 2, 3 자리에 카드명을 각각 적고, 켈틱이면 1~10 자리에 카드명을 적으면 됩니다. 카드를 모두 입력한 뒤 리딩 시작 버튼을 누르세요.
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
