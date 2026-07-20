# JOBDAY MVP

JOBDAY는 전국 현장 작업자가 작업레이드, 원정작업, 보조 구인, 오늘 일당 가능자, 공구장터, 자재나눔거래, 현장 질문, 초보 입문 정보를 올리는 모바일 우선 게시판 커뮤니티입니다.

JOBDAY는 유료직업소개업, 인력파견업, 임금 정산 플랫폼, 출근 관리 플랫폼, 자동 배정 매칭 플랫폼, 결제 중개 플랫폼이 아닙니다. 사용자는 게시글과 댓글로 정보를 공유하고, 연락과 조건 확인은 이용자끼리 직접 진행합니다.

## 현재 배포 준비 상태

| 항목 | 상태 |
| --- | --- |
| Supabase 기본 연결 | 통과 |
| 게시판 11개 | 통과 |
| 샘플 글 데이터 | 통과 |
| 핵심 URL 열림 | 통과 |
| 모바일 주요 화면 | 통과 |
| 글쓰기 전용 필드 | 통과 |
| 비로그인 관리자 접근 차단 | 통과 |
| `pnpm run lint` | 통과 |
| `pnpm run typecheck` | 통과 |
| `pnpm run build` | 통과 |
| `pnpm run smoke` | 통과 |
| `pnpm run qa:check` | 통과 |
| `pnpm run e2e` | 통과 |
| `pnpm run qa` | 통과 |

로컬 Release Candidate 기준은 통과했습니다. 외부 베타 사용자에게 보내기 전에는 Vercel Preview 주소에서 `pnpm run smoke`와 `pnpm run e2e`를 한 번 더 통과시켜야 합니다.

## 기술스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Vercel 배포 기준
- Playwright 자동 검수

## 주요 기능

- 홈
- 전체 게시판 목록
- 게시판별 글 목록
- 글 상세
- 글쓰기
- 글 수정
- 게시글 삭제 상태 처리
- 로그인, 회원가입, 로그아웃
- 마이페이지 프로필 저장
- 댓글, 대댓글
- 추천, 비추천
- 게시글 신고, 댓글 신고
- 이미지 업로드
- 작업레이드/원정레이드/보조/오늘일당가능 전용 입력값
- 공구장터/자재나눔거래 전용 입력값
- 관리자 페이지
- 신고 확인
- 게시글 숨김/해제
- 댓글 삭제 처리
- 유저 차단/해제
- 공지 등록
- 상단고정, 긴급 노출
- 광고 배너 자리 관리
- 관리자 활동 로그 기록

## 구현하지 않은 기능

아래 기능은 MVP 범위가 아니며, 일부러 구현하지 않았습니다.

- 결제
- 에스크로
- 일당 수수료
- 매칭 성공 수수료
- 임금 지급
- 임금 정산
- 출근 확정
- 출근 관리
- 작업자 자동 배정
- 실시간 채팅
- 신분증 인증
- 주민등록번호 수집
- 계좌번호 수집
- 공개 블랙리스트
- 검증된 작업자 보장
- 안전한 현장 보장

## 로컬 실행

```bash
pnpm install
pnpm run dev
```

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:3000
```

이 프로젝트는 `pnpm` 기준입니다. 현재 작업 환경에는 `npm`이 없을 수 있으므로 `npm run ...` 대신 `pnpm run ...`을 사용합니다.

## 환경변수

프로젝트 폴더에 `.env.local` 파일을 만들고 아래 값을 넣습니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

QA_TEST_EMAIL=
QA_TEST_PASSWORD=
```

값을 가져오는 곳:

