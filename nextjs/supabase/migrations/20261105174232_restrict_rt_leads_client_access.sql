-- Lead deduplication is server/MCP only. Preserve RLS and service-role access.
revoke all privileges on table public.rt_leads from anon, authenticated;
