import { Photo } from './photo';

export type Item = {
  id: string,
  categoryId: string,
  name: string,
  description: string,
  photo: Photo,
  url: string,
  price: number,
};
