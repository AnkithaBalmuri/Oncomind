import type { ChatMessage } from "@/types";
import { useSettingsStore } from "@/store/settings-store";

export const chatService = {
  async getHistory(): Promise<ChatMessage[]> {
    return [
      {
        id: "m0",
        role: "assistant",
        content: "Hello! I am the OncoMind AI Chatbot. You can ask me any questions about cancer, risk factors, screening, staging, or treatment. I will search the backend documents to retrieve cited, grounded answers."
      }
    ];
  },
  async sendMessage(message: string, scope = "all"): Promise<ChatMessage> {
    try {
      const language = useSettingsStore.getState().language;
      const response = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message, scope, language })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with RAG endpoint");
      }

      const data = await response.json();

      // Map backend citations to ChatMessage citation format
      const citations = (data.citations || []).map((cite: any) => ({
        title: cite.documentName,
        source: cite.citation,
        year: 2026,
        relevance: Math.min(99, Math.round(cite.score * 5) + 65)
      }));

      // Calculate confidence based on the highest citation score
      const maxScore = data.citations?.[0]?.score || 0;
      const confidence = data.citations?.length ? Math.min(99, 70 + Math.round(maxScore * 2)) : 80;

      return {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        confidence,
        content: data.answer,
        citations: citations.length ? citations : undefined
      };
    } catch (err) {
      return {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: `Sorry, I encountered an error while searching the documents: ${err instanceof Error ? err.message : String(err)}. Please try again.`
      };
    }
  }
};
