import { GetStaticProps } from "next";
import Link from "next/link";
import React from "react";
import { fetchBlogPosts } from "../api-functions/cms/ContentfulBlogLanding";
import Layout from "../components/Layout";
import { BlogItem, BlogContent } from "../interfaces/contentful-blog";

type Props = {
  blogContent: BlogContent;
};

function Blog({ blogContent }: Props) {
  return (
    <Layout
      title="Blog Landing"
      description="Blog landing with pinned and recent posts"
      showStartButton={true}
    >
      {blogContent.pinnedPosts.map((post, index) => {
        const url: string =
          "path" in post ? `/blog/${post.path}` : post.externalUrl;
        return (
          <Link key={index} href={url}>
            <div>
              <p>{post.title}</p>
              <p>{post.author}</p>
              <p>{post.date}</p>
              {post.tags.map((tag, index) => {
                return <p key={index}>{tag}</p>;
              })}
            </div>
          </Link>
        );
      })}
      {blogContent.recentPosts.map((post: BlogItem, index) => {
        const url: string =
          "path" in post ? `/blog/${post.path}` : post.externalUrl;
        return (
          <Link key={index} href={url}>
            <div>
              <p>{post.title}</p>
              <p>{post.author}</p>
              <p>{post.date}</p>
              {post.tags.map((tag, index) => {
                return <p key={index}>{tag}</p>;
              })}
            </div>
          </Link>
        );
      })}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const blogContent = await fetchBlogPosts();

  return { props: { blogContent }, revalidate: 60 };
};

export default Blog;
