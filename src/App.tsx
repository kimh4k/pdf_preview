import React, { useState } from 'react';

interface DocumentItem {
  id: number;
  title: string;
  size: string;
  url: string;
}


const LibraryIcon = () => (
  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
    <path d="M14 17H7v-6h7v6zm-5-4v2h3v-2H9zM7 7h2v2H7zM11 7h2v2h-2zM15 7h2v2h-2z"/>
  </svg>
);

const DocumentIcon = () => (
  <img 
    src={`${process.env.PUBLIC_URL || ''}/pdf.png`} 
    alt="PDF Document" 
    className="w-15 h-15 object-contain"
  />
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
  </svg>
);

const documents: DocumentItem[] = [
  {
    id: 1,
    title: "AWC ROYAL NSG LOW VOLTAGE & INSTRUMENTATION",
    size: "170.3 MB",
    url: `${process.env.PUBLIC_URL || ''}/pdf/AWC ROYAL NSG LOW VOLTAGE & INSTRUMENTATION.pdf`
  },
  {
    id: 2,
    title: "AWC ROYALNSG FLEXIBLE CABLES",
    size: "93.8 MB", 
    url: `${process.env.PUBLIC_URL || ''}/pdf/AWC ROYALNSG FLEXIBLE CABLES.pdf`
  },
  {
    id: 3,
    title: "AWC ROYALNSG Low Voltage FRC",
    size: "64.3 MB",
    url: `${process.env.PUBLIC_URL || ''}/pdf/AWC ROYALNSG Low Voltage FRC.pdf`
  },
  {
    id: 4,
    title: "AWC ROYALNSG MID HIGH EXTRA HIGH VOLTAGE",
    size: "52.7 MB",
    url: `${process.env.PUBLIC_URL || ''}/pdf/AWC ROYALNSG MID HIGH EXTRA HIGH VOLTAGE.pdf`
  }
];

// Header Component
const Header: React.FC = () => (
  <header className="text-center mb-16">
    <div className="flex justify-center mb-6">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
        <LibraryIcon />
      </div>
    </div>
    <h1 className="text-4xl font-bold text-gray-800 mb-4">Document Library</h1>
  </header>
);

// Document Card Component
interface DocumentCardProps {
  document: DocumentItem;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document: documentItem }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handlePreview = () => {
    // For local development and when files are served from the same domain
    // Create a simple PDF viewer page
    const pdfUrl = documentItem.url;
    
    // Check if it's a local URL (for development) or external URL (for production)
    const isLocalUrl = pdfUrl.startsWith('/') || pdfUrl.includes(window.location.origin);
    
    if (isLocalUrl) {
      // For local files, use direct browser PDF viewer
      window.open(pdfUrl, '_blank');
    } else {
      // For external URLs, use PDF.js viewer with CORS handling
      const pdfJsUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`;
      window.open(pdfJsUrl, '_blank');
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // For local development, use fetch with blob approach
      const response = await fetch(documentItem.url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = documentItem.title + '.pdf';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      
    } catch (error) {
      console.error('Download failed:', error);
      
      // Fallback 1: Try direct link download
      try {
        const link = document.createElement('a');
        link.href = documentItem.url;
        link.download = documentItem.title + '.pdf';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
      } catch (fallbackError) {
        console.error('Fallback download failed:', fallbackError);
        // Final fallback: open in new tab
        window.open(documentItem.url, '_blank', 'noopener,noreferrer');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col h-full">
      {/* Document Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 flex items-center justify-center">
          <DocumentIcon />
        </div>
      </div>
      
      {/* Content */}
      <div className="text-center flex-grow flex flex-col">
        <h3 className="text-base font-normal text-gray-800 mb-4">{documentItem.title}</h3>
        <div className="flex-grow"></div>
        <p className="text-sm text-gray-500 mb-6">{documentItem.size}</p>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-3">
        <button 
          onClick={handlePreview}
          className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
        >
          <EyeIcon />
          Preview
        </button>
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          <DownloadIcon />
          {isDownloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
    </div>
  );
};

// Document Grid Component
const DocumentGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
    {documents.map((document) => (
      <DocumentCard key={document.id} document={document} />
    ))}
  </div>
);


// Main App Component
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <DocumentGrid />
      </div>
    </div>
  );
};

export default App;