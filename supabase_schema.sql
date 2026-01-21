-- Create tables
create table boards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table lists (
  id uuid default gen_random_uuid() primary key,
  board_id uuid references boards on delete cascade not null,
  title text not null,
  position integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table cards (
  id uuid default gen_random_uuid() primary key,
  list_id uuid references lists on delete cascade not null,
  content text not null,
  position integer not null default 0,
  variables jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table boards enable row level security;
alter table lists enable row level security;
alter table cards enable row level security;

-- Policies
create policy "Users can view their own boards"
  on boards for select
  using (auth.uid() = user_id);

create policy "Users can insert their own boards"
  on boards for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own boards"
  on boards for update
  using (auth.uid() = user_id);

create policy "Users can delete their own boards"
  on boards for delete
  using (auth.uid() = user_id);

-- Lists policies (view if user owns the board)
create policy "Users can view lists of their boards"
  on lists for select
  using (
    exists (
      select 1 from boards
      where boards.id = lists.board_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can insert lists to their boards"
  on lists for insert
  with check (
    exists (
      select 1 from boards
      where boards.id = lists.board_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can update lists of their boards"
  on lists for update
  using (
    exists (
      select 1 from boards
      where boards.id = lists.board_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can delete lists of their boards"
  on lists for delete
  using (
    exists (
      select 1 from boards
      where boards.id = lists.board_id
      and boards.user_id = auth.uid()
    )
  );

-- Cards policies (similar to lists)
create policy "Users can view cards of their boards"
  on cards for select
  using (
    exists (
      select 1 from lists
      inner join boards on boards.id = lists.board_id
      where lists.id = cards.list_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can insert cards to their boards"
  on cards for insert
  with check (
    exists (
      select 1 from lists
      inner join boards on boards.id = lists.board_id
      where lists.id = cards.list_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can update cards of their boards"
  on cards for update
  using (
    exists (
      select 1 from lists
      inner join boards on boards.id = lists.board_id
      where lists.id = cards.list_id
      and boards.user_id = auth.uid()
    )
  );

create policy "Users can delete cards of their boards"
  on cards for delete
  using (
    exists (
      select 1 from lists
      inner join boards on boards.id = lists.board_id
      where lists.id = cards.list_id
      and boards.user_id = auth.uid()
    )
  );
