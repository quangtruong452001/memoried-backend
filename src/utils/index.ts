import * as mime from 'mime-types';
import * as _ from 'lodash';
export function convertImageToBase64(file: Express.Multer.File): string {
  const mimeType = mime.lookup(file.originalname);
  const base64Prefix = `data:${mimeType};base64,`;
  const imageBase64 = base64Prefix + file.buffer.toString('base64');
  return imageBase64;
}

export const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

export const logEvent = (msg: string) => {
  const date = new Date().toISOString();
  // format to dd/HH/YYYY ss:mm:hh
  const formattedDate = date.replace(/T/, ' ').replace(/\..+/, '');

  const content = `${formattedDate} - ${msg}\n`;
  return content;
};
