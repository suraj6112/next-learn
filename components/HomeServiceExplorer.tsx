"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Flame, Images, Layers3, Loader2, MessageSquare, Search, Send, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import VideoWithLoader from "@/components/VideoWithLoader";

interface SubcategoryItem {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
}

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories?: SubcategoryItem[];
}

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  subcategory?: string;
  categoryId?: string | { _id: string; name: string; slug: string };
  subcategoryId?: string | { _id: string; name: string; slug: string };
  altText?: string;
  mediaType: "image" | "video";
  cloudinaryUrl: string;
  thumbnail?: string;
  featured: boolean;
  showOnHome: boolean;
  isReel: boolean;
}

const getId = (value: string | { _id: string } | undefined) => (typeof value === "string" ? value : value?._id || "");

function buildMessage(category: string, subcategory: string) {
  const service = subcategory || category || "event planning";
  return `I want details for ${service}. Please share availability, setup options, and pricing.`;
}

export default function HomeServiceExplorer() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [mediaItems, setMediaItems] = useState<GalleryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    mobile: "",
    eventDate: "",
    message: "",
  });

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [categoryRes, galleryRes] = await Promise.all([
          axios.get("/api/categories?includeSubcategories=true"),
          axios.get("/api/gallery"),
        ]);

        if (categoryRes.data.success && Array.isArray(categoryRes.data.data)) {
          const fetchedCategories = categoryRes.data.data;
          setCategories(fetchedCategories);
          setSelectedCategoryId(fetchedCategories[0]?._id || "");
        }
        if (galleryRes.data.success && Array.isArray(galleryRes.data.data)) {
          setMediaItems(galleryRes.data.data);
        }
      } catch (err) {
        console.error("Failed to load home service data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  const selectedCategory = useMemo(
    () => categories.find((item) => item._id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  const selectedSubcategory = useMemo(
    () => selectedCategory?.subcategories?.find((item) => item._id === selectedSubcategoryId),
    [selectedCategory, selectedSubcategoryId]
  );

  const searchedCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter((category) => {
      const categoryText = `${category.name} ${category.description || ""}`.toLowerCase();
      const subcategoryText = (category.subcategories || []).map((item) => item.name).join(" ").toLowerCase();
      return `${categoryText} ${subcategoryText}`.includes(query);
    });
  }, [categories, searchTerm]);

  const filteredMedia = useMemo(() => {
    const filtered = mediaItems.filter((item) => {
      const matchesCategory = !selectedCategoryId || getId(item.categoryId) === selectedCategoryId;
      const matchesSubcategory = !selectedSubcategoryId || getId(item.subcategoryId) === selectedSubcategoryId;
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch = !query || `${item.title} ${item.category} ${item.subcategory || ""}`.toLowerCase().includes(query);
      return matchesCategory && matchesSubcategory && matchesSearch;
    });

    return filtered.slice(0, 6);
  }, [mediaItems, searchTerm, selectedCategoryId, selectedSubcategoryId]);

  const selectedCategoryName = selectedCategory?.name || "";
  const selectedSubcategoryName = selectedSubcategory?.name || "";
  const inquiryEventType = selectedSubcategoryName ? `${selectedCategoryName} / ${selectedSubcategoryName}` : selectedCategoryName || "Wedding Events";

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId("");
  };

  const selectSubcategory = (subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);
    const subcategory = selectedCategory?.subcategories?.find((item) => item._id === subcategoryId);
    setInquiryForm((prev) => ({
      ...prev,
      message: buildMessage(selectedCategory?.name || "", subcategory?.name || ""),
    }));
  };

  const submitInquiry = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setFormStatus(null);

    try {
      const payload = {
        name: inquiryForm.name,
        mobile: inquiryForm.mobile,
        eventType: inquiryEventType,
        eventDate: inquiryForm.eventDate,
        message: inquiryForm.message || buildMessage(selectedCategoryName, selectedSubcategoryName),
        source: "homepage_service_explorer",
      };
      const res = await axios.post("/api/inquiries", payload);
      if (res.data.success) {
        setFormStatus({ type: "success", message: "Inquiry sent. SKY SFX team will contact you shortly." });
        setInquiryForm({ name: "", mobile: "", eventDate: "", message: "" });
      } else {
        setFormStatus({ type: "error", message: res.data.message || "Inquiry submit nahi ho paayi." });
      }
    } catch {
      setFormStatus({ type: "error", message: "Network issue. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="border-t border-white/5 bg-black py-20">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 text-white/50">
          <Loader2 className="mr-3 h-5 w-5 animate-spin text-gold" />
          Loading services...
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="border-t border-white/5 bg-black py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Plan by Function</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-5xl">
              Explore SKY SFX <span className="text-gold gold-glow-text">Services</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Wedding functions, SFX moments, choreography, decor, artists, and event production in one place.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-lg border border-white/5 bg-charcoal p-3 text-center">
            <div className="px-3 py-2">
              <Layers3 className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-1 text-lg font-bold">{categories.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/45">Categories</p>
            </div>
            <div className="px-3 py-2">
              <Sparkles className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-1 text-lg font-bold">{categories.reduce((total, item) => total + (item.subcategories?.length || 0), 0)}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/45">Functions</p>
            </div>
            <div className="px-3 py-2">
              <Images className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-1 text-lg font-bold">{mediaItems.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/45">Media</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <div className="rounded-lg border border-white/5 bg-charcoal p-4">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-gold">
                Search services
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search Haldi, Varmala, Cold Pyro, DJ, Anchor..."
                  className="w-full rounded-lg border border-white/10 bg-black px-11 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 hover:border-gold/30 focus:border-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {searchedCategories.map((category, index) => {
                const isSelected = selectedCategoryId === category._id;
                return (
                  <motion.button
                    key={category._id}
                    type="button"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                    onClick={() => selectCategory(category._id)}
                    className={`rounded-lg border p-5 text-left transition-all clickable ${
                      isSelected
                        ? "border-gold/50 bg-gold/10"
                        : "border-white/5 bg-charcoal hover:border-gold/25"
                    }`}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-white">{category.name}</h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/50">{category.description || "SKY SFX event service category"}</p>
                      </div>
                      <span className="rounded-full border border-gold/20 bg-black/30 px-2.5 py-1 text-[10px] font-bold text-gold">
                        {category.subcategories?.length || 0}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(category.subcategories || []).slice(0, 4).map((subcategory) => (
                        <span key={subcategory._id} className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-semibold text-white/65">
                          {subcategory.name}
                        </span>
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            {searchedCategories.length === 0 && (
              <div className="rounded-lg border border-white/5 bg-charcoal p-8 text-center">
                <p className="text-sm text-white/55">No exact service found. Send your requirement and we will create a custom setup.</p>
              </div>
            )}

            {selectedCategory && (selectedCategory.subcategories?.length || 0) > 0 && (
              <div className="rounded-lg border border-white/5 bg-charcoal p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Choose function</p>
                    <h3 className="mt-1 text-xl font-bold text-white">{selectedCategory.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategoryId("")}
                    className={`rounded-md border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors clickable ${
                      !selectedSubcategoryId ? "border-gold bg-gold text-black" : "border-white/10 bg-black/25 text-white/70 hover:border-gold/30"
                    }`}
                  >
                    All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory.subcategories?.map((subcategory) => (
                    <button
                      key={subcategory._id}
                      type="button"
                      onClick={() => selectSubcategory(subcategory._id)}
                      className={`rounded-md border px-4 py-2 text-xs font-semibold transition-colors clickable ${
                        selectedSubcategoryId === subcategory._id
                          ? "border-gold bg-gold text-black"
                          : "border-white/10 bg-black/25 text-white/75 hover:border-gold/30 hover:text-white"
                      }`}
                    >
                      {subcategory.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg border border-white/5 bg-charcoal p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Real Event Media</p>
                  <h3 className="mt-1 text-xl font-bold text-white">
                    {selectedSubcategoryName || selectedCategoryName || "Latest Moments"}
                  </h3>
                </div>
                <a href="/gallery" className="rounded-md border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/70 transition-colors hover:border-gold/30 hover:text-gold">
                  Gallery
                </a>
              </div>
              {filteredMedia.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredMedia.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => setSelectedMedia(item)}
                      className="group overflow-hidden rounded-lg border border-white/5 bg-black text-left transition-colors hover:border-gold/30 clickable"
                    >
                      <div className="relative aspect-video bg-black">
                        {item.mediaType === "video" ? (
                          <>
                            {item.thumbnail ? (
                              <Image src={item.thumbnail} alt={item.altText || item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-75 transition-transform duration-500 group-hover:scale-105" />
                            ) : (
                              <div className="h-full w-full bg-black" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="rounded-full border border-gold/30 bg-black/60 p-3 text-gold">
                                <Flame className="h-5 w-5" />
                              </span>
                            </div>
                          </>
                        ) : (
                          <Image src={item.cloudinaryUrl} alt={item.altText || item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover opacity-75 transition-transform duration-500 group-hover:scale-105" />
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gold">
                          {item.subcategory ? `${item.category} / ${item.subcategory}` : item.category}
                        </p>
                        <h4 className="mt-1 line-clamp-2 text-sm font-bold text-white">{item.title}</h4>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-white/5 bg-black/30 p-8 text-center">
                  <p className="text-sm text-white/55">
                    Media for this function is not published yet. You can still plan this setup with SKY SFX.
                  </p>
                  <button
                    type="button"
                    onClick={() => setInquiryForm((prev) => ({ ...prev, message: buildMessage(selectedCategoryName, selectedSubcategoryName) }))}
                    className="mt-4 rounded-md bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-gold-hover clickable"
                  >
                    Plan This Setup
                  </button>
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-lg border border-gold/15 bg-charcoal p-6 lg:sticky lg:top-28">
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Quick Booking</p>
              <h3 className="mt-1 text-2xl font-bold text-white">Get Function Quote</h3>
              <p className="mt-3 text-xs leading-6 text-white/55">
                {inquiryEventType}
              </p>
            </div>

            {formStatus && (
              <div className={`mb-5 rounded-lg border p-3 text-xs ${
                formStatus.type === "success"
                  ? "border-green-500/30 bg-green-500/10 text-green-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}>
                {formStatus.message}
              </div>
            )}

            <form onSubmit={submitInquiry} className="space-y-4">
              <input
                type="text"
                required
                value={inquiryForm.name}
                onChange={(event) => setInquiryForm({ ...inquiryForm, name: event.target.value })}
                placeholder="Full name"
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition-colors hover:border-gold/30 focus:border-gold"
              />
              <input
                type="tel"
                required
                value={inquiryForm.mobile}
                onChange={(event) => setInquiryForm({ ...inquiryForm, mobile: event.target.value })}
                placeholder="Mobile / WhatsApp"
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition-colors hover:border-gold/30 focus:border-gold"
              />
              <input
                type="date"
                required
                value={inquiryForm.eventDate}
                onChange={(event) => setInquiryForm({ ...inquiryForm, eventDate: event.target.value })}
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition-colors hover:border-gold/30 focus:border-gold"
              />
              <textarea
                required
                rows={4}
                value={inquiryForm.message}
                onChange={(event) => setInquiryForm({ ...inquiryForm, message: event.target.value })}
                placeholder={buildMessage(selectedCategoryName, selectedSubcategoryName)}
                className="w-full resize-none rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition-colors hover:border-gold/30 focus:border-gold"
              />
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-60 clickable"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Inquiry
              </button>
            </form>

            <div className="mt-6 space-y-3 border-t border-white/5 pt-5">
              {["Function planning", "SFX timing", "Artist coordination"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs font-semibold text-white/65">
                  <CheckCircle2 className="h-4 w-4 text-gold" />
                  {item}
                </div>
              ))}
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""}?text=${encodeURIComponent(`Hello SKY SFX, I want ${inquiryEventType} for my event${inquiryForm.eventDate ? ` on ${inquiryForm.eventDate}` : ""}. Please share setup options, availability, and pricing.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-green-500/25 bg-green-500/10 px-5 py-3 text-sm font-bold uppercase tracking-wider text-green-300 transition-colors hover:bg-green-500/15 clickable"
              >
                <MessageSquare className="h-4 w-4" />
                WhatsApp Now
              </a>
            </div>
          </aside>
        </div>
      </div>

      {selectedMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 text-white backdrop-blur-md">
          <button
            type="button"
            onClick={() => setSelectedMedia(null)}
            className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/10 p-3 text-white/75 transition-colors hover:border-gold hover:text-gold clickable"
            aria-label="Close media"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="w-full max-w-5xl">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-gold/15 bg-black">
              {selectedMedia.mediaType === "video" ? (
                <VideoWithLoader
                  src={selectedMedia.cloudinaryUrl}
                  controls
                  autoPlay
                  preload="metadata"
                  wrapperClassName="relative h-full w-full"
                  className="h-full w-full object-contain"
                />
              ) : (
                <Image
                  src={selectedMedia.cloudinaryUrl}
                  alt={selectedMedia.altText || selectedMedia.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              )}
            </div>
            <div className="mt-5 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-gold">
                {selectedMedia.subcategory ? `${selectedMedia.category} / ${selectedMedia.subcategory}` : selectedMedia.category}
              </p>
              <h3 className="mt-2 font-serif text-2xl font-bold text-white">{selectedMedia.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
