export interface ProductDTO {
  id?: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  active: boolean;
  image: string;
}
export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isActive: boolean;
   imagePath?: string; 
}