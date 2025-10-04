import React, { useState, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useLocation } from "react-router";
import {
  ZoomIn,
  ZoomOut,
  Download,
  RotateCw,
  Maximize2,
  Minimize2,
  FileText,
} from "lucide-react";
import "./style.css";
import { base_url } from "../../constants";

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = () => {
  const location = useLocation();
  // const pdfUrl = location.state?.course?.book_url;
  const [pdfUrl, setPdfUrl] = useState("");

  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((error) => {
    console.error("PDF Load Error:", error);
    setError(`Failed to load PDF: ${error.message || "Unknown error"}`);
    setIsLoading(false);
  }, []);

  const handleZoomIn = () => setScale((prev) => Math.min(3, prev + 0.2));
  const handleZoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.2));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const toggleFullscreen = () => {
    const elem = document.documentElement;
    if (!isFullscreen) {
      elem.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen((prev) => !prev);
  };
  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = location.state?.course?.title || "document.pdf";
      link.click();
    }
  };

  const getPdfFile = async (id) => {
    try {
      const response = await fetch(
        `${base_url}/user/courses/content/pdfs/read_book.php?book_id=466`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      console.log("blob", blobUrl, blob);
      setPdfUrl(blobUrl);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };
  useEffect(() => {
    getPdfFile();
  }, []);

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No PDF Available
          </h2>
          <p className="text-gray-500">
            Please select a course with a PDF document.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-[#3b003b] w-[80%] m-auto ${
        isFullscreen ? "fixed inset-0 z-50" : "min-h-screen"
      }`}
    >
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-800 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            {location.state?.course?.title || "PDF Viewer"}
          </h1>
          {numPages && (
            <span className="text-sm text-gray-500">
              {numPages} page{numPages > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="viewer-btn"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" color="#3b003b" />
          </button>
          <span className="text-sm text-gray-600 px-2">
            {Math.round(scale * 100)}%
          </span>
          <button onClick={handleZoomIn} className="viewer-btn" title="Zoom In">
            <ZoomIn className="w-4 h-4" color="#3b003b" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button onClick={handleRotate} className="viewer-btn" title="Rotate">
            <RotateCw className="w-4 h-4" color="#3b003b" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-5rem)] bg-white px-4 py-6 pdf_content ">
        {" "}
        {/* Custom Scrollbar with tailwind */}
        {isLoading && (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading PDF...</span>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center p-12 text-red-600">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-lg font-medium">{error}</p>
              <p className="text-sm text-gray-500 mt-2">
                Please check your internet connection and try again.
              </p>
            </div>
          </div>
        )}
        {!isLoading && !error && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <div
                key={`page_${index + 1}`}
                className="mb-10  flex justify-center"
              >
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  rotate={rotation}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-md "
                />
              </div>
            ))}
          </Document>
        )}
      </div>
    </div>
  );
};

// Tailwind style helper
const style = document.createElement("style");
style.innerHTML = `
  .viewer-btn {
    padding: 0.5rem;
    color: #4B5563;
    border-radius: 0.5rem;
    transition: background-color 0.2s ease;
  }
  .viewer-btn:hover {
    color: #1F2937;
    background-color: #F3F4F6;
  }
`;
document.head.appendChild(style);

export default PdfViewer;
