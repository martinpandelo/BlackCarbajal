export interface ProductsResponse {
  count:    number;
  pages:    number;
  products: Product[];
}

export interface Product {
  id:          number;
  slug:        string;
  cod:         string;
  title:       string;
  description: string;
  categories:    Category[];
  type?: ProductType;
  material?: ProductMaterial;
  related?:    string | null;
  images:      string[];
  novelty:     boolean;
}

export interface Category {
  slug: string;
  name: string;
}

export interface ProductType {
  slug: string;
  name: string;
}

export interface ProductMaterial {
  slug: string;
  name: string;
  description: string;
}
