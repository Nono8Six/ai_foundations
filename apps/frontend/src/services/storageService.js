import { supabase } from '../lib/supabase';
import { safeQuery } from '../utils/supabaseClient';

export const BUCKETS = {
  images: 'course-images',
  videos: 'lesson-videos',
  documents: 'documents',
};

export function getPublicUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function listBucketFiles(bucket) {
  const { data, error } = await safeQuery(() =>
    supabase.storage.from(bucket).list('')
  );
  if (error) throw error;
  return data || [];
}

export async function uploadToBucket(bucket, file) {
  const filePath = `${Date.now()}-${file.name}`;
  const { error } = await safeQuery(() =>
    supabase.storage.from(bucket).upload(filePath, file, { upsert: true })
  );
  if (error) throw error;
  return { path: filePath, url: getPublicUrl(bucket, filePath) };
}
