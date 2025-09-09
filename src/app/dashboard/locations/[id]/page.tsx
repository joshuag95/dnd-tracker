"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import type { Audience } from "@/lib/schemas/location"; // type-only import

type Location = {
  id: string;
  campaignId: string;
  name: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  notes: Array<{
    id: string;
    title?: string;
    body: string;
    audience: Audience;
  }>;
};

// -------- fetchers ----------
async function fetchLocation(id: string): Promise<Location> {
  const res = await fetch(`/api/locations/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load location");
  return res.json();
}

async function postNote(id: string, input: { title?: string; body: string; audience: Audience }) {
  const res = await fetch(`/api/locations/${id}/notes`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Create note failed");
  return res.json();
}

// -------- audience selector (inline UI) ----------
function AudienceSelect({
  value,
  onChange,
}: {
  value: Audience;
  onChange: (a: Audience) => void;
}) {
  const isDM = value.role === "dm";
  const isAll = value.role === "all";
  const isPC = value.role === "pc";

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <label className="flex items-center gap-1">
        <input
          type="radio"
          checked={isDM}
          onChange={() => onChange({ role: "dm" })}
        />
        <span>DM only</span>
      </label>
      <label className="flex items-center gap-1">
        <input
          type="radio"
          checked={isAll}
          onChange={() => onChange({ role: "all" })}
        />
        <span>All PCs</span>
      </label>
      <label className="flex items-center gap-1">
        <input
          type="radio"
          checked={isPC}
          onChange={() => onChange({ role: "pc" })}
        />
        <span>Specific PC</span>
      </label>
      {isPC && (
        <input
          placeholder="PC ID (optional)"
          className="border rounded px-2 py-1 text-sm"
          value={"pcId" in value && value.pcId ? value.pcId : ""}
          onChange={(e) => onChange({ role: "pc", pcId: e.target.value || undefined })}
        />
      )}
    </div>
  );
}

export default function LocationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id!;
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["location", id],
    queryFn: () => fetchLocation(id),
    enabled: !!id,
  });

  // form
  const { register, handleSubmit, reset } = useForm<{ title?: string; body: string }>();
  const [audience, setAudience] = useState<Audience>({ role: "dm" });

  const createNote = useMutation({
    mutationFn: (values: { title?: string; body: string }) =>
      postNote(id, { ...values, audience }),
    onSuccess: () => {
      reset();
      setAudience({ role: "dm" });
      qc.invalidateQueries({ queryKey: ["location", id] });
    },
  });

  if (isLoading) return <p className="p-6">Loading…</p>;
  if (error || !data) return <p className="p-6 text-red-600">Failed to load</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <Link
        href="/dashboard/locations"
        className="text-sm text-blue-600 underline hover:text-blue-800"
      >
        ← Back to Locations
      </Link>

      <h1 className="text-3xl font-bold">{data.name}</h1>
      <div className="text-sm text-gray-500">
        Tags: {data.tags.length ? data.tags.join(", ") : "none"}
      </div>
      <div className="text-xs text-gray-400">
        Created: {new Date(data.createdAt).toLocaleString()}
      </div>

      {/* Notes list */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold mt-4">Notes</h2>
        {data.notes.length === 0 && (
          <p className="text-sm text-gray-500">No notes yet.</p>
        )}
        <ul className="space-y-2">
          {data.notes.map((n) => (
            <li key={n.id} className="rounded border bg-white p-3">
              <div className="flex items-center gap-2">
                <span className="text-xs rounded bg-gray-100 px-2 py-0.5 text-gray-600">
                  {n.audience.role === "dm"
                    ? "DM"
                    : n.audience.role === "all"
                    ? "All PCs"
                    : n.audience.pcId
                    ? `PC:${n.audience.pcId}`
                    : "PCs"}
                </span>
                {n.title && <div className="font-medium">{n.title}</div>}
              </div>
              <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{n.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Add note form */}
      <section className="rounded border bg-white p-4 space-y-3">
        <h3 className="font-medium">Add note</h3>
        <form
          className="space-y-3"
          onSubmit={handleSubmit((values) => createNote.mutate(values))}
        >
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Title (optional)"
            {...register("title")}
          />
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[100px]"
            placeholder="Note body…"
            {...register("body", { required: true })}
          />
          <AudienceSelect value={audience} onChange={setAudience} />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
            disabled={createNote.isPending}
          >
            {createNote.isPending ? "Saving…" : "Add note"}
          </button>
        </form>
      </section>
    </main>
  );
}
