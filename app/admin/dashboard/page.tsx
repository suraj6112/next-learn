"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ClipboardList,
  FolderTree,
  Image as ImageIcon,
  Layers3,
  Loader2,
  LogOut,
  Pencil,
  Phone,
  Send,
  Sparkles,
  Trash,
  Upload,
  XCircle,
} from "lucide-react";
import axios from "axios";

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  sortOrder: number;
  isActive: boolean;
}

interface SubcategoryItem {
  _id: string;
  categoryId: string | CategoryItem;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  sortOrder: number;
  isActive: boolean;
}

interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  subcategory?: string;
  categoryId?: string | CategoryItem;
  subcategoryId?: string | SubcategoryItem;
  description?: string;
  altText?: string;
  caption?: string;
  city?: string;
  serviceSlug?: string;
  duration?: string;
  mediaType: "image" | "video";
  cloudinaryUrl: string;
  thumbnail?: string;
  featured: boolean;
  showOnHome: boolean;
  isReel: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface EventItem {
  _id: string;
  title: string;
  category: string;
  subcategory?: string;
  categoryId?: string | CategoryItem;
  subcategoryId?: string | SubcategoryItem;
  description: string;
  mediaUrls: string[];
  createdAt: string;
}

interface InquiryItem {
  _id: string;
  name: string;
  mobile: string;
  eventType: string;
  eventDate: string;
  message: string;
  createdAt: string;
}

interface HomeStatItem {
  key: string;
  label: string;
  value: number;
  suffix: string;
  sortOrder: number;
  isActive: boolean;
}

interface ContactSettings {
  phoneLabel: string;
  phone: string;
  phoneHref: string;
  whatsappNumber: string;
  emailLabel: string;
  email: string;
  addressLabel: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
}

const CATEGORY_FORM = {
  name: "",
  slug: "",
  description: "",
  coverImage: "",
  sortOrder: 0,
  isActive: true,
};

const SUBCATEGORY_FORM = {
  categoryId: "",
  name: "",
  slug: "",
  description: "",
  coverImage: "",
  sortOrder: 0,
  isActive: true,
};

const GALLERY_FORM = {
  title: "",
  categoryId: "",
  subcategoryId: "",
  description: "",
  altText: "",
  caption: "",
  city: "",
  serviceSlug: "",
  duration: "",
  mediaType: "image" as "image" | "video",
  cloudinaryUrl: "",
  thumbnail: "",
  featured: false,
  showOnHome: false,
  isReel: false,
  sortOrder: 0,
  isActive: true,
};

const EVENT_FORM = {
  title: "",
  category: "Weddings",
  subcategory: "",
  categoryId: "",
  subcategoryId: "",
  description: "",
  mediaUrl: "",
};

const FALLBACK_EVENT_CATEGORIES = [
  "Weddings",
  "Corporate Events",
  "Dance Sangeet",
  "School & College",
  "Cultural",
];

const HOME_STATS_FORM: HomeStatItem[] = [
  {
    key: "events-completed",
    label: "Events Completed",
    value: 100,
    suffix: "+",
    sortOrder: 1,
    isActive: true,
  },
  {
    key: "happy-clients",
    label: "Happy Clients",
    value: 500,
    suffix: "+",
    sortOrder: 2,
    isActive: true,
  },
  {
    key: "premium-fire-shows",
    label: "Premium Fire Shows",
    value: 50,
    suffix: "+",
    sortOrder: 3,
    isActive: true,
  },
  {
    key: "years-experience",
    label: "Years Experience",
    value: 5,
    suffix: "+",
    sortOrder: 4,
    isActive: true,
  },
];

const CONTACT_SETTINGS_FORM: ContactSettings = {
  phoneLabel: "Call/Call Helpline",
  phone: "+91 99999 99999",
  phoneHref: "tel:+919999999999",
  whatsappNumber: "919999999999",
  emailLabel: "Send Professional Email",
  email: "bookings@skysfx.in",
  addressLabel: "HQ Location",
  address: "SKY SFX, Jaipur, Rajasthan, India",
  instagramUrl: "",
  facebookUrl: "",
};

type ActiveTab =
  | "leads"
  | "stats"
  | "contact"
  | "categories"
  | "subcategories"
  | "gallery"
  | "events";

const getRequestErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string }
      | undefined;
    return responseData?.message || fallback;
  }
  return fallback;
};

const getId = (value: string | { _id: string } | undefined) =>
  typeof value === "string" ? value : value?._id || "";

