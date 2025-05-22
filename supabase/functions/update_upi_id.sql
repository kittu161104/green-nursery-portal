
CREATE OR REPLACE FUNCTION public.update_upi_id(new_upi_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_id uuid;
BEGIN
  -- Only allow admin users to update this data
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: user is not an admin';
  END IF;
  
  -- Get ID of first admin setting (there should only be one)
  SELECT id INTO v_admin_id FROM public.admin_settings LIMIT 1;
  
  -- Update UPI ID
  IF v_admin_id IS NULL THEN
    -- Insert if no record exists
    INSERT INTO public.admin_settings (upi_id, updated_at)
    VALUES (new_upi_id, now());
  ELSE
    -- Update existing record
    UPDATE public.admin_settings
    SET upi_id = new_upi_id,
        updated_at = now()
    WHERE id = v_admin_id;
  END IF;
  
  RETURN TRUE;
END;
$$;
