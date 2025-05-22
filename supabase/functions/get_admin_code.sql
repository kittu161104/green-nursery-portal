
CREATE OR REPLACE FUNCTION public.get_admin_code()
RETURNS TABLE (admin_code text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow admin users to get this data
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: user is not an admin';
  END IF;
  
  RETURN QUERY 
    SELECT a.admin_code FROM public.admin_settings a LIMIT 1;
END;
$$;
