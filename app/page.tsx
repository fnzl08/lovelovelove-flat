'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CalendarDays, Cat, Heart, MessageCircleHeart, NotebookPen, PawPrint, Plus, ScrollText, Sparkles, Stars, UserRound, WandSparkles } from 'lucide-react';
import { Line, LineChart, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PolarGrid, PolarAngleAxis, PolarRadiusAxis, CartesianGrid } from 'recharts';
import { calendarScores, eventLogs, monthSeries, partners, userProfile, weekSeries } from '@/lib/data';
import { buildTarotInterpretation, clamp, generateStory, makeInsight, tarotSpreadLabels } from '@/lib/utils';

const tabs = [
  { id: 'mypage', label: '마이페이지' },
  { id: 'partners', label: '상대 목록' },
  { id: 'detail', label: '상대 상세' },
  { id: 'tarot', label: '타로' },
  { id: 'deploy', label: '배포 가이드' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function Page() {
  const [tab, setTab] = useState<TabId>('mypage');
  const [selectedPartnerId, setSelectedPartnerId] = useState(partners[0].id);
  const [tarotDeck, setTarotDeck] = useState('Universal Waite');
  const [tarotSpread, setTarotSpread] = useState<'three-card' | 'celtic-cross'>('three-card');
  const [question, setQuestion] = useState('');
  const [tarotCards, setTarotCards] = useState<string[]>(['', '', '']);

  const partner = useMemo(() => partners.find((p) => p.id === selectedPartnerId) ?? partners[0], [selectedPartnerId]);
  const labels = tarotSpreadLabels(tarotSpread);

  const tarotInterpretation = useMemo(
    () => buildTarotInterpretation({ partnerName: partner.name, deck: tarotDeck, spread: tarotSpread, question, cards: tarotCards }),
    [partner.name, tarotDeck, tarotSpread, question, tarotCards]
  );

  function onChangeSpread(next: 'three-card' | 'celtic-cross') {
    setTarotSpread(next);
    setTarotCards(next === 'three-card' ? ['', '', ''] : Array.from({ length: 10 }, () => ''));
  }

  function updateCard(index: number, value: string) {
    const next = [...tarotCards];
    next[index] = value;
    setTarotCards(next);
  }

  const insight = makeInsight(partner);
  const radarData = [
    { subject: '끌림', value: partner.compatibility.chemistry },
    { subject: '안정성', value: partner.compatibility.stability },
    { subject: '소통', value: partner.compatibility.communication },
    { subject: '타이밍', value: partner.compatibility.timing },
    { subject: '신뢰', value: partner.compatibility.trust },
  ];
  const concentrationRisk = clamp(Math.round((100 - partner.compatibility.trust + (100 - partner.compatibility.stability)) / 3), 12, 68);

  return (
    <main className="container">
      <section className="pixel-card section">
        <div className="grid-hero">
          <div>
            <div className="flex gap-8 wrap" style={{ alignItems: 'center' }}>
              <Heart size={18} color="#ff73ae" />
              <strong>Love!Love!Love!</strong>
            </div>
            <h1 className="title">사랑스럽고 장난스러운 비트아트 연애 시뮬레이션</h1>
            <p className="subtitle">
              whole sign chart, 궁합, 연락운, 월간 애정운, 일화 로그, 타로 리딩을 한 화면 흐름으로 묶은 개인용 러브 대시보드입니다.
              분석 문장은 한쪽으로 몰아가지 않고, 패턴·근거·가능성 중심으로 표현되도록 설계했습니다.
            </p>
            <div className="badges">
              <span className="badge">cute pixel UI</span>
              <span className="badge">whole sign ready</span>
              <span className="badge">tarot text input</span>
              <span className="badge">story log mode</span>
            </div>
          </div>
          <div className="pixel-card section">
            <div className="right-note">pixel love simulator · gray cat heroine</div>
            <div className="flex gap-16" style={{ alignItems: 'center', marginTop: 8 }}>
              <div className="hero-avatar">🐈</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{userProfile.name}</div>
                <div className="subtitle">회색 고양이 · 하늘색 눈 · ENFP</div>
              </div>
            </div>
            <div className="kv-grid" style={{ marginTop: 16 }}>
              <div className="kv"><div className="k">Sun</div><div className="v">Virgo 10H</div></div>
              <div className="kv"><div className="k">Moon</div><div className="v">Pisces 4H</div></div>
              <div className="kv"><div className="k">Venus</div><div className="v">Leo 9H</div></div>
              <div className="kv"><div className="k">ASC</div><div className="v">Sagittarius</div></div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 16 }} />

      <div className="tabs">
        {tabs.map((item) => (
          <button key={item.id} className={`tab ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ height: 16 }} />

      {tab === 'mypage' && (
        <div className="grid-2">
          <section className="pixel-card section">
            <div className="panel-title"><Cat size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />마이페이지 요약</div>
            <div className="panel-desc">네이탈 차트, 관계 성향, 해석 기준</div>
            <div className="text-box box-pink">{userProfile.summary}</div>
            <div style={{ height: 12 }} />
            <div className="kv-grid">
              {Object.entries(userProfile.chart).map(([k, v]) => (
                <div key={k} className="kv"><div className="k">{k}</div><div className="v">{v}</div></div>
              ))}
            </div>
          </section>

          <section className="pixel-card section">
            <div className="panel-title"><ScrollText size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />종합 해석</div>
            <div className="panel-desc">마이페이지 본문용 문장형 콘텐츠</div>
            <div className="space-y">
              <div className="text-box box-violet">희재의 차트는 공적인 영역에서의 정교함과 사적인 영역에서의 감수성이 뚜렷하게 대비됩니다. Virgo 10하우스의 태양·수성·목성은 관계를 구조와 패턴으로 읽게 만들고, Pisces Moon은 표면 아래의 정서 흐름을 크게 체감하게 합니다.</div>
              <div className="text-box box-amber">Venus in Leo는 사랑을 표현할 때 따뜻함·품격·선명한 애정을 원하게 하지만, square Pluto는 마음이 걸리면 단순 호감 이상으로 크게 몰입하게 만들 수 있습니다. 그래서 겉보기보다 훨씬 진지하고, 관계가 애매할수록 더 오래 해석하려는 경향이 있습니다.</div>
              <div className="text-box box-sky">이 앱에서는 좋다/나쁘다 식 단정 대신, 매력·안정성·소통·타이밍·신뢰를 분리해서 보여주고, 일화 로그가 쌓일수록 해석이 서사적으로 업데이트되도록 설계합니다.</div>
            </div>
            <div style={{ height: 16 }} />
            <table className="soft-table">
              <thead><tr><th>영역</th><th>강점</th><th>주의점</th></tr></thead>
              <tbody>
                <tr><td>연애 시작</td><td>호감 포착이 빠름</td><td>가능성 과해석</td></tr>
                <tr><td>연락</td><td>디테일 기억, 반응 예민</td><td>리듬 불균형에 예민</td></tr>
                <tr><td>애정 표현</td><td>따뜻하고 센스 있음</td><td>확신 전 감정 기복</td></tr>
                <tr><td>관계 유지</td><td>일관성, 책임감 중시</td><td>애매함 장기화에 취약</td></tr>
              </tbody>
            </table>
          </section>

          <section className="pixel-card section" style={{ gridColumn: '1 / -1' }}>
            <div className="panel-title"><Stars size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />핵심 애스펙트 메모</div>
            <div className="grid-3">
              {userProfile.notes.map((note) => <div className="kv" key={note}>{note}</div>)}
            </div>
          </section>
        </div>
      )}

      {tab === 'partners' && (
        <div className="grid-2">
          <section className="pixel-card section">
            <div className="panel-title"><UserRound size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />상대방 목록</div>
            <div className="panel-desc">저장된 상대 아바타와 이름, MBTI, 핵심 궁합 지표</div>
            <div className="space-y">
              {partners.map((p) => {
                const localInsight = makeInsight(p);
                return (
                  <button key={p.id} className="list-item" onClick={() => { setSelectedPartnerId(p.id); setTab('detail'); }}>
                    <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="flex gap-12" style={{ alignItems: 'center' }}>
                        <div className="hero-avatar" style={{ width: 60, height: 60, fontSize: 28 }}>{p.avatarEmoji}</div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{p.name}</div>
                          <div className="subtitle">{p.animal} · {p.mbti}</div>
                        </div>
                      </div>
                      <span className="badge">{localInsight.avg}점</span>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 14, color: '#6b7280' }}>{localInsight.mode}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="pixel-card section">
            <div className="panel-title"><Plus size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />상대 추가</div>
            <div className="panel-desc">출생정보 입력 또는 astro-seek 스타일 텍스트 붙여넣기 보조창</div>
            <div className="grid-2">
              <input className="input" placeholder="이름" />
              <input className="input" placeholder="MBTI" />
              <input className="input" placeholder="생년월일 (YYYY-MM-DD)" />
              <input className="input" placeholder="출생시간 (HH:mm)" />
            </div>
            <div style={{ height: 12 }} />
            <input className="input" placeholder="출생지" />
            <div style={{ height: 12 }} />
            <textarea className="textarea" placeholder="astro-seek 스타일 차트 텍스트를 그대로 붙여넣으면, 파싱해서 테이블화하고 해석에 반영하는 구조\n예: Sun in Scorpio..., Moon in Taurus..., ASC in Cancer..." />
            <div style={{ height: 12 }} />
            <div className="flex gap-12 wrap">
              <button className="btn primary">상대 저장</button>
              <button className="btn">동물 아바타 추천</button>
            </div>
          </section>
        </div>
      )}

      {tab === 'detail' && (
        <div className="grid-2">
          <section className="pixel-card section">
            <div className="panel-title"><PawPrint size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />{partner.name} 상세페이지</div>
            <div className="panel-desc">{partner.avatarEmoji} {partner.animal} · 차트 패턴 기반 상징 동물</div>
            <div className="kv-grid">
              {Object.entries(partner.chart).map(([k, v]) => <div key={k} className="kv"><div className="k">{k}</div><div className="v">{v}</div></div>)}
            </div>
            <div style={{ height: 12 }} />
            <div className="text-box box-pink"><strong>연애 스타일</strong><br />{partner.romanceStyle}</div>
            <div style={{ height: 12 }} />
            <div className="text-box box-violet"><strong>끌리는 타입</strong><br />{partner.attraction}</div>
            <div style={{ height: 12 }} />
            <div className="text-box box-sky"><strong>스토리 해석</strong><br />{generateStory(partner)}</div>
          </section>

          <div className="grid">
            <section className="pixel-card section">
              <div className="panel-title"><BarChart3 size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />궁합 대시보드</div>
              <div className="panel-desc">매력·안정성·소통·타이밍·신뢰를 분리 표기</div>
              <div className="grid-2">
                <div>
                  {Object.entries(partner.compatibility).map(([label, value]) => (
                    <div className="metric" key={label}>
                      <div className="metric-row"><span>{label}</span><span>{value}</span></div>
                      <div className="progress"><div style={{ width: `${value}%` }} /></div>
                    </div>
                  ))}
                  <div className="kv"><div className="k">종합</div><div className="v">{insight.avg}점 · {insight.mode}</div></div>
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
              <section className="score-card"><div className="subtitle">오늘 연락운</div><div className="score-number">71%</div><div className="subtitle" style={{ marginTop: 8 }}>답장은 오는 편. 다만 깊은 감정 확인보다 분위기 체크성일 수 있음.</div></section>
              <section className="score-card"><div className="subtitle">관계 외부 변수 추정</div><div className="score-number">{concentrationRisk}%</div><div className="subtitle" style={{ marginTop: 8 }}>사실 판정이 아니라 관심·에너지 분산 가능성을 중립적으로 표현한 값.</div></section>
              <section className="score-card"><div className="subtitle">이번 달 애정운 평균</div><div className="score-number">79점</div><div className="subtitle" style={{ marginTop: 8 }}>감정 흐름은 우상향. 확정 이벤트는 후반부가 유리한 패턴.</div></section>
            </div>
          </div>

          <section className="pixel-card section" style={{ gridColumn: '1 / -1' }}>
            <div className="panel-title"><CalendarDays size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />한 달 애정운 · 일주일 연락운</div>
            <div className="grid-2">
              <div>
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
              </div>
              <div>
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
            <div className="panel-title"><NotebookPen size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />일화 로그와 스토리 리빌드</div>
            <div className="panel-desc">실제 있었던 일을 넣으면 해석 문장이 갱신되는 구조</div>
            <div className="grid-2">
              <div className="space-y">
                {eventLogs.filter((e) => e.partner === partner.name).map((log) => (
                  <div key={log.date + log.text} className="log-item">
                    <div className="flex" style={{ justifyContent: 'space-between' }}><strong>{log.tag}</strong><span className="subtitle">{log.date}</span></div>
                    <div style={{ marginTop: 8, lineHeight: 1.7, fontSize: 14 }}>{log.text}</div>
                  </div>
                ))}
                <textarea className="textarea" placeholder="새로운 일화 추가: 그날 있었던 대화, 분위기, 상대의 표정, 약속의 확정/취소, SNS 반응 등" />
                <button className="btn primary">로그 저장 후 해석 갱신</button>
              </div>
              <div className="text-box box-violet">
                <strong>스토리 모드 예시</strong><br />최근 로그 기준으로 보면, {partner.name}과의 관계는 감정 공백 상태가 아니라 신중한 탐색 단계에 가깝습니다. 연락의 질은 올라가고 있으나, 상대가 확신을 언어화하기보다는 질문·관찰·맥락 수집으로 반응하는 패턴이 보입니다. 지금은 감정 확인을 몰아붙이기보다, 상대가 스스로 관계의 안정성을 체감하게 하는 흐름이 더 유리합니다.
              </div>
            </div>
          </section>
        </div>
      )}

      {tab === 'tarot' && (
        <div className="grid-2">
          <section className="pixel-card section">
            <div className="panel-title"><WandSparkles size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />타로 스튜디오</div>
            <div className="panel-desc">카드 이미지를 넣지 않고, 자리별 카드명을 텍스트로 입력하는 방식</div>

            <div className="grid-2">
              <div>
                <div className="panel-desc" style={{ marginBottom: 8 }}>상대 선택</div>
                <select className="select" value={selectedPartnerId} onChange={(e) => setSelectedPartnerId(e.target.value)}>
                  {partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
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
              <button className={`btn ${tarotSpread === 'three-card' ? 'primary' : ''}`} onClick={() => onChangeSpread('three-card')}>3카드</button>
              <button className={`btn ${tarotSpread === 'celtic-cross' ? 'primary' : ''}`} onClick={() => onChangeSpread('celtic-cross')}>켈틱 크로스</button>
            </div>

            <div style={{ height: 12 }} />
            <textarea className="textarea" placeholder="질문 입력: 예) 민준이 지금 나를 어떤 관계 대상으로 인식하는지, 4월 안에 직접적인 진전 가능성이 있는지" value={question} onChange={(e) => setQuestion(e.target.value)} />
            <div style={{ height: 12 }} />
            <div className="space-y">
              {labels.map((label, idx) => (
                <div key={label}>
                  <div className="panel-desc" style={{ marginBottom: 8 }}>{label}</div>
                  <input className="input" placeholder="예: The Star 정방향 / Cups 2 / Seven of Swords 역방향" value={tarotCards[idx] ?? ''} onChange={(e) => updateCard(idx, e.target.value)} />
                </div>
              ))}
            </div>
          </section>

          <section className="pixel-card section">
            <div className="panel-title"><MessageCircleHeart size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />해석 결과</div>
            <div className="panel-desc">상황·상대 특성·질문·입력 카드 조합형 해석</div>
            <motion.div initial={{ opacity: 0.7, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }} className="loading-box">
              ✨ 카드와 로그, 차트 패턴을 조합해서 스토리 리딩 중...
            </motion.div>
            <div style={{ height: 12 }} />
            <div className="text-box box-amber">{tarotInterpretation}</div>
            <div style={{ height: 12 }} />
            <div className="text-box box-sky">
              <strong>입력 방식 요약</strong><br />
              3카드면 1, 2, 3 자리에 카드명을 각각 적고, 켈틱이면 1~10 자리에 카드명을 적으면 됩니다. 실제 구현에서는 카드명 파싱 후 의미 사전, 수비학, 원소, 점성 대응, 선택 덱의 톤, 상대 차트와 일화 로그를 함께 반영하도록 API 레이어를 붙이면 됩니다.
            </div>
          </section>
        </div>
      )}

      {tab === 'deploy' && (
        <div className="grid-2">
          <section className="pixel-card section">
            <div className="panel-title"><Sparkles size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} />Vercel 배포 준비 완료</div>
            <div className="panel-desc">이 프로젝트는 Next.js App Router 기준이라 Vercel이 자동 감지하는 구조</div>
            <div className="space-y">
              <div className="text-box box-pink">1. 로컬에서 <strong>npm install</strong> 후 <strong>npm run dev</strong> 로 확인</div>
              <div className="text-box box-violet">2. GitHub 저장소에 업로드</div>
              <div className="text-box box-sky">3. Vercel에서 New Project → 저장소 Import → Deploy</div>
              <div className="text-box box-amber">4. 상용/공개 서비스화할 예정이면 Hobby가 아니라 Pro 플랜 검토</div>
            </div>
          </section>
          <section className="pixel-card section">
            <div className="panel-title">추가 구현 포인트</div>
            <div className="panel-desc">지금 버전은 프론트 MVP이며, 이후 붙일 서버 기능</div>
            <table className="soft-table">
              <thead><tr><th>기능</th><th>다음 단계</th></tr></thead>
              <tbody>
                <tr><td>회원/저장</td><td>Supabase Auth + Postgres</td></tr>
                <tr><td>차트 파싱</td><td>붙여넣기 텍스트 정규식 파서</td></tr>
                <tr><td>타로 해석 고도화</td><td>API route + 카드 의미 사전 + 프롬프트 레이어</td></tr>
                <tr><td>로그 기반 재해석</td><td>상대별 사건 기록 테이블과 분석 재계산</td></tr>
              </tbody>
            </table>
          </section>
        </div>
      )}
    </main>
  );
}
