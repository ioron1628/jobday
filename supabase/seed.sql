-- Job일 기본 데이터와 예시 글
-- 실행 순서:
-- 1. supabase/migrations/202607040001_initial_schema.sql 실행
-- 2. 앱에서 회원가입 1회 진행
-- 3. 이 파일 실행

begin;

insert into public.regions (slug, name, sort_order) values
  ('seoul', '서울', 10),
  ('gyeonggi', '경기', 20),
  ('incheon', '인천', 30),
  ('gangwon', '강원', 40),
  ('chungbuk', '충북', 50),
  ('chungnam', '충남', 60),
  ('daejeon', '대전', 70),
  ('chungcheong', '충청', 75),
  ('jeonbuk', '전북', 80),
  ('jeonnam', '전남', 90),
  ('gwangju', '광주', 100),
  ('gyeongbuk', '경북', 110),
  ('gyeongnam', '경남', 120),
  ('daegu', '대구', 130),
  ('busan', '부산', 140),
  ('ulsan', '울산', 150),
  ('jeju', '제주', 160),
  ('nationwide', '전국', 170)
on conflict (slug) do update set
  name = excluded.name,
  sort_order = excluded.sort_order;

insert into public.trades (slug, name, sort_order) values
  ('helper', '조공', 10),
  ('dimodo', '디모도', 20),
  ('electric', '전기', 30),
  ('plumbing', '설비', 40),
  ('welding', '용접', 50),
  ('carpentry', '목공', 60),
  ('tile', '타일', 70),
  ('wallpaper', '도배', 75),
  ('flooring', '장판', 78),
  ('paint', '페인트', 80),
  ('rebar', '철근', 90),
  ('formwork', '형틀', 100),
  ('interior', '인테리어', 110),
  ('logistics', '물류', 120),
  ('lifting', '양중', 125),
  ('demolition', '철거', 130),
  ('plaster', '미장', 135),
  ('waterproof', '방수', 140),
  ('sash', '샷시', 145),
  ('general-labor', '잡부', 148),
  ('other', '기타', 150)
on conflict (slug) do update set
  name = excluded.name,
  sort_order = excluded.sort_order;

insert into public.boards (slug, name, description, category, sort_order, requires_guardrail_notice) values
  ('free', '현장자유', '현장 이야기와 잡담을 나누는 게시판', 'free', 10, false),
  ('work-raid', '작업레이드', '단기 작업, 급한 인원 모집성 정보를 공유하는 게시판', 'work', 20, true),
  ('remote-raid', '원정레이드', '숙식, 이동, 장거리 작업 정보를 공유하는 게시판', 'work', 30, true),
  ('dimodo', '디모도구함', '디모도, 조공, 보조 인력 정보 공유 게시판', 'work', 40, true),
  ('available-today', '오늘일당가능', '오늘 가능한 지역과 직종을 작업자가 직접 올리는 게시판', 'work', 50, true),
  ('tool-market', '공구장터', '공구 판매, 대여, 교환 정보를 공유하는 게시판', 'market', 60, true),
  ('materials', '자재나눔거래', '남는 자재, 소량 자재, 무료 나눔 정보를 공유하는 게시판', 'market', 70, true),
  ('beginner', '초보입문', '준비물, 용어, 단가 감각, 현장 기본 정보를 나누는 게시판', 'guide', 80, false),
  ('questions', '현장질문', '시공, 공구, 현장 상황을 질문하는 게시판', 'question', 90, false),
  ('company-jobs', '시공사구인', '시공사와 업체가 작성한 정보성 구인 게시판', 'company', 100, true),
  ('notices', '공지사항', '운영 공지와 이용 안내', 'notice', 110, false)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  sort_order = excluded.sort_order,
  is_active = true,
  requires_guardrail_notice = excluded.requires_guardrail_notice;

insert into public.ad_slots (placement, label, description) values
  ('home_top', '홈 상단 배너', '홈 최상단 광고 위치'),
  ('region_board_top', '지역 게시판 상단 배너', '지역 태그/게시판 상단 광고 위치'),
  ('trade_board_top', '직종 게시판 상단 배너', '직종 태그/게시판 상단 광고 위치'),
  ('post_inline', '글 상세 중간 배너', '글 상세 중간 광고 위치'),
  ('market_top', '마켓 상단 배너', '공구장터와 자재나눔거래 상단 광고 위치')
on conflict (placement) do update set
  label = excluded.label,
  description = excluded.description,
  is_active = true;

insert into public.notices (id, title, body, is_published)
values (
  '00000000-0000-0000-0000-000000000901',
  'Job일 이용 안내',
  'Job일은 현장직 정보 공유 커뮤니티입니다. 조건과 연락은 이용자 간 직접 확인해야 합니다.',
  true
)
on conflict (id) do update set
  title = excluded.title,
  body = excluded.body,
  is_published = excluded.is_published;

do $$
begin
  if not exists (select 1 from public.profiles) then
    raise notice '샘플 글을 넣으려면 먼저 앱에서 회원가입을 한 번 진행해주세요.';
  end if;
end;
$$;

