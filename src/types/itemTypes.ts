export type ItemType = {
  mint: "string";
  owner: "string";
  tokenAmount: number;
  public: string;
  secret: string;
  tokenAccount: string;
  description: string;
  type: "string";
  lastTransaction: TransactionData;
  selected?: boolean;
};

export interface TransactionData {
  blockTime: number;
  confirmationStatus: string;
  err: null;
  memo: string;
  signature: string;
  slot: number;
}
