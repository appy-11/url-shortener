/**
 * This is the mock analytics data for the URL shortener application.
 * It provides a sample structure of analytics data for a short URL,
 * including the short URL details and its click history.
 * This data can be used for testing and development purposes.
 */

import type { ClickDataPoint } from '../types/url'

export const MOCK_CLICK_HISTORY: ClickDataPoint[] = [
  {
    date: 'Aug 14',
    clicks: 42,
  },
  {
    date: 'Aug 15',
    clicks: 67,
  },
  {
    date: 'Aug 16',
    clicks: 54,
  },
  {
    date: 'Aug 17',
    clicks: 91,
  },
  {
    date: 'Aug 18',
    clicks: 126,
  },
  {
    date: 'Aug 19',
    clicks: 143,
  },
  {
    date: 'Aug 20',
    clicks: 84,
  },
]
