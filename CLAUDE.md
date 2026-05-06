@AGENTS.md

## 기술 스택과 아키텍처

- 런타임: Next.js (프론트 + API Routes 통합) — Vercel 배포, 별도 백엔드 서버 없음
- DB·인증: Supabase (Postgres + Auth) — ENUM·인덱스·트리거·RLS 사용 금지
- 로그인: Google OAuth 단일 provider, 세션은 쿠키로 관리
- API base path: `/api` (버전 prefix 없음) — 상세는 docs/api.md 참조
- DB: `tasks` 단일 테이블 (id · title · assignee_id · created_by · status · created_at) — 상세는 docs/db.md 참조
- status 값: `'todo'` · `'done'` 두 가지만 (text check, ENUM 아님)
- 권한 규칙: 상태 변경은 본인 일감만 가능, 서버에서 403으로 강제 (클라이언트 검증 단독 금지)
- 인증 없는 요청은 서버에서 401 반환
- 정렬: 마감일 오름차순 고정, 우선순위 필드 없음
- 금지 항목: 메시지 큐·캐시·WebSocket·마이크로서비스·Read Replica·검색엔진
- 아키텍처 다이어그램 — 상세는 docs/architecture.md 참조
- 기능 요건(F-01~F-05)·비기능 요건 — 상세는 docs/requirements.md 참조

## 도메인 용어

| 용어 | 정의 |
|------|------|
| 일감 | 팀 내에서 할당·추적하는 작업 단위 (`tasks` 테이블 1행) |
| 담당자 | 일감을 수행할 책임이 있는 팀원 (`assignee_id` 컬럼) |
| 상태 | 일감의 진행 단계 — `todo`(대기) · `done`(완료) |
| 팀장 | 일감을 생성하고 담당자를 배정·재배정하는 역할 (`created_by`) |
| 재배정 | 팀장이 기존 일감의 담당자를 다른 팀원으로 변경하는 행위 |
