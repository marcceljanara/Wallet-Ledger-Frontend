'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { LedgerEntry } from '@/types';

function formatCurrency(amount: string) {
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) return 'Rp 0,00';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(parsed);
}

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;

  const { data: txn, isLoading, error } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => {
      const response = await api.get(`/transactions/${transactionId}`);
      return response.data?.data;
    },
    enabled: !!transactionId,
  });

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-1.5"
        >
          <ArrowLeft size={12} /> Back to Registry
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-text-muted font-mono text-xs animate-pulse">
          LOAD TRANSACTION DETAILS...
        </div>
      ) : error ? (
        <div className="border border-error/50 bg-error/10 p-4 text-xs text-error font-mono rounded-none uppercase">
          ERROR LOAD TRANSACTION METRICS (ID: {transactionId})
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main info card */}
          <Card className="md:col-span-2 space-y-6">
            <CardHeader className="bg-black/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-mono uppercase tracking-wider text-text-muted">
                  Transaction Properties
                </CardTitle>
                <span className="font-mono text-[9px] text-zinc-600">
                  ID: {txn.transaction_id}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-900">
                <div>
                  <span className="font-mono text-[10px] uppercase text-text-muted">Reference No</span>
                  <div className="font-mono font-bold text-text-main text-sm mt-1">{txn.reference_no}</div>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase text-text-muted">Status</span>
                  <div className="mt-1">
                    <Badge variant={txn.status === 'COMPLETED' ? 'primary' : txn.status === 'FAILED' ? 'danger' : 'warning'}>
                      {txn.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-900">
                <div>
                  <span className="font-mono text-[10px] uppercase text-text-muted">Type</span>
                  <div className="mt-1">
                    <Badge variant={txn.type === 'TOPUP' ? 'primary' : 'secondary'}>
                      {txn.type}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase text-text-muted">Timestamp</span>
                  <div className="font-mono text-xs text-text-main mt-1">
                    {new Date(txn.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-900">
                <div>
                  <span className="font-mono text-[10px] uppercase text-text-muted">Source Wallet</span>
                  <div className="font-mono text-xs text-text-main mt-1">{txn.source_wallet_id || 'EXTERNAL (SIMULATED)'}</div>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase text-text-muted">Target Wallet</span>
                  <div className="font-mono text-xs text-text-main mt-1">{txn.target_wallet_id}</div>
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-text-muted">Total Authorized Amount</span>
                <div className="font-mono text-xl font-bold text-primary mt-1">
                  {formatCurrency(txn.amount)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Double-Entry Ledger Details */}
          <Card className="flex flex-col h-full justify-between">
            <CardHeader className="bg-black/10">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-text-muted">
                Linked Ledger entries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {!txn.ledger_entries || txn.ledger_entries.length === 0 ? (
                <div className="p-6 text-center text-text-muted font-mono text-xs">
                  NO LEDGER ENTRIES GENERATED
                </div>
              ) : (
                <Table className="border-0">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wallet ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {txn.ledger_entries.map((entry: LedgerEntry) => (
                      <TableRow key={entry.entry_id}>
                        <TableCell className="font-mono text-[11px] text-zinc-400">
                          {entry.wallet_id}
                        </TableCell>
                        <TableCell>
                          <Badge variant={entry.entry_type === 'CREDIT' ? 'primary' : 'warning'}>
                            {entry.entry_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-right font-medium text-text-main">
                          {entry.entry_type === 'CREDIT' ? '+' : '-'}
                          {formatCurrency(entry.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
