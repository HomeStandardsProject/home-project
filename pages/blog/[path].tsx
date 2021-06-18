import { GetStaticProps } from "next";
import * as React from "react";
import {
  fetchBlogPageFromPath,
  fetchPathsForAllBlogPages,
} from "../../api-functions/cms/ContentfulBlogLanding";
import Layout from "../../components/Layout";
import { RichContentfulContent } from "../../components/RichContentfulContent";
import { BlogPost, BlogItem } from "../../interfaces/contentful-blog";

type Props = {
  content: BlogItem & BlogPost;
};

const BlogPost = ({ content }: Props) => {
  return (
    <Layout title={content.title} description={content.seoDescription}>
      {content.tags.map((tag, index) => {
        return <p key={index}>{tag}</p>;
      })}
      <img src={content.image} />
      <p>{content.title}</p>
      <p>{content.author}</p>
      <p>{content.publishedAt}</p>
      <RichContentfulContent content={content.richDescription} />
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

  return { props: { content: page }, revalidate: 60 };
};

export default BlogPost;
