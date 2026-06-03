'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Transaction } from '@/types';

function formatCurrency(amount: string) {
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) return 'Rp 0,00';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(parsed);
}

export default function TransactionsHistoryPage() {
  const [page, setPage] = React.useState(1);
  const [type, setType] = React.useState(''); // '' for all, 'TOPUP', 'TRANSFER'
  const limit = 10;

  // Retrieve user's wallet to see which transaction is credit/debit
  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await api.get('/wallets/me');
      return response.data?.data;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', page, type],
    queryFn: async () => {
      const response = await api.get('/transactions', {
        params: { page, limit, type: type || undefined },
      });
      return response.data?.data;
    },
  });

  // Handle pagination response format
  // API might return array directly or a wrapper { transactions: [], total: X, page: Y }
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
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-900">
        <div>
          <h1 className="font-space text-2xl font-semibold uppercase tracking-wider text-text-main">
            Transaction Registry
          </h1>
          <p className="text-xs text-text-muted">
            Complete list of all financial records
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <Button
            variant={type === '' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => { setType(''); setPage(1); }}
          >
            All
          </Button>
          <Button
            variant={type === 'TOPUP' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => { setType('TOPUP'); setPage(1); }}
          >
            Topup
          </Button>
          <Button
            variant={type === 'TRANSFER' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => { setType('TRANSFER'); setPage(1); }}
          >
            Transfer
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-text-muted font-mono text-xs animate-pulse">
              FETCHING TRANSACTION REGISTRY METRICS...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center text-text-muted font-mono text-xs">
              NO RECORDS MATCHING THE FILTER SPECIFIED
            </div>
          ) : (
            <>
              <div className="w-full overflow-x-auto">
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
                  {transactions.map((txn: Transaction) => {
                    const isDebit = txn.source_wallet_id === wallet?.wallet_id;
                    return (
                      <TableRow key={txn.transaction_id}>
                        <TableCell className="font-mono font-bold text-zinc-400">
                          <Link href={`/transactions/${txn.transaction_id}`} className="hover:text-secondary hover:underline">
                            {txn.reference_no}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={txn.type === 'TOPUP' ? 'primary' : 'secondary'}
                          >
                            {txn.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-text-muted">
                          {txn.source_wallet_id || 'N/A (EXTERNAL)'}
                        </TableCell>
                        <TableCell className="font-mono text-text-muted">
                          {txn.target_wallet_id}
                        </TableCell>
                        <TableCell className="font-mono text-right font-medium">
                          <span
                            className={
                              txn.type === 'TOPUP'
                                ? 'text-primary'
                                : isDebit
                                ? 'text-error'
                                : 'text-primary'
                            }
                          >
                            {txn.type === 'TOPUP' ? '+' : isDebit ? '-' : '+'}
                            {formatCurrency(txn.amount)}
                          </span>
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
                    );
                  })}
                </TableBody>
              </Table>
            </div>

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
