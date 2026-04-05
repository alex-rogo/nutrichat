import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvbmldqsqedxgpyljain.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2Ym1sZHFzcWVkeGdweWxqYWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjUzOTEsImV4cCI6MjA5MDgwMTM5MX0.G6ChNNN_bPLB2pHYhaSizhOCf9eVpBkdhaxmYB8plPk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);