
-- Create event type enum
CREATE TYPE public.event_type AS ENUM ('bhandara', 'ngo', 'community');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create food_events table
CREATE TABLE public.food_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  organizer TEXT NOT NULL,
  type event_type NOT NULL DEFAULT 'community',
  location TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  servings_available INTEGER NOT NULL DEFAULT 0,
  is_live BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.food_events ENABLE ROW LEVEL SECURITY;

-- Anyone can view events (public feature)
CREATE POLICY "Anyone can view events" ON public.food_events FOR SELECT USING (true);
-- Authenticated users can create events
CREATE POLICY "Authenticated users can create events" ON public.food_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
-- Users can update their own events
CREATE POLICY "Users can update own events" ON public.food_events FOR UPDATE TO authenticated USING (auth.uid() = user_id);
-- Users can delete their own events
CREATE POLICY "Users can delete own events" ON public.food_events FOR DELETE TO authenticated USING (auth.uid() = user_id);
