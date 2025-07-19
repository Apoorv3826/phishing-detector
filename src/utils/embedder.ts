// src/utils/embedder.ts
import axios from "axios";

const HF_TOKEN = process.env.HF_API_TOKEN;

if (!HF_TOKEN) {
  throw new Error("HF_API_TOKEN is missing in .env.local");
}

export async function getEmbedding(text: string): Promise<number[] | null> {
  console.log("🧪 Calling HF for:", text);

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/BAAI/bge-small-en-v1.5",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    const vector = Array.isArray(data?.[0]) ? data[0] : data;
    return Array.isArray(vector) ? vector : null;
  } catch (err: any) {
    console.error("❌ HF error:", err.response?.data || err.message);
    return null;
  }
}
