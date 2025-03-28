export type Recipe = {
  title: string;
  author?: string;
  publishDate?: string;
  videoUrl?: string;
  channelUrl?: string;
  intro?: string;
  ingredients: {
    name: string;
    quantity: string;
  }[];
  steps: string[];
  tips?: string[];
  outro?: string;
};
