export type ScannerType = {
  id: string;
  secretKey: string;
  description: string;
  public: string;
  selected: boolean;
};

export type ScannerCreateType = {
  description: string;
};

export type GetScannerResponseType = {
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
    additionalMetadata: [
      [
        "secret",
        "jTW2SfoRecY4eaShFpq5M7qEFUVSEPaS5drhyj7Tnk54S2A6yAPu8r5qxWrormLd1Anbw5aBYhNDe3eebPuXVHC"
      ],
      ["description", "test"],
      ["public", "true"]

    ];
  };
};
