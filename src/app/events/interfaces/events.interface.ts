export interface EventsResponse {
  count:  number;
  pages:  number;
  events: EventItem[];
}

export interface EventItem {
  id:          number;
  slug:        string;
  title:       string;
  description: string;
  images:      string[] | string;
}
