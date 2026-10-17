import { existsSync } from 'node:fs';
import path from 'node:path';
import { TEXTBOOK_IMAGE_PATTERN } from '@/lib/textbook/types';

// Image blocks name files in public/textbook-images/. The validator is pure, so
// the server and the CLI hand it this disk check: a missing file makes the
// unit unpublishable (block_image_missing). Only paths that already match the
// allowed pattern are looked up, so nothing outside that folder is touched.

export function textbookImageExists(src: string, root: string = process.cwd()): boolean {
  if (!TEXTBOOK_IMAGE_PATTERN.test(src)) return false;
  return existsSync(path.join(root, 'public', ...src.split('/').filter(Boolean)));
}
