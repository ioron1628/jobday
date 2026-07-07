-- JOBDAY commercial readiness.
-- 결제/자동과금 없이 운영자가 광고, 스폰서, 상단고정 노출을 수동 관리하기 위한 확장입니다.

alter table public.ad_slots
  add column if not exists advertiser_name text;

alter table public.ad_slots
  add column if not exists sponsor_type text not null default 'general';

alter table public.ad_slots
  add column if not exists target_region text;

alter table public.ad_slots
  add column if not exists target_trade text;

alter table public.ad_slots
  add column if not exists admin_memo text;

insert into public.ad_slots (placement, label, description, sponsor_type) values
  ('home_top', '홈 상단 배너', '홈 최상단 광고 위치', 'general'),
  ('region_board_top', '지역 게시판 상단 배너', '지역 태그/게시판 상단 광고 위치', 'general'),
  ('trade_board_top', '직종 게시판 상단 배너', '직종 태그/게시판 상단 광고 위치', 'general'),
  ('post_inline', '글 상세 중간 배너', '글 상세 중간 광고 위치', 'general'),
  ('market_top', '마켓 상단 배너', '공구장터와 자재나눔거래 상단 광고 위치', 'general'),
  ('tool_market_sponsor', '공구장터 추천 업체 슬롯', '공구상, 공구 대여점, 작업 장비 업체 스폰서 위치', 'tool_vendor'),
  ('workwear_safety_sponsor', '작업복/안전화 광고 슬롯', '작업복, 안전화, 보호구 광고 위치', 'workwear'),
  ('beginner_guide_sponsor', '초보입문 가이드 후원 영역', '초보 입문 장비와 가이드 후원 위치', 'beginner_guide'),
  ('group_buy_preview', '공구/자재 공동구매 예고 영역', '결제 없이 운영자가 수동으로 예고하는 공동구매 안내 위치', 'group_buy'),
  ('company_profile_sponsor', '사업자 프로필 노출 슬롯', '검증 보장이 아닌 사업자 정보 등록 계정 노출 위치', 'company_profile')
on conflict (placement) do update set
  label = excluded.label,
  description = excluded.description,
  sponsor_type = excluded.sponsor_type;
