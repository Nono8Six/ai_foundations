import { supabase } from '@frontend/lib/supabase';
import { safeQuery } from '@frontend/utils/supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Bucket, FileObject } from '@supabase/storage-js';
import type { Database } from '@frontend/types/database.types';

const supabaseClient = supabase as SupabaseClient<Database>;

export const BUCKETS = {
  images: 'course-images',
  videos: 'lesson-videos',
  documents: 'documents',
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS] & Bucket['name'];

export function getPublicUrl(bucket: BucketName, path: string): string {
  const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function listBucketFiles(bucket: BucketName): Promise<FileObject[]> {
  const { data, error } = await safeQuery(() => supabaseClient.storage.from(bucket).list(''));
  if (error) throw error;
  return data || [];
}

export async function uploadToBucket(
  bucket: BucketName,
  file: File
): Promise<{ path: string; url: string }> {
  const filePath = `${Date.now()}-${file.name}`;
  const { error } = await safeQuery(() =>
    supabaseClient.storage.from(bucket).upload(filePath, file, { upsert: true })
  );
  if (error) throw error;
  return { path: filePath, url: getPublicUrl(bucket, filePath) };
}
