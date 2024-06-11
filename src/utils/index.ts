import * as mime from 'mime-types';

export function convertImageToBase64(file: Express.Multer.File): string {
  const mimeType = mime.lookup(file.originalname);
  const base64Prefix = `data:${mimeType};base64,`;
  const imageBase64 = base64Prefix + file.buffer.toString('base64');
  return imageBase64;
}
