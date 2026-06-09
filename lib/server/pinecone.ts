/**
 * lib/server/pinecone.ts
 * Singleton Pinecone client and helper utilities.
 * All interaction with the Pinecone vector database goes through this module.
 */

import { Pinecone } from "@pinecone-database/pinecone";

// ---------------------------------------------------------------------------
// Singleton client
// ---------------------------------------------------------------------------

let _client: Pinecone | null = null;

function getPineconeClient(): Pinecone {
  if (_client) return _client;

  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "PINECONE_API_KEY is not set. Add it to your .env.local file."
    );
  }

  _client = new Pinecone({ apiKey });
  return _client;
}

// ---------------------------------------------------------------------------
// Index accessor
// ---------------------------------------------------------------------------

function getPineconeIndex() {
  const indexName = process.env.PINECONE_INDEX_NAME;
  const host = process.env.PINECONE_HOST;

  if (!indexName) {
    throw new Error(
      "PINECONE_INDEX_NAME is not set. Add it to your .env.local file."
    );
  }

  const client = getPineconeClient();

  // If a host override is provided (recommended for production) use it directly
  // to skip the extra DNS lookup that the SDK would otherwise make.
  if (host) {
    return client.index(indexName, host);
  }

  return client.index(indexName);
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

export type PineconeVector = {
  id: string;
  values: number[];
  metadata?: Record<string, string | number | boolean | string[]>;
};

export type PineconeQueryResult = {
  id: string;
  score: number;
  metadata?: Record<string, string | number | boolean | string[]>;
};

/**
 * Upsert vectors into the Pinecone index.
 * @param vectors Array of { id, values, metadata } objects.
 */
export async function upsertVectors(vectors: PineconeVector[]): Promise<void> {
  const index = getPineconeIndex();
  // SDK v4 expects `upsert` to receive the vectors array directly
  // (older overload) — map to the canonical PineconeRecord shape.
  await index.upsert({ records: vectors.map((v) => ({ id: v.id, values: v.values, metadata: v.metadata })) });
}

/**
 * Query the Pinecone index for the top-k most similar vectors.
 * @param queryVector  Embedding vector to search against.
 * @param topK         Number of results to return (default 5).
 * @param filter       Optional metadata filter object.
 */
export async function queryVectors(
  queryVector: number[],
  topK = 5,
  filter?: Record<string, unknown>
): Promise<PineconeQueryResult[]> {
  const index = getPineconeIndex();

  const response = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
    ...(filter ? { filter } : {}),
  });

  return (response.matches ?? []).map((match) => ({
    id: match.id,
    score: match.score ?? 0,
    metadata: match.metadata as Record<string, string | number | boolean | string[]> | undefined,
  }));
}

/**
 * Delete vectors by their IDs from the Pinecone index.
 * @param ids Array of vector IDs to delete.
 */
export async function deleteVectors(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const index = getPineconeIndex();
  await index.deleteMany(ids);
}

/**
 * Ping the Pinecone index and return basic stats.
 * Useful for health-check endpoints.
 */
export async function getPineconeStats() {
  const index = getPineconeIndex();
  return await index.describeIndexStats();
}
