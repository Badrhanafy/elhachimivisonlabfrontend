import React from 'react';
import { XMarkIcon, TrashIcon, ArrowDownTrayIcon, LinkIcon } from '@heroicons/react/24/outline';

const ImagePreviewModal = ({ isOpen, onClose, image, onDelete }) => {
  if (!isOpen || !image) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url || `/storage/${image.path}`;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyImageUrl = () => {
    navigator.clipboard.writeText(image.url || `/storage/${image.path}`);
    alert('Image URL copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal content */}
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
              {/* Header */}
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {image.filename}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {image.caption || 'No caption provided'}
                    </p>
                  </div>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              <div className="px-4 pb-4 sm:px-6">
                <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                  <div className="relative w-full h-96">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <img
                          src={image.url || `/storage/${image.path}`}
                          alt={image.caption || image.filename}
                          className="max-h-96 max-w-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            document.querySelector('.fallback-icon').style.display = 'block';
                          }}
                        />
                        <div className="fallback-icon hidden">
                          <div className="text-gray-400">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-2 text-sm">Image preview not available</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Details */}
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">File Name</h4>
                    <p className="mt-1 text-sm text-gray-900 truncate">{image.filename}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">File Size</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {image.size ? (image.size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Upload Date</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(image.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="sm:col-span-3">
                    <h4 className="text-sm font-medium text-gray-500">MIME Type</h4>
                    <p className="mt-1 text-sm text-gray-900">{image.mime_type}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                  >
                    <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={copyImageUrl}
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Copy URL
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this image?')) {
                        onDelete(image.id);
                        onClose();
                      }
                    }}
                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;