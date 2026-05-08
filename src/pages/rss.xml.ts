import rss from "@astrojs/rss";

import { siteConfig } from "@/config/site";
import { getPublishedBlogPosts } from "@/features/blog/content";

export async function GET(context: { site: URL }) {
  const posts = await getPublishedBlogPosts();

  return rss({
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}`,
    })),
  });
}
