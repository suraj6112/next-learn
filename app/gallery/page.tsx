"use client";

import { useEffect, useState } from "react";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

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
}

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

interface SubcategoryItem {
  _id: string;
  categoryId: string | { _id: string; name: string; slug: string };
  name: string;
  slug: string;
}

const getId = (value: string | { _id: string } | undefined) => (typeof value === "string" ? value : value?._id || "");

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchGalleryData() {
      try {
        const [galleryRes, categoryRes, subcategoryRes] = await Promise.all([
          axios.get("/api/gallery"),
          axios.get("/api/categories"),
          axios.get("/api/subcategories"),
        ]);

        if (categoryRes.data.success) {
          setCategories(categoryRes.data.data);
        }
        if (subcategoryRes.data.success) {
          setSubcategories(subcategoryRes.data.data);
        }
        if (galleryRes.data.success && galleryRes.data.data) {
          setItems(galleryRes.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch gallery data", err);
      }
    }
    fetchGalleryData();
  }, []);

  const visibleCategories = categories;
  const visibleSubcategories = subcategories.filter((item) => getId(item.categoryId) === selectedCategory);

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || getId(item.categoryId) === selectedCategory || item.category === selectedCategory;
    const matchesSubcategory =
      selectedSubcategory === "All" ||
      getId(item.subcategoryId) === selectedSubcategory ||
      item.subcategory === selectedSubcategory;

    return matchesCategory && matchesSubcategory;
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (lightboxIndex === null) return;
    let nextIndex = direction === "prev" ? lightboxIndex - 1 : lightboxIndex + 1;
    if (nextIndex < 0) nextIndex = filteredItems.length - 1;
    if (nextIndex >= filteredItems.length) nextIndex = 0;
    setLightboxIndex(nextIndex);
  };

  const currentItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;
  const mediaSchema = filteredItems.slice(0, 24).map((item) => {
    const isVideo = item.mediaType === "video";
    return {
      "@context": "https://schema.org",
      "@type": isVideo ? "VideoObject" : "ImageObject",
      name: item.title,
      description: item.altText || `${item.title} by SKY SFX`,
      contentUrl: item.cloudinaryUrl,
      thumbnailUrl: item.thumbnail || item.cloudinaryUrl,
      uploadDate: new Date().toISOString(),
    };
  });

  return (
    <div className="bg-black min-h-screen pt-32 pb-24 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(mediaSchema) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">Event Showroom</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white mt-2">
            The Media <span className="text-gold gold-glow-text">Vault</span>
          </h1>
          <p className="text-white/60 text-sm mt-4 font-light">
            Browse through real photos and videos of our wedding couples, high-intensity pyrotechnics, and sangeet choreography productions.
          </p>
        </div>

        {/* Filter Tags */}
        <div
          className={`flex flex-wrap justify-center gap-2 ${
            selectedCategory !== "All" && visibleSubcategories.length > 0 ? "mb-5" : "mb-12 sm:mb-16"
          }`}
        >
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSelectedSubcategory("All");
            }}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border clickable ${
              selectedCategory === "All"
                ? "bg-gold border-gold text-black gold-glow-btn"
                : "bg-charcoal border-white/5 text-white/80 hover:border-gold/30 hover:text-white"
            }`}
          >
            All
          </button>
          {visibleCategories.map((category) => (
            <button
              key={category._id}
              onClick={() => {
                setSelectedCategory(category._id);
                setSelectedSubcategory("All");
              }}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border clickable ${
                selectedCategory === category._id
                  ? "bg-gold border-gold text-black gold-glow-btn"
                  : "bg-charcoal border-white/5 text-white/80 hover:border-gold/30 hover:text-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {selectedCategory !== "All" && visibleSubcategories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12 sm:mb-16">
            <button
              onClick={() => setSelectedSubcategory("All")}
              className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 border clickable ${
                selectedSubcategory === "All"
                  ? "bg-white text-black border-white"
                  : "bg-charcoal border-white/5 text-white/70 hover:border-gold/30 hover:text-white"
              }`}
            >
              All Subcategories
            </button>
            {visibleSubcategories.map((subcategory) => (
              <button
                key={subcategory._id}
                onClick={() => setSelectedSubcategory(subcategory._id)}
                className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 border clickable ${
                  selectedSubcategory === subcategory._id
                    ? "bg-white text-black border-white"
                    : "bg-charcoal border-white/5 text-white/70 hover:border-gold/30 hover:text-white"
                }`}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        )}

        {/* Media Masonry/Flex Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => openLightbox(idx)}
              className="relative aspect-video rounded-2xl overflow-hidden bg-charcoal border border-white/5 hover:border-gold/25 transition-all duration-300 group cursor-pointer"
            >
              {item.mediaType === "video" ? (
                <div className="w-full h-full relative">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.altText || item.title}
                      className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-black" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-3.5 rounded-full bg-black/60 border border-gold/30 text-gold backdrop-blur-sm group-hover:scale-110 transition-all">
                      <Play className="w-6 h-6 fill-gold" />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={item.cloudinaryUrl}
                  alt={item.altText || item.title}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                />
              )}

              {/* Hover description layer */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                <span className="text-[10px] font-bold text-gold uppercase tracking-widest">
                  {item.subcategory ? `${item.category} / ${item.subcategory}` : item.category}
                </span>
                <h3 className="text-white font-bold text-base mt-1 group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-charcoal rounded-2xl border border-white/5">
            <p className="text-white/40 text-sm">No items found under this category yet.</p>
          </div>
        )}
      </div>

      {/* Dynamic Lightbox Modal Popup */}
      <AnimatePresence>
        {currentItem && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-center items-center p-4">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/5 transition-colors clickable"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Nav Arrow */}
            <button
              onClick={() => navigateLightbox("prev")}
              className="absolute left-4 sm:left-10 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/5 transition-colors clickable"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Right Nav Arrow */}
            <button
              onClick={() => navigateLightbox("next")}
              className="absolute right-4 sm:right-10 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/5 transition-colors clickable"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Lightbox Media Container */}
            <div className="max-w-4xl w-full aspect-video rounded-2xl overflow-hidden border border-gold/15 bg-black relative flex items-center justify-center">
              {currentItem.mediaType === "video" ? (
                <video
                  src={currentItem.cloudinaryUrl}
                  controls
                  autoPlay
                  className="w-full h-full max-h-[80vh] object-contain"
                />
              ) : (
                <img
                  src={currentItem.cloudinaryUrl}
                  alt={currentItem.altText || currentItem.title}
                  className="w-full h-full max-h-[80vh] object-contain"
                />
              )}
            </div>

            {/* Slide Title */}
            <div className="text-center mt-6 max-w-xl">
              <span className="text-xs text-gold uppercase font-bold tracking-widest">
                {currentItem.category}
                {currentItem.subcategory ? ` / ${currentItem.subcategory}` : ""}
              </span>
              <h2 className="text-white font-serif text-xl sm:text-2xl font-bold mt-1">
                {currentItem.title}
              </h2>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
