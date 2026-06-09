import { VoiceWidget } from "@/components/shared/voice-widget";
import { PageHeader } from "@/components/shared/page-header";

export default function VoicePage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Voice Interface"
        title="Voice Assistant"
        description="Speak your cancer-related questions and receive instant AI-powered responses with text-to-speech output. Supports full voice-to-voice interaction."
      />
      <VoiceWidget />
    </>
  );
}
