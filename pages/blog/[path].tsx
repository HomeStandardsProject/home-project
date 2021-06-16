import { GetStaticProps } from "next";
import * as React from "react";
import {
  fetchBlogPageFromPath,
  fetchPathsForAllBlogPages,
} from "../../api-functions/cms/ContentfulBlogLanding";
import Layout from "../../components/Layout";
import { RichContentfulContent } from "../../components/RichContentfulContent";
import { BlogItem } from "../../interfaces/contentful-blog";

type Props = {
  content: BlogItem;
};
const BlogPost = ({ content }: Props) => {
  const {
    title,
    image,
    author,
    richDescription,
    tags,
    seoDescription,
    publishedAt,
  } = content;
  console.log(content);
  return (
    <Layout title={title} description={seoDescription}>
      {tags.map((tag, index) => {
        return <p key={index}>{tag}</p>;
      })}
      <img src={image} />
      <p>{title}</p>
      <p>{author}</p>
      <p>{publishedAt}</p>
      <RichContentfulContent content={richDescription} />
    </Layout>
  );
};

export async function getStaticPaths() {
  const pages = await fetchPathsForAllBlogPages();

  const paths = pages.map((path) => ({
    params: { path },
  }));

  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.path || typeof params.path !== "string")
    throw new Error("Unable to generate the page. Path does not exist.");

  const page = await fetchBlogPageFromPath(params.path);

  console.log(page);

  return { props: { content: page }, revalidate: 60 };
};

export default BlogPost;
