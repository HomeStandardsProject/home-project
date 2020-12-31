import ArticlesData from "../data/articles.json";

export type Article = {
  title: string;
  source: string;
  sourceUrl: string;
  previewImage: string | null;
};

export function loadArticles() {
  for (const unvalidatedArticle of ArticlesData) {
    if (
      "title" in unvalidatedArticle &&
      "source" in unvalidatedArticle &&
      "sourceUrl" in unvalidatedArticle
    ) {
      continue;
    }
    throw new Error("Articles are invalid, properties are missing");
  }
  return ArticlesData as Article[];
}
