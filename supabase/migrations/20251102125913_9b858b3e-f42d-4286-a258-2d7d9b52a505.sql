-- Fix profiles table RLS policies for security
-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create secure owner-only SELECT policy
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add missing DELETE policy for GDPR compliance
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add UPDATE policy for tattoo_designs (allow users to modify their designs)
CREATE POLICY "Users can update their own tattoo designs" 
ON public.tattoo_designs 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);