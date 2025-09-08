"use client";
import Link from "next/link"; // 👈 add this at the top of file

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

type Location = {
  id: string;
  campaignId: string;
  name: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

async function fetchLocations(): Promise<Location[]> {
  const res = await fetch("/api/locations", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load");
  return res.json();
}

async function postLocation(input: { campaignId: string; name: string; tags?: string[] }) {
  const res = await fetch("/api/locations", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
}

export default function LocationsPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });

  const { register, handleSubmit, reset } = useForm<{ name: string; tags: string }>();

  const createMut = useMutation({
    mutationFn: (values: { name: string; tags: string }) =>
      postLocation({
        campaignId: "demo-1", // hardcoded for now
        name: values.name,
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
      }),
    onSuccess: () => {
      reset();
      qc.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Locations</h1>

      <form
        className="mt-4 flex gap-2"
        onSubmit={handleSubmit((values) => createMut.mutate(values))}
      >
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Location name"
          {...register("name", { required: true })}
        />
        <input
          className="border rounded px-3 py-2 w-48"
          placeholder="tags (comma separated)"
          {...register("tags")}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          disabled={createMut.isPending}
        >
          {createMut.isPending ? "Saving..." : "Add"}
        </button>
      </form>

      <section className="mt-6">
        {isLoading && <p>Loading…</p>}
        {error && <p className="text-red-600">Failed to load locations</p>}
       <ul className="divide-y border rounded">
  {data?.map((loc) => (
    <li key={loc.id} className="p-3">
      <div className="font-medium">
        <Link
          href={`/dashboard/locations/${loc.id}`}
          className="underline hover:text-blue-600"
        >
          {loc.name}
        </Link>
      </div>
      <div className="text-xs text-gray-500">
        Tags: {loc.tags.length ? loc.tags.join(", ") : "none"}
      </div>
      <div className="text-xs text-gray-400">
        Created: {new Date(loc.createdAt).toLocaleString()}
      </div>
    </li>
  ))}
</ul>
      </section>
    </main>
  );
}
