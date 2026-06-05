'use client';

import * as React from 'react';
import QRCode from 'react-qr-code';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletId?: string;
}

export function ReceiveModal({ isOpen, onClose, walletId }: ReceiveModalProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!walletId) return;
    try {
      await navigator.clipboard.writeText(walletId);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Receive Funds / Wallet Info">
      <div className="space-y-6">
        <p className="text-xs text-text-muted font-mono uppercase tracking-wide leading-relaxed">
          Share your wallet address or QR code to receive transfer from another client.
        </p>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-6 bg-zinc-950 border border-zinc-900 rounded-none space-y-4">
          <div className="bg-white p-3 border border-zinc-800 rounded-none inline-block shadow-lg">
            {walletId ? (
              <QRCode
                value={walletId}
                size={180}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                viewBox="0 0 256 256"
                level="H"
                fgColor="#000000"
                bgColor="#FFFFFF"
              />
            ) : (
              <div className="w-[180px] h-[180px] flex items-center justify-center text-xs text-text-muted font-mono uppercase bg-zinc-900 animate-pulse">
                Generating QR...
              </div>
            )}
          </div>
          
          <div className="text-center">
            <span className="font-mono text-[9px] bg-zinc-900 border border-zinc-800 text-secondary px-2 py-0.5 uppercase tracking-widest">
              Address Standard: UUID_V4
            </span>
          </div>
        </div>

        {/* Address Display & Copy */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase text-text-muted tracking-wider block">
            Wallet Address ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={walletId || 'Loading...'}
              className="flex-1 bg-zinc-950 border border-zinc-850 px-3 py-2.5 text-xs font-mono text-text-main focus:outline-none select-all select-none"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              type="button"
              variant={copied ? 'primary' : 'secondary'}
              className="flex items-center gap-2 text-xs font-mono uppercase px-4 py-2"
              onClick={handleCopy}
              disabled={!walletId}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Close button */}
        <div className="flex justify-end pt-4 border-t border-zinc-900">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close Terminal
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
