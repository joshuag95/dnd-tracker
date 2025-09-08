"use client";


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

type Campaign = {
  id: string;
  name: string;
  system: string;
  createdAt: string;
};

async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await fetch("/api/campaigns", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load");
  return res.json();
}

async function postCampaign(input: { name: string; system?: string }) {
  const res = await fetch("/api/campaigns", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
}

export default function CampaignsPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["campaigns"],
    queryFn: fetchCampaigns,
  });

  const { register, handleSubmit, reset } =
    useForm<{ name: string; system?: string }>();

  const createMut = useMutation({
    mutationFn: postCampaign,
    onSuccess: () => {
      reset();
      qc.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Campaigns</h1>

      <form
        className="mt-4 flex gap-2"
        onSubmit={handleSubmit((values) => createMut.mutate(values))}
      >
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Campaign name"
          {...register("name", { required: true })}
        />
        <input
          className="border rounded px-3 py-2 w-32"
          placeholder="system"
          defaultValue="5e"
          {...register("system")}
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
        {error && <p className="text-red-600">Failed to load campaigns</p>}
        <ul className="divide-y border rounded">
          {data?.map((c) => (
            <li key={c.id} className="p-3 flex items-center gap-3">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-500">({c.system})</div>
              <div className="ml-auto text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
          {!isLoading && !error && data?.length === 0 && (
            <li className="p-3 text-gray-500">No campaigns yet</li>
          )}
        </ul>
      </section>
    </main>
  );
}
