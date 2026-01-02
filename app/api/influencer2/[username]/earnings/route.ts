import prisma  from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    // In Next.js dynamic route params can be a promise-like object — await it
    const { username } = await params;
    if (!username) {
      return new Response(JSON.stringify({ error: 'username required' }), { status: 400 });
    }

    const creator = await prisma.creatorProfile.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!creator) {
      return new Response(JSON.stringify({ error: 'creator not found' }), { status: 404 });
    }

    // Return the last 5 calendar months (including months with zero payouts)
    const rows: Array<{ month: Date; total: string }> = await prisma.$queryRaw`
      SELECT gs.month AS month,
             COALESCE(SUM(t.amount), 0) AS total
      FROM generate_series(
        date_trunc('month', now()) - interval '4 month',
        date_trunc('month', now()),
        interval '1 month'
      ) AS gs(month)
      LEFT JOIN "Transaction" t
        ON date_trunc('month', t."createdAt") = gs.month
        AND t."creatorId" = ${creator.id}
        AND t.type = 'PAYOUT'
        AND t.status = 'COMPLETED'
      GROUP BY gs.month
      ORDER BY gs.month ASC;
    `;

    // Rows are returned oldest -> newest already
    const months = rows.map((r) => new Date(r.month).toLocaleString('en-US', { month: 'short' }));
    const totals = rows.map((r) => (r.total === null ? 0 : Number(r.total)));

    return new Response(JSON.stringify({ months, totals }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('earnings error', err);
    return new Response(JSON.stringify({ error: 'internal' }), { status: 500 });
  }
}
