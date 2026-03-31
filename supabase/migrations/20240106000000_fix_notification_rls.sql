-- Fix: Make trigger functions SECURITY DEFINER so they bypass RLS
-- This prevents the notification trigger from aborting the quest insert

CREATE OR REPLACE FUNCTION notify_new_quest() RETURNS TRIGGER AS $$
DECLARE
  new_notif_id UUID;
BEGIN
  INSERT INTO notifications (message, type, quest_id)
  VALUES ('New quest posted: "' || NEW.title || '"', 'new_quest', NEW.id)
  RETURNING id INTO new_notif_id;

  INSERT INTO user_notifications (notification_id, user_id)
  SELECT new_notif_id, id FROM auth.users WHERE id != NEW.created_by;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_new_quest failed: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION notify_quest_accepted() RETURNS TRIGGER AS $$
DECLARE
  new_notif_id UUID;
BEGIN
  IF NEW.status = 'active' AND OLD.status = 'open' THEN
    INSERT INTO notifications (user_id, message, type, quest_id)
    VALUES (NEW.created_by, 'Your quest "' || NEW.title || '" was accepted!', 'accepted', NEW.id)
    RETURNING id INTO new_notif_id;

    INSERT INTO user_notifications (notification_id, user_id)
    VALUES (new_notif_id, NEW.created_by);
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_quest_accepted failed: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow the trigger (SECURITY DEFINER) to insert notifications freely
DROP POLICY IF EXISTS "Service can insert notifications" ON notifications;
CREATE POLICY "Service can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service can insert user_notifications" ON user_notifications;
CREATE POLICY "Service can insert user_notifications" ON user_notifications
  FOR INSERT WITH CHECK (true);
