begin;
select plan(5);
select ok((select relrowsecurity from pg_class where oid = 'public.examples'::regclass), 'examples has RLS enabled');
select ok((select count(*) >= 1 from pg_indexes where schemaname = 'public' and tablename = 'examples' and indexdef like '%user_id%'), 'RLS ownership column is indexed');

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, created_at, updated_at) values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'owner@example.test', '', now(), now()),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'other@example.test', '', now(), now());
insert into public.examples (user_id, name) values ('11111111-1111-1111-1111-111111111111', 'owned row');

set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
select results_eq('select name from public.examples order by name', $$values ('owned row'::text)$$, 'owner can read their row');
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', true);
select is((select count(*) from public.examples), 0::bigint, 'non-owner cannot read the row');
reset role;
set local role anon;
select is((select count(*) from public.examples), 0::bigint, 'anonymous caller cannot read the row');
reset role;

select * from finish();
rollback;
