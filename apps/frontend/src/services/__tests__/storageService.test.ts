import { describe, it, expect, vi, beforeEach } from 'vitest';

const storageFromMock = vi.fn();
const safeQueryMock = vi.fn(async (fn: () => Promise<unknown>) => fn());

vi.mock('@frontend/lib/supabase', () => ({
  supabase: { storage: { from: storageFromMock } }
}));

vi.mock('@frontend/utils/supabaseClient', () => ({
  safeQuery: safeQueryMock
}));

function storageBuilder(listRes: unknown, uploadRes: { error: unknown } = { error: null }) {
  return {
    list: vi.fn().mockResolvedValue(listRes),
    upload: vi.fn().mockResolvedValue(uploadRes),
    getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'http://url' } })),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('listBucketFiles', () => {
  it('returns files', async () => {
    const builder = storageBuilder({ data: [{ name: 'f' }], error: null });
    storageFromMock.mockReturnValue(builder);
    const { listBucketFiles } = await import('../storageService');
    const files = await listBucketFiles('documents');
    expect(storageFromMock).toHaveBeenCalledWith('documents');
    expect(builder.list).toHaveBeenCalledWith('');
    expect(files).toEqual([{ name: 'f' }]);
  });

  it('throws when safeQuery returns error', async () => {
    safeQueryMock.mockImplementation(async () => ({ data: null, error: new Error('x') }));
    const { listBucketFiles } = await import('../storageService');
    await expect(listBucketFiles('images')).rejects.toThrow('x');
  });
});

describe('uploadToBucket', () => {
  it('uploads file and returns url', async () => {
    const builder = storageBuilder({ data: null, error: null });
    storageFromMock.mockReturnValue(builder);
    safeQueryMock.mockImplementation(async (fn) => {
      const result = await fn();
      return result;
    });
    const { uploadToBucket } = await import('../storageService');
    const file = new File(['a'], 'a.png', { type: 'image/png' });
    vi.spyOn(Date, 'now').mockReturnValue(5);
    const res = await uploadToBucket('videos', file);
    expect(builder.upload).toHaveBeenCalledWith('5-a.png', file, { upsert: true });
    expect(res).toEqual({ path: '5-a.png', url: 'http://url' });
  });

  it('throws when upload fails', async () => {
    const builder = storageBuilder({ data: null, error: null }, { error: new Error('bad') });
    storageFromMock.mockReturnValue(builder);
    safeQueryMock.mockImplementation(async (fn) => {
      const result = await fn();
      return result;
    });
    const { uploadToBucket } = await import('../storageService');
    await expect(uploadToBucket('images', new File([], 'f.txt'))).rejects.toThrow('bad');
  });
});
