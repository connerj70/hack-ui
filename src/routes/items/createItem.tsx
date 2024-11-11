import { useAuth } from "@/contexts/useAuth";
import { ChangeEvent, FormEvent, useState } from "react";

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
  const [uploadedBlob, setUploadedBlob] = useState<UploadedBlob | null>(null);
  const { currentUser } = useAuth();

  // Define the shape of the form data
  interface FormData {
    name: string;
    description: string;
    pdf: File | null;
  }

  // Initialize form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    pdf: null,
  });

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input changes separately
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      pdf: file || null,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.pdf) {
      if (!currentUser) {
        return;
      }

      const jwt = await currentUser.getIdToken();

      console.log("blob id ===", uploadedBlob?.blobId);

      const resp = await fetch(`${import.meta.env.VITE_API_URL}/item/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          blobId: "",
        }),
      });

      console.log("resp", resp);
    } else {
      if (formData.pdf.size > 10_000_000) {
        setError("File size should be less than 10MB.");
        return;
      }

      if (!formData.pdf.type.startsWith("application/pdf")) {
        setError("Invalid file type. Only PDFs are allowed.");
        return;
      }

      // Prepare form data for submission
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("pdf", formData.pdf);

      const basePublisherUrl = "https://publisher.walrus-testnet.walrus.space";
      const numEpochs = 1;

      setLoading(true);
      try {
        const response = await fetch(
          `${basePublisherUrl}/v1/store?epochs=${numEpochs}`,
          {
            method: "PUT",
            body: data, // Send the entire FormData
          }
        );

        const storageInfo = await response.json();
        setUploadedBlob(storageInfo);
        console.log("storageInfo", storageInfo);
        setSuccess("Item created successfully!");
        setFormData({ name: "", description: "", pdf: null }); // Reset form
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
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
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-300"
            placeholder="Enter your name"
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
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-300"
            placeholder="Enter a description"
            rows={4}
          ></textarea>
        </div>

        {/* PDF Upload Field */}
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
            required
            className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
          />
        </div>

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
