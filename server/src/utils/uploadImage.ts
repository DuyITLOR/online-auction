import { supabase } from './supabase';
import { uploadedImageDto } from '../dto/uploadImageDto';
import { Request } from 'express';
import multer from 'multer';

export const uploadImagesToSupabase = async (
  files: Express.Multer.File[] | undefined,
  folder: string = 'products'
): Promise<uploadedImageDto[]> => {
  if (!files || files.length === 0) return [];

  const uploadedImages: uploadedImageDto[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const ext = file.originalname.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${i}.${ext}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error('Upload error:', error);
      continue;
    }
    const { data } = supabase.storage.from('images').getPublicUrl(fileName);

    uploadedImages.push({
      url: data.publicUrl,
      sortOrder: i + 1,
    });
  }

  return uploadedImages;
};

export const uploadSingleFile = async (req: Request, folder: string) => {
  const file = req.file;
  if (!file) {
    return {
      success: false,
      message: 'No file included',
    };
  }
  const ext = file.originalname.split('.').pop();
  const fileName = `${folder}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('images')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: 'Upload to supabase unsuccessful',
    };
  }
  const { data } = supabase.storage.from('images').getPublicUrl(fileName);
  return {
    success: true,
    fileUrl: data.publicUrl,
    message: 'Upload file successful',
  };
};