with seed_author as (
  select id
  from public.profiles
  where status = 'active'
  order by created_at asc
  limit 1
),
sample_posts (
  id,
  board_slug,
  title,
  body,
  region_text,
  trade_text,
  work_date,
  daily_pay,
  contact_method,
  extra
) as (
  values
    (
      '00000000-0000-0000-0000-000000000101'::uuid,
      'work-raid',
      '경기 화성 전기 조공 3명 작업레이드',
      '화면 확인용 예시 글입니다. 실제 조건은 작성자와 직접 확인해야 합니다.',
      '경기 화성',
      '전기 조공',
      '2026-07-05'::date,
      180000,
      '댓글 후 연락',
      jsonb_build_object(
        'site_region', '경기 화성',
        'departure_region', '서울 구로',
        'work_date', '2026-07-05',
        'trade', '전기 조공',
        'needed_count', 3,
        'daily_pay', 180000,
        'contact_method', '댓글 후 연락',
        'lodging_provided', false,
        'beginner_ok', true,
        'recruiting_status', '모집중'
      )
    ),
    (
      '00000000-0000-0000-0000-000000000102'::uuid,
      'remote-raid',
      '부산 원정 설비 보조 2일',
      '숙소와 이동 조건은 작성자 입력 정보로 확인하는 예시 글입니다.',
      '부산',
      '설비',
      '2026-07-06'::date,
      200000,
      '댓글 확인',
      jsonb_build_object(
        'site_region', '부산',
        'departure_region', '서울',
        'work_date', '2026-07-06',
        'work_period', '2일',
        'trade', '설비',
        'needed_count', 2,
        'daily_pay', 200000,
        'contact_method', '댓글 확인',
        'lodging_provided', true,
        'transportation_provided', true,
        'ride_share_available', true,
        'beginner_ok', false,
        'recruiting_status', '모집중'
      )
    ),
    (
      '00000000-0000-0000-0000-000000000103'::uuid,
      'dimodo',
      '인천 송도 디모도 1명',
      '디모도 정보 공유 예시 글입니다.',
      '인천 송도',
      '디모도',
      '2026-07-05'::date,
      160000,
      '댓글 후 전화',
      jsonb_build_object(
        'site_region', '인천 송도',
        'work_date', '2026-07-05',
        'trade', '디모도',
        'needed_count', 1,
        'daily_pay', 160000,
        'contact_method', '댓글 후 전화',
        'beginner_ok', true
      )
    ),
    (
      '00000000-0000-0000-0000-000000000104'::uuid,
      'available-today',
      '오늘 경기 서부 전기 조공 가능',
      '작업자가 직접 올리는 가능 정보 예시입니다.',
      '경기 서부',
      '전기 조공',
      '2026-07-04'::date,
      170000,
      '댓글 확인',
      jsonb_build_object(
        'available_region', '경기 서부',
        'available_date', '2026-07-04',
        'available_trade', '전기 조공',
        'desired_pay', 170000,
        'contact_method', '댓글 확인',
        'has_vehicle', true,
        'can_travel', true
      )
    ),
    (
      '00000000-0000-0000-0000-000000000105'::uuid,
      'tool-market',
      '밀워키 임팩 판매',
      '공구 거래는 이용자 간 직접 진행됩니다.',
      '경기 수원',
      '공구',
      null::date,
      120000,
      '댓글 후 연락',
      jsonb_build_object(
        'tool_name', '밀워키 임팩',
        'transaction_type', '판매',
        'price', 120000,
        'condition', '사용감 있음',
        'market_region', '경기 수원',
        'contact_method', '댓글 후 연락'
      )
    ),
    (
      '00000000-0000-0000-0000-000000000106'::uuid,
      'materials',
      '석고보드 12장 나눔',
      '자재 거래와 나눔은 이용자 간 직접 확인합니다.',
      '서울 강서',
      '자재',
      null::date,
      0,
      '댓글 확인',
      jsonb_build_object(
        'material_name', '석고보드',
        'quantity', '12장',
        'price', 0,
        'market_region', '서울 강서',
        'direct_trade', true,
        'contact_method', '댓글 확인'
      )
    ),
    (
      '00000000-0000-0000-0000-000000000107'::uuid,
      'free',
      '오늘 현장 비 와도 진행하나요?',
      '지역별 상황을 댓글로 공유하는 예시 글입니다.',
      '전국',
      '현장자유',
      null::date,
      null::integer,
      '댓글',
      '{}'::jsonb
    ),
    (
      '00000000-0000-0000-0000-000000000108'::uuid,
      'beginner',
      '초보 첫 현장 준비물 체크',
      '안전화, 장갑, 작업복, 물통처럼 기본 준비물을 확인하는 예시 글입니다.',
      '전국',
      '초보입문',
      null::date,
      null::integer,
      '댓글',
      '{}'::jsonb
    ),
    (
      '00000000-0000-0000-0000-000000000109'::uuid,
      'work-raid',
      '평택 타일 현장 2명 구함',
      '작업 조건은 작성자와 직접 확인하는 샘플 작업레이드 글입니다.',
      '경기 평택',
      '타일',
      '2026-07-06'::date,
      180000,
      '댓글 후 문자',
      jsonb_build_object('site_region', '경기 평택', 'departure_region', '울산 남구', 'work_date', '2026-07-06', 'trade', '타일', 'needed_count', 2, 'daily_pay', 180000, 'contact_method', '댓글 후 문자', 'lodging_provided', true, 'beginner_ok', true, 'recruiting_status', '모집중')
    ),
    (
      '00000000-0000-0000-0000-000000000110'::uuid,
      'work-raid',
      '김포 물류 양중 보조 4명',
      '물량과 작업시간은 이용자 간 직접 확인하는 샘플 글입니다.',
      '경기 김포',
      '양중',
      '2026-07-07'::date,
      170000,
      '댓글 확인',
      jsonb_build_object('site_region', '경기 김포', 'departure_region', '서울 영등포', 'work_date', '2026-07-07', 'trade', '양중', 'needed_count', 4, 'daily_pay', 170000, 'contact_method', '댓글 확인', 'meal_provided', true, 'lodging_provided', false, 'beginner_ok', true, 'recruiting_status', '모집중')
    ),
    (
      '00000000-0000-0000-0000-000000000111'::uuid,
      'work-raid',
      '인천 송도 전기 조공 3명',
      '전기 조공 작업 정보 공유용 샘플 글입니다.',
      '인천 송도',
      '전기 조공',
      '2026-07-08'::date,
      190000,
      '댓글 후 연락',
      jsonb_build_object('site_region', '인천 송도', 'departure_region', '서울 구로', 'work_date', '2026-07-08', 'trade', '전기 조공', 'needed_count', 3, 'daily_pay', 190000, 'pay_method', '익일지급', 'work_hours', '08:00-17:00', 'contact_method', '댓글 후 연락', 'beginner_ok', true, 'recruiting_status', '모집중')
    ),
    (
      '00000000-0000-0000-0000-000000000112'::uuid,
      'work-raid',
      '서울 강서 철거 보조 2명',
      '철거 보조 정보 공유용 샘플 글입니다.',
      '서울 강서',
      '철거',
      '2026-07-09'::date,
      160000,
      '댓글',
      jsonb_build_object('site_region', '서울 강서', 'departure_region', '서울 신림', 'work_date', '2026-07-09', 'trade', '철거', 'needed_count', 2, 'daily_pay', 160000, 'required_tools', '안전화, 장갑', 'contact_method', '댓글', 'beginner_ok', true, 'recruiting_status', '모집중')
    ),
    (
      '00000000-0000-0000-0000-000000000113'::uuid,
      'work-raid',
      '수원 샷시 보조 1명',
      '샷시 보조 작업 정보 샘플입니다.',
      '경기 수원',
      '샷시',
      '2026-07-10'::date,
      180000,
      '댓글 후 전화',
      jsonb_build_object('site_region', '경기 수원', 'departure_region', '경기 안양', 'work_date', '2026-07-10', 'trade', '샷시', 'needed_count', 1, 'daily_pay', 180000, 'contact_method', '댓글 후 전화', 'lodging_provided', false, 'beginner_ok', false, 'recruiting_status', '모집중')
    ),
    (
      '00000000-0000-0000-0000-000000000114'::uuid,
      'work-raid',
      '부천 도배 장판 보조 2명',
      '도배와 장판 보조 정보 공유 샘플입니다.',
      '경기 부천',
      '도배 장판',
      '2026-07-11'::date,
      170000,
      '댓글 확인',
      jsonb_build_object('site_region', '경기 부천', 'departure_region', '서울 양천', 'work_date', '2026-07-11', 'trade', '도배 장판', 'needed_count', 2, 'daily_pay', 170000, 'contact_method', '댓글 확인', 'meal_provided', false, 'beginner_ok', true, 'recruiting_status', '모집중')
    ),
    (
      '00000000-0000-0000-0000-000000000115'::uuid,
      'work-raid',
      '시흥 미장 보조 급구',
      '급구 샘플 글이며 조건은 당사자 간 직접 확인합니다.',
      '경기 시흥',
      '미장',
      '2026-07-12'::date,
      190000,
      '댓글 후 문자',
      jsonb_build_object('site_region', '경기 시흥', 'departure_region', '인천', 'work_date', '2026-07-12', 'trade', '미장', 'needed_count', 2, 'daily_pay', 190000, 'contact_method', '댓글 후 문자', 'transport', '동승 가능', 'beginner_ok', false, 'recruiting_status', '모집중')
    ),
    (
      '00000000-0000-0000-0000-000000000116'::uuid,
      'work-raid',
      '용인 방수 현장 2명',
      '방수 현장 정보 공유용 샘플입니다.',
      '경기 용인',
      '방수',
      '2026-07-13'::date,
      200000,
      '댓글 확인',
      jsonb_build_object('site_region', '경기 용인', 'departure_region', '서울 사당', 'work_date', '2026-07-13', 'trade', '방수', 'needed_count', 2, 'daily_pay', 200000, 'contact_method', '댓글 확인', 'meal_provided', true, 'beginner_ok', false, 'recruiting_status', '모집중')
    ),
    (
      '00000000-0000-0000-0000-000000000117'::uuid,
      'work-raid',
      '하남 인테리어 잡부 3명',
      '인테리어 보조 정보 공유용 샘플입니다.',
      '경기 하남',
      '잡부',
      '2026-07-14'::date,
      150000,
      '댓글',
      jsonb_build_object('site_region', '경기 하남', 'departure_region', '서울 강동', 'work_date', '2026-07-14', 'trade', '잡부', 'needed_count', 3, 'daily_pay', 150000, 'contact_method', '댓글', 'beginner_ok', true, 'recruiting_status', '모집중')
    ),
    (
      '00000000-0000-0000-0000-000000000118'::uuid,
      'remote-raid',
      '울산 출발 평택 원정 타일 3일',
      '원정 작업 샘플 글입니다. 숙소와 이동은 직접 확인해야 합니다.',
      '울산->경기 평택',
      '타일',
      '2026-07-08'::date,
      210000,
      '댓글 후 연락',
      jsonb_build_object('site_region', '경기 평택', 'departure_region', '울산', 'work_date', '2026-07-08', 'work_period', '3일', 'trade', '타일', 'needed_count', 2, 'daily_pay', 210000, 'lodging_provided', true, 'transportation_provided', true, 'ride_share_available', true, 'transport', '차량 동승 협의', 'contact_method', '댓글 후 연락', 'beginner_ok', false, 'recruiting_status', '모집중')
    ),
    (
      '00000000-0000-0000-0000-000000000119'::uuid,
      'remote-raid',
      '부산 출발 수도권 목공 원정',
      '수도권 원정작업 정보 공유 샘플입니다.',
      '부산->수도권',
      '목공',
      '2026-07-09'::date,
      220000,
      '댓글 확인',
      jsonb_build_object('site_region', '경기 화성', 'departure_region', '부산', 'work_date', '2026-07-09', 'work_period', '1주', 'trade', '목공', 'needed_count', 2, 'daily_pay', 220000, 'lodging_provided', true, 'meal_provided', true, 'transportation_provided', true, 'contact_method', '댓글 확인', 'beginner_ok', false, 'recruiting_status', '모집중')
    ),
    (
      '00000000-0000-0000-0000-000000000120'::uuid,
      'remote-raid',
      '경남 출발 인천 설비 원정 2명',
      '장거리 작업 조건은 당사자 간 직접 확인합니다.',
      '경남->인천',
      '설비',
      '2026-07-10'::date,
      200000,
      '댓글 후 문자',
      jsonb_build_object('site_region', '인천', 'departure_region', '경남', 'work_date', '2026-07-10', 'work_period', '5일', 'trade', '설비', 'needed_count', 2, 'daily_pay', 200000, 'lodging_provided', true, 'transportation_provided', true, 'transport', '교통비 협의', 'contact_method', '댓글 후 문자', 'beginner_ok', true, 'recruiting_status', '모집중')
    ),
    (
      '00000000-0000-0000-0000-000000000121'::uuid,
      'remote-raid',
      '대구 출발 경기 전기 원정',
      '원정 전기 작업 정보 샘플입니다.',
      '대구->경기',
      '전기',
      '2026-07-11'::date,
      230000,
      '댓글 후 연락',
      jsonb_build_object('site_region', '경기 용인', 'departure_region', '대구', 'work_date', '2026-07-11', 'work_period', '4일', 'trade', '전기', 'needed_count', 1, 'daily_pay', 230000, 'lodging_provided', true, 'contact_method', '댓글 후 연락', 'beginner_ok', false, 'recruiting_status', '모집중')
    ),
    (
      '00000000-0000-0000-0000-000000000122'::uuid,
      'tool-market',
      '디월트 그라인더 판매',
      '공구 거래 샘플 글입니다. 거래는 이용자 간 직접 진행됩니다.',
      '부산 사상',
      '공구',
      null::date,
      70000,
      '댓글 후 연락',
      jsonb_build_object('tool_name', '디월트 그라인더', 'transaction_type', '판매', 'price', 70000, 'condition', '사용감 있음', 'market_region', '부산 사상', 'contact_method', '댓글 후 연락')
    ),
    (
      '00000000-0000-0000-0000-000000000123'::uuid,
      'tool-market',
      '레이저 레벨기 대여',
      '대여 조건은 직접 확인하는 샘플 글입니다.',
      '서울 구로',
      '공구',
      null::date,
      30000,
      '댓글 확인',
      jsonb_build_object('tool_name', '레이저 레벨기', 'transaction_type', '대여', 'price', 30000, 'condition', '정상 작동', 'market_region', '서울 구로', 'contact_method', '댓글 확인')
    ),
    (
      '00000000-0000-0000-0000-000000000124'::uuid,
      'tool-market',
      '안전화 새제품 교환',
      '공구/작업용품 교환 샘플 글입니다.',
      '경기 안산',
      '작업용품',
      null::date,
      0,
      '댓글',
      jsonb_build_object('tool_name', '안전화 270', 'transaction_type', '교환', 'price', 0, 'condition', '미사용', 'market_region', '경기 안산', 'contact_method', '댓글')
    ),
    (
      '00000000-0000-0000-0000-000000000125'::uuid,
      'tool-market',
      '임팩 배터리 5Ah 판매',
      '공구 배터리 거래 샘플입니다.',
      '울산 남구',
      '공구',
      null::date,
      60000,
      '댓글 후 문자',
      jsonb_build_object('tool_name', '임팩 배터리 5Ah', 'transaction_type', '판매', 'price', 60000, 'condition', '상태 양호', 'market_region', '울산 남구', 'contact_method', '댓글 후 문자')
    ),
    (
      '00000000-0000-0000-0000-000000000126'::uuid,
      'materials',
      '타일 본드 남은 자재 거래',
      '자재 거래는 당사자 간 직접 진행하는 샘플입니다.',
      '경기 화성',
      '자재',
      null::date,
      20000,
      '댓글 확인',
      jsonb_build_object('material_name', '타일 본드', 'quantity', '5포', 'price', 20000, 'market_region', '경기 화성', 'direct_trade', true, 'contact_method', '댓글 확인')
    ),
    (
      '00000000-0000-0000-0000-000000000127'::uuid,
      'materials',
      '목재 각재 소량 나눔',
      '남는 자재 나눔 샘플 글입니다.',
      '인천 부평',
      '자재',
      null::date,
      0,
      '댓글',
      jsonb_build_object('material_name', '목재 각재', 'quantity', '소량', 'price', 0, 'market_region', '인천 부평', 'direct_trade', true, 'contact_method', '댓글')
    ),
    (
      '00000000-0000-0000-0000-000000000128'::uuid,
      'materials',
      '페인트 남은 통 판매',
      '페인트 자재 거래 샘플입니다.',
      '대구 북구',
      '자재',
      null::date,
      15000,
      '댓글 후 연락',
      jsonb_build_object('material_name', '페인트', 'quantity', '2통', 'price', 15000, 'market_region', '대구 북구', 'direct_trade', true, 'contact_method', '댓글 후 연락')
    ),
    (
      '00000000-0000-0000-0000-000000000129'::uuid,
      'materials',
      '방수 시트 남은 자재',
      '방수 자재 거래 샘플입니다.',
      '광주 광산',
      '자재',
      null::date,
      40000,
      '댓글 확인',
      jsonb_build_object('material_name', '방수 시트', 'quantity', '1롤', 'price', 40000, 'market_region', '광주 광산', 'direct_trade', false, 'contact_method', '댓글 확인')
    ),
    (
      '00000000-0000-0000-0000-000000000130'::uuid,
      'questions',
      '샷시 실리콘 마감 질문',
      '현장 질문 게시판 화면 확인용 샘플 글입니다.',
      '전국',
      '샷시',
      null::date,
      null::integer,
      '댓글',
      '{}'::jsonb
    )
)
insert into public.posts (
  id,
  board_id,
  author_id,
  title,
  body,
  status,
  region_text,
  trade_text,
  work_date,
  daily_pay,
  contact_method,
  extra
)
select
  sample_posts.id,
  boards.id,
  seed_author.id,
  sample_posts.title,
  sample_posts.body,
  'recruiting',
  sample_posts.region_text,
  sample_posts.trade_text,
  sample_posts.work_date,
  sample_posts.daily_pay,
  sample_posts.contact_method,
  sample_posts.extra
