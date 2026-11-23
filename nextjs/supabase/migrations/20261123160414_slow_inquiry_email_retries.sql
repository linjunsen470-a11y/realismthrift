-- Fresh installations configure the retry job after enabling Supabase Cron.
do $$
begin
  if to_regclass('cron.job') is not null then
    perform cron.alter_job(jobid, schedule := '*/15 * * * *')
    from cron.job
    where jobname = 'retry-inquiry-emails'
      and database = current_database()
      and schedule <> '*/15 * * * *';
  end if;
end;
$$;
