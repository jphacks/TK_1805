import { Photo } from './photo';

export type Category = {
  id: string,
  storeId: string,
  name: string,
  description: string,
  photo: Photo,
  url: string,
};