from sample_posts
join public.boards on boards.slug = sample_posts.board_slug
cross join seed_author
on conflict (id) do update set
  title = excluded.title,
  body = excluded.body,
  status = excluded.status,
  region_text = excluded.region_text,
  trade_text = excluded.trade_text,
  work_date = excluded.work_date,
  daily_pay = excluded.daily_pay,
  contact_method = excluded.contact_method,
  extra = excluded.extra;

-- 베타 테스트용 운영 공지와 현장감 있는 샘플 글
-- 아래 데이터는 같은 id로 upsert되므로 seed.sql을 다시 실행해도 같은 샘플이 갱신됩니다.

insert into public.notices (id, title, body, is_published)
values
  (
    '00000000-0000-0000-0000-000000000902',
    'Job일 이용 규칙',
    'Job일은 현장직 정보 공유 커뮤니티입니다. 작업 조건, 임금, 안전사항, 거래 조건은 이용자끼리 직접 확인해주세요. 개인정보 노출과 공개 저격글은 숨김 처리될 수 있습니다.',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000903',
    '허위 구인글 금지',
    '현장지역, 작업날짜, 직종, 필요인원, 일당, 연락방법은 실제와 다르게 적지 말아주세요. 허위 구인글은 신고 접수 후 운영자가 숨김 처리할 수 있습니다.',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000904',
    '임금조건 명확히 적기',
    '일당, 지급방식, 작업시간, 식사, 숙소, 교통비 조건은 가능한 한 글에 명확히 적어주세요. Job일은 임금 지급이나 정산을 대행하지 않습니다.',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000905',
    '공구거래 주의사항',
    '공구와 자재 거래는 이용자 간 직접 진행됩니다. 상태, 수량, 가격, 지역, 연락방법을 직접 확인하고, 사기 의심 글은 신고해주세요.',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000906',
    '초보 현장 입문 가이드',
    '첫 현장은 안전화, 장갑, 작업복, 물통, 신분증 사본 요구 여부가 아닌 기본 준비물과 작업 내용을 먼저 확인하세요. 주민등록번호, 신분증 이미지, 계좌번호는 Job일에서 받지 않습니다.',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000907',
    '원정작업 체크리스트',
    '원정작업은 숙소, 교통비, 차량동승, 작업기간, 지급방식, 필요공구를 출발 전에 직접 확인하세요. Job일은 출근 관리나 작업 배정을 하지 않습니다.',
    true
  )
on conflict (id) do update set
  title = excluded.title,
  body = excluded.body,
  is_published = excluded.is_published;

