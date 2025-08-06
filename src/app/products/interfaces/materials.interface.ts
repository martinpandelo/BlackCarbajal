export interface MaterialsResponse {
  materials: Material[];
}

export interface Material {
  id:           number;
  slug:         string;
  name:         string;
  description:  string;
}
