import { GetStaticProps } from "next";
import Link from "next/link";
import React from "react";
import { fetchBlogPosts } from "../api-functions/cms/ContentfulBlogLanding";
import Layout from "../components/Layout";
import { BlogItem, BlogPostFeed } from "../interfaces/contentful-blog";

type Props = {
  blogFeedContent: BlogPostFeed;
};

function Blog({ blogFeedContent }: Props) {
  const { pinnedPosts, recentPosts } = blogFeedContent;
  return (
    <>
      <Layout
        title="Blog Landing"
        description="Blog landing with pinned and recent posts"
        showStartButton={true}
      >
        {pinnedPosts.map((post, index) => {
          const url: string =
            "path" in post ? `/blog/${post.path}` : post.externalLink;
          return (
            <Link key={index} href={url}>
              <div>
                <p>{post.title}</p>
                <p>{post.author}</p>
                <p>{post.publishedAt}</p>
                {post.tags.map((tag, index) => {
                  return <p key={index}>{tag}</p>;
                })}
              </div>
            </Link>
          );
        })}
        {recentPosts.map((post: BlogItem, index) => {
          const url: string =
            "path" in post ? `/blog/${post.path}` : post.externalLink;
          console.log(url);
          return (
            <Link key={index} href={url}>
              <div>
                <p>{post.title}</p>
                <p>{post.author}</p>
                <p>{post.publishedAt}</p>
                {post.tags.map((tag, index) => {
                  return <p key={index}>{tag}</p>;
                })}
              </div>
            </Link>
          );
        })}
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const blogFeedContent = await fetchBlogPosts();

  return { props: { blogFeedContent }, revalidate: 60 };
};

export default Blog;
