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
    className="w-12 h-12 md:w-20 md:h-20 object-contain"
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
    title: "Asian Wire & Cable Low Voltage & Instrumentation",
    size: "20 MB",
    url: `${process.env.PUBLIC_URL || ''}/pdf/Asian-Wire-&Cable-LOW-VOLTAGE-INSTRUMENTATION.pdf`
  },
  {
    id: 2,
    title: "Asian Wire & Cable Flexible Cables",
    size: "10 MB", 
    url: `${process.env.PUBLIC_URL || ''}/pdf/Asian-Wire-&Cable-FLEXIBLE-CABLES.pdf`
  },
  {
    id: 3,
    title: "Asian Wire & Cable Low Voltage FRC",
    size: "5.0 MB",
    url: `${process.env.PUBLIC_URL || ''}/pdf/Asian-Wire-&Cable-Low-Voltage-FRC.pdf`
  },
  {
    id: 4,
    title: "Asian Wire & Cable Mid High Extra High Voltage",
    size: "4.1 MB",
    url: `${process.env.PUBLIC_URL || ''}/pdf/Asian-Wire-&Cable-Mid-High-Extra-High-Voltage.pdf`
  }
];

// Document Card Component
interface DocumentCardProps {
  document: DocumentItem;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document: documentItem }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handlePreview = () => {
    window.open(documentItem.url, '_blank');
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
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-3 md:p-6 flex flex-col h-full relative">
      {/* File Size - Upper Right Corner */}
      <div className="absolute top-2 right-2 md:top-3 md:right-3">
        <span className="text-xs md:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-medium">
          {documentItem.size}
        </span>
      </div>
      
      {/* Document Icon */}
      <div className="flex justify-center mb-3 md:mb-6">
        <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
          <DocumentIcon />
        </div>
      </div>
      
      {/* Content */}
      <div className="text-center flex-grow flex flex-col">
        <h3 className="text-xs md:text-sm lg:text-base font-normal text-gray-800 mb-2 md:mb-4 line-clamp-3 leading-relaxed">{documentItem.title}</h3>
        <div className="flex-grow"></div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2 md:gap-3">
        <button 
          onClick={handlePreview}
          className="flex-1 py-2 md:py-3 px-2 md:px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-1 md:gap-2 font-medium text-xs md:text-sm"
        >
          <EyeIcon />
          Preview
        </button>
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className={`flex-1 py-2 md:py-3 px-2 md:px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-1 md:gap-2 font-medium shadow-md text-xs md:text-sm ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}
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
  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-16 max-w-7xl mx-auto">
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
        <DocumentGrid />
      </div>
    </div>
  );
};

export default App;