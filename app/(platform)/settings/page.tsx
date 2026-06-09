"use client";

import { Bell, Palette, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { useSettingsStore } from "@/store/settings-store";
import { useTranslation } from "@/lib/translations";

export default function SettingsPage() {
  const { t, language } = useTranslation();
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const notifications = useSettingsStore((state) => state.notifications);
  const toggleNotifications = useSettingsStore((state) => state.toggleNotifications);

  return (
    <>
      <PageHeader
        eyebrow={t("settingsEyebrow")}
        title={t("settingsTitle")}
        description={t("settingsDesc")}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <h3 className="flex items-center gap-2 font-semibold">
              <UserRound className="h-4 w-4" />
              {language === "Telugu" ? "ప్రొఫైల్ నిర్వహణ" : language === "Hindi" ? "प्रोफाइल प्रबंधन" : "Profile management"}
            </h3>
            <Input placeholder="Dr. Maya Chen" />
            <Input placeholder="maya.chen@hospital.org" />
            <Button>
              {language === "Telugu" ? "ప్రొఫైల్ సేవ్ చేయి" : language === "Hindi" ? "प्रोफ़ाइल सहेजें" : "Save profile"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-6">
            <div>
              <h3 className="flex items-center gap-2 font-semibold">
                <Bell className="h-4 w-4" />
                {language === "Telugu" ? "నోటిఫికేషన్లు" : language === "Hindi" ? "सूचनाएं" : "Notifications"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {language === "Telugu"
                  ? "పత్రం ప్రాసెసింగ్ మరియు మూల్యాంకన హెచ్చరికలను స్వీకరించండి."
                  : language === "Hindi"
                  ? "दस्तावेज़ प्रसंस्करण और मूल्यांकन अलर्ट प्राप्त करें।"
                  : "Receive document processing and evaluation alerts."}
              </p>
            </div>
            <Switch checked={notifications} onCheckedChange={toggleNotifications} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-6">
            <div>
              <h3 className="flex items-center gap-2 font-semibold">
                <Palette className="h-4 w-4" />
                {language === "Telugu" ? "థీమ్" : language === "Hindi" ? "थीम" : "Theme"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {language === "Telugu"
                  ? `ప్రస్తుత మోడ్: ${theme === "dark" ? "డార్క్" : "లైట్"}`
                  : language === "Hindi"
                  ? `वर्तमान मोड: ${theme === "dark" ? "डार्क" : "लाइट"}`
                  : `Current mode: ${theme}`}
              </p>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
