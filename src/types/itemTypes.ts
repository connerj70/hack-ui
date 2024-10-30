export type ItemType = {
  description: string;
  id: {
    id: string;
  };
  itemAddress: string;
  name: string;
  url: string;
  selected?: boolean; // Added 'selected' property
};

export interface TransactionData {
  blockTime: number;
  confirmationStatus: string;
  err: null;
  memo: string;
  signature: string;
  slot: number;
}
