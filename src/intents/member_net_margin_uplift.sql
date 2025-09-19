WITH margin AS (
    SELECT 
        h.invoice_id,
        h.customer_id,
        c.is_member,
        c.enrollment_date,
        SUM(l.sales_amount) AS sales,
        SUM(l.sales_amount - l.cost_amount) AS margin,
        h.document_date
    FROM SalesInvoiceHeader h
    JOIN SalesInvoiceLine l ON h.invoice_id = l.invoice_id
    JOIN Customer c ON h.customer_id = c.customer_id
    WHERE h.tenant_id = @tenant_id
      AND h.document_date BETWEEN @from_date AND @to_date
    GROUP BY h.invoice_id, h.customer_id, c.is_member, c.enrollment_date, h.document_date
),
labeled AS (
    SELECT 
        m.*,
        CASE 
            WHEN m.is_member = 1 AND m.document_date >= m.enrollment_date THEN 'member_post'
            WHEN m.is_member = 1 AND m.document_date < m.enrollment_date THEN 'member_pre'
            ELSE 'non_member'
        END AS cohort
    FROM margin m
)
SELECT 
    cohort,
    SUM(margin) * 1.0 / NULLIF(SUM(sales),0) AS net_margin_pct
FROM labeled
GROUP BY cohort;
