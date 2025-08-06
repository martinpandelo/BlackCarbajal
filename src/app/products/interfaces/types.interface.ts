export interface TypesResponse {
  types: Type[];
}

export interface Type {
  id:          number;
  slug:        string;
  name:       string;
}
