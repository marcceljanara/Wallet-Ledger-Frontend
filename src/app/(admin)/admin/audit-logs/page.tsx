'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AuditLog } from '@/types';

export default function AdminAuditLogsPage() {
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', page],
    queryFn: async () => {
      const response = await api.get('/admin/audit-logs', {
        params: { page, limit },
      });
      return response.data?.data;
    },
  });

  const logs = React.useMemo(() => {
    return data?.logs || [];
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
            Global Activity Logs
          </h1>
          <p className="text-xs text-text-muted">
            Ecosystem-wide security and operations ledger audit trail
          </p>
        </div>
        <div className="font-mono text-[10px] text-error text-right">
          <div>READ: SYSTEM_WIDE</div>
          <div>INTEGRITY: SECURED</div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-text-muted font-mono text-xs animate-pulse">
              LOADING GLOBAL AUDIT BUFFER INDEX...
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-text-muted font-mono text-xs">
              NO SYSTEM ACTIVITY RECORDED
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Audit ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log: AuditLog) => (
                    <TableRow key={log.log_id}>
                      <TableCell className="font-mono text-xs font-bold text-zinc-400">
                        {log.log_id}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-text-muted">
                        {log.user_id}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-text-main font-semibold">
                        {log.action}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-text-muted">
                        {log.ip_address}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-zinc-500">
                        {log.endpoint}
                      </TableCell>
                      <TableCell className="font-mono text-text-muted">
                        {new Date(log.created_at).toLocaleString()}
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
                    disabled={!hasNextPage && logs.length < limit}
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
