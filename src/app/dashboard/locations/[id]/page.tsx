"use client";
import Link from "next/link";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

type Location = {
  id: string;
  campaignId: string;
  name: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

async function fetchLocation(id: string): Promise<Location> {
  const res = await fetch(`/api/locations/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load location");
  return res.json();
}

export default function LocationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["location", id],
    queryFn: () => fetchLocation(id!),
    enabled: !!id,
  });

  if (isLoading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">Failed to load</p>;
  if (!data) return <p className="p-6">Location not found</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      {/* 👇 Back link goes here, right before the title */}
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
    </main>
  );
}