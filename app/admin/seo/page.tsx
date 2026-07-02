"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Database, Loader2, Pencil, Send, Trash, Upload, XCircle } from "lucide-react";
import axios from "axios";
import { uploadToCloudinary } from "@/lib/cloudinary-client";
import VideoWithLoader from "@/components/VideoWithLoader";

type SeoServiceItem = {
  _id: string;
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  heroImage: string;
  videoUrl?: string;
  intro: string;
  highlights: string[];
  process: string[];
  faqs: Array<{ question: string; answer: string }>;
  sortOrder: number;
  isActive: boolean;
};

type SeoLocationItem = {
  _id: string;
  slug: string;
  city: string;
  region: string;
  state: string;
  serviceAreas: string[];
  intro: string;
  videoUrl?: string;
  sortOrder: number;
  isActive: boolean;
};

const SERVICE_FORM = {
  slug: "",
  title: "",
  shortTitle: "",
  metaTitle: "",
  metaDescription: "",
  keywordsText: "",
  category: "",
  heroImage: "",
  videoUrl: "",
  intro: "",
  highlightsText: "",
  processText: "",
  faqsText: "",
  sortOrder: 0,
  isActive: true,
};

const LOCATION_FORM = {
  slug: "",
  city: "",
  region: "",
  state: "",
  serviceAreasText: "",
  intro: "",
  videoUrl: "",
  sortOrder: 0,
  isActive: true,
};

const splitLines = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);

const faqsFromText = (value: string) =>
  value
    .split("\n")
    .map((line) => {
      const [question, ...answerParts] = line.split("|");
      return { question: question?.trim() || "", answer: answerParts.join("|").trim() };
    })
    .filter((item) => item.question && item.answer);

const faqsToText = (faqs: Array<{ question: string; answer: string }>) =>
  faqs.map((faq) => `${faq.question} | ${faq.answer}`).join("\n");

const getRequestErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as { message?: string } | undefined;
    return responseData?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
};

