import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { useAuth } from "@/contexts/useAuth";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const QRScanner: React.FC = () => {
  const [scanKey, setScanKey] = useState<number>(0); // Used to reset the scanner
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const { selectedScanner, currentUser } = useAuth(); // Ensure 'currentUser' is destructured correctly

  useEffect(() => {
    let animationFrameId: number;
    let stream: MediaStream | null = null;
    let isComponentMounted = true;

    const startQRScanner = async () => {
      try {
        console.log("Requesting camera access...");
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        console.log("Camera access granted.");

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true"); // Required for iOS Safari

          // Attempt to play the video
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Video playing successfully.");
                if (isComponentMounted) {
                  setIsScanning(true);
                  scanQRCode();
                }
              })
              .catch((playError) => {
                console.error("Error playing video:", playError);
                setError(
                  "Error playing video. Please interact with the page to start scanning."
                );
              });
          }
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Unable to access the camera. Please check permissions.");
      }
    };

    const scanQRCode = () => {
      if (!videoRef.current || !canvasRef.current) {
        console.warn("Video or canvas reference is missing.");
        animationFrameId = requestAnimationFrame(scanQRCode);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          console.log("QR Code detected:", code.data);
          setQrCode(code.data);
          setIsScanning(false);
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
          return; // Stop the scanning loop
        }
      }

      // Continue scanning
      animationFrameId = requestAnimationFrame(scanQRCode);
    };

    startQRScanner();

    // Cleanup function
    return () => {
      isComponentMounted = false;
      setIsScanning(false);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [scanKey]); // Depend on scanKey to allow retries

  const handleRetry = () => {
    setQrCode(null);
    setError(null);
    setScanKey((prevKey) => prevKey + 1); // Change scanKey to re-run useEffect
  };

  const handleScan = async () => {
    setSubmitting(true);
    try {
      if (!currentUser) {
        toast({
          title: "User not authenticated",
          description: "Please log in to perform this action.",
          variant: "destructive",
        });
        return;
      }
      const jwt = await currentUser.getIdToken();
      const res: Response = await fetch(
        `${import.meta.env.VITE_API_URL}/event/scan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            scannerSecret: selectedScanner?.secret,
            itemSecret: qrCode,
            message: "test test",
          }),
        }
      );

      if (!res.ok) {
        toast({
          title: "Airdrop Failed",
          description: "Try again later.",
          variant: "destructive",
        });
        return;
      }

      // Assuming the response contains JSON data
      const data = await res.json();
      toast({
        title: "Airdrop Successful",
        description: "The item has been successfully scanned and processed.",
        variant: "default",
      });
      console.log("Airdrop Success:", data);
      // Optionally reset the scanner after successful submission
      handleRetry();
    } catch (error) {
      console.error("Error during airdrop:", error);
      toast({
        title: "Airdrop Failed",
        description: "Try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-semibold mb-4">
        QR Code Scanner {selectedScanner?.name && `(${selectedScanner.name})`}
      </h1>

      {/* Remove or comment out these debug lines in production */}
      {/* <p>scannerSecret: {selectedScanner?.secret}</p>
      <p>itemSecret: {qrCode}</p>
      <p>message: {"test test"}</p> */}

      {error && (
        <div className="mt-5 text-center pb-8">
          <p className="text-red-500">{error}</p>
          <Button onClick={handleRetry}>Retry</Button>
        </div>
      )}

      {qrCode ? (
        <div className="mt-5 text-center">
          <p className="mb-2">QR Code Detected:</p>
          <code className="block bg-gray-100 p-2 rounded break-all">
            {qrCode}
          </code>
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              onClick={handleScan}
              disabled={submitting}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
            <Button
              onClick={handleRetry}
              variant="ghost"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Scan Again
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative w-full max-w-md">
          <video
            key={scanKey} // Re-initialize video when scanKey changes
            ref={videoRef}
            className="w-full h-auto rounded-lg"
            autoPlay
            muted // Ensure video is muted to comply with autoplay policies
            playsInline
          />
          {isScanning && (
            <p className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-75 text-gray-700 px-3 py-1 rounded">
              Scanning for QR Code...
            </p>
          )}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default QRScanner;