with seed_author as (
  select id
  from public.profiles
  where status = 'active'
  order by created_at asc
  limit 1
),
work_rows(seed_no, title, body, status, site_region, departure_region, work_date, trade, needed_count, daily_pay, pay_method, work_hours, meal_provided, lodging_provided, transportation_provided, ride_share_available, beginner_ok, required_tools, contact_method) as (
  values
    (3001, '평택 타일 디모도 2명 구함', '평택 아파트 세대 타일 보조입니다. 줄눈 전 준비와 자재 이동 조금 있습니다. 조건은 댓글 후 직접 확인해주세요.', 'recruiting', '경기 평택', '울산 남구', '2026-07-06'::date, '타일', 2, 180000, '당일지급', '08:00-17:00', true, true, true, true, true, '안전화, 장갑', '댓글 후 문자'),
    (3002, '화성 전기 조공 3명 내일부터', '전선 정리와 자재 운반 위주입니다. 초보 가능하지만 안전화는 꼭 필요합니다.', 'recruiting', '경기 화성', '서울 구로', '2026-07-07'::date, '전기 조공', 3, 185000, '익일지급', '08:00-17:30', false, false, false, false, true, '안전화, 장갑', '댓글 확인'),
    (3003, '김포 물류센터 양중 4명', '석고보드와 자재 양중 있습니다. 무거운 것 가능하신 분만 연락주세요.', 'recruiting', '경기 김포', '서울 영등포', '2026-07-08'::date, '양중', 4, 170000, '당일지급', '07:30-16:30', true, false, false, false, true, '안전화', '댓글 후 연락'),
    (3004, '인천 송도 전기 조공 주간 3명', '상가 전기 배관 보조입니다. 조공 경험 있으면 좋고 초보도 설명 가능합니다.', 'recruiting', '인천 송도', '서울 구로', '2026-07-09'::date, '전기', 3, 190000, '익일지급', '08:00-17:00', false, false, false, false, true, '안전화, 절연장갑 있으면 좋음', '댓글 후 연락'),
    (3005, '서울 강서 철거 보조 2명', '내부 철거 보조입니다. 먼지 많으니 마스크 챙기세요.', 'recruiting', '서울 강서', '서울 신림', '2026-07-10'::date, '철거', 2, 160000, '당일지급', '08:00-17:00', false, false, false, false, true, '안전화, 장갑, 마스크', '댓글'),
    (3006, '수원 샷시 보조 1명', '샷시 설치 보조입니다. 경험자 우대이고 공구는 팀장님 쪽에서 준비합니다.', 'recruiting', '경기 수원', '경기 안양', '2026-07-11'::date, '샷시', 1, 180000, '익일지급', '08:00-17:00', false, false, false, false, false, '안전화', '댓글 후 전화'),
    (3007, '부천 도배 장판 보조 2명', '도배 장판 현장 정리와 보조입니다. 초보 가능하지만 꼼꼼한 분이면 좋습니다.', 'closed', '경기 부천', '서울 양천', '2026-07-12'::date, '도배', 2, 170000, '당일지급', '08:30-17:30', false, false, false, false, true, '작업복', '댓글 확인'),
    (3008, '시흥 미장 보조 급구', '미장 보조 2명 구합니다. 동승 가능 여부는 댓글로 확인해주세요.', 'recruiting', '경기 시흥', '인천', '2026-07-13'::date, '미장', 2, 190000, '익일지급', '08:00-17:00', false, false, false, true, false, '안전화, 장화', '댓글 후 문자'),
    (3009, '용인 방수 현장 2명', '옥상 방수 보조입니다. 경험 있으면 좋고 안전장비 챙겨주세요.', 'recruiting', '경기 용인', '서울 사당', '2026-07-14'::date, '방수', 2, 200000, '주급', '08:00-17:00', true, false, false, false, false, '안전화, 장갑', '댓글 확인'),
    (3010, '하남 인테리어 잡부 3명', '상가 인테리어 자재 정리와 청소입니다. 초보 가능합니다.', 'recruiting', '경기 하남', '서울 강동', '2026-07-15'::date, '잡부', 3, 150000, '당일지급', '09:00-18:00', false, false, false, false, true, '안전화', '댓글'),
    (3011, '분당 목공 보조 2명', '몰딩과 가벽 작업 보조입니다. 목공 경험자 우대합니다.', 'recruiting', '경기 성남 분당', '서울 잠실', '2026-07-16'::date, '목공', 2, 200000, '익일지급', '08:00-17:00', false, false, false, false, false, '안전화, 개인공구 있으면 좋음', '댓글 후 연락'),
    (3012, '의정부 설비 보조 1명', '화장실 배관 보조입니다. 초보 가능하지만 냄새 민감하신 분은 참고하세요.', 'recruiting', '경기 의정부', '서울 노원', '2026-07-17'::date, '설비', 1, 175000, '당일지급', '08:00-17:00', false, false, false, false, true, '장화, 장갑', '댓글 확인'),
    (3013, '안산 페인트 보조 2명', '실내 페인트 보조입니다. 보양 작업 많습니다.', 'recruiting', '경기 안산', '인천 남동', '2026-07-18'::date, '페인트', 2, 165000, '익일지급', '08:30-17:30', false, false, false, false, true, '작업복, 마스크', '댓글 후 문자'),
    (3014, '서울 마포 타일 보조 1명', '욕실 타일 보조입니다. 자재 옮기는 일 조금 있습니다.', 'closed', '서울 마포', '서울 신촌', '2026-07-19'::date, '타일', 1, 180000, '당일지급', '08:00-17:00', false, false, false, false, true, '안전화', '댓글'),
    (3015, '광명 철거 조공 3명', '상가 내부 철거입니다. 오전 집합 시간 꼭 지켜주세요.', 'recruiting', '경기 광명', '서울 구로', '2026-07-20'::date, '철거', 3, 170000, '당일지급', '07:30-16:30', true, false, false, false, true, '안전화, 마스크', '댓글 후 연락'),
    (3016, '파주 물류 칸막이 보조 2명', '칸막이 자재 운반과 설치 보조입니다.', 'recruiting', '경기 파주', '서울 은평', '2026-07-21'::date, '인테리어', 2, 180000, '익일지급', '08:00-17:30', false, false, false, false, true, '안전화', '댓글 확인'),
    (3017, '청라 전기 트레이 보조 2명', '트레이 설치 보조입니다. 높은 곳 작업 가능하신 분 우대합니다.', 'recruiting', '인천 청라', '인천 부평', '2026-07-22'::date, '전기', 2, 195000, '주급', '08:00-17:00', false, false, false, false, false, '안전화, 안전벨트', '댓글 후 연락'),
    (3018, '구리 방수 보조 1명', '베란다 방수 보조입니다. 하루 작업 예정입니다.', 'recruiting', '경기 구리', '서울 중랑', '2026-07-23'::date, '방수', 1, 190000, '당일지급', '08:30-17:00', false, false, false, false, false, '장갑, 작업복', '댓글'),
    (3019, '천안 설비 조공 2명', '오피스텔 설비 보조입니다. 식사 제공 여부는 연락 시 확인해주세요.', 'recruiting', '충남 천안', '대전', '2026-07-24'::date, '설비', 2, 180000, '익일지급', '08:00-17:00', false, false, false, false, true, '안전화', '댓글 확인'),
    (3020, '부산 해운대 목공 보조', '상가 목공 보조입니다. 부산권 작업자 우선입니다.', 'recruiting', '부산 해운대', '부산 사상', '2026-07-25'::date, '목공', 1, 190000, '당일지급', '08:00-17:00', false, false, false, false, false, '안전화', '댓글 후 문자')
),
remote_rows(seed_no, title, body, status, site_region, departure_region, work_date, work_period, trade, needed_count, daily_pay, lodging_provided, transportation_provided, ride_share_available, beginner_ok, contact_method) as (
  values
    (3101, '울산 출발 평택 원정 타일 3일', '부산/울산권에서 같이 올라갈 분 찾습니다. 숙소와 차량동승은 출발 전 직접 확인해주세요.', 'recruiting', '경기 평택', '울산', '2026-07-08'::date, '3일', '타일', 2, 210000, true, true, true, false, '댓글 후 연락'),
    (3102, '부산 출발 화성 목공 원정 1주', '수도권 목공 원정입니다. 숙소 제공 예정이고 작업내용은 연락 시 확인해주세요.', 'recruiting', '경기 화성', '부산', '2026-07-09'::date, '1주', '목공', 2, 220000, true, true, false, false, '댓글 확인'),
    (3103, '경남 출발 인천 설비 원정 5일', '설비 보조 2명 필요합니다. 교통비는 협의로 적혀 있으니 직접 확인 부탁드립니다.', 'recruiting', '인천', '경남 창원', '2026-07-10'::date, '5일', '설비', 2, 200000, true, true, false, true, '댓글 후 문자'),
    (3104, '대구 출발 용인 전기 원정', '전기 배관 보조입니다. 숙소 제공, 초보는 어려울 수 있습니다.', 'closed', '경기 용인', '대구', '2026-07-11'::date, '4일', '전기', 1, 230000, true, false, false, false, '댓글 후 연락'),
    (3105, '부산 출발 김포 물류 양중 원정', '양중 경험자 위주로 구합니다. 숙소와 식사는 연락 시 확인해주세요.', 'recruiting', '경기 김포', '부산', '2026-07-12'::date, '2일', '양중', 3, 200000, true, true, true, false, '댓글'),
    (3106, '울산 출발 시흥 미장 원정', '미장 보조 가능하신 분 찾습니다. 차량동승 가능 인원 먼저 댓글 주세요.', 'recruiting', '경기 시흥', '울산', '2026-07-13'::date, '3일', '미장', 2, 215000, true, true, true, false, '댓글 확인'),
    (3107, '경남 양산 출발 파주 인테리어 원정', '상가 인테리어 보조입니다. 숙소 제공 여부는 글 작성자와 직접 확인해야 합니다.', 'recruiting', '경기 파주', '경남 양산', '2026-07-14'::date, '1주', '인테리어', 2, 190000, true, false, false, true, '댓글 후 연락'),
    (3108, '부산 출발 서울 철거 원정 2일', '철거 경험자 우대합니다. 먼지 많고 보호구 챙겨야 합니다.', 'recruiting', '서울 강서', '부산', '2026-07-15'::date, '2일', '철거', 2, 190000, true, true, false, false, '댓글 후 문자'),
    (3109, '울산 출발 하남 방수 원정', '방수 경험자 1명 구합니다. 숙소는 모텔 예정이라고 하니 직접 확인해주세요.', 'recruiting', '경기 하남', '울산', '2026-07-16'::date, '4일', '방수', 1, 230000, true, true, true, false, '댓글'),
    (3110, '창원 출발 수원 샷시 원정', '샷시 보조 경험자 구합니다. 차량동승 가능 여부는 출발 전 확인 바랍니다.', 'recruiting', '경기 수원', '경남 창원', '2026-07-17'::date, '3일', '샷시', 1, 210000, true, false, true, false, '댓글 확인')
),
dimodo_rows(seed_no, title, body, status, site_region, work_date, trade, needed_count, daily_pay, beginner_ok, work_hours, contact_method) as (
  values
    (3201, '송도 디모도 1명 내일', '현장 정리와 보조 위주입니다. 초보 가능하지만 시간 엄수 부탁드립니다.', 'recruiting', '인천 송도', '2026-07-06'::date, '디모도', 1, 160000, true, '08:00-17:00', '댓글 후 전화'),
    (3202, '마곡 조공 2명 급구', '상가 내부 작업 보조입니다. 안전화 필수입니다.', 'recruiting', '서울 마곡', '2026-07-06'::date, '조공', 2, 165000, true, '08:00-17:00', '댓글'),
    (3203, '평택 디모도 2명', '타일 현장 보조입니다. 자재 조금 옮깁니다.', 'recruiting', '경기 평택', '2026-07-07'::date, '디모도', 2, 170000, true, '08:00-17:30', '댓글 확인'),
    (3204, '수원 전기 조공 1명', '전기 보조 경험 조금 있으신 분이면 좋습니다.', 'closed', '경기 수원', '2026-07-07'::date, '전기 조공', 1, 175000, false, '08:00-17:00', '댓글 후 연락'),
    (3205, '부산 사상 철거 보조 2명', '철거 보조입니다. 마스크 챙기세요.', 'recruiting', '부산 사상', '2026-07-08'::date, '철거 조공', 2, 155000, true, '08:00-17:00', '댓글'),
    (3206, '울산 남구 설비 조공', '설비 보조 하루 작업입니다.', 'recruiting', '울산 남구', '2026-07-08'::date, '설비 조공', 1, 165000, true, '08:30-17:30', '댓글 후 문자'),
    (3207, '천안 물류 디모도 3명', '물류창고 자재 정리 보조입니다.', 'recruiting', '충남 천안', '2026-07-09'::date, '디모도', 3, 150000, true, '09:00-18:00', '댓글 확인'),
    (3208, '용인 목공 조공 1명', '목공 보조 경험자 우대합니다.', 'recruiting', '경기 용인', '2026-07-09'::date, '목공 조공', 1, 180000, false, '08:00-17:00', '댓글'),
    (3209, '김해 방수 보조 2명', '옥상 방수 보조입니다. 장화 있으면 좋습니다.', 'recruiting', '경남 김해', '2026-07-10'::date, '방수 조공', 2, 170000, true, '08:00-17:00', '댓글 후 연락'),
    (3210, '고양 인테리어 보조', '자재 정리와 청소 위주입니다.', 'recruiting', '경기 고양', '2026-07-10'::date, '인테리어 조공', 1, 155000, true, '09:00-18:00', '댓글 확인'),
    (3211, '대전 타일 디모도 1명', '욕실 타일 보조입니다.', 'recruiting', '대전', '2026-07-11'::date, '타일 디모도', 1, 165000, true, '08:00-17:00', '댓글'),
    (3212, '인천 부평 샷시 보조', '샷시 작업 보조입니다. 경험자 우대합니다.', 'recruiting', '인천 부평', '2026-07-11'::date, '샷시 조공', 1, 175000, false, '08:00-17:00', '댓글 후 문자'),
    (3213, '안양 페인트 보조 2명', '보양과 정리 작업 많습니다.', 'recruiting', '경기 안양', '2026-07-12'::date, '페인트 조공', 2, 160000, true, '08:30-17:30', '댓글'),
    (3214, '창원 설비 보조 1명', '상가 설비 보조 하루 작업입니다.', 'recruiting', '경남 창원', '2026-07-12'::date, '설비 조공', 1, 170000, true, '08:00-17:00', '댓글 확인'),
    (3215, '광주 미장 보조 2명', '미장 보조입니다. 초보는 힘들 수 있습니다.', 'recruiting', '광주 광산', '2026-07-13'::date, '미장 조공', 2, 180000, false, '08:00-17:00', '댓글 후 연락')
),
available_rows(seed_no, title, body, region_text, available_date, trade, experience, desired_pay, owned_tools, has_vehicle, can_travel, contact_method) as (
  values
    (3301, '오늘 경기 서부 전기 조공 가능합니다', '안산, 시흥, 화성 쪽 가능합니다. 안전화 있고 차량 있습니다.', '경기 서부', '2026-07-04'::date, '전기 조공', '1년', 170000, '안전화, 공구벨트', true, true, '댓글 확인'),
    (3302, '내일 부산 철거 보조 가능', '부산 전지역 이동 가능합니다. 철거 경험 6개월 있습니다.', '부산', '2026-07-05'::date, '철거', '6개월', 160000, '안전화, 마스크', false, false, '댓글'),
    (3303, '오늘 울산 설비 조공 가능', '울산 남구, 북구 가능합니다. 기본 공구 조금 있습니다.', '울산', '2026-07-04'::date, '설비 조공', '초보', 160000, '장갑, 안전화', true, false, '댓글 후 문자'),
    (3304, '경남 창원 내일 양중 가능', '무거운 일 가능합니다. 시간만 맞으면 바로 갑니다.', '경남 창원', '2026-07-05'::date, '양중', '2년', 180000, '안전화', true, true, '댓글 확인'),
    (3305, '서울 남부 도배 보조 가능', '도배 보조 몇 번 해봤습니다. 초보 단가로 가능합니다.', '서울 남부', '2026-07-06'::date, '도배 조공', '초보', 150000, '작업복', false, false, '댓글'),
    (3306, '인천 전기 조공 오늘 가능', '송도, 청라, 부평 가능합니다. 전기 조공 8개월입니다.', '인천', '2026-07-04'::date, '전기 조공', '8개월', 175000, '공구벨트, 안전화', true, false, '댓글 후 연락'),
    (3307, '대구 목공 보조 이번주 가능', '목공 보조 경험 있습니다. 원정은 조건 보고 가능합니다.', '대구', '2026-07-07'::date, '목공 조공', '1년', 180000, '임팩, 안전화', true, true, '댓글 확인'),
    (3308, '광주 페인트 보조 가능', '보양 작업 해봤습니다. 당일 작업 가능해요.', '광주', '2026-07-05'::date, '페인트', '3개월', 150000, '작업복', false, false, '댓글'),
    (3309, '경기 북부 잡부 가능합니다', '의정부, 고양, 파주 가능합니다. 차량은 없습니다.', '경기 북부', '2026-07-06'::date, '잡부', '1년', 150000, '안전화', false, false, '댓글 후 문자'),
    (3310, '부산에서 수도권 원정 가능합니다', '숙소와 교통비 조건 맞으면 수도권 원정 가능합니다.', '부산', '2026-07-08'::date, '타일 조공', '1년', 190000, '안전화, 줄자', false, true, '댓글 확인'),
    (3311, '울산 방수 보조 가능', '옥상 방수 보조 몇 번 했습니다. 장화 있습니다.', '울산', '2026-07-06'::date, '방수', '6개월', 170000, '장화, 장갑', true, false, '댓글'),
    (3312, '서울 강동 샷시 보조 가능', '샷시 보조 경험 있습니다. 하루 작업 가능합니다.', '서울 강동', '2026-07-05'::date, '샷시 조공', '1년', 180000, '안전화', false, false, '댓글 후 연락'),
    (3313, '천안 설비 조공 가능', '천안, 아산 가능합니다. 차량 있습니다.', '충남 천안', '2026-07-07'::date, '설비 조공', '초보', 160000, '안전화', true, false, '댓글 확인'),
    (3314, '경기 남부 미장 조공 가능', '수원, 오산, 화성 가능합니다. 미장 보조 해봤습니다.', '경기 남부', '2026-07-08'::date, '미장 조공', '5개월', 170000, '장갑, 안전화', true, false, '댓글'),
    (3315, '전국 원정 전기 조공 가능합니다', '숙소 제공이면 원정 가능합니다. 전기 조공 2년입니다.', '전국', '2026-07-09'::date, '전기 조공', '2년', 200000, '공구벨트, 안전화', true, true, '댓글 후 문자')
),
tool_rows(seed_no, title, body, status, region_text, tool_name, transaction_type, price, condition, contact_method) as (
  values
    (3401, '밀워키 임팩 판매합니다', '사용감 있지만 작동 문제 없습니다. 직거래 선호합니다.', 'recruiting', '경기 수원', '밀워키 임팩', '판매', 120000, '사용감 있음', '댓글 후 연락'),
    (3402, '레이저 레벨기 하루 대여', '실내에서만 썼고 수평 잘 맞습니다. 보증금 여부는 직접 협의해주세요.', 'recruiting', '서울 구로', '레이저 레벨기', '대여', 30000, '정상 작동', '댓글 확인'),
    (3403, '안전화 270 새제품 교환', '사이즈가 안 맞아서 265 또는 장갑 세트와 교환 원합니다.', 'recruiting', '경기 안산', '안전화 270', '교환', 0, '미사용', '댓글'),
    (3404, '디월트 그라인더 판매', '날은 빼고 본체만 판매합니다.', 'closed', '부산 사상', '디월트 그라인더', '판매', 70000, '사용감 있음', '댓글 후 문자'),
    (3405, '임팩 배터리 5Ah 판매', '충전 잘 됩니다. 같은 브랜드 쓰시는 분 가져가세요.', 'recruiting', '울산 남구', '임팩 배터리 5Ah', '판매', 60000, '상태 양호', '댓글 후 문자'),
    (3406, '컷쏘 대여합니다', '철거 하루 작업용으로 대여 가능합니다.', 'recruiting', '인천 부평', '컷쏘', '대여', 25000, '사용 가능', '댓글 확인'),
    (3407, '함마드릴 판매 또는 교환', '큰 작업이 줄어서 정리합니다. 레이저 레벨기와 교환도 봅니다.', 'recruiting', '경기 화성', '함마드릴', '교환', 90000, '사용감 있음', '댓글'),
    (3408, '공구벨트 판매', '한 달 정도 사용했습니다. 상태 괜찮습니다.', 'recruiting', '서울 강동', '공구벨트', '판매', 25000, '양호', '댓글 후 연락'),
    (3409, '타일 절단기 대여', '소형 타일 절단기입니다. 직접 가져가셔야 합니다.', 'recruiting', '경기 평택', '타일 절단기', '대여', 40000, '정상 작동', '댓글 확인'),
    (3410, '전동 드라이버 판매', '예비용으로 쓰던 제품입니다.', 'recruiting', '대전', '전동 드라이버', '판매', 50000, '상태 보통', '댓글'),
    (3411, '사다리 6자 대여', '인근 직거래만 합니다.', 'recruiting', '광주 광산', '6자 사다리', '대여', 15000, '사용감 있음', '댓글 후 문자'),
    (3412, '보쉬 레이저 거리측정기 판매', '작동 확인했습니다. 박스는 없습니다.', 'recruiting', '경기 성남', '레이저 거리측정기', '판매', 45000, '양호', '댓글 확인'),
    (3413, '작업등 교환 원합니다', '충전식 작업등입니다. 임팩 비트 세트와 교환 원합니다.', 'recruiting', '부산 해운대', '충전식 작업등', '교환', 0, '상태 좋음', '댓글'),
    (3414, '콤프레샤 소형 판매', '목공 보조 때 쓰던 소형 콤프입니다.', 'recruiting', '경남 김해', '소형 콤프레샤', '판매', 130000, '사용감 있음', '댓글 후 연락'),
    (3415, '그라인더 날 묶음 나눔', '남은 날 몇 장 있습니다. 가까운 분 가져가세요.', 'recruiting', '서울 마포', '그라인더 날', '판매', 0, '남은 자재급', '댓글')
),
material_rows(seed_no, title, body, status, region_text, material_name, quantity, price, pickup_only, contact_method) as (
  values
    (3501, '석고보드 12장 무료나눔', '남은 석고보드입니다. 직접 가져가실 분만 댓글 주세요.', 'recruiting', '서울 강서', '석고보드', '12장', 0, true, '댓글 확인'),
    (3502, '타일 본드 5포 거래', '개봉 안 한 타일 본드입니다. 현장 남은 자재입니다.', 'recruiting', '경기 화성', '타일 본드', '5포', 20000, true, '댓글'),
    (3503, '목재 각재 소량 나눔', '각재 조금 남았습니다. 인천 부평 직거래만 합니다.', 'recruiting', '인천 부평', '목재 각재', '소량', 0, true, '댓글 후 연락'),
    (3504, '페인트 2통 판매', '색상 확인 필요합니다. 직접 보고 가져가세요.', 'recruiting', '대구 북구', '페인트', '2통', 15000, true, '댓글 확인'),
    (3505, '방수 시트 1롤', '남은 방수 시트입니다. 택배는 어렵습니다.', 'recruiting', '광주 광산', '방수 시트', '1롤', 40000, true, '댓글'),
    (3506, '몰딩 자재 남은 것 나눔', '흰색 몰딩 몇 본 남았습니다.', 'closed', '경기 부천', '몰딩', '8본', 0, true, '댓글 후 문자'),
    (3507, '전선관 소량 거래', '전기 현장 남은 전선관입니다.', 'recruiting', '경기 시흥', '전선관', '한 묶음', 10000, true, '댓글 확인'),
    (3508, '실리콘 새것 10개 판매', '회색 실리콘입니다. 한 박스 남았습니다.', 'recruiting', '부산 사상', '실리콘', '10개', 25000, true, '댓글'),
    (3509, '장판 남은 자재 나눔', '방 하나 정도는 안 되고 보수용입니다.', 'recruiting', '서울 은평', '장판', '소량', 0, true, '댓글 후 연락'),
    (3510, '타일 여분 2박스', '욕실 보수용 타일입니다. 색상 확인하고 가져가세요.', 'recruiting', '울산 북구', '타일', '2박스', 30000, true, '댓글 확인')
),
free_rows(seed_no, title, body, region_text, trade_text) as (
  values
    (3601, '오늘 비 오는데 외부 작업 다들 하나요?', '서울 쪽은 오전에 그쳤는데 외부 방수 현장은 애매하네요. 다들 어떻게 하는지 궁금합니다.', '전국', '현장자유'),
    (3602, '아침 조회 너무 길면 힘 빠지네요', '작업 시작 전에 전달사항은 좋은데 30분 넘으면 다들 지치는 듯합니다.', '전국', '현장자유'),
    (3603, '평택 숙소 잡아주는 현장 어떤가요', '원정 처음이라 숙소 제공 현장 분위기가 궁금합니다. 직접 확인해야 하는 건 알지만 경험담 부탁드립니다.', '경기 평택', '원정작업'),
    (3604, '안전화 발볼 넓은 거 추천 있나요', '발볼 넓어서 일반 안전화 오래 신으면 발이 너무 아픕니다.', '전국', '작업용품'),
    (3605, '울산에서 수도권 원정 가는 분들', '차량동승 맞춰서 가는 경우가 많은지 궁금합니다.', '울산', '원정작업'),
    (3606, '현장 도시락 vs 근처 백반', '식사 제공이라고 해도 현장마다 차이가 크네요.', '전국', '현장자유'),
    (3607, '일당 당일지급이면 보통 몇 시쯤 받나요', '현장마다 다른 건 알지만 보통 저녁에 받는지 다음날 받는지 궁금합니다.', '전국', '일당'),
    (3608, '장마철 외부 작업 준비물 뭐 챙기세요', '우비 말고 신발이나 장갑 쪽 팁 있으면 공유 부탁드립니다.', '전국', '준비물'),
    (3609, '현장 처음 가면 어디 서 있어야 하나요', '초보라 아침에 도착해서 누구한테 말 걸어야 할지 항상 긴장됩니다.', '전국', '초보'),
    (3610, '공구 빌려주는 팀 분위기 괜찮나요', '개인공구 아직 없는데 매번 빌리는 것도 눈치 보이네요.', '전국', '공구'),
    (3611, '부산 현장 요즘 타일 단가 어떤가요', '지역마다 차이가 큰 것 같아 감 잡고 싶습니다.', '부산', '타일'),
    (3612, '퇴근 후 공구 정리 습관', '작은 비트 자주 잃어버리는데 다들 어떻게 정리하시나요.', '전국', '공구'),
    (3613, '숙소 4인실이면 많이 불편한가요', '원정 가기 전에 직접 확인은 할 건데 경험담 궁금합니다.', '전국', '원정작업'),
    (3614, '현장별 주차 문제 진짜 큽니다', '차량 가지고 다니면 편한데 주차가 생각보다 스트레스네요.', '전국', '차량'),
    (3615, '전기 조공에서 다음 단계로 가려면', '어떤 작업을 먼저 익히면 좋을까요.', '전국', '전기'),
    (3616, '비 오는 날 장갑 뭐 쓰세요', '젖으면 손이 너무 불편해서 추천 부탁드립니다.', '전국', '작업용품'),
    (3617, '현장 말투 적응 어렵네요', '처음엔 다 화내는 줄 알았는데 그냥 빠르게 말하는 분들도 많더라고요.', '전국', '현장자유'),
    (3618, '원정 갈 때 세탁은 어떻게 하세요', '일주일 이상이면 작업복 관리가 은근 문제네요.', '전국', '원정작업'),
    (3619, '점심시간에 차에서 쉬는 분 많나요', '숙소 없는 현장 기준으로 궁금합니다.', '전국', '현장자유'),
    (3620, '오늘도 무사히 끝났습니다', '더운 날 다들 물 챙기고 안전하게 하세요.', '전국', '현장자유')
),
beginner_rows(seed_no, title, body, region_text, trade_text) as (
  values
    (3701, '초보 첫 현장 준비물 체크리스트', '안전화, 장갑, 작업복, 물통, 여벌 양말은 기본으로 챙기면 좋습니다.', '전국', '초보입문'),
    (3702, '조공이 정확히 하는 일이 뭔가요', '직종마다 다르지만 자재 정리, 보조, 청소, 간단 운반이 많습니다. 현장마다 직접 확인하세요.', '전국', '조공'),
    (3703, '디모도랑 조공 차이 쉽게 설명', '현장마다 부르는 말이 다르지만 보조 인력이라는 점은 비슷합니다.', '전국', '디모도'),
    (3704, '초보가 피해야 할 말', '모르는 걸 아는 척하기보다 바로 물어보는 게 안전합니다.', '전국', '초보입문'),
    (3705, '안전화는 싼 거 사도 되나요', '처음엔 기본형도 괜찮지만 오래 신을 거면 발 편한 걸 추천합니다.', '전국', '작업용품'),
    (3706, '첫날 현장 도착하면 할 일', '작성자 연락방법 확인하고, 담당자에게 닉네임보다 실제 약속한 이름으로 확인하세요.', '전국', '초보입문'),
    (3707, '일당 글 볼 때 꼭 확인할 것', '작업시간, 지급방식, 식사, 교통비, 필요공구, 초보가능 여부를 확인하세요.', '전국', '일당'),
    (3708, '원정작업 초보 체크리스트', '숙소, 교통비, 차량동승, 세탁, 작업기간, 지급방식을 출발 전에 확인하세요.', '전국', '원정작업'),
    (3709, '전기 조공 첫 주에 배우는 것', '자재 이름, 배관 보조, 전선 정리부터 익히는 경우가 많습니다.', '전국', '전기'),
    (3710, '타일 디모도 처음이면 힘든 점', '자재 무게와 바닥 정리가 생각보다 힘듭니다. 무릎 보호도 신경 쓰세요.', '전국', '타일'),
    (3711, '철거 보조 갈 때 마스크 필수', '먼지 많은 현장이 많으니 마스크와 장갑은 꼭 챙기세요.', '전국', '철거'),
    (3712, '공구 없으면 현장 못 가나요', '초보가능 글은 기본 공구 없이도 가능한 경우가 있지만 글마다 직접 확인해야 합니다.', '전국', '공구'),
    (3713, '차량 있으면 좋은 점', '지역 이동과 원정에서 유리하지만 주차와 기름값도 같이 봐야 합니다.', '전국', '차량'),
    (3714, '작업복은 어떤 게 편한가요', '계절별로 다르지만 잘 마르고 움직임 편한 옷이 좋습니다.', '전국', '작업복'),
    (3715, '현장 용어 처음 들으면 메모하세요', '자재 이름과 위치를 헷갈리면 다시 묻고 메모하는 게 좋습니다.', '전국', '초보입문'),
    (3716, '초보가 일당 높게만 보면 안 되는 이유', '작업강도, 경험 필요 여부, 지급방식, 이동거리까지 같이 봐야 합니다.', '전국', '일당'),
    (3717, '숙소 제공 글 볼 때 질문할 것', '몇 인실인지, 주차 가능한지, 식사는 어떤지 직접 확인하세요.', '전국', '원정작업'),
    (3718, '작업 중 모르면 멈추고 물어보기', '특히 전기, 높은 곳, 절단 작업은 혼자 판단하지 않는 게 안전합니다.', '전국', '안전'),
    (3719, '현장 첫날 인사 팁', '크게 어렵지 않습니다. 시간 맞춰 가고, 담당자에게 작업 내용부터 확인하세요.', '전국', '초보입문'),
    (3720, '초보 가능 글이라도 확인할 것', '초보 가능이라고 해도 필요한 체력과 공구가 있을 수 있으니 연락 전에 확인하세요.', '전국', '초보입문')
),
question_rows(seed_no, title, body, region_text, trade_text) as (
  values
    (3801, '샷시 실리콘 마감 질문입니다', '마감선이 자꾸 울렁거리는데 초보가 연습할 방법 있을까요?', '전국', '샷시'),
    (3802, '타일 줄눈 전 청소 어느 정도까지 하나요', '현장마다 기준이 다른 것 같아 궁금합니다.', '전국', '타일'),
    (3803, '전기 배관 자를 때 주의할 점', '처음 보조하는데 컷팅할 때 자꾸 삐뚤어집니다.', '전국', '전기'),
    (3804, '방수 프라이머 냄새 심한가요', '처음 방수 현장 가는데 준비할 게 있을까요?', '전국', '방수'),
    (3805, '목공 조공 개인공구 뭐부터 사나요', '임팩부터 사야 할지 공구벨트부터 사야 할지 고민입니다.', '전국', '목공'),
    (3806, '철거 현장 장갑 추천', '일반 코팅 장갑으로 충분한지 궁금합니다.', '전국', '철거'),
    (3807, '도배 초배지 붙일 때 주름 질문', '초보인데 주름이 자꾸 생깁니다.', '전국', '도배'),
    (3808, '미장 보조 첫날 뭐 하나요', '미장 현장은 처음이라 어떤 일을 하는지 궁금합니다.', '전국', '미장'),
    (3809, '양중할 때 허리 덜 아프게 하는 법', '요령이 있을까요. 보호대 쓰시는지도 궁금합니다.', '전국', '양중'),
    (3810, '페인트 보양 테이프 추천', '잘 붙고 덜 남는 제품 있나요?', '전국', '페인트'),
    (3811, '설비 조공 장화 필수인가요', '화장실 배관 보조라는데 장화 챙겨야 할까요?', '전국', '설비'),
    (3812, '현장 식사 제공이면 보통 어떤 방식인가요', '도시락인지 식당인지 글에 없으면 직접 물어봐야겠죠?', '전국', '현장질문'),
    (3813, '원정 숙소 몇 인실인지 꼭 물어보나요', '처음 원정이라 체크할 것 정리 중입니다.', '전국', '원정작업'),
    (3814, '초보가 레이저 레벨기 써도 되나요', '빌려서 써볼까 하는데 조심할 점 있을까요?', '전국', '공구'),
    (3815, '공구 대여할 때 보증금 보통 있나요', '개인 거래라 직접 정하는 건 알지만 보통 어떻게 하는지 궁금합니다.', '전국', '공구장터'),
    (3816, '자재 나눔 받을 때 운반은 직접인가요', '석고보드 같은 건 차량 없으면 어렵겠죠?', '전국', '자재'),
    (3817, '겨울 현장 장갑 추천', '손 시려서 작업이 느려지는데 괜찮은 장갑 있을까요?', '전국', '작업용품'),
    (3818, '일당 익일지급이면 주말 끼면 언제 받나요', '작성자랑 직접 확인해야겠지만 보통 어떻게 되는지 궁금합니다.', '전국', '일당'),
    (3819, '안전모 개인 거 사는 게 좋나요', '현장에서 주는 경우와 개인 거 쓰는 경우가 다르더라고요.', '전국', '안전'),
    (3820, '차량동승이면 출발지는 어디서 맞추나요', '원정 글 볼 때 출발 위치 확인하는 팁 있을까요?', '전국', '원정작업')
),
company_rows(seed_no, title, body, status, region_text, trade_text, work_date, daily_pay, contact_method) as (
  values
    (3901, '경기 화성 인테리어 팀 보조 구함', '상가 인테리어 보조 인원 정보입니다. 계약과 조건은 당사자 간 직접 확인해주세요.', 'recruiting', '경기 화성', '인테리어', '2026-07-08'::date, 180000, '댓글 후 담당자 연락'),
    (3902, '부산 해운대 목공 보조 모집', '목공 보조 경험자 우대합니다. Job일은 채용 당사자가 아닙니다.', 'recruiting', '부산 해운대', '목공', '2026-07-09'::date, 190000, '댓글 확인'),
    (3903, '서울 강서 전기 조공 정보', '상가 전기 보조 인원 구합니다. 지급방식과 작업시간은 직접 확인 바랍니다.', 'recruiting', '서울 강서', '전기', '2026-07-10'::date, 190000, '댓글 후 연락'),
    (3904, '인천 송도 설비 보조 모집', '설비 보조 가능하신 분 찾습니다. 초보 가능 여부는 연락 시 확인해주세요.', 'closed', '인천 송도', '설비', '2026-07-11'::date, 180000, '댓글'),
    (3905, '울산 남구 방수 보조 구함', '방수 현장 보조입니다. 안전장비와 작업조건은 직접 확인해주세요.', 'recruiting', '울산 남구', '방수', '2026-07-12'::date, 190000, '댓글 확인'),
    (3906, '대전 타일 보조 인원 정보', '욕실 타일 보조 인원 찾습니다. 일당과 지급일은 작성자와 확인하세요.', 'recruiting', '대전', '타일', '2026-07-13'::date, 175000, '댓글 후 문자'),
    (3907, '경남 창원 철거 보조 구함', '철거 보조 인원 정보입니다. 보호구 챙기고 조건 직접 확인 바랍니다.', 'recruiting', '경남 창원', '철거', '2026-07-14'::date, 165000, '댓글'),
    (3908, '경기 파주 물류창고 보조 모집', '자재 정리와 보조 업무입니다. 출근 여부는 당사자 간 직접 확인합니다.', 'recruiting', '경기 파주', '물류', '2026-07-15'::date, 160000, '댓글 확인'),
    (3909, '서울 마포 도배 보조 정보', '도배 보조 경험자 우대합니다. 상세 조건은 연락 시 확인해주세요.', 'recruiting', '서울 마포', '도배', '2026-07-16'::date, 170000, '댓글 후 연락'),
    (3910, '경기 평택 원정 가능 조공 구함', '숙소 제공 예정이나 상세 조건은 직접 확인 바랍니다.', 'recruiting', '경기 평택', '조공', '2026-07-17'::date, 185000, '댓글')
),
beta_posts as (
  select
    seed_no,
    'work-raid'::text as board_slug,
    title,
    body,
    status,
    site_region as region_text,
    trade as trade_text,
    work_date,
    daily_pay,
    contact_method,
    jsonb_build_object(
      'site_region', site_region,
      'departure_region', departure_region,
      'work_date', work_date::text,
      'trade', trade,
      'needed_count', needed_count,
      'daily_pay', daily_pay,
      'wage_payment_type', pay_method,
      'pay_method', pay_method,
      'work_hours', work_hours,
      'meal_provided', meal_provided,
      'lodging_provided', lodging_provided,
      'transportation_provided', transportation_provided,
      'ride_share_available', ride_share_available,
      'beginner_ok', beginner_ok,
      'required_tools', required_tools,
      'contact_method', contact_method,
      'recruiting_status', case when status = 'closed' then '마감' else '모집중' end
    ) as extra
  from work_rows
  union all
  select
    seed_no,
    'remote-raid',
    title,
    body,
    status,
    departure_region || '→' || site_region,
    trade,
    work_date,
    daily_pay,
    contact_method,
    jsonb_build_object(
      'site_region', site_region,
      'departure_region', departure_region,
      'work_date', work_date::text,
      'work_period', work_period,
      'trade', trade,
      'needed_count', needed_count,
      'daily_pay', daily_pay,
      'lodging_provided', lodging_provided,
      'transportation_provided', transportation_provided,
      'ride_share_available', ride_share_available,
      'transport', case when ride_share_available then '차량동승 가능' when transportation_provided then '교통비 협의' else '교통 조건 직접 확인' end,
      'beginner_ok', beginner_ok,
      'contact_method', contact_method,
      'recruiting_status', case when status = 'closed' then '마감' else '모집중' end
    )
  from remote_rows
  union all
  select
    seed_no,
    'dimodo',
    title,
    body,
    status,
    site_region,
    trade,
    work_date,
    daily_pay,
    contact_method,
    jsonb_build_object(
      'site_region', site_region,
      'work_date', work_date::text,
      'trade', trade,
      'needed_count', needed_count,
      'daily_pay', daily_pay,
      'beginner_ok', beginner_ok,
      'work_hours', work_hours,
      'contact_method', contact_method,
      'recruiting_status', case when status = 'closed' then '마감' else '모집중' end
    )
  from dimodo_rows
  union all
  select
    seed_no,
    'available-today',
    title,
    body,
    'recruiting',
    region_text,
    trade,
    available_date,
    desired_pay,
    contact_method,
    jsonb_build_object(
      'available_region', region_text,
      'available_date', available_date::text,
      'available_trade', trade,
      'experience', experience,
      'desired_pay', desired_pay,
      'owned_tools', owned_tools,
      'has_vehicle', has_vehicle,
      'can_travel', can_travel,
      'contact_method', contact_method,
      'recruiting_status', '모집중'
    )
  from available_rows
  union all
  select
    seed_no,
    'tool-market',
    title,
    body,
    status,
    region_text,
    '공구',
    null::date,
    price,
    contact_method,
    jsonb_build_object(
      'tool_name', tool_name,
      'transaction_type', transaction_type,
      'price', price,
      'condition', condition,
      'market_region', region_text,
      'contact_method', contact_method
    )
  from tool_rows
  union all
  select
    seed_no,
    'materials',
    title,
    body,
    status,
    region_text,
    '자재',
    null::date,
    price,
    contact_method,
    jsonb_build_object(
      'material_name', material_name,
      'quantity', quantity,
      'price', price,
      'market_region', region_text,
      'direct_trade', pickup_only,
      'contact_method', contact_method
    )
  from material_rows
  union all
  select seed_no, 'free', title, body, 'recruiting', region_text, trade_text, null::date, null::integer, '댓글', '{}'::jsonb from free_rows
  union all
  select seed_no, 'beginner', title, body, 'recruiting', region_text, trade_text, null::date, null::integer, '댓글', '{}'::jsonb from beginner_rows
  union all
  select seed_no, 'questions', title, body, 'recruiting', region_text, trade_text, null::date, null::integer, '댓글', '{}'::jsonb from question_rows
  union all
  select
    seed_no,
    'company-jobs',
    title,
    body,
    status,
    region_text,
    trade_text,
    work_date,
    daily_pay,
    contact_method,
    jsonb_build_object(
      'site_region', region_text,
      'work_date', work_date::text,
      'trade', trade_text,
      'needed_count', 1,
      'daily_pay', daily_pay,
      'contact_method', contact_method,
      'beginner_ok', false,
      'recruiting_status', case when status = 'closed' then '마감' else '모집중' end
    )
  from company_rows
)
insert into public.posts (
  id,
  board_id,
  author_id,
  title,
  body,
  status,
  region_text,
  trade_text,
  work_date,
  daily_pay,
  contact_method,
  extra,
  view_count,
  up_count,
  comment_count
)
select
  ('20000000-0000-0000-0000-' || lpad(beta_posts.seed_no::text, 12, '0'))::uuid,
  boards.id,
  seed_author.id,
  beta_posts.title,
  beta_posts.body,
  beta_posts.status,
  beta_posts.region_text,
  beta_posts.trade_text,
  beta_posts.work_date,
  beta_posts.daily_pay,
  beta_posts.contact_method,
  beta_posts.extra,
  20 + (beta_posts.seed_no % 180),
  beta_posts.seed_no % 12,
  beta_posts.seed_no % 9
from beta_posts
join public.boards on boards.slug = beta_posts.board_slug
cross join seed_author
on conflict (id) do update set
  title = excluded.title,
  body = excluded.body,
  status = excluded.status,
  region_text = excluded.region_text,
  trade_text = excluded.trade_text,
  work_date = excluded.work_date,
  daily_pay = excluded.daily_pay,
  contact_method = excluded.contact_method,
  extra = excluded.extra,
  view_count = excluded.view_count,
  up_count = excluded.up_count,
  comment_count = excluded.comment_count;

commit;