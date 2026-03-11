-- Add migration script here
ALTER TABLE public.carts ADD is_selected boolean DEFAULT false NOT NULL;