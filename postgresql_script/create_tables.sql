drop table if exists public.cart_items;

drop table if exists public.orders;

drop table if exists public.cart;

drop table if exists public.users;


drop type if exists order_status;


CREATE TYPE order_status AS ENUM ('OPEN', 'ORDERED');


create table public.users (
	id uuid primary key default uuid_generate_v4(),
	name varchar(250),
	email varchar(250)
);


create table public.cart (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid not null,
	created_at date not null,
	updated_at date not null,
	status order_status,
	foreign key (user_id) references public.users(id)
);


create table public.cart_items (
	cart_id uuid not null,
	product_id uuid not null,
	count integer,
	foreign key (cart_id) references public.cart(id)
);


create table public.orders (
	id uuid not null,
	user_id uuid not null,
	cart_id uuid not null,
	payment json,
	delivery json,
	comments text,
	status text,
	total integer,
	foreign key (cart_id) references public.cart(id),
	foreign key (user_id) references public.users(id)
);


insert into public.users (id, name, email)
values (uuid_generate_v4(), 'Adam Smith','adam_smith@yahoo.com'),
	   (uuid_generate_v4(), 'Harry Potter', 'harry_potter@hogwarts.com')
;


insert into public.cart (id, user_id, created_at, updated_at, status)
select uuid_generate_v4(),
   	   id,
   	   current_date,
   	   current_date,
   	   'OPEN'::order_status
  from public.users
;


insert into public.cart_items (cart_id, product_id, count)
select id, uuid_generate_v4(), 10
  from public.cart
;


insert into public.orders (id, user_id, cart_id, payment, delivery, comments, status, total)
select uuid_generate_v4(), user_id, id,
	   '{"type": "test", "address": "test", "creditCard": "test"}',
	   '{"type": "test", "address": "test"}',
	   'test comment',
	   'some status',
	   10
  from public.cart
;


grant usage on schema public to test;

grant select, insert, update, delete on table public.cart to test;

grant select, insert, update, delete on table public.cart_items to test;

grant select, insert, update, delete on table public.orders to test;

grant select, insert, update, delete on table public.users to test;
