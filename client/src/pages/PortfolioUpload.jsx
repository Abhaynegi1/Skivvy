import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Filter, Sliders, Type, Check, RotateCw, ZoomIn, ZoomOut, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '../components/Toast';

const PortfolioUpload = () => {
  const navigate = useNavigate();
  const { show } = useToast();
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [step, setStep] = useState('upload'); // upload, edit, caption
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  // Image editing state
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [exposure, setExposure] = useState(100);
  const [contrast, setContrast] = useState(100);

  // Filter state
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [zoom, setZoom] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filters = {
    none: { brightness: 100, saturation: 100, contrast: 100 },
    vintage: { brightness: 90, saturation: 85, contrast: 110 },
    blackwhite: { brightness: 100, saturation: 0, contrast: 120 },
    warm: { brightness: 105, saturation: 115, contrast: 100 },
    cool: { brightness: 95, saturation: 110, contrast: 100 },
    dramatic: { brightness: 85, saturation: 120, contrast: 130 }
  };

  useEffect(() => {
    if (originalImage && step === 'edit') {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brightness, saturation, exposure, contrast, selectedFilter, originalImage, step]);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        // Initialize canvas with image dimensions
        if (canvasRef.current) {
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
          const ctx = canvasRef.current.getContext('2d');
          ctx.drawImage(img, 0, 0);
        }
        setStep('edit');
      };
      img.src = url;
    }
  };

  const applyFilters = () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const filter = filters[selectedFilter] || filters.none;

    // Calculate final values
    const finalBrightness = (brightness / 100) * (filter.brightness / 100) * 100;
    const finalSaturation = (saturation / 100) * (filter.saturation / 100) * 100;
    const finalContrast = (contrast / 100) * (filter.contrast / 100) * 100;

    // Set canvas size
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // Apply filters
    ctx.filter = `
      brightness(${finalBrightness}%)
      saturate(${finalSaturation}%)
      contrast(${finalContrast}%)
    `;

    ctx.drawImage(originalImage, 0, 0);

    // Apply exposure adjustment
    if (exposure !== 100) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const exposureFactor = exposure / 100;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * exposureFactor); // R
        data[i + 1] = Math.min(255, data[i + 1] * exposureFactor); // G
        data[i + 2] = Math.min(255, data[i + 2] * exposureFactor); // B
      }

      ctx.putImageData(imageData, 0, 0);
    }
  };

  const resetFilters = () => {
    setBrightness(100);
    setSaturation(100);
    setExposure(100);
    setContrast(100);
    setSelectedFilter('none');
  };

  const handleFilterSelect = (filterName) => {
    setSelectedFilter(filterName);
    if (filterName !== 'none') {
      const filter = filters[filterName];
      setBrightness((filter.brightness / 100) * 100);
      setSaturation((filter.saturation / 100) * 100);
      setContrast((filter.contrast / 100) * 100);
    }
  };

  const handleNext = () => {
    if (step === 'edit') {
      setStep('caption');
    }
  };

  const handleBack = () => {
    if (step === 'caption') {
      setStep('edit');
    } else if (step === 'edit') {
      handleClose();
    }
  };

  const handleSave = async () => {
    if (!caption.trim()) {
      show({ type: 'error', title: 'Missing caption', message: 'Please add a caption' });
      return;
    }

    // Ensure we can produce a blob even if the canvas element is not mounted
    const produceBlob = () => new Promise((resolve) => {
      const c = canvasRef.current || document.createElement('canvas');
      if (!canvasRef.current && originalImage) {
        c.width = originalImage.width;
        c.height = originalImage.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(originalImage, 0, 0);
      }
      c.toBlob((b) => resolve(b), 'image/jpeg', 0.9);
    });

    setUploading(true);
    try {
      const blob = await produceBlob();
      const formData = new FormData();
      formData.append('portfolioImage', blob, 'portfolio.jpg');
      formData.append('caption', caption);

      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.PROD 
        ? 'https://skivvy-backend.onrender.com' 
        : 'http://localhost:5000';

      const response = await fetch(`${API_BASE_URL}/api/auth/portfolio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        show({ type: 'success', title: 'Posted', message: 'Your portfolio item has been posted' });
        navigate('/Profile');
      } else {
        show({ type: 'error', title: 'Upload failed', message: data.message || 'Failed to upload portfolio' });
        setUploading(false);
      }
    } catch (error) {
      console.error('Error uploading portfolio:', error);
      show({ type: 'error', title: 'Upload error', message: 'Error uploading portfolio' });
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setOriginalImage(null);
    setStep('upload');
    setCaption('');
    resetFilters();
    navigate('/Profile');
  };

  return (
    <div className="min-h-screen bg-orange-100 pt-20">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Add to Portfolio</h1>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-white rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
            {/* Keep an offscreen canvas mounted across steps so saving always works */}
            <canvas ref={canvasRef} className="hidden" />
            {step === 'upload' && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-12 h-12 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Select an Image</h2>
                <p className="text-gray-600 mb-6">Choose an image to add to your portfolio</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Choose Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}

            {step === 'edit' && originalImage && (
              <div className="space-y-6">
                {/* Image Preview with Editing */}
                <div className="relative bg-orange-50 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <div className="relative" style={{ maxWidth: '100%', maxHeight: '100%' }}>
                      <img
                        ref={imageRef}
                        src={canvasRef.current?.toDataURL() || previewUrl}
                        alt="Preview"
                        className="max-w-full max-h-full"
                        style={{ 
                          transform: `scale(${zoom})`,
                          userSelect: 'none'
                        }}
                        draggable={false}
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  </div>
                </div>

                {/* Editing Controls */}
                <div className="space-y-4">
                  {/* Filter Presets */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Filter className="w-5 h-5 text-orange-500" />
                      Filters
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {Object.keys(filters).map((filterName) => (
                        <button
                          key={filterName}
                          onClick={() => handleFilterSelect(filterName)}
                          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                            selectedFilter === filterName
                              ? 'bg-orange-500 text-white'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          }`}
                        >
                          {filterName.charAt(0).toUpperCase() + filterName.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Options Toggle */}
                  <div>
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center justify-between w-full p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                        <Sliders className="w-4 h-4 text-orange-500" />
                        Advanced Options
                      </span>
                      {showAdvanced ? (
                        <ChevronUp className="w-4 h-4 text-orange-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-orange-500" />
                      )}
                    </button>

                    {/* Advanced Editing Sliders */}
                    {showAdvanced && (
                      <div className="mt-4 space-y-4 p-4 bg-orange-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Brightness: {brightness}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={brightness}
                            onChange={(e) => setBrightness(parseInt(e.target.value))}
                            className="w-full accent-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Saturation: {saturation}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={saturation}
                            onChange={(e) => setSaturation(parseInt(e.target.value))}
                            className="w-full accent-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Exposure: {exposure}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={exposure}
                            onChange={(e) => setExposure(parseInt(e.target.value))}
                            className="w-full accent-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contrast: {contrast}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={contrast}
                            onChange={(e) => setContrast(parseInt(e.target.value))}
                            className="w-full accent-orange-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Zoom and Reset Controls */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                        className="p-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                        className="p-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={resetFilters}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 font-medium"
                    >
                      <RotateCw className="w-4 h-4" />
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 'caption' && (
              <div className="space-y-6">
                {/* Image Preview */}
                <div className="bg-orange-50 rounded-lg p-4 flex justify-center">
                  <img
                    src={canvasRef.current?.toDataURL() || previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-96 rounded-lg shadow-md"
                  />
                </div>

                {/* Caption Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Type className="w-5 h-5 text-orange-500" />
                    Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption for your portfolio item..."
                    className="w-full p-4 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{caption.length}/500 characters</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step !== 'upload' && (
              <div className="flex justify-between mt-6 pt-6 border-t border-orange-200">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 text-gray-700 border-2 border-orange-300 rounded-lg hover:bg-orange-50 transition-colors font-medium"
                >
                  Back
                </button>
                {step === 'edit' ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Next: Add Caption
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={uploading || !caption.trim()}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploading ? 'Uploading...' : (
                      <>
                        <Check className="w-4 h-4" />
                        Post to Portfolio
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioUpload;