1. Supabase 프로젝트로 이동합니다.
2. `Project Settings`를 엽니다.
3. `API` 메뉴를 엽니다.
4. `Project URL`을 `NEXT_PUBLIC_SUPABASE_URL`에 넣습니다.
5. `anon public` key를 `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 넣습니다.

`QA_TEST_EMAIL`, `QA_TEST_PASSWORD`는 자동 검수용입니다. Supabase 이메일 확인이 켜져 있으면, 이메일 확인이 끝난 테스트 계정을 넣어야 `pnpm run e2e`가 끝까지 통과합니다.

서비스 롤 키는 넣지 않습니다. 브라우저 앱에는 anon key만 사용합니다.

## Supabase 설정

### 1. 새 프로젝트 만들기

1. Supabase에 로그인합니다.
2. `New project`를 누릅니다.
3. 프로젝트 이름을 정합니다.
4. Region은 가까운 지역을 선택합니다.
5. Database password를 저장해 둡니다.
6. 프로젝트 생성이 끝날 때까지 기다립니다.

### 2. Auth 설정 확인

Supabase에서 이메일 확인을 켜두면, 새로 가입한 계정은 이메일 확인 전까지 로그인하지 못할 수 있습니다.

개발과 자동 검수를 쉽게 하려면 둘 중 하나를 선택합니다.

| 방법 | 설명 |
| --- | --- |
| 이메일 확인 끄기 | 개발 중 가장 쉽습니다. 새 계정이 바로 로그인됩니다. |
| 이메일 확인 유지 | 테스트 계정 이메일을 실제로 확인한 뒤 `QA_TEST_EMAIL`, `QA_TEST_PASSWORD`에 넣습니다. |

Vercel 배포 후에는 Supabase `Authentication > URL Configuration`에서 아래 URL을 추가합니다.

```text
http://localhost:3000
https://배포된-vercel-주소.vercel.app
```

## DB schema 적용

Supabase Dashboard에서 `SQL Editor`를 열고 아래 SQL 파일을 실행합니다.

새 Supabase 프로젝트라면 아래 순서대로 실행합니다.

1. `supabase/migrations/202607040001_initial_schema.sql`
2. `supabase/migrations/202607040003_reports_and_comments.sql`
3. `supabase/migrations/202607040004_admin_pages.sql`

이미 `supabase/schema.sql` 전체를 기준으로 새로 만들고 싶다면 `supabase/schema.sql`을 실행해도 됩니다. 단, 운영 데이터가 있는 DB에 무작정 다시 실행하지 말고 백업 후 진행해야 합니다.

SQL Editor 사용법:

1. 파일을 엽니다.
2. 내용을 처음부터 끝까지 전부 복사합니다.
3. Supabase `SQL Editor` 입력창에 붙여넣습니다.
4. 선택된 일부 줄만 실행되지 않게 입력창 안의 아무 곳이나 클릭합니다.
5. `Run`을 누릅니다.

## Storage bucket 설정

이미지 업로드는 Supabase Storage의 `post-images` 버킷을 사용합니다.

`202607040001_initial_schema.sql` 또는 `supabase/schema.sql`에는 아래 작업이 포함되어 있습니다.

- `post-images` 버킷 생성
- 이미지 파일 크기 제한
- 이미지 MIME 타입 제한
- 공개 읽기 정책
- 로그인 사용자 업로드 정책
- 본인 이미지 수정/삭제 정책

확인 방법:

1. Supabase Dashboard에서 `Storage`를 엽니다.
2. `post-images` 버킷이 있는지 확인합니다.
3. 없으면 SQL을 다시 확인하거나 수동으로 만듭니다.

수동으로 만들 때:

1. `Storage > New bucket`을 누릅니다.
2. 이름은 `post-images`로 입력합니다.
3. Public bucket을 켭니다.
4. 파일 크기는 5MB 정도로 제한합니다.
5. 허용 타입은 이미지 파일로 제한합니다.

수동 생성만으로는 정책이 부족할 수 있습니다. 가능하면 SQL migration으로 버킷과 정책을 함께 만드는 방식을 권장합니다.

## seed 데이터 적용

seed 데이터는 게시판과 베타 테스트용 샘플 글을 채웁니다.

실행 순서:

1. DB schema를 먼저 적용합니다.
2. 앱에서 회원가입을 한 번 합니다.
3. Supabase `SQL Editor`에서 `supabase/seed.sql` 전체 내용을 붙여넣고 실행합니다.

회원가입을 먼저 해야 하는 이유:

- 샘플 게시글의 작성자를 실제 `profiles` 사용자와 연결하기 위해서입니다.

seed에 들어가는 데이터:

| 게시판 | 샘플 수 |
| --- | ---: |
| 작업레이드 | 20개 이상 |
| 원정레이드 | 10개 이상 |
| 보조구함 | 15개 이상 |
| 오늘일당가능 | 15개 이상 |
| 공구장터 | 15개 이상 |
| 자재나눔거래 | 10개 이상 |
| 현장자유 | 20개 이상 |
| 초보입문 | 20개 이상 |
| 현장질문 | 20개 이상 |
| 시공사구인 | 10개 이상 |
| 운영 공지 | 6개 |

같은 `seed.sql`을 다시 실행해도 같은 샘플 ID를 기준으로 업데이트되므로, 베타 데이터가 계속 중복으로 쌓이지 않게 설계했습니다.

## 관리자 계정 만들기

1. JOBDAY 앱에서 관리자용 계정으로 회원가입합니다.
2. Supabase Dashboard에서 `Table Editor > profiles`를 엽니다.
3. 관리자 계정의 `id`를 확인합니다.
4. Supabase `SQL Editor`에서 아래 SQL을 실행합니다.

```sql
update public.profiles
set role = 'admin',
    is_admin = true
