export type ItemType = {
  id: string;
  description: string;
  secretKey: string;
  itemPublic: string;
  itemSecret: string;
  mint: string;
  tokenAccount: string;
};

export type ItemTypeRes = {
  mint: "string";
  owner: "string";
  tokenAmount: 0;
  itemPublic: string;
  itemSecret: string;
  tokenAccount: string;
  metadata: {
    updateAuthority: "string";
    mint: "string";
    name: "string";
    symbol: "string";
    uri: "string";
    additionalMetadata: [
      ["secret", "potatoes"],
      ["description", "potatoes"],
      ["public", "potatoes"]
    ];
  };
};
