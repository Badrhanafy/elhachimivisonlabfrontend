// pages/admin/ImageUploadModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Image as ImageIcon,
  Trash2, 
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  FolderDown,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const ImageUploadModal = ({ reservation, onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadingSingleImage, setDownloadingSingleImage] = useState(null);
  
  const fileInputRef = useRef(null);
const backendurl = process.env.REACT_APP_BACKEND_URL;
  // Create axios instance with base configuration
  const api = axios.create({
    baseURL: backendurl,
    headers: {
      'Accept': 'application/json',
    },
  });

  // Add auth token to requests
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Load existing images on modal open
  useEffect(() => {
    fetchExistingImages();
  }, [reservation.id]);

  const fetchExistingImages = async () => {
    try {
      setLoadingExisting(true);
      const response = await api.get(`/admin/images/reservation/${reservation.id}`);
      setExistingImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError(error.response?.data?.message || 'Failed to load existing images');
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file count
  /*   if (files.length + selectedFiles.length > 10) {
      setError('Maximum 10 images allowed per reservation');
      return;
    } */

    // Validate file types and sizes (8MB limit based on your controller)
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 8 * 1024 * 1024; // 8MB (8120 in controller)
      
      if (!isValidType) {
        setError(`File ${file.name} is not a valid image type`);
        return false;
      }
      if (!isValidSize) {
        setError(`File ${file.name} exceeds 8MB limit`);
        return false;
      }
      return true;
    });

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    // Initialize captions
    const newCaptions = validFiles.map(file => {
      const name = file.name.split('.')[0];
      return name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' ');
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    setCaptions(prev => [...prev, ...newCaptions]);
    setError('');
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previews];
    const newCaptions = [...captions];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    newCaptions.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    setCaptions(newCaptions);
  };

  const updateCaption = (index, value) => {
    const newCaptions = [...captions];
    newCaptions[index] = value;
    setCaptions(newCaptions);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one image to upload');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');
      
      const formData = new FormData();
      
      // Append each file
      selectedFiles.forEach((file, index) => {
        formData.append('images[]', file);
        if (captions[index]) {
          formData.append('captions[]', captions[index]);
        }
      });

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Direct axios call to upload images
      const response = await api.post(
        `/admin/images/reservation/${reservation.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setSuccess(`${selectedFiles.length} image(s) uploaded successfully!`);
      setUploadedImages(response.data.images);
      
      // Clear selections
      setSelectedFiles([]);
      setPreviews([]);
      setCaptions([]);
      
      // Refresh existing images
      await fetchExistingImages();
      
      // Call onUpload callback
      if (onUpload) {
        onUpload();
      }
      
      // Reset progress after delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
      
    } catch (error) {
      console.error('Upload error:', error);
      
      // Handle validation errors from Laravel
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError(error.response?.data?.message || 'Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const toggleImageSelect = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const deleteSelectedImages = async () => {
    if (selectedImages.length === 0) return;
    
    if (!window.confirm(`Delete ${selectedImages.length} selected image(s)?`)) {
      return;
    }

    try {
      // Direct axios call for bulk delete
      await api.post('/admin/images/bulk-delete', { 
        image_ids: selectedImages 
      });
      
      setSuccess(`${selectedImages.length} image(s) deleted successfully!`);
      setSelectedImages([]);
      await fetchExistingImages();
      if (onUpload) onUpload();
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.response?.data?.message || 'Failed to delete images');
    }
  };

  // Function to update a single image caption
  const updateImageCaption = async (imageId, caption) => {
    try {
      await api.put(`/admin/images/${imageId}`, { caption });
      // Refresh the images list
      await fetchExistingImages();
    } catch (error) {
      console.error('Error updating caption:', error);
      setError('Failed to update caption');
    }
  };

  // Function to delete a single image
  const deleteSingleImage = async (imageId) => {
    if (!window.confirm('Delete this image?')) return;
    
    try {
      await api.delete(`/admin/images/${imageId}`);
      setSuccess('Image deleted successfully!');
      await fetchExistingImages();
      if (onUpload) onUpload();
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image');
    }
  };

  // Function to get image stats
  const fetchImageStats = async () => {
    try {
      const response = await api.get(`/admin/images/stats/${reservation.id}`);
      console.log('Image stats:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  };

  // View full size image in new tab
  const viewFullImage = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  // Download single image
  const downloadSingleImage = async (image, e) => {
    e.stopPropagation();
    setDownloadingSingleImage(image.id);
    
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = image.filename || `image_${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading single image:', error);
      setError('Failed to download image');
    } finally {
      setDownloadingSingleImage(null);
    }
  };

  // Download all images as zip
  const downloadAllImagesAsZip = async () => {
    if (existingImages.length === 0) {
      setError('No images to download');
      return;
    }

    try {
      setDownloadingZip(true);
      setError('');
      
      const response = await api.get(
        `/admin/images/reservation/${reservation.id}/download-zip`,
        {
          responseType: 'blob',
        }
      );
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from response headers
      const contentDisposition = response.headers['content-disposition'];
      let filename = `reservation_${reservation.id}_images.zip`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*?=["']?([^"';]+)["']?/);
        if (filenameMatch && filenameMatch[1]) {
          // Handle encoded filenames
          if (filenameMatch[1].startsWith("UTF-8''")) {
            filename = decodeURIComponent(filenameMatch[1].substring(7));
          } else {
            filename = filenameMatch[1];
          }
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSuccess(`Downloaded ${existingImages.length} images as zip file: ${filename}`);
      
    } catch (error) {
      console.error('Download error:', error);
      
      if (error.response?.status === 404) {
        setError('No images found to download');
      } else if (error.response?.status === 500) {
        setError('Failed to create zip file. Please try again.');
      } else if (error.response?.data) {
        // Try to read error message from blob
        const errorText = await error.response.data.text();
        try {
          const errorJson = JSON.parse(errorText);
          setError(errorJson.message || 'Download failed');
        } catch {
          setError('Download failed. Please try again.');
        }
      } else {
        setError('Download failed. Please check your connection.');
      }
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Upload Images</h3>
            <p className="text-gray-500 text-sm">
              Reservation #{reservation.id} • {reservation.team || 'No team'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          {/* Upload Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-700">Upload New Images</h4>
              <span className="text-sm text-gray-500">
                {selectedFiles.length} of 10 selected
              </span>
            </div>

            {/* File Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                handleFileSelect({ target: { files: e.dataTransfer.files } });
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Drop images here or click to browse</p>
              <p className="text-gray-500 text-sm mt-1">
                Supports JPG, PNG, GIF, WEBP • Max 8MB per image
              </p>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="mt-6">
                <h5 className="font-medium text-gray-700 mb-3">Selected Images</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden bg-white">
                      <div className="relative aspect-square bg-gray-100">
                        <img
                          src={previews[index]}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3">
                        <input
                          type="text"
                          value={captions[index]}
                          onChange={(e) => updateCaption(index, e.target.value)}
                          placeholder="Add a caption..."
                          className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Existing Images Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-700">
                Existing Images ({existingImages.length})
              </h4>
              <div className="flex space-x-2">
                {existingImages.length > 0 && (
                  <button
                    onClick={downloadAllImagesAsZip}
                    disabled={downloadingZip || existingImages.length === 0}
                    className={`px-3 py-1 text-sm rounded-lg flex items-center transition-colors
                      ${downloadingZip || existingImages.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                      }`}
                  >
                    {downloadingZip ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <FolderDown className="w-4 h-4 mr-1" />
                        Download All
                      </>
                    )}
                  </button>
                )}
                {selectedImages.length > 0 && (
                  <button
                    onClick={deleteSelectedImages}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete Selected ({selectedImages.length})
                  </button>
                )}
              </div>
            </div>

            {loadingExisting ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading images...</p>
              </div>
            ) : existingImages.length === 0 ? (
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No images uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {existingImages.map((image) => (
                  <div
                    key={image.id}
                    className={`border rounded-lg overflow-hidden bg-white cursor-pointer transition-all
                      ${selectedImages.includes(image.id) ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => toggleImageSelect(image.id)}
                  >
                    <div className="relative aspect-square bg-gray-100">
                      <img
                        src={image.url}
                        alt={image.caption || image.filename}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" font-size="10" text-anchor="middle" dy=".3em" fill="%239ca3af">Image</text></svg>';
                        }}
                      />
                      <div 
                        className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          viewFullImage(image.url);
                        }}
                      >
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      {selectedImages.includes(image.id) && (
                        <div className="absolute top-2 left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {/* Individual delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSingleImage(image.id);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="p-2">
                      <input
                        type="text"
                        defaultValue={image.caption || ''}
                        placeholder="Add caption..."
                        className="w-full px-2 py-1 text-xs border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-1"
                        onClick={(e) => e.stopPropagation()}
                        onBlur={(e) => {
                          if (e.target.value !== (image.caption || '')) {
                            updateImageCaption(image.id, e.target.value);
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.target.blur();
                          }
                        }}
                      />
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(image.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => downloadSingleImage(image, e)}
                            disabled={downloadingSingleImage === image.id}
                            className="text-blue-500 hover:text-blue-600"
                            title="Download"
                          >
                            {downloadingSingleImage === image.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Download className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          {/* Progress Bar */}
          {uploading && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between bg-red-50 text-red-700 p-3 rounded-lg mb-4"
              >
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{error}</span>
                </div>
                <button onClick={() => setError('')}>
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between bg-green-50 text-green-700 p-3 rounded-lg mb-4"
              >
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>{success}</span>
                </div>
                <button onClick={() => setSuccess('')}>
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center
                ${uploading || selectedFiles.length === 0
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                }`}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload ({selectedFiles.length})
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageUploadModal;