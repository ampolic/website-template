import { getCollection } from "astro:content";

export async function getPublishedBlogPosts() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  return posts.sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );
}
