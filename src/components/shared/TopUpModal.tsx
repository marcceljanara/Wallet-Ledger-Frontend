'use client';

import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import api from '@/lib/axios';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isAxiosError } from 'axios';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const mutation = useMutation({
    mutationFn: async ({ topupAmount, idempotencyKey }: { topupAmount: string; idempotencyKey: string }) => {
      const response = await api.post(
        '/wallets/topup',
        { amount: parseFloat(topupAmount) },
        {
          headers: {
            'Idempotency-Key': idempotencyKey,
          },
        }
      );
      return response.data?.data;
    },
    onSuccess: () => {
      setSuccess(true);
      // Invalidate queries to refresh the wallet balance and transactions list
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setTimeout(() => {
        handleClose();
      }, 1500);
    },
    onError: (err: unknown) => {
      console.error(err);
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to process top-up simulation.'
        );
      } else {
        setError('An unexpected error occurred.');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than zero');
      return;
    }

    setError('');
    // Generate UUID v4 for the idempotency control
    const key = uuidv4();
    mutation.mutate({ topupAmount: amount, idempotencyKey: key });
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Simulate Top-Up Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="border border-error/50 bg-error/10 p-3 text-xs text-error font-mono rounded-none uppercase tracking-wide">
            SYS_ERR: {error}
          </div>
        )}
        {success && (
          <div className="border border-primary bg-primary/10 p-3 text-xs text-primary font-mono rounded-none uppercase tracking-wide animate-pulse">
            TRANSACTION COMPLETED // SYSTEM BALANCE LOADED
          </div>
        )}

        <Input
          label="Top-Up Amount (IDR)"
          type="number"
          id="topup-amount"
          placeholder="e.g. 50000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={mutation.isPending || success}
          min="1"
          required
        />

        <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-zinc-900">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={mutation.isPending || success}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={mutation.isPending || success}
          >
            {mutation.isPending ? 'Processing...' : 'Authorize Funds'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