export default function AdminDashboard() {
  const router = useRouter();
  const categoryFormRef = useRef<HTMLDivElement>(null);
  const subcategoryFormRef = useRef<HTMLDivElement>(null);
  const galleryFormRef = useRef<HTMLDivElement>(null);
  const eventFormRef = useRef<HTMLDivElement>(null);

  const [token] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("admin_token");
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>("leads");

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [eventItems, setEventItems] = useState<EventItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [homeStats, setHomeStats] = useState<HomeStatItem[]>(HOME_STATS_FORM);
  const [contactSettings, setContactSettings] = useState<ContactSettings>(
    CONTACT_SETTINGS_FORM,
  );

  const [categoryForm, setCategoryForm] = useState(CATEGORY_FORM);
  const [subcategoryForm, setSubcategoryForm] = useState(SUBCATEGORY_FORM);
  const [galleryForm, setGalleryForm] = useState(GALLERY_FORM);
  const [eventForm, setEventForm] = useState(EVENT_FORM);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<
    string | null
  >(null);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token],
  );

  const filteredSubcategories = useMemo(
    () =>
      subcategories.filter(
        (item) => getId(item.categoryId) === galleryForm.categoryId,
      ),
    [galleryForm.categoryId, subcategories],
  );

  const activeCategories = useMemo(
    () => categories.filter((item) => item.isActive),
    [categories],
  );

  const eventCategoryOptions = useMemo(() => {
    const categoryNames =
      activeCategories.length > 0
        ? activeCategories.map((item) => item.name)
        : FALLBACK_EVENT_CATEGORIES;
    return eventForm.category && !categoryNames.includes(eventForm.category)
      ? [eventForm.category, ...categoryNames]
      : categoryNames;
  }, [activeCategories, eventForm.category]);

  const selectedEventCategory = eventCategoryOptions.includes(
    eventForm.category,
  )
    ? eventForm.category
    : eventCategoryOptions[0] || "";

  const selectedEventCategoryItem = useMemo(
    () => activeCategories.find((item) => item.name === selectedEventCategory),
    [activeCategories, selectedEventCategory],
  );

  const eventFilteredSubcategories = useMemo(
    () =>
      selectedEventCategoryItem
        ? subcategories.filter(
            (item) =>
              getId(item.categoryId) === selectedEventCategoryItem._id &&
              item.isActive,
          )
        : [],
    [selectedEventCategoryItem, subcategories],
  );

  const eventSubcategoryOptions = useMemo(() => {
    return eventFilteredSubcategories.map((item) => ({
      value: item._id,
      label: item.name,
    }));
  }, [eventFilteredSubcategories]);

  const fetchCategories = useCallback(async () => {
    const res = await axios.get("/api/categories?includeInactive=true");
    if (res.data.success) {
      setCategories(res.data.data);
    }
  }, []);

  const fetchSubcategories = useCallback(async () => {
    const res = await axios.get("/api/subcategories?includeInactive=true");
    if (res.data.success) {
      setSubcategories(res.data.data);
    }
  }, []);

  const fetchGalleryItems = useCallback(async () => {
    const res = await axios.get("/api/gallery?includeInactive=true");
    if (res.data.success) {
      setGalleryItems(res.data.data);
    }
  }, []);

  const fetchEventItems = useCallback(async () => {
    const res = await axios.get("/api/events");
    if (res.data.success) {
      setEventItems(res.data.data);
    }
  }, []);

  const fetchInquiries = useCallback(async () => {
    const res = await axios.get("/api/inquiries", { headers: authHeaders });
    if (res.data.success) {
      setInquiries(res.data.data);
    }
  }, [authHeaders]);

  const fetchHomeStats = useCallback(async () => {
    const res = await axios.get("/api/home-stats?includeInactive=true");
    if (res.data.success && res.data.data?.length) {
      setHomeStats(res.data.data);
    }
  }, []);

  const fetchContactSettings = useCallback(async () => {
    const res = await axios.get("/api/contact-settings");
    if (res.data.success && res.data.data) {
      setContactSettings({ ...CONTACT_SETTINGS_FORM, ...res.data.data });
    }
  }, []);

  const refreshCmsData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCategories(),
        fetchSubcategories(),
        fetchGalleryItems(),
        fetchEventItems(),
        fetchHomeStats(),
        fetchContactSettings(),
      ]);
    } catch {
      setFormError(
        "CMS data load nahi ho paaya. Please refresh karke try karein.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    fetchCategories,
    fetchContactSettings,
    fetchEventItems,
    fetchGalleryItems,
    fetchHomeStats,
    fetchSubcategories,
  ]);

  useEffect(() => {
    if (!token) {
      router.push("/admin");
    }
  }, [router, token]);

  useEffect(() => {
    if (!token) return;
    const loadTimer = window.setTimeout(() => {
      void refreshCmsData();
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, [refreshCmsData, token]);

  useEffect(() => {
    if (!token || activeTab !== "leads") return;
    const loadTimer = window.setTimeout(() => {
      setLoading(true);
      fetchInquiries()
        .catch(() => setFormError("Lead inbox load nahi ho paaya."))
        .finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, [activeTab, fetchInquiries, token]);

  useEffect(() => {
    const firstCategory = activeCategories[0];
    if (
      !firstCategory ||
      (galleryForm.categoryId && subcategoryForm.categoryId)
    )
      return;

    const defaultTimer = window.setTimeout(() => {
      if (!galleryForm.categoryId) {
        setGalleryForm((prev) => ({ ...prev, categoryId: firstCategory._id }));
      }
      if (!subcategoryForm.categoryId) {
        setSubcategoryForm((prev) => ({
          ...prev,
          categoryId: firstCategory._id,
        }));
      }
    }, 0);
    return () => window.clearTimeout(defaultTimer);
  }, [activeCategories, galleryForm.categoryId, subcategoryForm.categoryId]);

  const clearFeedback = () => {
    setFormError(null);
    setFormSuccess(null);
  };

  const switchTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    clearFeedback();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/api/admin/upload", formData, {
      headers: { ...authHeaders, "Content-Type": "multipart/form-data" },
    });
    if (!res.data.success) {
      throw new Error(res.data.message || "Upload failed");
    }
    return res.data as { url: string; thumbnailUrl?: string };
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "categoryCover" | "subcategoryCover" | "gallery" | "event",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTarget(target);
    clearFeedback();
    try {
      const uploaded = await uploadFile(file);
      if (target === "categoryCover") {
        setCategoryForm((prev) => ({ ...prev, coverImage: uploaded.url }));
      }
      if (target === "subcategoryCover") {
        setSubcategoryForm((prev) => ({ ...prev, coverImage: uploaded.url }));
      }
      if (target === "gallery") {
        const detectedType = file.type.startsWith("video/") ? "video" : "image";
        setGalleryForm((prev) => ({
          ...prev,
          mediaType: detectedType,
          cloudinaryUrl: uploaded.url,
          thumbnail: uploaded.thumbnailUrl || uploaded.url,
          isReel: detectedType === "video" ? prev.isReel : false,
        }));
      }
      if (target === "event") {
        setEventForm((prev) => ({ ...prev, mediaUrl: uploaded.url }));
      }
      setFormSuccess("File uploaded successfully.");
    } catch (err) {
      console.error("File upload error:", err);
      setFormError(
        getRequestErrorMessage(
          err,
          "File upload failed. Cloudinary config check karein.",
        ),
      );
    } finally {
      setUploadingTarget(null);
      e.target.value = "";
    }
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    clearFeedback();
    try {
      const request = editingCategoryId
        ? axios.put(
            "/api/categories",
            { id: editingCategoryId, ...categoryForm },
            { headers: authHeaders },
          )
        : axios.post("/api/categories", categoryForm, { headers: authHeaders });
      const res = await request;
      if (res.data.success) {
        setFormSuccess(
          editingCategoryId ? "Category updated." : "Category created.",
        );
        setCategoryForm(CATEGORY_FORM);
        setEditingCategoryId(null);
        await Promise.all([fetchCategories(), fetchSubcategories()]);
      }
    } catch (err) {
      setFormError(getRequestErrorMessage(err, "Category save nahi ho paayi."));
    } finally {
      setFormLoading(false);
    }
  };

  const saveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    clearFeedback();
    try {
      const request = editingSubcategoryId
        ? axios.put(
            "/api/subcategories",
            { id: editingSubcategoryId, ...subcategoryForm },
            { headers: authHeaders },
          )
        : axios.post("/api/subcategories", subcategoryForm, {
            headers: authHeaders,
          });
      const res = await request;
      if (res.data.success) {
        setFormSuccess(
          editingSubcategoryId
            ? "Subcategory updated."
            : "Subcategory created.",
        );
        setSubcategoryForm({
          ...SUBCATEGORY_FORM,
          categoryId: activeCategories[0]?._id || "",
        });
        setEditingSubcategoryId(null);
        await fetchSubcategories();
      }
    } catch (err) {
      setFormError(
        getRequestErrorMessage(err, "Subcategory save nahi ho paayi."),
      );
    } finally {
      setFormLoading(false);
    }
  };

  const saveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    clearFeedback();
    try {
      const payload = {
        ...galleryForm,
        subcategoryId: galleryForm.subcategoryId || undefined,
      };
      const request = editingGalleryId
        ? axios.put(
            "/api/gallery",
            { id: editingGalleryId, ...payload },
            { headers: authHeaders },
          )
        : axios.post("/api/gallery", payload, { headers: authHeaders });
      const res = await request;
      if (res.data.success) {
        setFormSuccess(
          editingGalleryId ? "Media item updated." : "Media item published.",
        );
        setGalleryForm({
          ...GALLERY_FORM,
          categoryId: activeCategories[0]?._id || "",
        });
        setEditingGalleryId(null);
        await fetchGalleryItems();
      }
    } catch (err) {
      setFormError(
        getRequestErrorMessage(err, "Gallery media save nahi ho paaya."),
      );
    } finally {
      setFormLoading(false);
    }
  };

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    clearFeedback();
    try {
      const payload = {
        id: editingEventId || undefined,
        title: eventForm.title,
        category: selectedEventCategory,
        subcategory:
          eventFilteredSubcategories.find(
            (item) => item._id === eventForm.subcategoryId,
          )?.name || eventForm.subcategory,
        categoryId: selectedEventCategoryItem?._id,
        subcategoryId: eventForm.subcategoryId || undefined,
        description: eventForm.description,
        mediaUrls: eventForm.mediaUrl ? [eventForm.mediaUrl] : [],
      };
      const request = editingEventId
        ? axios.put("/api/events", payload, { headers: authHeaders })
        : axios.post("/api/events", payload, { headers: authHeaders });
      const res = await request;
      if (res.data.success) {
        setFormSuccess(
          editingEventId
            ? "Event case-study updated."
            : "Event case-study published.",
        );
        setEventForm(EVENT_FORM);
        setEditingEventId(null);
        await fetchEventItems();
      }
    } catch (err) {
      setFormError(getRequestErrorMessage(err, "Event save nahi ho paaya."));
    } finally {
      setFormLoading(false);
    }
  };

  const updateHomeStat = (index: number, patch: Partial<HomeStatItem>) => {
    setHomeStats((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  };

  const saveHomeStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    clearFeedback();
    try {
      const payload = {
        stats: homeStats.map((item, index) => ({
          ...item,
          key:
            item.key ||
            item.label
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
          value: Number(item.value) || 0,
          sortOrder: Number(item.sortOrder) || index + 1,
          isActive: item.isActive !== false,
        })),
      };
      const res = await axios.put("/api/home-stats", payload, {
        headers: authHeaders,
      });
      if (res.data.success) {
        setFormSuccess("Home stats updated.");
        await fetchHomeStats();
      }
    } catch (err) {
      setFormError(
        getRequestErrorMessage(err, "Home stats save nahi ho paaye."),
      );
    } finally {
      setFormLoading(false);
    }
  };

  const saveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    clearFeedback();
    try {
      const res = await axios.put("/api/contact-settings", contactSettings, {
        headers: authHeaders,
      });
      if (res.data.success) {
        setFormSuccess("Contact direct connect updated.");
        await fetchContactSettings();
      }
    } catch (err) {
      setFormError(
        getRequestErrorMessage(err, "Contact settings save nahi ho paayi."),
      );
    } finally {
      setFormLoading(false);
    }
  };

  const deleteItem = async (
    endpoint: string,
    id: string,
    afterDelete: () => Promise<void>,
    message: string,
  ) => {
    const confirmed = window.confirm(message);
    if (!confirmed) return;
    clearFeedback();
    try {
      const res = await axios.delete(`${endpoint}?id=${id}`, {
        headers: authHeaders,
      });
      if (res.data.success) {
        setFormSuccess("Deleted successfully.");
        await afterDelete();
      }
    } catch (err) {
      setFormError(getRequestErrorMessage(err, "Delete failed."));
    }
  };

  const editCategory = (item: CategoryItem) => {
    setCategoryForm({
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      coverImage: item.coverImage || "",
      sortOrder: item.sortOrder || 0,
      isActive: item.isActive !== false,
    });
    setEditingCategoryId(item._id);
    categoryFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const editSubcategory = (item: SubcategoryItem) => {
    setSubcategoryForm({
      categoryId: getId(item.categoryId),
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      coverImage: item.coverImage || "",
      sortOrder: item.sortOrder || 0,
      isActive: item.isActive !== false,
    });
    setEditingSubcategoryId(item._id);
    subcategoryFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const editGallery = (item: GalleryItem) => {
    setGalleryForm({
      title: item.title,
      categoryId: getId(item.categoryId),
      subcategoryId: getId(item.subcategoryId),
      description: item.description || "",
      altText: item.altText || "",
      caption: item.caption || "",
      city: item.city || "",
      serviceSlug: item.serviceSlug || "",
      duration: item.duration || "",
      mediaType: item.mediaType,
      cloudinaryUrl: item.cloudinaryUrl,
      thumbnail: item.thumbnail || "",
      featured: item.featured === true,
      showOnHome: item.showOnHome === true,
      isReel: item.isReel === true,
      sortOrder: item.sortOrder || 0,
      isActive: item.isActive !== false,
    });
    setEditingGalleryId(item._id);
    galleryFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const editEvent = (item: EventItem) => {
    const categoryId = getId(item.categoryId);
    const subcategoryId = getId(item.subcategoryId);
    setEventForm({
      title: item.title,
      category: item.category,
      subcategory: item.subcategory || "",
      categoryId,
      subcategoryId,
      description: item.description,
      mediaUrl: item.mediaUrls?.[0] || "",
    });
    setEditingEventId(item._id);
    eventFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (!token) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        Authenticating...
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-5 border-b border-white/5 pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
                <Sparkles className="h-3.5 w-3.5" />
                Admin
              </span>
              <h1 className="mt-3 font-serif text-3xl font-extrabold text-gold gold-glow-text sm:text-4xl">
                SKY SFX Control Panel
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
                Leads, media, categories aur event content ko ek clean workspace
                se manage karein.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20 clickable"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-7">
            {[
              { label: "Leads", value: inquiries.length, icon: ClipboardList },
              { label: "Home Stats", value: homeStats.length, icon: Sparkles },
              { label: "Contact", value: 3, icon: Phone },
              {
                label: "Categories",
                value: categories.length,
                icon: FolderTree,
              },
              {
                label: "Subcategories",
                value: subcategories.length,
                icon: Layers3,
              },
              { label: "Media", value: galleryItems.length, icon: ImageIcon },
              { label: "Events", value: eventItems.length, icon: Sparkles },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/5 bg-charcoal/80 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
                      {stat.label}
                    </span>
                    <Icon className="h-4 w-4 text-gold" />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-white/5 bg-charcoal/70 p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-white">
                  SEO & Content Tools
                </h2>
                <p className="mt-0.5 text-xs text-white/45">
                  Ranking pages, blogs, packages aur case studies.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                {
                  href: "/admin/seo",
                  label: "SEO CMS",
                  icon: Sparkles,
                  primary: true,
                },
                { href: "/admin/blogs", label: "Blogs", icon: ClipboardList },
                { href: "/admin/packages", label: "Packages", icon: Sparkles },
                {
                  href: "/admin/case-studies",
                  label: "Case Studies",
                  icon: ImageIcon,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex min-h-12 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors clickable ${
                      item.primary
                        ? "bg-gold text-black hover:bg-gold/90"
                        : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-8 overflow-x-auto pb-1">
          <div className="inline-flex min-w-full gap-2 rounded-lg border border-white/5 bg-charcoal p-1">
            {[
              {
                key: "leads",
                label: "Leads",
                count: inquiries.length,
                icon: ClipboardList,
              },
              {
                key: "stats",
                label: "Stats",
                count: homeStats.length,
                icon: Sparkles,
              },
              { key: "contact", label: "Contact", count: 3, icon: Phone },
              {
                key: "categories",
                label: "Categories",
                count: categories.length,
                icon: FolderTree,
              },
              {
                key: "subcategories",
                label: "Subcategories",
                count: subcategories.length,
                icon: Layers3,
              },
              {
                key: "gallery",
                label: "Media",
                count: galleryItems.length,
                icon: ImageIcon,
              },
              {
                key: "events",
                label: "Events",
                count: eventItems.length,
                icon: Sparkles,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => switchTab(tab.key as ActiveTab)}
                  className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-all sm:text-xs clickable ${
                    activeTab === tab.key
                      ? "bg-gold text-black shadow-lg shadow-gold/10"
                      : "text-white/65 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      activeTab === tab.key
                        ? "bg-black/10 text-black"
                        : "bg-white/5 text-white/45"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {formSuccess && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-3">
            <Check className="w-5 h-5 shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}
        {formError && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {formError}
          </div>
        )}

        {loading && (
          <div className="mb-6 flex items-center gap-2 text-gold text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading latest CMS data...
          </div>
        )}

        {activeTab === "leads" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-wide">
              Client Inquiries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inquiries.map((inq) => (
                <div
                  key={inq._id}
                  className="p-6 rounded-lg bg-charcoal border border-white/5"
                >
                  <div className="flex justify-between gap-4 border-b border-white/5 pb-3 mb-4">
                    <div>
                      <h3 className="font-bold">{inq.name}</h3>
                      <a
                        href={`tel:${inq.mobile}`}
                        className="text-gold text-sm font-semibold hover:underline"
                      >
                        {inq.mobile}
                      </a>
                    </div>
                    <span className="bg-gold/10 border border-gold/20 text-gold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-semibold h-fit">
                      {inq.eventType}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                  <p className="text-[11px] text-white/40">
                    Submitted: {new Date(inq.createdAt).toLocaleString()} |
                    Event: {new Date(inq.eventDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {inquiries.length === 0 && (
                <div className="md:col-span-2 text-center py-16 bg-charcoal rounded-lg border border-white/5">
                  <p className="text-white/40 text-sm">Inbox is empty.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
            <div className="p-6 rounded-lg bg-charcoal border border-white/5 h-fit">
              <FormHeader
                title="Update Home Stats"
                editing={false}
                onCancel={() => setHomeStats(HOME_STATS_FORM)}
              />
              <form onSubmit={saveHomeStats} className="space-y-5">
                {homeStats.map((stat, index) => (
                  <div
                    key={stat.key || index}
                    className="rounded-lg border border-white/5 bg-black/30 p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-gold">
                        Counter {index + 1}
                      </span>
                      <Checkbox
                        label="Active"
                        checked={stat.isActive}
                        onChange={(checked) =>
                          updateHomeStat(index, { isActive: checked })
                        }
                      />
                    </div>
                    <TextField
                      label="Label"
                      required
                      value={stat.label}
                      onChange={(value) =>
                        updateHomeStat(index, { label: value })
                      }
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <NumberField
                        label="Value"
                        value={stat.value}
                        onChange={(value) => updateHomeStat(index, { value })}
                      />
                      <TextField
                        label="Suffix"
                        value={stat.suffix}
                        onChange={(value) =>
                          updateHomeStat(index, { suffix: value })
                        }
                        placeholder="+"
                      />
                    </div>
                    <NumberField
                      label="Sort Order"
                      value={stat.sortOrder}
                      onChange={(value) =>
                        updateHomeStat(index, { sortOrder: value })
                      }
                    />
                  </div>
                ))}
                <SubmitButton loading={formLoading} label="Save Home Stats" />
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 h-fit">
              {homeStats.map((stat) => (
                <div
                  key={stat.key}
                  className="rounded-lg border border-white/5 bg-charcoal p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/45">
                      {stat.isActive ? "Active" : "Hidden"}
                    </span>
                    <Sparkles className="h-4 w-4 text-gold" />
                  </div>
                  <p className="mt-4 font-serif text-4xl font-extrabold text-white">
                    {stat.value}
                    <span className="text-gold">{stat.suffix}</span>
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-8">
            <div className="p-6 rounded-lg bg-charcoal border border-white/5 h-fit">
              <FormHeader
                title="Update Direct Connect"
                editing={false}
                onCancel={() => setContactSettings(CONTACT_SETTINGS_FORM)}
              />
              <form onSubmit={saveContactSettings} className="space-y-4">
                <TextField
                  label="Phone Label"
                  value={contactSettings.phoneLabel}
                  onChange={(value) =>
                    setContactSettings({
                      ...contactSettings,
                      phoneLabel: value,
                    })
                  }
                />
                <TextField
                  label="Phone Number"
                  required
                  value={contactSettings.phone}
                  onChange={(value) =>
                    setContactSettings({ ...contactSettings, phone: value })
                  }
                />
                <TextField
                  label="Phone Link"
                  value={contactSettings.phoneHref}
                  onChange={(value) =>
                    setContactSettings({ ...contactSettings, phoneHref: value })
                  }
                  placeholder="tel:+919999999999"
                />
                <TextField
                  label="WhatsApp Number"
                  value={contactSettings.whatsappNumber}
                  onChange={(value) =>
                    setContactSettings({
                      ...contactSettings,
                      whatsappNumber: value,
                    })
                  }
                  placeholder="919999999999"
                />
                <TextField
                  label="Email Label"
                  value={contactSettings.emailLabel}
                  onChange={(value) =>
                    setContactSettings({
                      ...contactSettings,
                      emailLabel: value,
                    })
                  }
                />
                <TextField
                  label="Email"
                  required
                  value={contactSettings.email}
                  onChange={(value) =>
                    setContactSettings({ ...contactSettings, email: value })
                  }
                />
                <TextField
                  label="Address Label"
                  value={contactSettings.addressLabel}
                  onChange={(value) =>
                    setContactSettings({
                      ...contactSettings,
                      addressLabel: value,
                    })
                  }
                />
                <TextArea
                  label="Address"
                  required
                  value={contactSettings.address}
                  onChange={(value) =>
                    setContactSettings({ ...contactSettings, address: value })
                  }
                />
                <TextField
                  label="Instagram URL"
                  value={contactSettings.instagramUrl}
                  onChange={(value) =>
                    setContactSettings({
                      ...contactSettings,
                      instagramUrl: value,
                    })
                  }
                  placeholder="https://www.instagram.com/yourpage"
                />
                <TextField
                  label="Facebook URL"
                  value={contactSettings.facebookUrl}
                  onChange={(value) =>
                    setContactSettings({
                      ...contactSettings,
                      facebookUrl: value,
                    })
                  }
                  placeholder="https://www.facebook.com/yourpage"
                />
                <SubmitButton
                  loading={formLoading}
                  label="Save Direct Connect"
                />
              </form>
            </div>

            <div className="rounded-lg bg-charcoal border border-white/5 p-6 h-fit">
              <h2 className="text-xl font-bold tracking-wide mb-6">
                Contact Preview
              </h2>
              <div className="space-y-5">
                {[
                  {
                    label: contactSettings.phoneLabel,
                    value: contactSettings.phone,
                    href: contactSettings.phoneHref,
                  },
                  {
                    label: "WhatsApp",
                    value: contactSettings.whatsappNumber,
                    href: `https://wa.me/${contactSettings.whatsappNumber}`,
                  },
                  {
                    label: contactSettings.emailLabel,
                    value: contactSettings.email,
                    href: `mailto:${contactSettings.email}`,
                  },
                  {
                    label: contactSettings.addressLabel,
                    value: contactSettings.address,
                  },
                  ...(contactSettings.instagramUrl
                    ? [
                        {
                          label: "Instagram",
                          value: contactSettings.instagramUrl,
                          href: contactSettings.instagramUrl,
                        },
                      ]
                    : []),
                  ...(contactSettings.facebookUrl
                    ? [
                        {
                          label: "Facebook",
                          value: contactSettings.facebookUrl,
                          href: contactSettings.facebookUrl,
                        },
                      ]
                    : []),
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/5 bg-black/30 p-5"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gold">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-2 block text-base font-semibold text-white hover:text-gold"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed text-white/65">
                        {item.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
            <div
              ref={categoryFormRef}
              className="p-6 rounded-lg bg-charcoal border border-white/5 h-fit scroll-mt-32"
            >
              <FormHeader
                title={
                  editingCategoryId ? "Update Category" : "Create Category"
                }
                editing={!!editingCategoryId}
                onCancel={() => {
                  setCategoryForm(CATEGORY_FORM);
                  setEditingCategoryId(null);
                }}
              />
              <div className="space-y-3 mb-5">
                <Uploader
                  label="Cover Image"
                  accept="image/*"
                  loading={uploadingTarget === "categoryCover"}
                  onChange={(e) => handleFileUpload(e, "categoryCover")}
                />
              </div>
              <form onSubmit={saveCategory} className="space-y-4">
                <TextField
                  label="Name"
                  required
                  value={categoryForm.name}
                  onChange={(value) =>
                    setCategoryForm({ ...categoryForm, name: value })
                  }
                />
                <TextField
                  label="Slug"
                  value={categoryForm.slug}
                  onChange={(value) =>
                    setCategoryForm({ ...categoryForm, slug: value })
                  }
                  placeholder="Auto from name if blank"
                />
                <TextArea
                  label="Description"
                  value={categoryForm.description}
                  onChange={(value) =>
                    setCategoryForm({ ...categoryForm, description: value })
                  }
                />
                <TextField
                  label="Cover Image URL"
                  value={categoryForm.coverImage}
                  onChange={(value) =>
                    setCategoryForm({ ...categoryForm, coverImage: value })
                  }
                />
                <NumberField
                  label="Sort Order"
                  value={categoryForm.sortOrder}
                  onChange={(value) =>
                    setCategoryForm({ ...categoryForm, sortOrder: value })
                  }
                />
                <Checkbox
                  label="Active"
                  checked={categoryForm.isActive}
                  onChange={(checked) =>
                    setCategoryForm({ ...categoryForm, isActive: checked })
                  }
                />
                <SubmitButton
                  loading={formLoading}
                  label={
                    editingCategoryId ? "Update Category" : "Create Category"
                  }
                />
              </form>
            </div>
            <ItemGrid
              emptyText="No categories yet."
              items={categories}
              render={(item) => (
                <ContentCard
                  key={item._id}
                  image={item.coverImage}
                  badge={item.isActive ? "Active" : "Hidden"}
                  eyebrow={`/${item.slug}`}
                  title={item.name}
                  subtitle={item.description || "No description added."}
                  onEdit={() => editCategory(item)}
                  onDelete={() =>
                    deleteItem(
                      "/api/categories",
                      item._id,
                      async () => {
                        await Promise.all([
                          fetchCategories(),
                          fetchSubcategories(),
                          fetchGalleryItems(),
                        ]);
                      },
                      "Delete this category? Its subcategories will also be deleted.",
                    )
                  }
                />
              )}
            />
          </div>
        )}

        {activeTab === "subcategories" && (
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
            <div
              ref={subcategoryFormRef}
              className="p-6 rounded-lg bg-charcoal border border-white/5 h-fit scroll-mt-32"
            >
              <FormHeader
                title={
                  editingSubcategoryId
                    ? "Update Subcategory"
                    : "Create Subcategory"
                }
                editing={!!editingSubcategoryId}
                onCancel={() => {
                  setSubcategoryForm({
                    ...SUBCATEGORY_FORM,
                    categoryId: activeCategories[0]?._id || "",
                  });
                  setEditingSubcategoryId(null);
                }}
              />
              <div className="mb-5">
                <Uploader
                  label="Cover Image"
                  accept="image/*"
                  loading={uploadingTarget === "subcategoryCover"}
                  onChange={(e) => handleFileUpload(e, "subcategoryCover")}
                />
              </div>
              <form onSubmit={saveSubcategory} className="space-y-4">
                <SelectField
                  label="Parent Category"
                  required
                  value={subcategoryForm.categoryId}
                  onChange={(value) =>
                    setSubcategoryForm({
                      ...subcategoryForm,
                      categoryId: value,
                    })
                  }
                  options={activeCategories.map((item) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                />
                <TextField
                  label="Name"
                  required
                  value={subcategoryForm.name}
                  onChange={(value) =>
                    setSubcategoryForm({ ...subcategoryForm, name: value })
                  }
                />
                <TextField
                  label="Slug"
                  value={subcategoryForm.slug}
                  onChange={(value) =>
                    setSubcategoryForm({ ...subcategoryForm, slug: value })
                  }
                  placeholder="Auto from name if blank"
                />
                <TextArea
                  label="Description"
                  value={subcategoryForm.description}
                  onChange={(value) =>
                    setSubcategoryForm({
                      ...subcategoryForm,
                      description: value,
                    })
                  }
                />
                <TextField
                  label="Cover Image URL"
                  value={subcategoryForm.coverImage}
                  onChange={(value) =>
                    setSubcategoryForm({
                      ...subcategoryForm,
                      coverImage: value,
                    })
                  }
                />
                <NumberField
                  label="Sort Order"
                  value={subcategoryForm.sortOrder}
                  onChange={(value) =>
                    setSubcategoryForm({ ...subcategoryForm, sortOrder: value })
                  }
                />
                <Checkbox
                  label="Active"
                  checked={subcategoryForm.isActive}
                  onChange={(checked) =>
                    setSubcategoryForm({
                      ...subcategoryForm,
                      isActive: checked,
                    })
                  }
                />
                <SubmitButton
                  loading={formLoading}
                  label={
                    editingSubcategoryId
                      ? "Update Subcategory"
                      : "Create Subcategory"
                  }
                />
              </form>
            </div>
            <ItemGrid
              emptyText="No subcategories yet."
              items={subcategories}
              render={(item) => (
                <ContentCard
                  key={item._id}
                  image={item.coverImage}
                  badge={item.isActive ? "Active" : "Hidden"}
                  eyebrow={`${typeof item.categoryId === "string" ? "Category" : item.categoryId.name} / ${item.slug}`}
                  title={item.name}
                  subtitle={item.description || "No description added."}
                  onEdit={() => editSubcategory(item)}
                  onDelete={() =>
                    deleteItem(
                      "/api/subcategories",
                      item._id,
                      fetchSubcategories,
                      "Delete this subcategory?",
                    )
                  }
                />
              )}
            />
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-8">
            <div
              ref={galleryFormRef}
              className="p-6 rounded-lg bg-charcoal border border-white/5 h-fit scroll-mt-32"
            >
              <FormHeader
                title={editingGalleryId ? "Update Media" : "Publish Media"}
                editing={!!editingGalleryId}
                onCancel={() => {
                  setGalleryForm({
                    ...GALLERY_FORM,
                    categoryId: activeCategories[0]?._id || "",
                  });
                  setEditingGalleryId(null);
                }}
              />
              <div className="mb-5">
                <Uploader
                  label="Upload Photo / Video"
                  accept="image/*,video/*"
                  loading={uploadingTarget === "gallery"}
                  onChange={(e) => handleFileUpload(e, "gallery")}
                />
              </div>
              <form onSubmit={saveGallery} className="space-y-4">
                <TextField
                  label="Title"
                  required
                  value={galleryForm.title}
                  onChange={(value) =>
                    setGalleryForm({ ...galleryForm, title: value })
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField
                    label="Category"
                    required
                    value={galleryForm.categoryId}
                    onChange={(value) =>
                      setGalleryForm({
                        ...galleryForm,
                        categoryId: value,
                        subcategoryId: "",
                      })
                    }
                    options={activeCategories.map((item) => ({
                      value: item._id,
                      label: item.name,
                    }))}
                  />
                  <SelectField
                    label="Subcategory"
                    value={galleryForm.subcategoryId}
                    onChange={(value) =>
                      setGalleryForm({ ...galleryForm, subcategoryId: value })
                    }
                    options={[
                      { value: "", label: "No subcategory" },
                      ...filteredSubcategories.map((item) => ({
                        value: item._id,
                        label: item.name,
                      })),
                    ]}
                  />
                </div>
                <TextArea
                  label="Description"
                  value={galleryForm.description}
                  onChange={(value) =>
                    setGalleryForm({ ...galleryForm, description: value })
                  }
                />
                <TextField
                  label="SEO Alt Text"
                  value={galleryForm.altText}
                  onChange={(value) =>
                    setGalleryForm({ ...galleryForm, altText: value })
                  }
                  placeholder="Cold pyro couple entry in Indore wedding by SKY SFX"
                />
                <TextArea
                  label="Caption"
                  value={galleryForm.caption}
                  onChange={(value) =>
                    setGalleryForm({ ...galleryForm, caption: value })
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <TextField
                    label="City"
                    value={galleryForm.city}
                    onChange={(value) =>
                      setGalleryForm({ ...galleryForm, city: value })
                    }
                    placeholder="Indore"
                  />
                  <TextField
                    label="Service Slug"
                    value={galleryForm.serviceSlug}
                    onChange={(value) =>
                      setGalleryForm({ ...galleryForm, serviceSlug: value })
                    }
                    placeholder="cold-pyro-entry"
                  />
                  <TextField
                    label="Video Duration"
                    value={galleryForm.duration}
                    onChange={(value) =>
                      setGalleryForm({ ...galleryForm, duration: value })
                    }
                    placeholder="PT30S"
                  />
                </div>
                <SelectField
                  label="Media Type"
                  value={galleryForm.mediaType}
                  onChange={(value) =>
                    setGalleryForm({
                      ...galleryForm,
                      mediaType: value as "image" | "video",
                      isReel: value === "video" ? galleryForm.isReel : false,
                    })
                  }
                  options={[
                    { value: "image", label: "Image" },
                    { value: "video", label: "Video" },
                  ]}
                />
                <TextField
                  label="Media URL"
                  required
                  value={galleryForm.cloudinaryUrl}
                  onChange={(value) =>
                    setGalleryForm({ ...galleryForm, cloudinaryUrl: value })
                  }
                />
                <TextField
                  label="Thumbnail URL"
                  value={galleryForm.thumbnail}
                  onChange={(value) =>
                    setGalleryForm({ ...galleryForm, thumbnail: value })
                  }
                />
                <NumberField
                  label="Sort Order"
                  value={galleryForm.sortOrder}
                  onChange={(value) =>
                    setGalleryForm({ ...galleryForm, sortOrder: value })
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Checkbox
                    label="Featured gallery"
                    checked={galleryForm.featured}
                    onChange={(checked) =>
                      setGalleryForm({ ...galleryForm, featured: checked })
                    }
                  />
                  <Checkbox
                    label="Show on home"
                    checked={galleryForm.showOnHome}
                    onChange={(checked) =>
                      setGalleryForm({ ...galleryForm, showOnHome: checked })
                    }
                  />
                  <Checkbox
                    label="Use as reel"
                    checked={galleryForm.isReel}
                    disabled={galleryForm.mediaType !== "video"}
                    onChange={(checked) =>
                      setGalleryForm({ ...galleryForm, isReel: checked })
                    }
                  />
                  <Checkbox
                    label="Active"
                    checked={galleryForm.isActive}
                    onChange={(checked) =>
                      setGalleryForm({ ...galleryForm, isActive: checked })
                    }
                  />
                </div>
                <SubmitButton
                  loading={formLoading}
                  label={editingGalleryId ? "Update Media" : "Publish Media"}
                />
              </form>
            </div>
            <ItemGrid
              emptyText="No media uploaded yet."
              items={galleryItems}
              render={(item) => (
                <ContentCard
                  key={item._id}
                  image={
                    item.mediaType === "video"
                      ? item.thumbnail || item.cloudinaryUrl
                      : item.cloudinaryUrl
                  }
                  badge={`${item.mediaType}${item.isReel ? " / reel" : ""}`}
                  eyebrow={`${item.category}${item.subcategory ? ` / ${item.subcategory}` : ""}`}
                  title={item.title}
                  subtitle={`${item.featured ? "Featured. " : ""}${item.showOnHome ? "Home. " : ""}${item.isActive ? "Active." : "Hidden."}`}
                  onEdit={() => editGallery(item)}
                  onDelete={() =>
                    deleteItem(
                      "/api/gallery",
                      item._id,
                      fetchGalleryItems,
                      "Delete this media item?",
                    )
                  }
                />
              )}
            />
          </div>
        )}

        {activeTab === "events" && (
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
            <div
              ref={eventFormRef}
              className="p-6 rounded-lg bg-charcoal border border-white/5 h-fit scroll-mt-32"
            >
              <FormHeader
                title={
                  editingEventId
                    ? "Update Event Case-study"
                    : "Create Event Case-study"
                }
                editing={!!editingEventId}
                onCancel={() => {
                  setEventForm(EVENT_FORM);
                  setEditingEventId(null);
                }}
              />
              <div className="mb-5">
                <Uploader
                  label="Upload Event Cover"
                  accept="image/*"
                  loading={uploadingTarget === "event"}
                  onChange={(e) => handleFileUpload(e, "event")}
                />
              </div>
              <form onSubmit={saveEvent} className="space-y-4">
                <TextField
                  label="Title"
                  required
                  value={eventForm.title}
                  onChange={(value) =>
                    setEventForm({ ...eventForm, title: value })
                  }
                />
                <SelectField
                  label="Category"
                  value={selectedEventCategory}
                  onChange={(value) =>
                    setEventForm({
                      ...eventForm,
                      category: value,
                      subcategory: "",
                      categoryId: "",
                      subcategoryId: "",
                    })
                  }
                  options={eventCategoryOptions.map((value) => ({
                    value,
                    label: value,
                  }))}
                />
                {(eventSubcategoryOptions.length > 0 ||
                  eventForm.subcategory) && (
                  <SelectField
                    label="Subcategory"
                    value={eventForm.subcategoryId}
                    onChange={(value) => {
                      const selectedSubcategory =
                        eventFilteredSubcategories.find(
                          (item) => item._id === value,
                        );
                      setEventForm({
                        ...eventForm,
                        subcategoryId: value,
                        subcategory: selectedSubcategory?.name || "",
                      });
                    }}
                    options={[
                      { value: "", label: "No subcategory" },
                      ...eventSubcategoryOptions,
                    ]}
                  />
                )}
                <TextField
                  label="Main Cover Media URL"
                  value={eventForm.mediaUrl}
                  onChange={(value) =>
                    setEventForm({ ...eventForm, mediaUrl: value })
                  }
                />
                <TextArea
                  label="Description"
                  required
                  value={eventForm.description}
                  onChange={(value) =>
                    setEventForm({ ...eventForm, description: value })
                  }
                />
                <SubmitButton
                  loading={formLoading}
                  label={
                    editingEventId ? "Update Case-study" : "Publish Case-study"
                  }
                />
              </form>
            </div>
            <ItemGrid
              emptyText="No event case-studies yet."
              items={eventItems}
              render={(item) => (
                <ContentCard
                  key={item._id}
                  image={item.mediaUrls?.[0]}
                  badge={
                    item.subcategory
                      ? `${item.category} / ${item.subcategory}`
                      : item.category
                  }
                  eyebrow={new Date(item.createdAt).toLocaleDateString()}
                  title={item.title}
                  subtitle={item.description}
                  onEdit={() => editEvent(item)}
                  onDelete={() =>
                    deleteItem(
                      "/api/events",
                      item._id,
                      fetchEventItems,
                      "Delete this event case-study?",
                    )
                  }
                />
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function FormHeader({
  title,
  editing,
  onCancel,
}: {
  title: string;
  editing: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-6">
      <h2 className="text-xl font-bold tracking-wide">{title}</h2>
      {editing && (
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:text-white text-xs font-semibold transition-colors clickable"
        >
          <XCircle className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      )}
    </div>
  );
}

function Uploader({
  label,
  accept,
  loading,
  onChange,
}: {
  label: string;
  accept: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="p-4 rounded-lg border border-gold/10 bg-black/30">
      <span className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-2 mb-3">
        <Upload className="w-4 h-4" />
        {label}
      </span>
      <input
        type="file"
        accept={accept}
        disabled={loading}
        onChange={onChange}
        className="w-full text-xs text-white/60 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black hover:file:bg-gold-hover file:cursor-pointer bg-black/40 border border-white/10 rounded-lg p-2 clickable"
      />
      {loading && (
        <span className="text-xs text-gold animate-pulse flex items-center gap-2 mt-3">
          <Loader2 className="w-3 h-3 animate-spin" />
          Uploading to Cloudinary...
        </span>
      )}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-white/70 uppercase">
        {label}
      </label>
      <input
        type="text"
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 rounded-lg outline-none text-white text-sm"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-white/70 uppercase">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 rounded-lg outline-none text-white text-sm"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-white/70 uppercase">
        {label}
      </label>
      <textarea
        rows={4}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 rounded-lg outline-none text-white text-sm resize-none"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-white/70 uppercase">
        {label}
      </label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg outline-none text-white text-sm"
      >
        {options.map((option) => (
          <option key={option.value || "blank"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-2 text-sm font-semibold text-white/80 ${disabled ? "opacity-40" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded accent-gold"
      />
      {label}
    </label>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-4 bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 clickable disabled:opacity-60"
    >
      {loading ? "Saving..." : label}
      <Send className="w-4 h-4" />
    </button>
  );
}

function ItemGrid<T>({
  items,
  render,
  emptyText,
}: {
  items: T[];
  render: (item: T) => React.ReactNode;
  emptyText: string;
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-charcoal rounded-lg border border-white/5 h-fit">
        <p className="text-white/40 text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {items.map(render)}
    </div>
  );
}

function ContentCard({
  image,
  badge,
  eyebrow,
  title,
  subtitle,
  onEdit,
  onDelete,
}: {
  image?: string;
  badge: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg bg-charcoal border border-white/5 overflow-hidden">
      <div className="relative aspect-video bg-black">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/25 text-xs">
            No visual
          </div>
        )}
        <span className="absolute top-3 left-3 bg-black/80 border border-gold/20 text-gold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
          {badge}
        </span>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <p className="text-[10px] text-gold uppercase tracking-widest font-bold line-clamp-1">
            {eyebrow}
          </p>
          <h3 className="text-white font-bold mt-1 line-clamp-2">{title}</h3>
          <p className="text-white/50 text-xs leading-relaxed mt-2 line-clamp-3">
            {subtitle}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/80 hover:text-gold hover:border-gold/30 text-xs font-semibold transition-colors clickable"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/25 rounded-lg text-red-300 hover:text-red-200 hover:bg-red-500/20 text-xs font-semibold transition-colors clickable"
          >
            <Trash className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
