export type ItemType = {
  description: string;
  id: {
    id: string;
  };
  itemAddress: string;
  name: string;
  url: string;
};

export interface ItemId {
  id: string;
}

export interface ItemScan {
  combinedSignature: string;
  id: ItemId;
  itemAddress: string;
  itemBytes: string;
  message: string;
  name: string;
  scannerAddress: string;
  url: string;
}

