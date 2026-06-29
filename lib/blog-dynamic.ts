/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/db";
import { defaultBlogPosts } from "@/lib/blog-defaults";
import BlogPost from "@/models/BlogPost";

export type BlogPostData = {
  _id?: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  coverImage: string;
  excerpt: string;
  content: string;
  relatedServiceSlug?: string;
  relatedLocationSlug?: string;
  faqs: Array<{ question: string; answer: string }>;
  sortOrder: number;
  isActive: boolean;
  publishedAt?: Date | string;
};

function toBlogPost(doc: any): BlogPostData {
  return {
    _id: String(doc._id || ""),
    title: doc.title,
    slug: doc.slug,
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    keywords: Array.isArray(doc.keywords) ? doc.keywords : [],
    coverImage: doc.coverImage,
    excerpt: doc.excerpt,
    content: doc.content,
    relatedServiceSlug: doc.relatedServiceSlug || "",
    relatedLocationSlug: doc.relatedLocationSlug || "",
    faqs: Array.isArray(doc.faqs) ? doc.faqs : [],
    sortOrder: Number(doc.sortOrder) || 0,
    isActive: doc.isActive !== false,
    publishedAt: doc.publishedAt,
  };
}

const fallbackPosts: BlogPostData[] = defaultBlogPosts.map((post) => ({
  ...post,
  publishedAt: new Date(),
}));

export async function getBlogPosts(options: { includeFallback?: boolean; includeInactive?: boolean } = {}) {
  try {
    await dbConnect();
    const filter = options.includeInactive ? {} : { isActive: true };
    const docs = await BlogPost.find(filter).sort({ sortOrder: 1, publishedAt: -1 }).lean();
    const posts = docs.map(toBlogPost);
    return posts.length > 0 || options.includeFallback === false ? posts : fallbackPosts;
  } catch {
    return options.includeFallback === false ? [] : fallbackPosts;
  }
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug);
}
