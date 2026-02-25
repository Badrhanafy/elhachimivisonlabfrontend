import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BackgroundAnimation from '../components/ImageGallery/BackgroundAnimation';
import LoadingState from '../components/ImageGallery/LoadingState';
import ErrorState from '../components/ImageGallery/ErrorState';
import MainCard from '../components/ImageGallery/MainCard';
import GalleryModal from '../components/ImageGallery/GalleryModal';
import ImageDetailModal from '../components/ImageGallery/ImageDetailModal';

const ImageGallery = ({ reservationId: propReservationId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reservationInfo, setReservationInfo] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  // Get ID from props or URL, and validate it's numeric
  const rawId = propReservationId || extractReservationIdFromPath();
  const effectiveReservationId = rawId && /^\d+$/.test(rawId) ? rawId : null;

  function extractReservationIdFromPath() {
    const path = window.location.pathname;
    const parts = path.split('/');
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      // Ignore common words and only return if it's numeric
      if (part && !['images', 'reservation', 'gallery', 'api', 'results'].includes(part) && /^\d+$/.test(part)) {
        return part;
      }
    }
    return null;
  }

  const API_BASE = process.env.REACT_APP_API_URL || 'https://server.elhachimivisionlab.com/api'; ;
  const STORAGE_URL = process.env.REACT_APP_STORAGE_URL;

  const fetchData = useCallback(async () => {
    if (!effectiveReservationId) {
      setError('Invalid reservation ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const reservationResponse = await axios.get(
        `${API_BASE}/reservations/${effectiveReservationId}`
      );

      const reservationData = reservationResponse.data.success
        ? reservationResponse.data.data
        : reservationResponse.data;

      setReservationInfo(reservationData);

      const videoPath = reservationData.video_path;
      if (videoPath && videoPath.trim() !== '') {
        setHasVideo(true);
        const fullVideoUrl = videoPath.startsWith('http')
          ? videoPath
          : `${STORAGE_URL}/${videoPath}`;
        setVideoUrl(fullVideoUrl);
        setImages([]);
      } else {
        setHasVideo(false);
        setImages(reservationData.images || []);
      }
    } catch (err) {
      console.error('Error fetching reservation:', err);
      let errorMessage = 'Failed to load gallery';
      if (err.response) {
        if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 404) {
          errorMessage = 'Reservation not found';
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [effectiveReservationId, API_BASE, STORAGE_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openGalleryModal = () => setShowGalleryModal(true);
  const closeGalleryModal = () => setShowGalleryModal(false);

  const downloadVideo = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `reservation_${effectiveReservationId}_video.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <>
        <BackgroundAnimation />
        <LoadingState reservationId={effectiveReservationId} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <BackgroundAnimation />
        <ErrorState error={error} onRetry={fetchData} />
      </>
    );
  }

  return (
    <>
      <BackgroundAnimation />
      <MainCard
        reservationInfo={reservationInfo}
        imagesCount={images.length}
        hasVideo={hasVideo}
        onPreviewClick={openGalleryModal}
      />

      <GalleryModal
        isOpen={showGalleryModal}
        onClose={closeGalleryModal}
        reservationInfo={reservationInfo}
        effectiveReservationId={effectiveReservationId}
        images={images}
        hasVideo={hasVideo}
        videoUrl={videoUrl}
        onDownloadVideo={downloadVideo}
        onImageSelect={setSelectedImage}
      />

      <ImageDetailModal
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};

export default ImageGallery;