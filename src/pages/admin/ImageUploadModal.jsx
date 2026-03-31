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
  Loader2,
  Sparkles,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Star,
  Camera
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [previewImage, setPreviewImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 12;
  
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

  // Pagination
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = existingImages.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(existingImages.length / imagesPerPage);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes (8MB limit based on your controller)
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 8 * 1024 * 1024; // 8MB
      
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
    setError('Please select images');
    return;
  }

  setUploading(true);
  setError('');
  setSuccess('');
  setUploadProgress(0);

  const totalFiles = selectedFiles.length;

  // ⚡ adaptive config (focus speed)
  let batchSize = 10;
  let parallel = 2;

  if (totalFiles < 50) {
    batchSize = 15;
    parallel = 2;
  } else if (totalFiles < 200) {
    batchSize = 10;
    parallel = 2;
  } else {
    batchSize = 8;
    parallel = 2;
  }

  let uploadedCount = 0;

  const uploadBatch = async (batch, startIndex, retry = 1) => {
    const formData = new FormData();

    batch.forEach((file, index) => {
      formData.append('images[]', file);

      const captionIndex = startIndex + index;
      if (captions[captionIndex]) {
        formData.append('captions[]', captions[captionIndex]);
      }
    });

    try {
      await api.post(
        `/admin/images/reservation/${reservation.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            const globalProgress = Math.round(
              ((uploadedCount + (percent / 100) * batch.length) / totalFiles) * 100
            );

            setUploadProgress(globalProgress);
          },
        }
      );
    } catch (err) {
      if (retry > 0) {
        return uploadBatch(batch, startIndex, retry - 1);
      } else {
        throw err;
      }
    }
  };

  try {
    let promises = [];

    for (let i = 0; i < totalFiles; i += batchSize) {
      const batch = selectedFiles.slice(i, i + batchSize);

      const promise = uploadBatch(batch, i).then(() => {
        uploadedCount += batch.length;
      });

      promises.push(promise);

      // 🚀 run parallel batches (speed boost)
      if (promises.length === parallel) {
        await Promise.all(promises);
        promises = [];
      }
    }

    // باقي batches
    if (promises.length > 0) {
      await Promise.all(promises);
    }

    setSuccess(`${totalFiles} images uploaded successfully 🚀`);

    setSelectedFiles([]);
    setPreviews([]);
    setCaptions([]);

    await fetchExistingImages();
    if (onUpload) onUpload();

    setTimeout(() => setUploadProgress(0), 2000);

  } catch (error) {
    console.error(error);
    setError('Upload failed, some images may not be uploaded');
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

  const updateImageCaption = async (imageId, caption) => {
    try {
      await api.put(`/admin/images/${imageId}`, { caption });
      await fetchExistingImages();
    } catch (error) {
      console.error('Error updating caption:', error);
      setError('Failed to update caption');
    }
  };

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

  const viewFullImage = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

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
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let filename = `reservation_${reservation.id}_images.zip`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*?=["']?([^"';]+)["']?/);
        if (filenameMatch && filenameMatch[1]) {
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-6xl max-h-[90vh]">
          {/* Glassmorphism Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#B8E601]/20 via-black/60 to-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl" />
          
          {/* Main Content */}
          <div className="relative z-10 flex flex-col h-full max-h-[90vh] overflow-hidden rounded-3xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B8E601] to-[#B8E601]/70 flex items-center justify-center shadow-lg">
                  <Camera className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Image Gallery</h3>
                  <p className="text-sm text-gray-300">
                    {reservation.team || 'Session'} • {reservation.id}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-gradient-to-r from-[#B8E601] to-[#B8E601]/70 text-black' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'list' 
                        ? 'bg-gradient-to-r from-[#B8E601] to-[#B8E601]/70 text-black' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#B8E601]" />
                    Upload New Images
                  </h4>
                  <span className="text-sm text-[#B8E601] bg-[#B8E601]/20 px-3 py-1 rounded-full border border-[#B8E601]/30">
                    {selectedFiles.length} selected
                  </span>
                </div>

                {/* Enhanced Drop Zone */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all overflow-hidden group
                    ${error ? 'border-rose-400/50 bg-rose-500/10' : 'border-[#B8E601]/30 hover:border-[#B8E601]'}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-[#B8E601]', 'bg-[#B8E601]/10');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-[#B8E601]', 'bg-[#B8E601]/10');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-[#B8E601]', 'bg-[#B8E601]/10');
                    handleFileSelect({ target: { files: e.dataTransfer.files } });
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#B8E601]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#B8E601]/20 to-[#B8E601]/5 border border-[#B8E601]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-[#B8E601]" />
                    </div>
                    <p className="text-white font-medium text-lg mb-2">
                      Drop images here or click to browse
                    </p>
                    <p className="text-gray-400 text-sm">
                      Supports JPG, PNG, GIF, WEBP • Max 8MB per image
                    </p>
                  </div>
                </motion.div>

                {/* Selected Files Preview */}
                <AnimatePresence>
                  {selectedFiles.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-3"
                    >
                      <h5 className="text-sm font-medium text-[#B8E601] uppercase tracking-wider">
                        Ready to Upload
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedFiles.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group relative bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-[#B8E601]/30 transition-all"
                          >
                            <div className="relative aspect-square">
                              <img
                                src={previews[index]}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <button
                                onClick={() => removeFile(index)}
                                className="absolute top-2 right-2 p-1.5 bg-rose-500/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 backdrop-blur-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="p-3">
                              <input
                                type="text"
                                value={captions[index]}
                                onChange={(e) => updateCaption(index, e.target.value)}
                                placeholder="Add caption..."
                                className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:border-[#B8E601]/50 focus:outline-none"
                              />
                              <p className="text-xs text-gray-400 mt-2 truncate">
                                {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Existing Images Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#B8E601]" />
                    Gallery ({existingImages.length})
                  </h4>
                  
                  <div className="flex items-center gap-3">
                    {existingImages.length > 0 && (
                      <button
                        onClick={downloadAllImagesAsZip}
                        disabled={downloadingZip}
                        className="px-4 py-2 bg-gradient-to-r from-[#B8E601] to-[#B8E601]/70 text-black rounded-xl font-medium hover:from-[#B8E601] hover:to-[#B8E601] transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {downloadingZip ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Preparing...
                          </>
                        ) : (
                          <>
                            <FolderDown className="w-4 h-4" />
                            Download All
                          </>
                        )}
                      </button>
                    )}
                    {selectedImages.length > 0 && (
                      <button
                        onClick={deleteSelectedImages}
                        className="px-4 py-2 bg-rose-500/20 text-rose-400 rounded-xl font-medium hover:bg-rose-500/30 transition-all flex items-center gap-2 border border-rose-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete ({selectedImages.length})
                      </button>
                    )}
                  </div>
                </div>

                {loadingExisting ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-black/40 border border-white/10 rounded-2xl">
                    <div className="relative">
                      <div className="w-12 h-12 border-2 border-white/20 border-t-[#B8E601] rounded-full animate-spin" />
                    </div>
                    <p className="mt-4 text-sm text-gray-400">Loading gallery...</p>
                  </div>
                ) : existingImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-black/40 border border-white/10 rounded-2xl">
                    <ImageIcon className="w-12 h-12 text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-1">No images yet</h3>
                    <p className="text-sm text-gray-400">Upload your first images above</p>
                  </div>
                ) : (
                  <>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {currentImages.map((image) => (
                          <motion.div
                            key={image.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`group relative bg-black/40 border rounded-xl overflow-hidden cursor-pointer transition-all
                              ${selectedImages.includes(image.id) 
                                ? 'border-[#B8E601] ring-2 ring-[#B8E601]/50' 
                                : 'border-white/10 hover:border-[#B8E601]/30'}`}
                            onClick={() => toggleImageSelect(image.id)}
                          >
                            <div className="relative aspect-square">
                              <img
                                src={image.url}
                                alt={image.caption || image.filename}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23333"/><text x="50" y="50" font-size="10" text-anchor="middle" dy=".3em" fill="%23666">Error</text></svg>';
                                }}
                              />
                              
                              {/* Overlay with actions */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute top-2 right-2 flex gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      viewFullImage(image.url);
                                    }}
                                    className="p-1.5 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-[#B8E601]/80 hover:text-black transition-all"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => downloadSingleImage(image, e)}
                                    disabled={downloadingSingleImage === image.id}
                                    className="p-1.5 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-[#B8E601]/80 hover:text-black transition-all"
                                  >
                                    {downloadingSingleImage === image.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Download className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteSingleImage(image.id);
                                    }}
                                    className="p-1.5 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              {selectedImages.includes(image.id) && (
                                <div className="absolute top-2 left-2">
                                  <div className="w-6 h-6 bg-[#B8E601] rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-black" />
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="p-3">
                              <input
                                type="text"
                                defaultValue={image.caption || ''}
                                placeholder="Add caption..."
                                className="w-full px-2 py-1 text-xs bg-black/40 border border-white/10 rounded text-white placeholder-gray-500 focus:border-[#B8E601]/50 focus:outline-none"
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
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">
                                  {new Date(image.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      // List View
                      <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-black/60 border-b border-white/10">
                              <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#B8E601] uppercase">Image</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#B8E601] uppercase">Caption</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#B8E601] uppercase">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-[#B8E601] uppercase">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                              {existingImages.map((image) => (
                                <motion.tr
                                  key={image.id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="hover:bg-[#B8E601]/5 transition-colors cursor-pointer"
                                  onClick={() => toggleImageSelect(image.id)}
                                >
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 border border-white/10">
                                        <img
                                          src={image.url}
                                          alt={image.caption}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div>
                                        <div className="font-medium text-white">{image.filename || 'Image'}</div>
                                        <div className="text-xs text-gray-400">ID: {image.id}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <input
                                      type="text"
                                      defaultValue={image.caption || ''}
                                      placeholder="No caption"
                                      className="px-3 py-1 bg-black/40 border border-white/10 rounded text-sm text-white placeholder-gray-500 focus:border-[#B8E601]/50 focus:outline-none"
                                      onClick={(e) => e.stopPropagation()}
                                      onBlur={(e) => {
                                        if (e.target.value !== (image.caption || '')) {
                                          updateImageCaption(image.id, e.target.value);
                                        }
                                      }}
                                    />
                                  </td>
                                  <td className="px-6 py-4 text-gray-300 text-sm">
                                    {new Date(image.created_at).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          viewFullImage(image.url);
                                        }}
                                        className="p-2 text-[#B8E601] hover:bg-[#B8E601]/10 rounded-lg transition-all"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={(e) => downloadSingleImage(image, e)}
                                        disabled={downloadingSingleImage === image.id}
                                        className="p-2 text-[#B8E601] hover:bg-[#B8E601]/10 rounded-lg transition-all"
                                      >
                                        {downloadingSingleImage === image.id ? (
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                          <Download className="w-4 h-4" />
                                        )}
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteSingleImage(image.id);
                                        }}
                                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                      {selectedImages.includes(image.id) && (
                                        <CheckCircle className="w-5 h-5 text-[#B8E601]" />
                                      )}
                                    </div>
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="p-2 bg-black/40 border border-white/10 rounded-lg text-gray-400 hover:text-[#B8E601] hover:border-[#B8E601]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-[#B8E601] to-[#B8E601]/70 text-black'
                                : 'bg-black/40 border border-white/10 text-gray-400 hover:text-[#B8E601] hover:border-[#B8E601]/30'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="p-2 bg-black/40 border border-white/10 rounded-lg text-gray-400 hover:text-[#B8E601] hover:border-[#B8E601]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-6 bg-black/40">
              {/* Progress Bar */}
              {uploading && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>Uploading to gallery...</span>
                    <span className="text-[#B8E601]">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#B8E601] to-[#B8E601]/70 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
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
                    className="flex items-center justify-between bg-rose-500/20 text-rose-400 p-4 rounded-xl border border-rose-500/30 mb-4"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                    <button onClick={() => setError('')} className="hover:bg-rose-500/10 p-1 rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-between bg-[#B8E601]/20 text-[#B8E601] p-4 rounded-xl border border-[#B8E601]/30 mb-4"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{success}</span>
                    </div>
                    <button onClick={() => setSuccess('')} className="hover:bg-[#B8E601]/10 p-1 rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-all"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || selectedFiles.length === 0}
                  className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2
                    ${uploading || selectedFiles.length === 0
                      ? 'bg-[#B8E601]/20 text-[#B8E601]/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#B8E601] to-[#B8E601]/70 text-black hover:from-[#B8E601] hover:to-[#B8E601]'
                    }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading {uploadProgress}%...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full Image Preview Modal */}
        <AnimatePresence>
          {previewImage && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60]"
                onClick={() => setPreviewImage(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-[61] flex items-center justify-center p-4"
                onClick={() => setPreviewImage(null)}
              >
                <div className="relative max-w-5xl max-h-[90vh">
                  <img
                    src={previewImage}
                    alt="Full size preview"
                    className="max-w-full max-h-[90vh] object-contain rounded-2xl"
                  />
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-sm rounded-xl hover:bg-[#B8E601]/80 hover:text-black transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageUploadModal;