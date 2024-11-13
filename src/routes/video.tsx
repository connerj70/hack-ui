import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { useAuth } from "@/contexts/useAuth";
import { Button } from "@/components/ui/button";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

const QRScanner: React.FC = () => {
  const [scanKey, setScanKey] = useState<number>(0); // Used to reset the scanner
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const { selectedScanner, currentUser } = useAuth(); // Ensure 'currentUser' is destructured correctly
  const [location, setLocation] = useState<string>("");
  const { toast } = useToast();
  const nav = useNavigate();

  // Function to get user's current location
  const getCurrentLocation = () => {
    return new Promise<{ latitude: number; longitude: number }>(
      (resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by your browser"));
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              reject(error);
            }
          );
        }
      }
    );
  };

  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getCurrentLocation();
      setLocation(`${location.latitude},${location.longitude}`);
    };
    fetchLocation();
  }, []);

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
              });
          }
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
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

          const { secretKey } = decodeSuiPrivateKey(code.data);
          const address = Ed25519Keypair.fromSecretKey(secretKey);

          setQrCode(address.toSuiAddress());
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
    setScanKey((prevKey) => prevKey + 1); // Change scanKey to re-run useEffect
    // alert("Scan successful");
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

      console.log(jwt);
      const res: Response = await fetch(
        `${import.meta.env.VITE_API_URL}/event/sui/scan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            scannerSecret: selectedScanner?.secret,
            itemSecret: qrCode,
            message: location, // Replaced with user's GPS data
            blobId: "", // Replace with actual blobId
          }),
        }
      );

      if (!res.ok) {
        toast({
          title: "Scan Failed",
          description: "Try again later or contact support",
          variant: "destructive",
          action: (
            <ToastAction
              altText="Goto schedule to undo"
              onClick={() => nav(-1)}
            >
              Back to Dashboard
            </ToastAction>
          ),
        });
        return;
      }

      // Assuming the response contains JSON data
      const data = await res.json();
      toast({
        title: "Scan Successful",
        description: "The item has been successfully scanned and processed.",
        variant: "default",
      });
      console.log("Scan Success:", data);
      // Optionally reset the scanner after successful submission
      handleRetry();
    } catch (error) {
      console.error("Error during scan:", error);
      toast({
        title: "Scan Failed",
        description: "Try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center pb-10">
      <h1 className="text-2xl font-semibold mb-4">
        Selected Scanner: {selectedScanner?.name && `(${selectedScanner.name})`}
      </h1>
      {qrCode ? (
        <div className="mt-5 text-center">
          <div className="flex items-center">
            <p className="text-xs leading-none text-muted-foreground break-words whitespace-normal flex-1 min-w-0">
              {qrCode}
            </p>
            <a
              href={`https://suiscan.xyz/devnet/account/${qrCode}/portfolio`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
              aria-label={`Open profile for ${qrCode}`}
            >
              <OpenInNewWindowIcon className="w-4 h-4" />
            </a>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              onClick={handleScan}
              disabled={submitting && !qrCode && !location && !selectedScanner}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
            <Button
              onClick={handleRetry}
              variant="ghost"
              className="px-4 py-2 rounded transition"
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
            <div></div> // Add a loading indicator here (optional)
          )}
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
      <Toaster />
    </div>
  );
};

export default QRScanner;
