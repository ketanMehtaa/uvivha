import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import NextImage from 'next/image';
import { Loader2, X, Upload, Edit2 } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  className?: string;
}

const ASPECT_RATIO = 4 / 5; // Standard portrait photo ratio
const MIN_IMAGES = 2;
const MAX_IMAGES = 6;

export default function ImageUpload({ images, onImagesChange, className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [currentCrop, setCurrentCrop] = useState<{ file: File; index: number } | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > MAX_IMAGES) {
      alert(`You can only upload up to ${MAX_IMAGES} images`);
      return;
    }

    // Start with the first image
    setCurrentCrop({ file: acceptedFiles[0], index: images.length });
  }, [images.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: true
  });

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = document.createElement('img');
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Canvas is empty');
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  const uploadToS3 = async (file: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  };

  const handleCropSave = async () => {
    if (!currentCrop || !croppedAreaPixels) return;

    try {
      setUploading(true);
      const objectUrl = URL.createObjectURL(currentCrop.file);
      const croppedImageBlob = await getCroppedImg(objectUrl, croppedAreaPixels);
      const imageUrl = await uploadToS3(croppedImageBlob);
      
      const newImages = [...images];
      newImages[currentCrop.index] = imageUrl;
      onImagesChange(newImages);
      
      setCurrentCrop(null);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {currentCrop && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-2xl">
            <div className="relative h-96 mb-4">
              <Cropper
                image={URL.createObjectURL(currentCrop.file)}
                crop={crop}
                zoom={zoom}
                aspect={ASPECT_RATIO}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setCurrentCrop(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropSave}
                disabled={uploading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-[4/5] group">
            <NextImage
              src={image}
              alt={`Uploaded image ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        
        {images.length < MAX_IMAGES && (
          <div
            {...getRootProps()}
            className={`aspect-[4/5] border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-red-500 transition-colors
              ${isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
          >
            <input {...getInputProps()} />
            <div className="text-center p-4">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                {images.length < MIN_IMAGES
                  ? `Upload at least ${MIN_IMAGES - images.length} more images`
                  : 'Add more images (optional)'}
              </p>
            </div>
          </div>
        )}
      </div>

      {images.length < MIN_IMAGES && (
        <p className="text-sm text-red-600">
          Please upload at least {MIN_IMAGES} images
        </p>
      )}
    </div>
  );
} 