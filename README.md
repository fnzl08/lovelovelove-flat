# Love!Love!Love!

귀엽고 장난스러운 비트아트 감성의 연애 시뮬레이션 대시보드입니다.

## 포함 기능
- 마이페이지 차트 요약
- 상대 목록 / 상대 추가 UI
- 상대 상세 궁합 지표
- 월간 애정운 그래프 / 주간 연락운 그래프 / 달력 뷰
- 일화 로그 입력 UI
- 타로 스튜디오
  - 3카드: 1,2,3 카드 텍스트 입력
  - 켈틱 크로스: 1~10 카드 텍스트 입력
  - 카드 이미지는 쓰지 않고 카드명 입력으로 해석
- Vercel 배포용 Next.js App Router 구조

## 실행
```bash
npm install
npm run dev
```

## Vercel 배포
1. GitHub에 이 폴더를 올립니다.
2. Vercel에서 New Project를 누릅니다.
3. 저장소를 Import 합니다.
4. Framework Preset은 Next.js로 자동 감지됩니다.
5. Deploy를 누릅니다.

CLI로도 가능합니다.
```bash
npm i -g vercel
vercel
vercel --prod
```

## 주의
- Vercel Hobby는 개인 비상업용에 적합합니다.
- 상용 공개 서비스라면 Pro 검토가 필요합니다.
- 점성 계산 엔진과 타로 해석 API는 아직 붙이지 않은 프론트 MVP입니다.
