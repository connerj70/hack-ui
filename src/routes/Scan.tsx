import QRScanner from "./video";

export const SUI_NETWORK = "testnet";
export const SUI_VIEW_TX_URL = `https://suiscan.xyz/${SUI_NETWORK}/tx`;
export const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;

// Define the structure of the uploaded blob information
export interface UploadedBlob {
  status: string;
  blobId: string;
  endEpoch: number;
  suiRefType: string;
  suiRef: string;
  suiBaseUrl: string;
  mediaType: string;
}

const Scan: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-5">
      <QRScanner />
    </div>
  );
};

export default Scan;
