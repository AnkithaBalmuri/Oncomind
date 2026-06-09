"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Send, Sparkles, BookOpen } from "lucide-react";
import { ChatBubble } from "@/components/shared/chat-bubble";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { chatService } from "@/services/chat-service";
import type { ChatMessage } from "@/types";
import { useTranslation } from "@/lib/translations";

const promptKeys = [
  "chatPrompt1",
  "chatPrompt2",
  "chatPrompt3",
  "chatPrompt4",
  "chatPrompt5",
  "chatPrompt6",
  "chatPrompt7",
  "chatPrompt8",
  "chatPrompt9",
  "chatPrompt10"
] as const;

export default function ChatPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatService.getHistory().then(setMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || streaming) return;
    const query = input.trim();
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: query };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setStreaming(true);
    try {
      const response = await chatService.sendMessage(query, "knowledge");
      setMessages((current) => [...current, response]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I encountered an issue fetching the response. Please try again."
        }
      ]);
    } finally {
      setStreaming(false);
    }
  }

  async function selectAndSend(prompt: string) {
    if (streaming) return;
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: prompt };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setStreaming(true);
    try {
      const response = await chatService.sendMessage(prompt, "knowledge");
      setMessages((current) => [...current, response]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I encountered an issue fetching the response. Please try again."
        }
      ]);
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  function handleExport() {
    const text = messages
      .map((m) => `${m.role === "user" ? "User" : "OncoMind AI"}:\n${m.content}\n`)
      .join("\n---\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `oncomind-chat-conversation-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        eyebrow={t("chatEyebrow")}
        title={t("chatTitle")}
        description={t("chatDesc")}
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <Card className="flex flex-col border-slate-200/80 bg-white shadow-md min-h-[38rem] max-h-[42rem]">
          <CardContent className="flex flex-col flex-1 p-4 overflow-hidden">
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 pb-4">
              {messages.map((message) => <ChatBubble key={message.id} message={message} />)}
              {streaming ? (
                <div className="flex items-center gap-2 text-sm text-sky-700 font-semibold bg-sky-50 p-3 rounded-lg border border-sky-100 animate-pulse">
                  <Sparkles className="h-4 w-4 animate-spin animate-duration-1000" />
                  {t("aiSearching")}
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="mt-4 flex gap-2 border-t pt-4 border-slate-100">
              <Textarea
                className="min-h-[50px] max-h-[120px] resize-none font-medium placeholder:text-slate-400"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("askPlaceholder")}
              />
              <Button className="h-auto px-5 font-bold shadow-sm" onClick={send} disabled={streaming} aria-label="Send message">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card className="border-sky-100 bg-sky-50/50 shadow-sm max-h-[38rem] overflow-y-auto">
            <CardContent className="p-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-900 border-b pb-2 mb-3">
                <BookOpen className="h-4 w-4 text-primary" />
                {t("suggestedTopics")}
              </h3>
              <div className="grid gap-2">
                {promptKeys.map((key) => {
                  const promptText = t(key);
                  return (
                    <Button
                      key={key}
                      variant="outline"
                      className="justify-start text-left h-auto py-2.5 px-3 text-xs whitespace-normal font-semibold leading-relaxed border-sky-100/70 hover:bg-sky-100 hover:text-sky-900 text-slate-700 transition-all duration-200"
                      onClick={() => selectAndSend(promptText)}
                      disabled={streaming}
                    >
                      {promptText}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <Button variant="accent" className="w-full font-bold shadow-sm py-5" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            {t("exportConversation")}
          </Button>
        </div>
      </div>
    </>
  );
}