export default function AdminSeoPage() {
  const router = useRouter();
  const [token] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("admin_token");
  });
  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [activeTab, setActiveTab] = useState<"services" | "locations">("services");
  const [services, setServices] = useState<SeoServiceItem[]>([]);
  const [locations, setLocations] = useState<SeoLocationItem[]>([]);
  const [serviceForm, setServiceForm] = useState(SERVICE_FORM);
  const [locationForm, setLocationForm] = useState(LOCATION_FORM);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<"serviceHero" | "serviceVideo" | "locationVideo" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [servicesRes, locationsRes] = await Promise.all([
        axios.get("/api/seo-services?includeInactive=true"),
        axios.get("/api/seo-locations?includeInactive=true"),
      ]);
      if (servicesRes.data.success) setServices(servicesRes.data.data);
      if (locationsRes.data.success) setLocations(locationsRes.data.data);
    } catch {
      setError("SEO CMS data load nahi ho paaya.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/admin");
      return;
    }
    const timer = window.setTimeout(() => void fetchData(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchData, router, token]);

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const seedDefaults = async () => {
    setSaving(true);
    clearFeedback();
    try {
      const res = await axios.post("/api/seo-seed", {}, { headers: authHeaders });
      if (res.data.success) {
        setMessage("Default SEO services and locations seeded.");
        await fetchData();
      }
    } catch (err) {
      setError(getRequestErrorMessage(err, "Seed failed."));
    } finally {
      setSaving(false);
    }
  };

  const uploadSeoFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "serviceHero" | "serviceVideo" | "locationVideo",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTarget(target);
    clearFeedback();

    try {
      const uploaded = await uploadToCloudinary(file, {
        onRetry: (attempt) => setMessage(`Upload slow/fail hua, retry ${attempt}/3 chal raha hai...`),
      });
      if (target === "serviceHero") {
        setServiceForm((prev) => ({ ...prev, heroImage: uploaded.url }));
      }
      if (target === "serviceVideo") {
        setServiceForm((prev) => ({ ...prev, videoUrl: uploaded.url }));
      }
      if (target === "locationVideo") {
        setLocationForm((prev) => ({ ...prev, videoUrl: uploaded.url }));
      }
      setMessage("File uploaded to Cloudinary.");
    } catch (err) {
      setError(getRequestErrorMessage(err, "File upload failed."));
    } finally {
      setUploadingTarget(null);
      e.target.value = "";
    }
  };

  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    clearFeedback();
    const payload = {
      id: editingServiceId || undefined,
      ...serviceForm,
      keywords: splitLines(serviceForm.keywordsText),
      highlights: splitLines(serviceForm.highlightsText),
      process: splitLines(serviceForm.processText),
      faqs: faqsFromText(serviceForm.faqsText),
    };

    try {
      const res = editingServiceId
        ? await axios.put("/api/seo-services", payload, { headers: authHeaders })
        : await axios.post("/api/seo-services", payload, { headers: authHeaders });
      if (res.data.success) {
        setMessage(editingServiceId ? "SEO service updated." : "SEO service created.");
        setServiceForm(SERVICE_FORM);
        setEditingServiceId(null);
        await fetchData();
      }
    } catch (err) {
      setError(getRequestErrorMessage(err, "SEO service save failed."));
    } finally {
      setSaving(false);
    }
  };

  const saveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    clearFeedback();
    const payload = {
      id: editingLocationId || undefined,
      ...locationForm,
      serviceAreas: splitLines(locationForm.serviceAreasText),
    };

    try {
      const res = editingLocationId
        ? await axios.put("/api/seo-locations", payload, { headers: authHeaders })
        : await axios.post("/api/seo-locations", payload, { headers: authHeaders });
      if (res.data.success) {
        setMessage(editingLocationId ? "SEO location updated." : "SEO location created.");
        setLocationForm(LOCATION_FORM);
        setEditingLocationId(null);
        await fetchData();
      }
    } catch (err) {
      setError(getRequestErrorMessage(err, "SEO location save failed."));
    } finally {
      setSaving(false);
    }
  };

  const editService = (service: SeoServiceItem) => {
    setServiceForm({
      slug: service.slug,
      title: service.title,
      shortTitle: service.shortTitle,
      metaTitle: service.metaTitle,
      metaDescription: service.metaDescription,
      keywordsText: service.keywords.join("\n"),
      category: service.category,
      heroImage: service.heroImage,
      videoUrl: service.videoUrl || "",
      intro: service.intro,
      highlightsText: service.highlights.join("\n"),
      processText: service.process.join("\n"),
      faqsText: faqsToText(service.faqs),
      sortOrder: service.sortOrder || 0,
      isActive: service.isActive !== false,
    });
    setEditingServiceId(service._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editLocation = (location: SeoLocationItem) => {
    setLocationForm({
      slug: location.slug,
      city: location.city,
      region: location.region,
      state: location.state,
      serviceAreasText: location.serviceAreas.join("\n"),
      intro: location.intro,
      videoUrl: location.videoUrl || "",
      sortOrder: location.sortOrder || 0,
      isActive: location.isActive !== false,
    });
    setEditingLocationId(location._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteItem = async (endpoint: string, id: string) => {
    if (!window.confirm("Delete this SEO item?")) return;
    clearFeedback();
    try {
      const res = await axios.delete(`${endpoint}?id=${id}`, { headers: authHeaders });
      if (res.data.success) {
        setMessage("Deleted successfully.");
        await fetchData();
      }
    } catch (err) {
      setError(getRequestErrorMessage(err, "Delete failed."));
    }
  };

  if (!token) {
    return <div className="bg-black text-white min-h-screen flex items-center justify-center">Authenticating...</div>;
  }

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
          <div>
            <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-3">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-gold gold-glow-text">SEO CMS</h1>
            <p className="text-white/50 text-sm mt-1">Manage service pages and city pages without editing code.</p>
          </div>
          <button
            onClick={seedDefaults}
            disabled={saving}
            className="px-5 py-3 bg-gold text-black rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 clickable disabled:opacity-60"
          >
            <Database className="w-4 h-4" />
            Seed Defaults
          </button>
        </div>

        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab("services")}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider clickable ${activeTab === "services" ? "bg-gold text-black" : "bg-charcoal text-white/70"}`}
          >
            SEO Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab("locations")}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider clickable ${activeTab === "locations" ? "bg-gold text-black" : "bg-charcoal text-white/70"}`}
          >
            SEO Locations ({locations.length})
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-3">
            <Check className="w-5 h-5" />
            {message}
          </div>
        )}
        {error && <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
        {loading && (
          <div className="mb-6 flex items-center gap-2 text-gold text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading SEO CMS...
          </div>
        )}

        {activeTab === "services" ? (
          <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-8">
            <div className="p-6 rounded-lg bg-charcoal border border-white/5 h-fit">
              <FormHeader
                title={editingServiceId ? "Update SEO Service" : "Create SEO Service"}
                editing={!!editingServiceId}
                onCancel={() => {
                  setServiceForm(SERVICE_FORM);
                  setEditingServiceId(null);
                }}
              />
              <form onSubmit={saveService} className="space-y-4">
                <TextField label="Title" required value={serviceForm.title} onChange={(value) => setServiceForm({ ...serviceForm, title: value })} />
                <TextField label="Short Title" required value={serviceForm.shortTitle} onChange={(value) => setServiceForm({ ...serviceForm, shortTitle: value })} />
                <TextField label="Slug" value={serviceForm.slug} onChange={(value) => setServiceForm({ ...serviceForm, slug: value })} placeholder="auto from short title" />
                <TextField label="Category" required value={serviceForm.category} onChange={(value) => setServiceForm({ ...serviceForm, category: value })} />
                <TextField label="Meta Title" required value={serviceForm.metaTitle} onChange={(value) => setServiceForm({ ...serviceForm, metaTitle: value })} />
                <TextArea label="Meta Description" required value={serviceForm.metaDescription} onChange={(value) => setServiceForm({ ...serviceForm, metaDescription: value })} />
                <div className="p-4 rounded-lg border border-gold/10 bg-black/30">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Upload className="w-4 h-4" />
                    Upload Hero Image to Cloudinary
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingTarget === "serviceHero"}
                    onChange={(e) => uploadSeoFile(e, "serviceHero")}
                    className="w-full text-xs text-white/60 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black hover:file:bg-gold-hover file:cursor-pointer bg-black/40 border border-white/10 rounded-lg p-2 clickable"
                  />
                  {uploadingTarget === "serviceHero" && (
                    <span className="text-xs text-gold animate-pulse flex items-center gap-2 mt-3">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Uploading hero image...
                    </span>
                  )}
                </div>
                <TextField label="Hero Image URL" required value={serviceForm.heroImage} onChange={(value) => setServiceForm({ ...serviceForm, heroImage: value })} />
                {serviceForm.heroImage && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black">
                    <img src={serviceForm.heroImage} alt="SEO service hero preview" className="w-full h-full object-cover opacity-80" />
                  </div>
                )}
                <div className="p-4 rounded-lg border border-gold/10 bg-black/30">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Upload className="w-4 h-4" />
                    Upload Service Video to Cloudinary
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    disabled={uploadingTarget === "serviceVideo"}
                    onChange={(e) => uploadSeoFile(e, "serviceVideo")}
                    className="w-full text-xs text-white/60 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black hover:file:bg-gold-hover file:cursor-pointer bg-black/40 border border-white/10 rounded-lg p-2 clickable"
                  />
                  {uploadingTarget === "serviceVideo" && (
                    <span className="text-xs text-gold animate-pulse flex items-center gap-2 mt-3">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Uploading service video...
                    </span>
                  )}
                </div>
                <TextField label="Service Video URL" value={serviceForm.videoUrl} onChange={(value) => setServiceForm({ ...serviceForm, videoUrl: value })} />
                {serviceForm.videoUrl && (
                  <VideoWithLoader
                    src={serviceForm.videoUrl}
                    controls
                    preload="metadata"
                    wrapperClassName="relative overflow-hidden rounded-lg border border-white/10 bg-black"
                    className="w-full"
                  />
                )}
                <TextArea label="Intro" required value={serviceForm.intro} onChange={(value) => setServiceForm({ ...serviceForm, intro: value })} />
                <TextArea label="Keywords (one per line)" value={serviceForm.keywordsText} onChange={(value) => setServiceForm({ ...serviceForm, keywordsText: value })} />
                <TextArea label="Highlights (one per line)" value={serviceForm.highlightsText} onChange={(value) => setServiceForm({ ...serviceForm, highlightsText: value })} />
                <TextArea label="Process Steps (one per line)" value={serviceForm.processText} onChange={(value) => setServiceForm({ ...serviceForm, processText: value })} />
                <TextArea label="FAQs (Question | Answer per line)" value={serviceForm.faqsText} onChange={(value) => setServiceForm({ ...serviceForm, faqsText: value })} />
                <NumberField label="Sort Order" value={serviceForm.sortOrder} onChange={(value) => setServiceForm({ ...serviceForm, sortOrder: value })} />
                <Checkbox label="Active" checked={serviceForm.isActive} onChange={(checked) => setServiceForm({ ...serviceForm, isActive: checked })} />
                <SubmitButton loading={saving} label={editingServiceId ? "Update Service" : "Create Service"} />
              </form>
            </div>
            <ItemList
              items={services}
              emptyText="No SEO services in DB yet. Use Seed Defaults."
              render={(service) => (
                <SeoCard
                  key={service._id}
                  badge={service.isActive ? "Active" : "Hidden"}
                  title={service.shortTitle}
                  subtitle={`/services/${service.slug}`}
                  description={service.metaDescription}
                  onEdit={() => editService(service)}
                  onDelete={() => deleteItem("/api/seo-services", service._id)}
                />
              )}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-8">
            <div className="p-6 rounded-lg bg-charcoal border border-white/5 h-fit">
              <FormHeader
                title={editingLocationId ? "Update SEO Location" : "Create SEO Location"}
                editing={!!editingLocationId}
                onCancel={() => {
                  setLocationForm(LOCATION_FORM);
                  setEditingLocationId(null);
                }}
              />
              <form onSubmit={saveLocation} className="space-y-4">
                <TextField label="City" required value={locationForm.city} onChange={(value) => setLocationForm({ ...locationForm, city: value })} />
                <TextField label="Slug" value={locationForm.slug} onChange={(value) => setLocationForm({ ...locationForm, slug: value })} placeholder="auto from city" />
                <TextField label="Region" required value={locationForm.region} onChange={(value) => setLocationForm({ ...locationForm, region: value })} placeholder="Indore, Madhya Pradesh" />
                <TextField label="State" required value={locationForm.state} onChange={(value) => setLocationForm({ ...locationForm, state: value })} />
                <TextArea label="Service Areas (one per line)" value={locationForm.serviceAreasText} onChange={(value) => setLocationForm({ ...locationForm, serviceAreasText: value })} />
                <TextArea label="Local Intro" required value={locationForm.intro} onChange={(value) => setLocationForm({ ...locationForm, intro: value })} />
                <div className="p-4 rounded-lg border border-gold/10 bg-black/30">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Upload className="w-4 h-4" />
                    Upload Location Video to Cloudinary
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    disabled={uploadingTarget === "locationVideo"}
                    onChange={(e) => uploadSeoFile(e, "locationVideo")}
                    className="w-full text-xs text-white/60 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black hover:file:bg-gold-hover file:cursor-pointer bg-black/40 border border-white/10 rounded-lg p-2 clickable"
                  />
                  {uploadingTarget === "locationVideo" && (
                    <span className="text-xs text-gold animate-pulse flex items-center gap-2 mt-3">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Uploading location video...
                    </span>
                  )}
                </div>
                <TextField label="Location Video URL" value={locationForm.videoUrl} onChange={(value) => setLocationForm({ ...locationForm, videoUrl: value })} />
                {locationForm.videoUrl && (
                  <VideoWithLoader
                    src={locationForm.videoUrl}
                    controls
                    preload="metadata"
                    wrapperClassName="relative overflow-hidden rounded-lg border border-white/10 bg-black"
                    className="w-full"
                  />
                )}
                <NumberField label="Sort Order" value={locationForm.sortOrder} onChange={(value) => setLocationForm({ ...locationForm, sortOrder: value })} />
                <Checkbox label="Active" checked={locationForm.isActive} onChange={(checked) => setLocationForm({ ...locationForm, isActive: checked })} />
                <SubmitButton loading={saving} label={editingLocationId ? "Update Location" : "Create Location"} />
              </form>
            </div>
            <ItemList
              items={locations}
              emptyText="No SEO locations in DB yet. Use Seed Defaults."
              render={(location) => (
                <SeoCard
                  key={location._id}
                  badge={location.isActive ? "Active" : "Hidden"}
                  title={location.city}
                  subtitle={`${location.region} / ${location.slug}`}
                  description={location.intro}
                  onEdit={() => editLocation(location)}
                  onDelete={() => deleteItem("/api/seo-locations", location._id)}
                />
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function FormHeader({ title, editing, onCancel }: { title: string; editing: boolean; onCancel: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-6">
      <h2 className="text-xl font-bold tracking-wide">{title}</h2>
      {editing && (
        <button type="button" onClick={onCancel} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:text-white text-xs font-semibold clickable">
          <XCircle className="w-4 h-4" />
          Cancel
        </button>
      )}
    </div>
  );
}

function TextField({ label, value, onChange, required, placeholder }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-white/70 uppercase">{label}</label>
      <input required={required} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 rounded-lg outline-none text-white text-sm" />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-white/70 uppercase">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 rounded-lg outline-none text-white text-sm" />
    </div>
  );
}

function TextArea({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-white/70 uppercase">{label}</label>
      <textarea rows={4} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 rounded-lg outline-none text-white text-sm resize-y" />
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-white/80 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 rounded accent-gold" />
      {label}
    </label>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} className="w-full py-4 bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-2 clickable disabled:opacity-60">
      {loading ? "Saving..." : label}
      <Send className="w-4 h-4" />
    </button>
  );
}

function ItemList<T>({ items, render, emptyText }: { items: T[]; render: (item: T) => React.ReactNode; emptyText: string }) {
  if (items.length === 0) {
    return <div className="p-10 text-center bg-charcoal border border-white/5 rounded-lg text-white/40 text-sm h-fit">{emptyText}</div>;
  }
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{items.map(render)}</div>;
}

function SeoCard({ badge, title, subtitle, description, onEdit, onDelete }: { badge: string; title: string; subtitle: string; description: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="rounded-lg bg-charcoal border border-white/5 p-5 space-y-4">
      <div>
        <span className="inline-flex bg-gold/10 border border-gold/20 text-gold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold mb-3">{badge}</span>
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <p className="text-gold text-xs mt-1">{subtitle}</p>
        <p className="text-white/50 text-xs leading-6 mt-3 line-clamp-3">{description}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onEdit} className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/80 hover:text-gold text-xs font-semibold clickable">
          <Pencil className="w-4 h-4" />
          Edit
        </button>
        <button type="button" onClick={onDelete} className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/25 rounded-lg text-red-300 text-xs font-semibold clickable">
          <Trash className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
