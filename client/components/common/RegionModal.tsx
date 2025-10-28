import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegion } from "@/store/useRegion";

const REGIONS: Array<{ code: string; name: string }> = [
  { code: "UZ-TCC", name: "Toshkent sh." },
  { code: "UZ-TOS", name: "Toshkent vil." },
  { code: "UZ-AND", name: "Andijon" },
  { code: "UZ-NAM", name: "Namangan" },
  { code: "UZ-FER", name: "Farg‘ona" },
  { code: "UZ-SAM", name: "Samarqand" },
  { code: "UZ-BUK", name: "Buxoro" },
  { code: "UZ-JIZ", name: "Jizzax" },
  { code: "UZ-SIR", name: "Sirdaryo" },
  { code: "UZ-NAV", name: "Navoiy" },
  { code: "UZ-QAS", name: "Qashqadaryo" },
  { code: "UZ-SUR", name: "Surxondaryo" },
  { code: "UZ-XOR", name: "Xorazm" },
  { code: "UZ-QRP", name: "Qoraqalpog‘iston R." },
];

export function RegionModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { code, setRegion } = useRegion();
  const [q, setQ] = useState("");
  const items = useMemo(() => REGIONS.filter(r => r.name.toLowerCase().includes(q.toLowerCase())), [q]);

  useEffect(() => {
    if (!code) onOpenChange(true);
  }, [code, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Viloyatni tanlang</DialogTitle>
        </DialogHeader>
        <Input placeholder="Qidirish" value={q} onChange={(e) => setQ(e.target.value)} className="mb-3" />
        <div className="max-h-72 overflow-auto space-y-2">
          {items.map((r) => (
            <Button key={r.code} variant="outline" className="w-full justify-start" onClick={() => { setRegion(r.code as any, r.name); onOpenChange(false); }}>
              {r.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}