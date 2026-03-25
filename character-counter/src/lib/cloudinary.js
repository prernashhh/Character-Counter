import { v2 as cloudinary } from 'cloudinary';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

let configured = false;

function ensureCloudinaryConfig() {
  if (configured) return;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary environment variables are missing');
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  configured = true;
}

export async function uploadImageToCloudinary(buffer, type = 'blog-content') {
  ensureCloudinaryConfig();

  const folder = type === 'blog-cover' ? 'character-counter/blog-covers' : 'character-counter/blog-content';

  const transformation = type === 'blog-cover'
    ? [
        { width: 1600, height: 900, crop: 'fill', gravity: 'auto' },
        { quality: 'auto', fetch_format: 'auto' },
      ]
    : [
        { width: 1400, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' },
      ];

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteImageFromCloudinary(publicId) {
  if (!publicId) return;
  ensureCloudinaryConfig();
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}
