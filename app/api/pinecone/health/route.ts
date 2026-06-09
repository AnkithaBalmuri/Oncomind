/**
 * GET /api/pinecone/health
 * Returns Pinecone index statistics to verify the connection.
 */

import { NextResponse } from "next/server";
import { getPineconeStats } from "@/lib/server/pinecone";

export async function GET() {
  try {
    const stats = await getPineconeStats();
    return NextResponse.json({
      connected: true,
      indexName: process.env.PINECONE_INDEX_NAME,
      host: process.env.PINECONE_HOST,
      stats,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { connected: false, error: message },
      { status: 500 }
    );
  }
}
