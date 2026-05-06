-- 0002_oauth.sql
-- Re-declare FK constraints with explicit ON DELETE behaviour.
-- 0001 created the columns without ON DELETE clauses (defaults to NO ACTION).

alter table tasks
  drop constraint if exists tasks_assignee_id_fkey,
  drop constraint if exists tasks_created_by_fkey;

alter table tasks
  add constraint tasks_assignee_id_fkey
    foreign key (assignee_id) references auth.users on delete set null,
  add constraint tasks_created_by_fkey
    foreign key (created_by) references auth.users on delete cascade;

-- Remove rows that have no valid owner (created before auth was in place).
delete from tasks
where created_by not in (select id from auth.users);

-- Harden: ensure created_by is never null going forward.
alter table tasks alter column created_by set not null;

-- Drop the temporary blanket policy added during the no-auth bootstrap phase.
drop policy if exists temp_all_access on tasks;

-- Formal RLS policies -----------------------------------------------------------

-- SELECT: own tasks (created or assigned)
create policy tasks_select on tasks
  for select using (
    auth.uid() = created_by
    or auth.uid() = assignee_id
  );

-- INSERT: caller must be the creator
create policy tasks_insert on tasks
  for insert with check (
    auth.uid() = created_by
  );

-- UPDATE: creator (reassignment) or assignee (status change)
create policy tasks_update on tasks
  for update using (
    auth.uid() = created_by
    or auth.uid() = assignee_id
  );

-- DELETE: creator only
create policy tasks_delete on tasks
  for delete using (
    auth.uid() = created_by
  );
