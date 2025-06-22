import type { Bucket, FileObject } from '@supabase/storage-js';
export declare const BUCKETS: {
    readonly images: "course-images";
    readonly videos: "lesson-videos";
    readonly documents: "documents";
};
export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS] & Bucket['name'];
export declare function getPublicUrl(bucket: BucketName, path: string): string;
export declare function listBucketFiles(bucket: BucketName): Promise<FileObject[]>;
export declare function uploadToBucket(bucket: BucketName, file: File): Promise<{
    path: string;
    url: string;
}>;
