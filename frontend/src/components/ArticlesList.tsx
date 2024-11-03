interface Article {
  id: number;
  title: string;
  coverImage?: string;
  author: {
    name: string;
  };
  likes?: number;
  dislikes?: number;
  stars?: number;
  comments?: number;
  content: string;
}
