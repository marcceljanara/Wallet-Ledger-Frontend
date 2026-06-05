'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, Plus, Send, QrCode } from 'lucide-react';
import { TopUpModal } from '@/components/shared/TopUpModal';
import { TransferModal } from '@/components/shared/TransferModal';
import { ReceiveModal } from '@/components/shared/ReceiveModal';
import Link from 'next/link';
import { Transaction } from '@/types';

// Formatting helper

function formatCurrency(amount: string) {
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) return 'Rp 0,00';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(parsed);
}

export default function UserDashboardPage() {
  const [isTopUpOpen, setIsTopUpOpen] = React.useState(false);
  const [isTransferOpen, setIsTransferOpen] = React.useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = React.useState(false);

  // Query wallet info
  const { data: wallet, isLoading: isWalletLoading, error: walletError } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await api.get('/wallets/me');
      return response.data?.data;
    },
  });

  // Query recent transactions (limit 5)
  const { data: recentTxns, isLoading: isTxnsLoading } = useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: async () => {
      const response = await api.get('/transactions', {
        params: { page: 1, limit: 5 },
      });
      const data = response.data?.data;
      return data?.transactions || [];
    },
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between pb-4 border-b border-zinc-900">
        <div>
          <h1 className="font-space text-2xl font-semibold uppercase tracking-wider text-text-main">
            Dashboard Overview
          </h1>
          <p className="text-xs text-text-muted">
            Terminal status for client ledger tracking system
          </p>
        </div>
        <div className="font-mono text-[10px] text-text-muted text-right hidden md:block">
          <div>SYS_TIME: {new Date().toLocaleDateString()}</div>
          <div>STATUS: ONLINE // SAFE</div>
        </div>
      </div>

      {/* Main Stats Block */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Wallet Balance Card */}
        <Card className="md:col-span-2">
          <CardHeader className="bg-black/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-text-muted">
                Main Wallet Balance
              </CardTitle>
              {wallet?.wallet_id && (
                <span className="font-mono text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-secondary">
                  {wallet.wallet_id}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isWalletLoading ? (
              <div className="h-10 w-48 bg-zinc-900/50 animate-pulse" />
            ) : walletError ? (
              <div className="text-xs text-error font-mono uppercase">
                ERROR LOAD BALANCE
              </div>
            ) : (
              <div className="font-mono text-3xl font-medium tracking-tight text-primary">
                {formatCurrency(wallet?.balance || '0')}
              </div>
            )}
            <p className="text-xs text-text-muted mt-2">
              Currency standard: IDR (Indonesian Rupiah)
            </p>
          </CardContent>
        </Card>

        {/* Action Panel */}
        <Card>
          <CardHeader className="bg-black/10">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-text-muted">
              Quick Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col gap-2">
            <Button
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setIsTopUpOpen(true)}
              disabled={isWalletLoading}
            >
              <Plus size={14} /> Simulate Top-Up
            </Button>
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setIsTransferOpen(true)}
              disabled={isWalletLoading}
            >
              <Send size={14} /> Send Transfer
            </Button>
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setIsReceiveOpen(true)}
              disabled={isWalletLoading}
            >
              <QrCode size={14} /> Receive Funds
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between bg-black/10">
          <div>
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-text-main">
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Last 5 operations recorded in the ledger
            </CardDescription>
          </div>
          <Link href="/transactions">
            <Button variant="ghost" size="sm" className="font-mono text-[9px]">
              View All Records
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {isTxnsLoading ? (
            <div className="p-8 text-center text-text-muted font-mono text-xs animate-pulse">
              LOADING RECENT SYSTEM TRANSACTIONS...
            </div>
          ) : !recentTxns || recentTxns.length === 0 ? (
            <div className="p-8 text-center text-text-muted font-mono text-xs">
              NO TRANSACTION HISTORY FOUND
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference No</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTxns.map((txn: Transaction) => {
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
                          {new Date(txn.created_at).toLocaleString([], {
                            dateStyle: 'short',
                            timeStyle: 'medium',
                          })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        myWalletId={wallet?.wallet_id}
      />
      <ReceiveModal
        isOpen={isReceiveOpen}
        onClose={() => setIsReceiveOpen(false)}
        walletId={wallet?.wallet_id}
      />
    </div>
  );
}
