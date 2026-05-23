alter table tasks
add column if not exists notification_sent_at timestamptz;

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text unique not null,
  subscription jsonb not null,
  user_label text default 'default',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
