-- Stores individual click events for shortened URLs.
-- Each row represents one click and its timestamp.
CREATE TABLE IF NOT EXISTS click_events (
  -- Unique identifier for the click event.
  id BIGSERIAL PRIMARY KEY,

  -- ID of the shortened URL that was clicked.
  -- The event is automatically deleted if the associated URL is deleted.
  url_id BIGINT NOT NULL REFERENCES urls(id) ON DELETE CASCADE,

  -- Timestamp indicating when the URL was clicked.
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index used to quickly find all click events for a specific URL.
CREATE INDEX IF NOT EXISTS idx_click_events_url_id
  ON click_events(url_id);

-- Composite index used for efficiently querying click events
-- for a specific URL within a particular time range.
CREATE INDEX IF NOT EXISTS idx_click_events_url_id_clicked_at
  ON click_events(url_id, clicked_at);