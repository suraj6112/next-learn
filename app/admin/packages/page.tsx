"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Database, Loader2, Pencil, Send, Trash, Upload, XCircle } from "lucide-react";
import axios from "axios";
import { uploadToCloudinary } from "@/lib/cloudinary-client";

type PackageItem = {
  _id: string;
  name: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  coverImage: string;
  shortDescription: string;
  description: string;
  relatedServiceSlug?: string;
  relatedLocationSlug?: string;
  startingPrice?: string;
  idealFor: string[];
  inclusions: string[];
  faqs: Array<{ question: string; answer: string }>;
  isFeatured: boolean;
  sortOrder: number;
  isActive: boolean;
};

const PACKAGE_FORM = {
  name: "",
  slug: "",
  metaTitle: "",
  metaDescription: "",
  keywordsText: "",
  coverImage: "",
  shortDescription: "",
  description: "",
  relatedServiceSlug: "",
  relatedLocationSlug: "",
  startingPrice: "",
  idealForText: "",
  inclusionsText: "",
  faqsText: "",
  isFeatured: false,
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
  return fallback;
};

export default function AdminPackagesPage() {
  const router = useRouter();
  const [token] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("admin_token");
  });
  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [form, setForm] = useState(PACKAGE_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/packages?includeInactive=true");
      if (res.data.success) setPackages(res.data.data);
    } catch {
      setError("Packages load nahi ho paaye.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/admin");
      return;
    }
    const timer = window.setTimeout(() => void fetchPackages(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchPackages, router, token]);

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const seedDefaults = async () => {
    setSaving(true);
    clearFeedback();
    try {
      const res = await axios.post("/api/package-seed", {}, { headers: authHeaders });
      if (res.data.success) {
        setMessage("Default packages seeded.");
        await fetchPackages();
      }
    } catch (err) {
      setError(getRequestErrorMessage(err, "Package seed failed."));
    } finally {
      setSaving(false);
    }
  };

  const uploadCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    clearFeedback();

    try {
      const uploaded = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, coverImage: uploaded.url }));
      setMessage("Cover image uploaded to Cloudinary.");
    } catch (err) {
      setError(getRequestErrorMessage(err, "Cover image upload failed."));
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  };

  const savePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    clearFeedback();
    const payload = {
      id: editingId || undefined,
      ...form,
      keywords: splitLines(form.keywordsText),
      idealFor: splitLines(form.idealForText),
      inclusions: splitLines(form.inclusionsText),
      faqs: faqsFromText(form.faqsText),
    };

    try {
      const res = editingId
        ? await axios.put("/api/packages", payload, { headers: authHeaders })
        : await axios.post("/api/packages", payload, { headers: authHeaders });
      if (res.data.success) {
        setMessage(editingId ? "Package updated." : "Package created.");
        setForm(PACKAGE_FORM);
        setEditingId(null);
        await fetchPackages();
      }
    } catch (err) {
      setError(getRequestErrorMessage(err, "Package save failed."));
    } finally {
      setSaving(false);
    }
  };

  const editPackage = (item: PackageItem) => {
    setForm({
      name: item.name,
      slug: item.slug,
      metaTitle: item.metaTitle,
      metaDescription: item.metaDescription,
      keywordsText: item.keywords.join("\n"),
      coverImage: item.coverImage,
      shortDescription: item.shortDescription,
      description: item.description,
      relatedServiceSlug: item.relatedServiceSlug || "",
      relatedLocationSlug: item.relatedLocationSlug || "",
      startingPrice: item.startingPrice || "",
      idealForText: item.idealFor.join("\n"),
      inclusionsText: item.inclusions.join("\n"),
      faqsText: faqsToText(item.faqs),
      isFeatured: item.isFeatured === true,
      sortOrder: item.sortOrder || 0,
      isActive: item.isActive !== false,
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deletePackage = async (id: string) => {
    if (!window.confirm("Delete this package?")) return;
    clearFeedback();
    try {
      const res = await axios.delete(`/api/packages?id=${id}`, { headers: authHeaders });
      if (res.data.success) {
        setMessage("Package deleted.");
        await fetchPackages();
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
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-gold gold-glow-text">Packages CMS</h1>
            <p className="text-white/50 text-sm mt-1">Create package and pricing SEO pages.</p>
          </div>
          <button
            onClick={seedDefaults}
            disabled={saving}
            className="px-5 py-3 bg-gold text-black rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 clickable disabled:opacity-60"
          >
            <Database className="w-4 h-4" />
            Seed Packages
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
            Loading packages...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-8">
          <div className="p-6 rounded-lg bg-charcoal border border-white/5 h-fit">
            <FormHeader
              title={editingId ? "Update Package" : "Create Package"}
              editing={!!editingId}
              onCancel={() => {
                setForm(PACKAGE_FORM);
                setEditingId(null);
              }}
            />
            <form onSubmit={savePackage} className="space-y-4">
              <TextField label="Package Name" required value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
              <TextField label="Slug" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} placeholder="auto from name" />
              <TextField label="Meta Title" required value={form.metaTitle} onChange={(value) => setForm({ ...form, metaTitle: value })} />
              <TextArea label="Meta Description" required value={form.metaDescription} onChange={(value) => setForm({ ...form, metaDescription: value })} />
              <div className="p-4 rounded-lg border border-gold/10 bg-black/30">
                <span className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Upload className="w-4 h-4" />
                  Upload Cover Image to Cloudinary
                </span>
                <input type="file" accept="image/*" disabled={uploadingCover} onChange={uploadCoverImage} className="w-full text-xs text-white/60 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-black hover:file:bg-gold-hover file:cursor-pointer bg-black/40 border border-white/10 rounded-lg p-2 clickable" />
                {uploadingCover && (
                  <span className="text-xs text-gold animate-pulse flex items-center gap-2 mt-3">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Uploading cover image...
                  </span>
                )}
              </div>
              <TextField label="Cover Image URL" required value={form.coverImage} onChange={(value) => setForm({ ...form, coverImage: value })} />
              {form.coverImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black">
                  <img src={form.coverImage} alt="Package cover preview" className="w-full h-full object-cover opacity-80" />
                </div>
              )}
              <TextField label="Starting Price" value={form.startingPrice} onChange={(value) => setForm({ ...form, startingPrice: value })} placeholder="Custom quote / Starting from ..." />
              <TextArea label="Short Description" required value={form.shortDescription} onChange={(value) => setForm({ ...form, shortDescription: value })} />
              <TextArea label="Full Description" required rows={6} value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
              <TextArea label="Keywords (one per line)" value={form.keywordsText} onChange={(value) => setForm({ ...form, keywordsText: value })} />
              <TextField label="Related Service Slug" value={form.relatedServiceSlug} onChange={(value) => setForm({ ...form, relatedServiceSlug: value })} placeholder="cold-pyro-entry" />
              <TextField label="Related Location Slug" value={form.relatedLocationSlug} onChange={(value) => setForm({ ...form, relatedLocationSlug: value })} placeholder="indore" />
              <TextArea label="Ideal For (one per line)" value={form.idealForText} onChange={(value) => setForm({ ...form, idealForText: value })} />
              <TextArea label="Inclusions (one per line)" value={form.inclusionsText} onChange={(value) => setForm({ ...form, inclusionsText: value })} />
              <TextArea label="FAQs (Question | Answer per line)" value={form.faqsText} onChange={(value) => setForm({ ...form, faqsText: value })} />
              <NumberField label="Sort Order" value={form.sortOrder} onChange={(value) => setForm({ ...form, sortOrder: value })} />
              <Checkbox label="Featured" checked={form.isFeatured} onChange={(checked) => setForm({ ...form, isFeatured: checked })} />
              <Checkbox label="Active" checked={form.isActive} onChange={(checked) => setForm({ ...form, isActive: checked })} />
              <SubmitButton loading={saving} label={editingId ? "Update Package" : "Create Package"} />
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-fit">
            {packages.map((item) => (
              <div key={item._id} className="rounded-lg bg-charcoal border border-white/5 overflow-hidden">
                <div className="relative aspect-video bg-black">
                  {item.coverImage ? (
                    <img src={item.coverImage} alt={item.name} className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">No cover</div>
                  )}
                  <span className="absolute top-3 left-3 bg-black/80 border border-gold/20 text-gold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                    {item.isActive ? "Active" : "Hidden"} {item.isFeatured ? "/ Featured" : ""}
                  </span>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-gold text-xs">/packages/{item.slug}</p>
                    <h3 className="text-white font-bold text-lg mt-1 line-clamp-2">{item.name}</h3>
                    <p className="text-white/50 text-xs leading-6 mt-2 line-clamp-3">{item.shortDescription}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => editPackage(item)} className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/80 hover:text-gold text-xs font-semibold clickable">
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button type="button" onClick={() => deletePackage(item._id)} className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/25 rounded-lg text-red-300 text-xs font-semibold clickable">
                      <Trash className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {packages.length === 0 && <div className="md:col-span-2 p-10 text-center bg-charcoal border border-white/5 rounded-lg text-white/40 text-sm">No packages yet. Use Seed Packages.</div>}
          </div>
        </div>
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

function TextArea({ label, value, onChange, required, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; rows?: number }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-white/70 uppercase">{label}</label>
      <textarea rows={rows} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 rounded-lg outline-none text-white text-sm resize-y" />
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
