"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Loader2, Mic, MicOff, Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useSettingsStore } from "@/store/settings-store";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string }; isFinal?: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type VoiceState = "idle" | "listening" | "processing" | "speaking";

const NUM_BARS = 28;

function getBarHeight(index: number, state: VoiceState): number {
  if (state === "idle") return 6 + ((index * 3) % 8);
  if (state === "listening") {
    const wave = Math.sin((index / NUM_BARS) * Math.PI * 2) * 0.5 + 0.5;
    const jitter = (index * 7) % 5;
    return 10 + wave * 36 + jitter;
  }
  if (state === "speaking") {
    const wave = Math.sin((index / NUM_BARS) * Math.PI * 3) * 0.5 + 0.5;
    return 8 + wave * 28;
  }
  return 6;
}

export function VoiceWidget() {
  const { t, language } = useTranslation();
  const voiceMode = useSettingsStore((state) => state.voiceMode);
  const toggleVoiceMode = useSettingsStore((state) => state.toggleVoiceMode);

  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [supported, setSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceAnswer, setVoiceAnswer] = useState("");

  const defaultAnswers = useMemo<Record<string, string>>(() => ({
    Telugu: "నేను అప్‌లోడ్ చేసిన క్యాన్సర్ నివేదికలను వివరించడంలో, బయోమార్కర్లను సంగ్రహించడంలో మరియు వైద్యుని సందర్శన ప్రశ్నలను సూచించడంలో సహాయపడగలను.",
    Hindi: "मैं अपलोड की गई कैंसर रिपोर्टों को समझाने, बायोमार्कर को संक्षेप में प्रस्तुत करने और डॉक्टर के पास जाने के लिए प्रश्नों का सुझाव देने में मदद कर सकता हूँ।",
    English: "I can help explain uploaded cancer reports, summarize biomarkers, suggest doctor visit questions, and remind you to confirm medical decisions with your oncology team."
  }), []);

  useEffect(() => {
    setVoiceAnswer(defaultAnswers[language] || defaultAnswers.English);
  }, [defaultAnswers, language]);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef("");
  const voiceModeRef = useRef(voiceMode);
  const [bars, setBars] = useState<number[]>(Array.from({ length: NUM_BARS }, (_, i) => getBarHeight(i, "idle")));
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => { voiceModeRef.current = voiceMode; }, [voiceMode]);

  // Animate waveform
  useEffect(() => {
    let frame = 0;
    function animate() {
      frame++;
      setBars((prev) =>
        prev.map((_, i) => {
          const state = voiceState;
          if (state === "idle") return 6 + ((i * 3 + frame * 0.1) % 8);
          if (state === "listening") {
            const wave = Math.sin((i / NUM_BARS) * Math.PI * 2 + frame * 0.18) * 0.5 + 0.5;
            return 8 + wave * 36 + ((i * 7) % 5);
          }
          if (state === "speaking") {
            const wave = Math.sin((i / NUM_BARS) * Math.PI * 3 + frame * 0.14) * 0.5 + 0.5;
            return 6 + wave * 28;
          }
          return 6;
        })
      );
      animFrameRef.current = requestAnimationFrame(animate);
    }
    animFrameRef.current = requestAnimationFrame(animate);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [voiceState]);

  // Setup speech recognition
  useEffect(() => {
    const browserWindow = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Recognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    setSupported(Boolean(Recognition));
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    const currentLang = useSettingsStore.getState().language;
    recognition.lang = currentLang === "Telugu" ? "te-IN" : currentLang === "Hindi" ? "hi-IN" : "en-US";

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setTranscript(text);
      transcriptRef.current = text;
    };

    recognition.onend = () => {
      const query = transcriptRef.current.trim();
      if (query) {
        submitQuery(query);
      } else {
        setVoiceState("idle");
      }
    };

    recognition.onerror = () => {
      setVoiceState("idle");
      setTranscript(language === "Telugu" ? "వాయిస్ గుర్తింపులో సమస్య వచ్చింది. దయచేసి మళ్ళీ ప్రయత్నించండి." : language === "Hindi" ? "आवाज़ पहचानने में समस्या हुई। कृपया पुनः प्रयास करें।" : "Speech recognition had trouble. Please try again.");
    };

    recognitionRef.current = recognition;

    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  // SpeechRecognition is initialized once; language changes are applied below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update recognition language dynamically
  useEffect(() => {
    if (recognitionRef.current) {
      if (language === "Telugu") {
        recognitionRef.current.lang = "te-IN";
      } else if (language === "Hindi") {
        recognitionRef.current.lang = "hi-IN";
      } else {
        recognitionRef.current.lang = "en-US";
      }
    }
  }, [language]);

  async function submitQuery(query: string) {
    setVoiceState("processing");
    setVoiceAnswer(language === "Telugu" ? "క్యాన్సర్ సమాచారాన్ని వెతుకుతోంది..." : language === "Hindi" ? "कैंसर जानकारी खोजी जा रही है..." : "Searching cancer knowledge base...");
    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query, scope: "all", language })
      });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();

      const cleanAnswer = data.answer
        .replace(/\*\*?/g, "")
        .replace(/#+\s*/g, "")
        .replace(/-\s*/g, "")
        .trim();

      setVoiceAnswer(cleanAnswer);

      if (voiceModeRef.current && "speechSynthesis" in window) {
        speakText(cleanAnswer);
      } else {
        setVoiceState("idle");
      }
    } catch {
      setVoiceAnswer(t("chatError"));
      setVoiceState("idle");
    }
  }

  function speakText(text: string) {
    if (!("speechSynthesis" in window)) { setVoiceState("idle"); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (language === "Telugu") {
      utterance.lang = "te-IN";
    } else if (language === "Hindi") {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-US";
    }
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onend = () => setVoiceState("idle");
    setVoiceState("speaking");
    window.speechSynthesis.speak(utterance);
  }

  function toggleListening() {
    if (!recognitionRef.current) {
      setTranscript(t("speechUnsupported"));
      return;
    }
    if (voiceState === "listening") {
      recognitionRef.current.stop();
      setVoiceState("idle");
      return;
    }
    if (voiceState === "speaking") {
      window.speechSynthesis.cancel();
    }
    setTranscript("");
    transcriptRef.current = "";
    setVoiceState("listening");
    recognitionRef.current.start();
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setVoiceState("idle");
  }

  function restart() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    if (recognitionRef.current && voiceState === "listening") recognitionRef.current.stop();
    setVoiceState("idle");
    setTranscript("");
    transcriptRef.current = "";
    setVoiceAnswer(language === "Telugu" ? "మీ తదుపరి ప్రశ్నకు సిద్ధంగా ఉన్నాను." : language === "Hindi" ? "आपके अगले प्रश्न के लिए तैयार हूँ।" : "Ready for your next question.");
  }

  const getVoiceStateLabel = (state: VoiceState) => {
    if (state === "idle") return t("micReady");
    if (state === "listening") return t("listening");
    if (state === "processing") return t("searching");
    if (state === "speaking") return t("speaking");
    return state;
  };

  const isListening = voiceState === "listening";
  const isProcessing = voiceState === "processing";
  const isSpeaking = voiceState === "speaking";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      {/* Control Panel */}
      <Card className="clinical-card overflow-hidden">
        <CardContent className="p-6 text-center">
          {/* AI Avatar */}
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
            <div
              className={cn(
                "absolute inset-0 rounded-full opacity-30",
                isListening || isSpeaking ? "animate-pulse-ring" : isProcessing ? "animate-pulse-ring-blue" : ""
              )}
              style={{
                background: isListening
                  ? "hsl(0 84% 60%)"
                  : isSpeaking
                  ? "hsl(163 80% 38%)"
                  : "hsl(230 80% 56%)"
              }}
            />
            <div
              className="relative grid h-20 w-20 place-items-center rounded-full shadow-primary-glow"
              style={{ background: "linear-gradient(135deg, hsl(230 80% 56%), hsl(163 80% 38%))" }}
            >
              <Bot className="h-9 w-9 text-white" />
            </div>
          </div>

          <h2 className="text-xl font-black text-foreground">{t("appName")} {t("voice")}</h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {supported ? (language === "Telugu" ? "స్పష్టంగా మాట్లాడండి — AI గట్టిగా సమాధానం ఇస్తుంది" : language === "Hindi" ? "स्पष्ट बोलें — AI ज़ोर से जवाब देगा" : "Speak clearly — AI will respond aloud") : t("speechUnsupported")}
          </p>

          {/* State indicator */}
          <div className={cn(
            "mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold",
            isListening ? "bg-rose-50 text-rose-700 border border-rose-200" :
            isSpeaking ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
            isProcessing ? "bg-amber-50 text-amber-700 border border-amber-200" :
            "bg-muted text-muted-foreground border border-border"
          )}>
            <span className={cn("h-2 w-2 rounded-full", isListening || isSpeaking ? "status-dot-active" : isProcessing ? "bg-amber-400" : "bg-muted-foreground/40")} />
            {getVoiceStateLabel(voiceState)}
            {isProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
          </div>

          {/* Mic Button */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              onClick={isListening ? toggleListening : (isSpeaking ? stopSpeaking : toggleListening)}
              disabled={isProcessing}
              className={cn(
                "relative flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50",
                isListening
                  ? "bg-rose-500 hover:bg-rose-600 focus:ring-rose-200"
                  : isSpeaking
                  ? "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-200"
                  : "shadow-primary-glow focus:ring-primary/30",
                !isListening && !isSpeaking && "bg-primary hover:bg-primary/90"
              )}
              aria-label={isListening ? "Stop recording" : "Start recording"}
            >
              {isListening ? <MicOff className="h-8 w-8" /> : isSpeaking ? <Pause className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={restart}
              className="gap-1.5 text-xs"
              disabled={isProcessing}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t("restartBtn")}
            </Button>
          </div>

          {/* Voice mode toggle */}
          <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border bg-muted/40 px-4 py-3">
            <Volume2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground flex-1 text-left">
              {language === "Telugu" ? "స్వయంచాలకంగా చదవండి" : language === "Hindi" ? "स्वचालित रूप से पढ़ें" : "Auto-read response"}
            </span>
            <Switch checked={voiceMode} onCheckedChange={toggleVoiceMode} />
          </div>
        </CardContent>
      </Card>

      {/* Transcript + Waveform + Answer */}
      <div className="flex flex-col gap-4">
        {/* Transcript */}
        <Card className="clinical-card">
          <CardContent className="p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              {language === "Telugu" ? "స్పీచ్ ఇన్‌పుట్" : language === "Hindi" ? "स्पीच इनपुट" : "Speech Input"}
            </p>
            <p className={cn(
              "min-h-[2.5rem] text-base font-semibold leading-7 text-foreground transition-all",
              !transcript && "text-muted-foreground"
            )}>
              {transcript || (language === "Telugu" ? "మైక్రోఫోన్‌ను క్లిక్ చేసి మీ క్యాన్సర్ ప్రశ్నాన్ని అడగండి..." : language === "Hindi" ? "माइक्रोफ़ोन पर क्लिक करें और अपना कैंसर प्रश्न पूछें..." : "Click the microphone and ask your oncology question...")}
            </p>
          </CardContent>
        </Card>

        {/* Waveform */}
        <Card className="clinical-card overflow-hidden">
          <CardContent className="flex h-20 items-end gap-0.5 p-4">
            {bars.map((h, i) => (
              <div
                key={i}
                className={cn("flex-1 rounded-t-sm transition-all", isListening ? "bg-rose-400" : isSpeaking ? "bg-emerald-400" : "bg-primary/40")}
                style={{ height: `${h}px`, transitionDuration: "80ms" }}
              />
            ))}
          </CardContent>
        </Card>

        {/* Answer */}
        <Card className={cn("clinical-card flex-1", isSpeaking && "border-emerald-200")}>
          <CardContent className="p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
              {language === "Telugu" ? "AI సమాధానం" : language === "Hindi" ? "AI उत्तर" : "AI Response"}
            </p>
            <p className="text-sm font-semibold leading-7 text-foreground whitespace-pre-wrap">
              {voiceAnswer}
            </p>
            {voiceAnswer && !isSpeaking && voiceState === "idle" && (
              <Button
                className="mt-4 gap-2 font-semibold"
                size="sm"
                variant="outline"
                onClick={() => speakText(voiceAnswer)}
              >
                <Play className="h-3.5 w-3.5" />
                {language === "Telugu" ? "బిగ్గరగా చదవండి" : language === "Hindi" ? "ज़ोर से पढ़ें" : "Read aloud"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
