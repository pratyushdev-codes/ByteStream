import React, { useState, useRef } from 'react';
import { Menu, Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Download, ChevronDown, Share2 } from 'lucide-react';

function ByteDocs() {
  const [content, setContent] = useState('Start typing your document...');
  const [title, setTitle] = useState('Untitled Document');
  const [isSaved, setIsSaved] = useState(true);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const editorRef = useRef(null);

  const handleContentChange = (e) => {
    setContent(e.currentTarget.innerText);
    setIsSaved(false);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsSaved(false);
  };

  const formatDoc = (command, value = undefined) => {
    document.execCommand(command, false, value);
  };

  const getFormattedContent = () => {
    const element = editorRef.current;
    if (!element) return '';

    return `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
            }
            h1 {
              text-align: center;
              color: #333;
              margin-bottom: 30px;
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${element.innerHTML}
        </body>
      </html>`;
  };

  const downloadAsPDF = () => {

    const content = getFormattedContent();
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(content);
    printWindow.document.close();
    
    // Wait for resources to load
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    //   printWindow.close();
    };
  };

  const downloadAsDocx = () => {
    const content = getFormattedContent();
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleConnectSession = () => {
    setIsConnecting(true);
    // Generate a random session ID (in a real app, this would come from your backend)
    const newSessionId = Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className=" bg-gray-900 sticky top-0 z-10">
        <div className="flex items-center px-4 py-2">
          <Type className="h-8 w-5 text-blue-400 mr-2" />
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="text-lg font-medium w-full bg-transparent text-gray-100 rounded-full "
              placeholder="Untitled Document"
            />
          </div>
          <div className="flex items-center space-x-1 mr-4">
            <button
              onClick={handleConnectSession}
              disabled={isConnecting}
              className={`flex items-center space-x-1 px-1 py-1.5 rounded-2xl  ${
                sessionId ? 'bg-green' : 'bg-[#045AD8] '
              } text-white rounded hover:opacity-90 transition-colors ${
                isConnecting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              <Share2 className="h-4 w-4" />
              <span>
                {isConnecting
                  ? 'Connecting...'
                  : sessionId
                  ? `Connected (${sessionId})`
                  : 'Connect Session'}
              </span>
            </button>
            <div className="relative">
              <button
                onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 rounded-full text-white  hover:bg-blue-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {isDownloadMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => {
                        downloadAsPDF();
                        setIsDownloadMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      role="menuitem"
                    >
                      Download as PDF
                    </button>
                    <button
                      onClick={() => {
                        downloadAsDocx();
                        setIsDownloadMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      role="menuitem"
                    >
                      Download as DOC
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
    
        </div>
        
        {/* Toolbar */}
        <div className="flex items-center space-x-2 px-4 py-2 border-t border-gray-800">
          <button onClick={() => formatDoc('bold')} className="p-1.5 hover:bg-gray-800 rounded text-gray-300 hover:text-gray-100">
            <Bold className="h-4 w-4" />
          </button>
          <button onClick={() => formatDoc('italic')} className="p-1.5 hover:bg-gray-800 rounded text-gray-300 hover:text-gray-100">
            <Italic className="h-4 w-4" />
          </button>
          <button onClick={() => formatDoc('underline')} className="p-1.5 hover:bg-gray-800 rounded text-gray-300 hover:text-gray-100">
            <Underline className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-800" />
          <button onClick={() => formatDoc('justifyLeft')} className="p-1.5 hover:bg-gray-800 rounded text-gray-300 hover:text-gray-100">
            <AlignLeft className="h-4 w-4" />
          </button>
          <button onClick={() => formatDoc('justifyCenter')} className="p-1.5 hover:bg-gray-800 rounded text-gray-300 hover:text-gray-100">
            <AlignCenter className="h-4 w-4" />
          </button>
          <button onClick={() => formatDoc('justifyRight')} className="p-1.5 hover:bg-gray-800 rounded text-gray-300 hover:text-gray-100">
            <AlignRight className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-800" />
          <button onClick={() => formatDoc('insertUnorderedList')} className="p-1.5 hover:bg-gray-800 rounded text-gray-300 hover:text-gray-100">
            <List className="h-4 w-4" />
          </button>
          <button onClick={() => formatDoc('insertOrderedList')} className="p-1.5 hover:bg-gray-800 rounded text-gray-300 hover:text-gray-100">
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Editor */}
      <main className="max-w-4xl mx-auto  ">
        <div
          ref={editorRef}
          className="min-h-[1100px] w-full bg-gray-900 shadow-lg border border-gray-800 rounded-lg p-12 text-gray-100 "
          contentEditable
          onInput={handleContentChange}
          suppressContentEditableWarning
          style={{ outline: 'none' }}
        >
          {content}
        </div>
      </main>
    </div>
  );
}

export default ByteDocs;