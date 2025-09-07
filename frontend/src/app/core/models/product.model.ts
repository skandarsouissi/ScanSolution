import { Category } from "./category.model";
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imagePath?: string; 
 category: Category | string;
  categoryId?: number;
  isActive: boolean;

}



