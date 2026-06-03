'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

function formatCurrency(amount: string) {
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) return 'Rp 0,00';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(parsed);
}

export default function LedgerEntriesPage() {
  const [page, setPage] = React.useState(1);
  const [entryType, setEntryType] = React.useState(''); // '' for all, 'DEBIT', 'CREDIT'
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['ledger-entries', page, entryType],
    queryFn: async () => {
      const response = await api.get('/ledger/entries', {
        params: { page, limit, entry_type: entryType || undefined },
      });
      return response.data?.data;
    },
  });

  const entries = React.useMemo(() => {
    return data?.entries || [];
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
            Ledger mutasi (Obsidian Ledger)
          </h1>
          <p className="text-xs text-text-muted">
            Double-entry book record mutations of your wallet balance
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            variant={entryType === '' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => { setEntryType(''); setPage(1); }}
          >
            All
          </Button>
          <Button
            variant={entryType === 'CREDIT' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => { setEntryType('CREDIT'); setPage(1); }}
          >
            Credit (IN)
          </Button>
          <Button
            variant={entryType === 'DEBIT' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => { setEntryType('DEBIT'); setPage(1); }}
          >
            Debit (OUT)
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-text-muted font-mono text-xs animate-pulse">
              LOADING BOOK MUTATION REGISTRY...
            </div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center text-text-muted font-mono text-xs">
              NO MUTATION ENTRIES RECORDED IN BOOK LEDGER
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ledger Entry ID</TableHead>
                    <TableHead>Transaction Reference</TableHead>
                    <TableHead>Wallet ID</TableHead>
                    <TableHead>Entry Type</TableHead>
                    <TableHead>Mutation Amount</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry: any) => (
                    <TableRow key={entry.entry_id}>
                      <TableCell className="font-mono text-xs font-bold text-zinc-400">
                        {entry.entry_id}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-text-main">
                        {entry.transaction_ref_no || entry.transaction_id || 'N/A'}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-text-muted">
                        {entry.wallet_id}
                      </TableCell>
                      <TableCell>
                        <Badge variant={entry.entry_type === 'CREDIT' ? 'primary' : 'warning'}>
                          {entry.entry_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-right font-medium">
                        <span className={entry.entry_type === 'CREDIT' ? 'text-primary' : 'text-error'}>
                          {entry.entry_type === 'CREDIT' ? '+' : '-'}
                          {formatCurrency(entry.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-text-muted">
                        {new Date(entry.created_at).toLocaleString()}
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
                    disabled={!hasNextPage && entries.length < limit}
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
