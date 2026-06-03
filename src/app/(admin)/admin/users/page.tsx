'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function formatCurrency(amount: string) {
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) return 'Rp 0,00';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(parsed);
}

export default function AdminUsersPage() {
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: async () => {
      const response = await api.get('/admin/users', {
        params: { page, limit },
      });
      return response.data?.data;
    },
  });

  const users = React.useMemo(() => {
    return data?.users || [];
  }, [data]);

  const hasNextPage = React.useMemo(() => {
    const pagination = data?.pagination;
    if (!pagination) return false;
    return page < pagination.total_pages;
  }, [data, page]);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="pb-4 border-b border-zinc-900">
        <h1 className="font-space text-2xl font-semibold uppercase tracking-wider text-error">
          Identity Registry
        </h1>
        <p className="text-xs text-text-muted">
          Operational list of all registered clients and administrators in the system
        </p>
      </div>

      <Card>
        <CardHeader className="bg-black/10">
          <CardTitle className="text-xs font-mono uppercase tracking-wider text-text-main">
            Registered Identities
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-text-muted font-mono text-xs animate-pulse">
              LOADING SYSTEM IDENTITIES INDEX...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-error font-mono text-xs">
              ERROR FETCHING USER ACCOUNTS
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-text-muted font-mono text-xs">
              NO USERS REGISTERED
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID (UUID)</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Access Level (Role)</TableHead>
                    <TableHead>Wallet Associated</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u: any) => (
                    <TableRow key={u.user_id}>
                      <TableCell className="font-mono text-xs font-bold text-zinc-400">
                        {u.user_id}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-text-main">
                        {u.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.role === 'ADMIN' ? 'danger' : 'secondary'}>
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {u.wallet_id ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-secondary font-semibold">{u.wallet_id}</span>
                            <span className="text-[10px] text-primary">{formatCurrency(u.balance || '0')}</span>
                          </div>
                        ) : (
                          <span className="text-text-muted">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-text-muted text-xs">
                        {new Date(u.created_at).toLocaleString()}
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
                    disabled={!hasNextPage && users.length < limit}
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
