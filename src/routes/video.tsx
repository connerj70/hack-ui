import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

const QRScanner: React.FC = () => {
  const [scanKey, setScanKey] = useState<number>(0); // Used to reset the scanner
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

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

  return (
    <div style={styles.container}>
      <h1>QR Code Scanner</h1>
      {error && (
        <div style={styles.message}>
          <p>{error}</p>
          <button onClick={handleRetry} style={styles.button}>
            Retry
          </button>
        </div>
      )}
      {qrCode ? (
        <div style={styles.message}>
          <p>QR Code Detected:</p>
          <code>{qrCode}</code>
          <button onClick={handleRetry} style={styles.button}>
            Scan Again
          </button>
        </div>
      ) : (
        <div style={styles.scanner}>
          <video
            key={scanKey} // Re-initialize video when scanKey changes
            ref={videoRef}
            style={styles.video}
            autoPlay
            muted // Ensure video is muted to comply with autoplay policies
            playsInline
          />
          {isScanning && <p>Scanning for QR Code...</p>}
        </div>
      )}
      <canvas ref={canvasRef} style={styles.canvas} />
    </div>
  );
};

// Inline styles for simplicity; consider using CSS or styled-components for larger projects
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  scanner: {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
  },
  video: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
  },
  canvas: {
    display: "none",
  },
  message: {
    marginTop: "20px",
    textAlign: "center",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default QRScanner;
