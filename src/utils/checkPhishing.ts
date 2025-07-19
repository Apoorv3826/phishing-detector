import { Pinecone } from "@pinecone-database/pinecone";
import { getEmbedding } from "./embedder";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export async function checkPhishing(
  inputUrl: string,
  topK = 3,
  threshold = 0.8
): Promise<{ isPhishing: boolean; confidence: string }> {
  const index = pinecone.Index(process.env.PINECONE_INDEX!);
  const embedding = await getEmbedding(inputUrl);

  const vector = Array.isArray(embedding?.[0]) ? embedding[0] : embedding;

  if (!vector || !Array.isArray(vector) || vector.length !== 384) {
    console.error("❌ Invalid embedding received.");
    return { isPhishing: false, confidence: "0.0000" };
  }

  console.log("📏 Embedding length:", vector.length);
  console.log("🧠 Sample vector:", vector.slice(0, 5));

  try {
    const result = await index.query({
      vector,
      topK,
      includeMetadata: true,
    });

    console.log("🌐 Raw Pinecone matches:", result.matches);

    const suspicious = (result.matches || [])
      .filter(
        (match) => typeof match.score === "number" && match.score >= threshold
      )
      .sort((a, b) => b.score! - a.score!);

    const topMatch = suspicious[0];

    return {
      isPhishing: Boolean(topMatch),
      confidence: topMatch ? topMatch.score!.toFixed(4) : "0.0000",
    };
  } catch (err: any) {
    console.error("❌ Pinecone error:", err.message);
    return { isPhishing: false, confidence: "0.0000" };
  }
}
