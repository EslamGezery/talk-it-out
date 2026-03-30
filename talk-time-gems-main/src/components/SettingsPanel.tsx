import { useState, useEffect } from "react";
import { Settings, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

const SettingsPanel = () => {
  const [geminiKey, setGeminiKey] = useState("");
  const [adUnitId, setAdUnitId] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setGeminiKey(localStorage.getItem("gemini_api_key") || "");
    setAdUnitId(
      localStorage.getItem("admob_ad_unit_id") ||
        "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY"
    );
  }, [open]);

  const handleSave = () => {
    if (!geminiKey.trim()) {
      toast.error("Please enter your Gemini API Key");
      return;
    }
    localStorage.setItem("gemini_api_key", geminiKey.trim());
    localStorage.setItem("admob_ad_unit_id", adUnitId.trim());
    toast.success("Settings saved!");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gemini-key" className="text-foreground">
              Google Gemini API Key
            </Label>
            <Input
              id="gemini-key"
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="bg-secondary border-border"
            />
            <p className="text-xs text-muted-foreground">
              Get your key from{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admob-id" className="text-foreground">
              AdMob Rewarded Ad Unit ID
            </Label>
            <Input
              id="admob-id"
              type="text"
              placeholder="ca-app-pub-XXXX/YYYY"
              value={adUnitId}
              onChange={(e) => setAdUnitId(e.target.value)}
              className="bg-secondary border-border"
            />
            <p className="text-xs text-muted-foreground">
              Your AdMob rewarded video ad unit ID
            </p>
          </div>

          <Button onClick={handleSave} className="w-full gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsPanel;
