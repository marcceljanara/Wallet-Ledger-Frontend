export interface User {
  user_id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  created_at?: string;
  updated_at?: string;
}

export interface Wallet {
  wallet_id: string;
  user_id: string;
  balance: string; // shopspring/decimal is serialized as a string
  currency: string;
  created_at: string;
  updated_at: string;
}

export type TransactionType = 'TOPUP' | 'TRANSFER';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Transaction {
  transaction_id: string;
  reference_no: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
  source_wallet_id: string | null;
  target_wallet_id: string;
  created_at: string;
}

export type LedgerEntryType = 'DEBIT' | 'CREDIT';

export interface LedgerEntry {
  entry_id: string;
  transaction_id: string;
  wallet_id: string;
  entry_type: LedgerEntryType;
  amount: string;
  created_at: string;
  transaction_ref_no?: string;
}

export interface AuditLog {
  log_id: string;
  user_id: string;
  action: string;
  ip_address: string;
  endpoint: string;
  created_at: string;
}

export interface Notification {
  id: string; // the JSON spec lists "id" for notification
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface TransactionDetail extends Transaction {
  ledger_entries: LedgerEntry[];
}

export interface AdminUserListItem {
  user_id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  wallet_id: string;
  balance: string;
  created_at: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}
