# API — Team-Tasks MVP

| METHOD | PATH | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/auth/login | Google OAuth 로그인 흐름을 시작하고 provider URL로 리다이렉트한다 | 불필요 |
| GET | /api/auth/callback | OAuth 콜백을 처리하고 세션 쿠키를 발급한 뒤 홈으로 리다이렉트한다 | 불필요 |
| POST | /api/auth/logout | 세션 쿠키를 만료시켜 로그아웃한다 | 필요 |
| GET | /api/tasks | 전체 일감 목록을 마감일 오름차순으로 반환한다 (쿼리 파라미터 `mine=true`로 내 일감 필터) | 필요 |
| POST | /api/tasks | 새 일감을 생성한다 (title · assignee_id · due_date 필드 수신) | 필요 |
| PATCH | /api/tasks/[id] | 일감의 status 또는 assignee_id를 변경한다 (본인 일감 status 변경 · 팀장 재배정 모두 이 엔드포인트) | 필요 |
| GET | /api/tasks/[id] | 단일 일감의 상세 정보를 반환한다 | 필요 |
