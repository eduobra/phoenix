WITH ar AS (
  SELECT customer_id, as_of_date, overdue_amount, yyyy_mm
  FROM curated.v_ar_aging_daily
 WHERE tenant_id = @tenant_id
 AND as_of_date BETWEEN DATEADD(day, -(@base_win), @as_of_date) AND 
@as_of_date
 AND yyyy_mm >= (YEAR(DATEADD(day, -@base_win, @as_of_date)) * 100 + 
MONTH(DATEADD(day, -@base_win, @as_of_date)))
 )
 SELECT
  customer_id,
  SUM(CASE WHEN as_of_date >  DATEADD(day, -@short_win, @as_of_date) THEN 
overdue_amount ELSE 0 END) AS overdue_14d,
  SUM(CASE WHEN as_of_date <= DATEADD(day, -@short_win, @as_of_date) THEN 
overdue_amount ELSE 0 END) AS overdue_prev_60d,
  CASE
 WHEN SUM(CASE WHEN as_of_date <= DATEADD(day, -@short_win, @as_of_date) 
THEN overdue_amount ELSE 0 END) > 0
 THEN (1.0 * SUM(CASE WHEN as_of_date > DATEADD(day, -@short_win, @as_of_date) 
THEN overdue_amount ELSE 0 END)
         /
     SUM(CASE WHEN as_of_date <= DATEADD(day, -@short_win, @as_of_date) 
THEN overdue_amount ELSE 0 END)) - 1.0
    ELSE NULL
  END AS spike_pct
 FROM ar
 GROUP BY customer_id
 HAVING
  SUM(CASE WHEN as_of_date <= DATEADD(day, -@short_win, @as_of_date) THEN 
overdue_amount ELSE 0 END) > 0
 AND (
      (1.0 * SUM(CASE WHEN as_of_date > DATEADD(day, -@short_win, @as_of_date) 
THEN overdue_amount ELSE 0 END)
       /
     SUM(CASE WHEN as_of_date <= DATEADD(day, -@short_win, @as_of_date) THEN 
overdue_amount ELSE 0 END)) - 1.0
  ) >= @min_spike_pct
 ORDER BY spike_pct DESC;