import { useAuth } from "@/contexts/useAuth";
import { ChangeEvent, FormEvent, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"; // Import the Checkbox component
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

export default function CreateScanner() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedBlob, setUploadedBlob] = useState<UploadedBlob | null>(null);
  const { currentUser } = useAuth();

  const nav = useNavigate();

  // Define the shape of the form data
  interface FormData {
    name: string;
    description: string;
    pdf: File | null;
    includePdf: boolean; // State for the checkbox
  }

  // Initialize form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    pdf: null,
    includePdf: false, // Initialize checkbox as unchecked
  });

  // Handle input changes for text inputs and textareas
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      includePdf: checked,
      pdf: checked ? prev.pdf : null, // Reset pdf if unchecked
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

    // Destructure formData for easier access
    const { name, description, pdf, includePdf } = formData;

    // Validation
    if (includePdf) {
      if (!pdf) {
        setError("Please upload a PDF file or uncheck the option.");
        return;
      }

      if (pdf.size > 10_000_000) {
        setError("File size should be less than 10MB.");
        return;
      }

      if (!pdf.type.startsWith("application/pdf")) {
        setError("Invalid file type. Only PDFs are allowed.");
        return;
      }
    }

    try {
      if (includePdf && pdf) {
        // Prepare form data for submission
        const data = new FormData();
        data.append("name", name);
        data.append("description", description);
        data.append("pdf", pdf);

        const basePublisherUrl =
          "https://publisher.walrus-testnet.walrus.space";
        const numEpochs = 1;

        setLoading(true);

        const response = await fetch(
          `${basePublisherUrl}/v1/store?epochs=${numEpochs}`,
          {
            method: "PUT",
            body: pdf, // Send the entire FormData
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to upload PDF.");
        }

        const storageInfo = await response.json();
        setUploadedBlob(storageInfo);
        console.log("storageInfo", storageInfo);
      }

      // If PDF is not included, handle accordingly
      if (!includePdf) {
        if (!currentUser) {
          setError("User not authenticated.");
          return;
        }

        const jwt = await currentUser.getIdToken();

        const resp = await fetch(
          `${import.meta.env.VITE_API_URL}/scanner/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
              name,
              description,
              blobId: uploadedBlob?.blobId || "", // No PDF uploaded
            }),
          }
        );

        if (!resp.ok) {
          const errorData = await resp.json();
          throw new Error(errorData.message || "Failed to create scanner.");
        }
      }

      setSuccess("Scanner created successfully!");
      setFormData({
        name: "",
        description: "",
        pdf: null,
        includePdf: false, // Reset checkbox
      });

      nav("/scanners");
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
          Create a New Scanner
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
            placeholder="Enter your scanner name"
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
            placeholder="Enter a scanner description"
            rows={4}
          ></textarea>
        </div>

        {/* Checkbox to Include PDF */}
        <div className="mb-4 flex items-center">
          <Checkbox
            checked={formData.includePdf}
            onCheckedChange={handleCheckboxChange}
            id="includePdf"
          />
          <label
            htmlFor="includePdf"
            className="ml-2 text-gray-700 text-sm cursor-pointer"
          >
            Upload Aditional PDF (Optional)
          </label>
        </div>

        {/* PDF Upload Field - Conditionally Rendered */}
        {formData.includePdf && (
          <div className="mb-6">
            <label
              htmlFor="pdf"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Upload Aditional PDF
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
