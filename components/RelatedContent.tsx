import Link from "next/link";
import { ArrowRight, BookOpen, BriefcaseBusiness, FolderOpen } from "lucide-react";
import type { BlogPostData } from "@/lib/blog-dynamic";
import type { CaseStudyData } from "@/lib/case-study-dynamic";
import type { PackageData } from "@/lib/package-dynamic";

type RelatedContentProps = {
  blogs?: BlogPostData[];
  packages?: PackageData[];
  caseStudies?: CaseStudyData[];
};

export default function RelatedContent({ blogs = [], packages = [], caseStudies = [] }: RelatedContentProps) {
  const hasContent = blogs.length > 0 || packages.length > 0 || caseStudies.length > 0;
  if (!hasContent) return null;

  return (
    <section className="py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-bold tracking-widest text-gold uppercase">Related Content</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-3 mb-10">Explore more before booking</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {blogs.map((item) => (
            <RelatedCard
              key={`blog-${item.slug}`}
              href={`/blog/${item.slug}`}
              icon={<BookOpen className="w-5 h-5" />}
              eyebrow="Guide"
              title={item.title}
              description={item.excerpt}
            />
          ))}
          {packages.map((item) => (
            <RelatedCard
              key={`package-${item.slug}`}
              href={`/packages/${item.slug}`}
              icon={<BriefcaseBusiness className="w-5 h-5" />}
              eyebrow={item.startingPrice || "Package"}
              title={item.name}
              description={item.shortDescription}
            />
          ))}
          {caseStudies.map((item) => (
            <RelatedCard
              key={`case-${item.slug}`}
              href={`/case-studies/${item.slug}`}
              icon={<FolderOpen className="w-5 h-5" />}
              eyebrow={item.city}
              title={item.title}
              description={item.result}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedCard({
  href,
  icon,
  eyebrow,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="rounded-lg bg-charcoal border border-white/5 hover:border-gold/30 p-6 transition-colors group">
      <div className="text-gold mb-4">{icon}</div>
      <p className="text-[10px] text-gold uppercase tracking-widest font-bold">{eyebrow}</p>
      <h3 className="text-white font-bold text-lg mt-2 line-clamp-2 group-hover:text-gold transition-colors">{title}</h3>
      <p className="text-white/50 text-xs leading-6 mt-3 line-clamp-3">{description}</p>
      <span className="inline-flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mt-5">
        Open
        <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}
