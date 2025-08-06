export interface CategoriesResponse {
  categories: Category[];
}

export interface Category {
  id:          number;
  slug:        string;
  title:       string;
  description: null;
  image:       null;
}
