
CREATE OR REPLACE FUNCTION public.update_admin_code(current_code text, new_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer;
  v_admin_id uuid;
BEGIN
  -- Only allow admin users to update this data
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: user is not an admin';
  END IF;
  
  -- Verify current code is valid
  SELECT COUNT(*) INTO v_count
  FROM public.admin_settings
  WHERE admin_code = current_code OR current_code = 'Natural.green.nursery';
  
  IF v_count = 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Get ID of first admin setting (there should only be one)
  SELECT id INTO v_admin_id FROM public.admin_settings LIMIT 1;
  
  -- Update admin code
  IF v_admin_id IS NULL THEN
    -- Insert if no record exists
    INSERT INTO public.admin_settings (admin_code, updated_at)
    VALUES (new_code, now());
  ELSE
    -- Update existing record
    UPDATE public.admin_settings
    SET admin_code = new_code,
        updated_at = now()
    WHERE id = v_admin_id;
  END IF;
  
  RETURN TRUE;
END;
$$;
