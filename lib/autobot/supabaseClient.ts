import { createClient } from '@supabase/supabase-js';

// Supabase URL과 Anon Key는 환경 변수에서 가져옵니다.
// JOBDAY 프로젝트의 .env 파일에 SUPABASE_URL과 SUPABASE_ANON_KEY가 설정되어 있다고 가정합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
