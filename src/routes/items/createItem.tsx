import { useAuth } from "@/contexts/useAuth";
import { ChangeEvent, FormEvent, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

export const SUI_NETWORK = "testnet";
export const SUI_VIEW_TX_URL = `https://suiscan.xyz/${SUI_NETWORK}/tx`;
export const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;

export interface UploadedBlob {
  status: string;
  blobId: string;
  endEpoch: number;
  suiRefType: string;
  suiRef: string;
  suiBaseUrl: string;
  mediaType: string;
}

export default function CreateItem() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  interface FormData {
    name: string;
    description: string;
    pdf: File | null;
    includePdf: boolean;
  }

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    pdf: null,
    includePdf: false,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      includePdf: checked,
      pdf: checked ? prev.pdf : null,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      pdf: file || null,
    }));
  };

  const storeBlob = async (file: File): Promise<UploadedBlob> => {
    if (file.size > 10_000_000) {
      throw new Error("File size should be less than 10MB.");
    }

    if (!file.type.startsWith("application/pdf")) {
      throw new Error("Invalid file type. Only PDFs are allowed.");
    }

    const basePublisherUrl = "https://walrus-testnet-publisher.nodes.guru";
    const numEpochs = 1;

    const response = await fetch(
      `${basePublisherUrl}/v1/store?epochs=${numEpochs}`,
      {
        method: "PUT",
        body: file,
      }
    );

    if (response.ok) {
      const storageInfo = await response.json();
      console.log("Storage Info:", storageInfo);

      if (storageInfo.alreadyCertified) {
        return {
          status: "Already certified",
          blobId: storageInfo.alreadyCertified.blobId,
          endEpoch: storageInfo.alreadyCertified.endEpoch,
          suiRefType: "Previous Sui Certified Event",
          suiRef: storageInfo.alreadyCertified.eventOrObject.Event.txDigest,
          suiBaseUrl: SUI_VIEW_TX_URL,
          mediaType: file.type,
        };
      } else if (storageInfo.newlyCreated) {
        return {
          status: "Newly created",
          blobId: storageInfo.newlyCreated.blobObject.blobId,
          endEpoch: storageInfo.newlyCreated.blobObject.storage.endEpoch,
          suiRefType: "Associated Sui Object",
          suiRef: storageInfo.newlyCreated.blobObject.id,
          suiBaseUrl: SUI_VIEW_OBJECT_URL,
          mediaType: file.type,
        };
      } else {
        throw new Error("Unhandled successful response!");
      }
    } else {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Something went wrong when storing the blob!"
      );
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const { name, description, pdf, includePdf } = formData;

    // Validation
    if (includePdf) {
      if (!pdf) {
        setError("Please upload a PDF file or uncheck the option.");
        setLoading(false);
        return;
      }

      if (pdf.size > 10_000_000) {
        setError("File size should be less than 10MB.");
        setLoading(false);
        return;
      }

      if (!pdf.type.startsWith("application/pdf")) {
        setError("Invalid file type. Only PDFs are allowed.");
        setLoading(false);
        return;
      }
    }

    try {
      let blobId = "";

      if (includePdf && pdf) {
        const blob = await storeBlob(pdf);
      
        blobId = blob.blobId;
      }

      if (!currentUser) {
        throw new Error("User not authenticated.");
      }

      const jwt = await currentUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/item/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            name,
            description,
            blobId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create item.");
      }

      setSuccess("Item created successfully!");
      setFormData({
        name: "",
        description: "",
        pdf: null,
        includePdf: false,
      });

      navigate("/items");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create a New Item
        </h2>

        {/* Display Error Message */}
        {error && <div className="mb-4 text-red-500">{error}</div>}

        {/* Display Success Message */}
        {success && <div className="mb-4 text-green-500">{success}</div>}

        {/* Name Field */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-300"
            placeholder="Enter your name"
            disabled={loading}
          />
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-300"
            placeholder="Enter a description"
            rows={4}
            disabled={loading}
          ></textarea>
        </div>

        {/* Checkbox to Include PDF */}
        <div className="mb-4 flex items-center">
          <Checkbox
            checked={formData.includePdf}
            onCheckedChange={handleCheckboxChange}
            id="includePdf"
            disabled={loading}
          />
          <label
            htmlFor="includePdf"
            className="ml-2 text-gray-700 text-sm cursor-pointer"
          >
            Upload Bill of Lading (Optional)
          </label>
        </div>

        {/* PDF Upload Field - Conditionally Rendered */}
        {formData.includePdf && (
          <div className="mb-6">
            <label
              htmlFor="pdf"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Upload Bill of Lading
            </label>
            <input
              type="file"
              id="pdf"
              name="pdf"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
              disabled={loading}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
