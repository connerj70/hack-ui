export type ItemType = {
  id: string;
  description: string;
};

export type ItemTypeRes = {
  mint: "string";
  owner: "string";
  tokenAccount: "string";
  tokenAmount: 0;
  metadata: {
    updateAuthority: "string";
    mint: "string";
    name: "string";
    symbol: "string";
    uri: "string";
    additionalMetadata: [["secret", "potatoes"], ["description", "potatoes"]];
  };
};
