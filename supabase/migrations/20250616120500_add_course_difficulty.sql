-- Adds difficulty column to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS difficulty text;
