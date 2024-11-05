// src/App.tsx
import React, { useState, FormEvent } from "react";

// Define the structure of the uploaded blob information
interface UploadedBlob {
  status: string;
  blobId: string;
  endEpoch: number;
  suiRefType: string;
  suiRef: string;
  suiBaseUrl: string;
  blobUrl: string;
  suiUrl: string;
  mediaType: string;
}

const Walrus: React.FC = () => {
  const [publisherUrl, setPublisherUrl] = useState<string>(
    "https://publisher.walrus-testnet.walrus.space"
  );
  const [aggregatorUrl, setAggregatorUrl] = useState<string>(
    "https://aggregator.walrus-testnet.walrus.space"
  );
  const [file, setFile] = useState<File | null>(null);
  const [epochs, setEpochs] = useState<number>(1);
  const [uploadedBlobs, setUploadedBlobs] = useState<UploadedBlob[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const SUI_NETWORK = "testnet";
  const SUI_VIEW_TX_URL = `https://suiscan.xyz/${SUI_NETWORK}/tx`;
  const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/${SUI_NETWORK}/object`;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const storageInfo = await storeBlob();
      if (storageInfo) {
        displayUpload(storageInfo.info, storageInfo.media_type);
        // Optionally, reset the file input
        setFile(null);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "An error occurred while uploading. Check the console and ensure that the aggregator and publisher URLs are correct."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const storeBlob = async (): Promise<{ info: any; media_type: string }> => {
    if (!file) {
      throw new Error("No file selected.");
    }

    const basePublisherUrl = publisherUrl;
    const numEpochs = epochs;

    const response = await fetch(
      `${basePublisherUrl}/v1/store?epochs=${numEpochs}`,
      {
        method: "PUT",
        body: file,
      }
    );

    if (response.status === 200) {
      const info = await response.json();
      console.log(info);
      return { info: info, media_type: file.type };
    } else {
      throw new Error("Something went wrong when storing the blob!");
    }
  };

  const displayUpload = (storage_info: any, media_type: string) => {
    let info: any;

    if ("alreadyCertified" in storage_info) {
      info = {
        status: "Already certified",
        blobId: storage_info.alreadyCertified.blobId,
        endEpoch: storage_info.alreadyCertified.endEpoch,
        suiRefType: "Previous Sui Certified Event",
        suiRef: storage_info.alreadyCertified.event.txDigest,
        suiBaseUrl: SUI_VIEW_TX_URL,
      };
    } else if ("newlyCreated" in storage_info) {
      info = {
        status: "Newly created",
        blobId: storage_info.newlyCreated.blobObject.blobId,
        endEpoch: storage_info.newlyCreated.blobObject.storage.endEpoch,
        suiRefType: "Associated Sui Object",
        suiRef: storage_info.newlyCreated.blobObject.id,
        suiBaseUrl: SUI_VIEW_OBJECT_URL,
      };
    } else {
      throw new Error("Unhandled successful response!");
    }

    const blobUrl = `${aggregatorUrl}/v1/${info.blobId}`;
    const suiUrl = `${info.suiBaseUrl}/${info.suiRef}`;
    const isImage = media_type.startsWith("image");

    const newBlob: UploadedBlob = {
      status: info.status,
      blobId: info.blobId,
      endEpoch: info.endEpoch,
      suiRefType: info.suiRefType,
      suiRef: info.suiRef,
      suiBaseUrl: info.suiBaseUrl,
      blobUrl: blobUrl,
      suiUrl: suiUrl,
      mediaType: media_type,
    };

    setUploadedBlobs((prev) => [newBlob, ...prev]);
  };

  return (
    <div>
      <header className="container my-3">
        <h1>Walrus Blob Upload</h1>
        <p className="lead">
          An example uploading and displaying files with Walrus.
        </p>
      </header>

      <main className="container">
        <div className="row align-items-start gx-5">
          <section className="col-lg-5 mb-3">
            <h2>Blob Upload</h2>
            <p>
              Upload blobs to Walrus, and display them on this page. See the{" "}
              <a
                href="https://docs.walrus.site"
                target="_blank"
                rel="noopener noreferrer"
              >
                Walrus documentation
              </a>{" "}
              for more information. The file size is limited to 10 MiB on the
              default publisher. Use the{" "}
              <a
                href="https://docs.walrus.site/usage/client-cli.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                CLI tool
              </a>{" "}
              to store bigger files.
            </p>

            <form id="upload-form" onSubmit={handleSubmit} className="mb-3">
              <fieldset disabled={isUploading}>
                <div className="row g-3">
                  <div className="col-lg-6">
                    <label htmlFor="publisher-url-input" className="form-label">
                      Walrus publisher URL
                    </label>
                    <input
                      id="publisher-url-input"
                      type="url"
                      className="form-control"
                      placeholder="https://publisher.walrus-testnet.walrus.space"
                      value={publisherUrl}
                      onChange={(e) => setPublisherUrl(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-lg-6">
                    <label
                      htmlFor="aggregator-url-input"
                      className="form-label"
                    >
                      Walrus aggregator URL
                    </label>
                    <input
                      id="aggregator-url-input"
                      type="url"
                      className="form-control"
                      placeholder="https://aggregator.walrus-testnet.walrus.space"
                      value={aggregatorUrl}
                      onChange={(e) => setAggregatorUrl(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="file-input" className="form-label">
                      Blob to upload (<strong>Max 10 MiB size</strong> on the
                      default publisher!)
                    </label>
                    <input
                      id="file-input"
                      type="file"
                      className="form-control"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFile(e.target.files[0]);
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="epochs-input" className="form-label">
                      Epochs
                    </label>
                    <input
                      id="epochs-input"
                      type="number"
                      value={epochs}
                      min={1}
                      placeholder="Epochs"
                      className="form-control"
                      onChange={(e) => setEpochs(parseInt(e.target.value, 10))}
                      required
                    />
                    <div className="form-text">
                      The number of Walrus epochs for which to store the blob.
                    </div>
                  </div>

                  <div className="col-12">
                    <button
                      id="submit"
                      type="submit"
                      className="btn btn-primary"
                    >
                      {isUploading && (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      )}
                      <span>{isUploading ? "Uploading ..." : "Upload"}</span>
                    </button>
                  </div>
                </div>
              </fieldset>
            </form>

            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
          </section>

          <section className="col-lg-7">
            <h2>Uploaded Blobs</h2>
            <div id="uploaded-blobs">
              {uploadedBlobs.length === 0 && <p>No blobs uploaded yet.</p>}
              {uploadedBlobs.map((blob) => (
                <article
                  key={blob.blobId}
                  className="row border rounded-2 shadow-sm mb-3 p-2"
                >
                  <div className="col-4 ps-0">
                    {blob.mediaType.startsWith("image") ? (
                      <img
                        src={blob.blobUrl}
                        alt="Uploaded Blob"
                        className="img-fluid rounded"
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : (
                      <object
                        type={blob.mediaType}
                        data={
                          blob.mediaType.startsWith("image")
                            ? blob.blobUrl
                            : undefined
                        }
                        className="w-100 h-100"
                      >
                        {blob.blobId}
                      </object>
                    )}
                  </div>
                  <dl className="blob-info col-8 my-2">
                    <dt>Status</dt>
                    <dd>{blob.status}</dd>

                    <dt>Blob ID</dt>
                    <dd className="text-truncate">
                      <a
                        href={blob.blobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {blob.blobId}
                      </a>
                    </dd>

                    <dt>{blob.suiRefType}</dt>
                    <dd className="text-truncate">
                      <a
                        href={blob.suiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {blob.suiRef}
                      </a>
                    </dd>

                    <dt>Stored until epoch</dt>
                    <dd>{blob.endEpoch}</dd>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Walrus;