where id = '관리자로_지정할_profiles_id';
```

이후 해당 계정으로 로그인하면 `/admin`에 접근할 수 있습니다.

관리자 계정으로 확인할 것:

- 신고 목록
- 게시글 숨김/해제
- 댓글 삭제 처리
- 유저 차단/차단해제
- 공지 등록
- 상단고정 등록
- 배너 광고 자리 등록
- 관리자 활동 로그

## Vercel 배포

1. 코드를 Git 저장소에 올립니다.
2. Vercel에서 `Add New Project`를 누릅니다.
3. Git 저장소를 선택합니다.
4. Framework Preset은 `Next.js`를 선택합니다.
5. Install Command는 기본값 또는 `pnpm install`을 사용합니다.
6. Build Command는 `pnpm run build`를 사용합니다.
7. Environment Variables에 아래 값을 넣습니다.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
8. Deploy를 실행합니다.
9. 배포 주소가 나오면 Supabase Auth URL Configuration에 배포 주소를 추가합니다.
10. 배포 주소에서 회원가입, 로그인, 게시판, 글쓰기, 댓글, 신고를 확인합니다.

Vercel에는 `QA_TEST_EMAIL`, `QA_TEST_PASSWORD`를 꼭 넣을 필요는 없습니다. 자동 검수를 Vercel 배포 주소 기준으로 돌릴 때만 넣습니다.

## 자동 검수

품질 확인 명령어:

```bash
pnpm run qa:check
pnpm run smoke
pnpm run e2e
pnpm run qa
pnpm run lint
pnpm run typecheck
pnpm run build
```

명령어별 의미:

| 명령어 | 하는 일 |
| --- | --- |
| `pnpm run qa:check` | Supabase 연결, 게시판, 지역, 직종, 게시글 저장소, 이미지 버킷 확인 |
| `pnpm run smoke` | 핵심 URL, 모바일 화면, 글쓰기 전용 필드, 비로그인 관리자 차단 확인 |
| `pnpm run e2e` | 로그인, 프로필 저장, 글쓰기, 댓글, 신고, 수정, 삭제 흐름 확인 |
| `pnpm run qa` | Supabase 점검 후 브라우저 자동 검수 실행 |
| `pnpm run lint` | 코드 규칙 확인 |
| `pnpm run typecheck` | TypeScript 타입 확인 |
| `pnpm run build` | 배포 빌드 확인 |

주의:

- 자동 검수는 실제 Supabase DB에 테스트용 회원과 테스트 글을 만듭니다.
- 테스트 글 제목에는 `자동검수`가 들어갑니다.
- Supabase 이메일 확인이 켜져 있으면 확인된 테스트 계정을 `.env.local`에 넣어야 합니다.

## 베타 테스트 체크리스트

베타 오픈 전 아래를 확인합니다.

| 항목 | 확인 |
| --- | --- |
| 홈이 열린다 | `/` |
| 게시판 11개가 보인다 | `/boards` |
| 작업레이드 목록이 보인다 | `/boards/work-raid` |
| 회원가입이 된다 | `/signup` |
| 로그인이 된다 | `/login` |
| 프로필 저장이 된다 | `/me` |
| 작업레이드 글 작성이 된다 | `/boards/work-raid/new` |
| 원정레이드 글 작성이 된다 | `/boards/remote-raid/new` |
| 보조구함 글 작성이 된다 | `/boards/dimodo/new` |
| 오늘일당가능 글 작성이 된다 | `/boards/available-today/new` |
| 공구장터 글 작성이 된다 | `/boards/tool-market/new` |
| 자재거래 글 작성이 된다 | `/boards/materials/new` |
| 댓글과 대댓글이 된다 | 글 상세 |
| 추천/비추천이 된다 | 글 상세 |
| 신고가 된다 | 글 상세, 댓글 |
| 비로그인 사용자는 글 저장이 막힌다 | 글쓰기 |
| 일반 사용자는 관리자 접근이 막힌다 | `/admin` |
| 관리자는 신고를 볼 수 있다 | `/admin/reports` |
| 관리자는 게시글을 숨길 수 있다 | `/admin/posts` |
| 관리자는 유저를 차단할 수 있다 | `/admin/users` |
| 관리자는 상단고정을 등록할 수 있다 | `/admin/promotions` |
| 모바일 390px에서 깨지지 않는다 | 주요 화면 |

## 배포 전 금지 기능 체크

| 항목 | 현재 상태 |
| --- | --- |
| 결제 기능 없음 | 코드 기준 충족 |
| 수수료 기능 없음 | 코드 기준 충족 |
| 자동매칭 없음 | 코드 기준 충족 |
| 출근관리 없음 | 코드 기준 충족 |
| 임금정산 없음 | 코드 기준 충족 |
| 신분증 수집 없음 | 코드 기준 충족 |
| 공개 블랙리스트 없음 | 코드 기준 충족 |
| 책임제한 문구 있음 | 코드 기준 충족 |
| 약관/개인정보처리방침 있음 | 코드 기준 충족 |
| 신고/관리자 기능 있음 | 코드 기준 충족, 관리자 계정으로 최종 리허설 필요 |

현재 코드 기준으로 금지 기능은 구현하지 않았고, 책임제한 문구와 약관/개인정보처리방침/커뮤니티 규칙 페이지가 준비되어 있습니다. 단, 실제 공개 전에는 운영자가 화면을 직접 눌러 최종 확인해야 합니다.

## 운영자 매뉴얼

운영 기준은 [docs/OPERATIONS_GUIDE.md](docs/OPERATIONS_GUIDE.md)에 정리되어 있습니다.

핵심 원칙:

- JOBDAY는 계약 당사자가 아닙니다.
- JOBDAY는 임금, 출근, 안전, 거래 결과를 보장하지 않습니다.
- 위험 글은 삭제보다 숨김 후 검토를 우선합니다.
- 공개 블랙리스트를 만들지 않습니다.
- 관리자 처리는 `admin_actions`에 남깁니다.
- 광고와 상단고정은 결제 없이 운영자가 수동 처리합니다.

## 법적 검토 필요 TODO

아래 문서는 현재 MVP 초안입니다. 실제 서비스 공개 전 변호사 또는 노무사 검토가 필요합니다.

- 이용약관
- 개인정보처리방침
- 책임 제한 안내
- 커뮤니티 규칙
- 신고 처리 기준
- 광고/프리미엄 프로필 안내 문구

법적 안내 문구의 핵심:

> JOBDAY는 현장직 정보 공유 커뮤니티이며, 구인자와 구직자 간 계약의 당사자가 아닙니다. 임금, 근로조건, 안전사항, 출근 여부, 거래 조건은 이용자 간 직접 확인해야 합니다. JOBDAY는 임금 지급, 출근 관리, 작업 지시, 거래 대금 결제를 대행하지 않습니다.

마켓 거래 안내:

> JOBDAY는 공구 및 자재 거래의 당사자가 아니며, 거래는 이용자 간 직접 진행됩니다.

## 실제 배포 순서

1. Supabase 새 프로젝트를 만든다.
2. Supabase Project URL과 anon key를 복사한다.
3. 로컬 `.env.local`에 Supabase 값을 넣는다.
4. Supabase SQL Editor에서 migration SQL을 순서대로 실행한다.
5. Storage에 `post-images` 버킷이 만들어졌는지 확인한다.
6. 로컬에서 회원가입을 한 번 한다.
7. Supabase SQL Editor에서 `supabase/seed.sql`을 실행한다.
8. 관리자용 계정을 회원가입한다.
9. Supabase SQL Editor에서 관리자 계정의 `is_admin`을 true로 바꾼다.
10. `.env.local`에 확인된 테스트 계정 `QA_TEST_EMAIL`, `QA_TEST_PASSWORD`를 넣는다.
11. `pnpm run qa:check`를 실행한다.
12. `pnpm run smoke`를 실행한다.
13. `pnpm run e2e`를 실행한다.
14. `pnpm run lint`, `pnpm run typecheck`, `pnpm run build`를 실행한다.
15. 관리자 화면에서 신고, 숨김, 차단, 상단고정, 배너 관리를 직접 확인한다.
16. Git 저장소에 코드를 올린다.
17. Vercel에서 프로젝트를 연결한다.
18. Vercel 환경변수에 Supabase URL과 anon key를 넣는다.
19. Vercel 배포를 실행한다.
20. Supabase Auth URL Configuration에 Vercel 배포 주소를 추가한다.
21. 배포 주소에서 회원가입, 로그인, 글쓰기, 댓글, 신고, 관리자 접근을 다시 확인한다.
22. 약관과 운영 정책을 전문가에게 검토받는다.
23. 베타 테스트 참여자에게 URL을 공유한다.
