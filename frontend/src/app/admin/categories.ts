export interface CategoryDto {
  id?: number;       // optionnel à la création
  name: string;
  Active: boolean;
}

export interface CategoryResponse {
  data: CategoryDto[];  // ou adapte selon la structure exacte de ta réponse backend
 
}
