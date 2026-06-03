'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function formatCurrency(amount: string) {
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) return 'Rp 0,00';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(parsed);
}

export default function AdminOverviewPage() {
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-transactions', page],
    queryFn: async () => {
      const response = await api.get('/admin/transactions', {
        params: { page, limit },
      });
      return response.data?.data;
    },
  });

  const transactions = React.useMemo(() => {
    return data?.transactions || [];
  }, [data]);

  const hasNextPage = React.useMemo(() => {
    const pagination = data?.pagination;
    if (!pagination) return false;
    return page < pagination.total_pages;
  }, [data, page]);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="pb-4 border-b border-zinc-900 flex justify-between items-center">
        <div>
          <h1 className="font-space text-2xl font-semibold uppercase tracking-wider text-error">
            Admin System Monitor
          </h1>
          <p className="text-xs text-text-muted">
            Overview of all transactional logs executed in the ecosystem
          </p>
        </div>
        <div className="font-mono text-[10px] text-error text-right">
          <div>CONTROL: ELEVATED</div>
          <div>SCOPE: SYSTEM_WIDE</div>
        </div>
      </div>

      {/* Global Ledger Logs */}
      <Card>
        <CardHeader className="bg-black/10">
          <CardTitle className="text-xs font-mono uppercase tracking-wider text-text-main">
            Global Transaction Registry
          </CardTitle>
          <CardDescription>
            Audit list of every transaction submitted by any client
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-text-muted font-mono text-xs animate-pulse">
              STREAMING CLOUD TRANS-LOG INDEX...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center text-text-muted font-mono text-xs">
              NO GLOBAL TRANSACTIONS DETECTED
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference No</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Source Wallet</TableHead>
                    <TableHead>Target Wallet</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn: any) => (
                    <TableRow key={txn.transaction_id}>
                      <TableCell className="font-mono font-bold text-zinc-400">
                        {/* Under standard admin, viewing transaction details is identical to user detail page since we can query any transaction ID if admin. We will route to same transaction detail page */}
                        <Link href={`/transactions/${txn.transaction_id}`} className="hover:text-secondary hover:underline">
                          {txn.reference_no}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={txn.type === 'TOPUP' ? 'primary' : 'secondary'}>
                          {txn.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-text-muted">
                        {txn.source_wallet_id || 'N/A (EXTERNAL)'}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-text-muted">
                        {txn.target_wallet_id}
                      </TableCell>
                      <TableCell className="font-mono text-right font-semibold text-foreground">
                        {formatCurrency(txn.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            txn.status === 'COMPLETED'
                              ? 'primary'
                              : txn.status === 'FAILED'
                              ? 'danger'
                              : 'warning'
                          }
                        >
                          {txn.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-text-muted">
                        {new Date(txn.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between p-4 border-t border-zinc-900 bg-black/25">
                <span className="font-mono text-[10px] text-text-muted">
                  PAGE {page}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNextPage && transactions.length < limit}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
