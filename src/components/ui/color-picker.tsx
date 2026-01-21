"use client";

import { cn } from "@/lib/utils";
import { Check, Sparkles } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// Preset solid colors - สีสดใสน่ารัก
export const PRESET_COLORS = [
  { name: "Default", value: "", label: "ค่าเริ่มต้น" },
  { name: "Rose", value: "#fecdd3", label: "กุหลาบ" },
  { name: "Pink", value: "#fbcfe8", label: "ชมพู" },
  { name: "Fuchsia", value: "#f0abfc", label: "บานเย็น" },
  { name: "Purple", value: "#d8b4fe", label: "ม่วง" },
  { name: "Violet", value: "#c4b5fd", label: "ไวโอเล็ต" },
  { name: "Indigo", value: "#a5b4fc", label: "คราม" },
  { name: "Blue", value: "#93c5fd", label: "ฟ้า" },
  { name: "Sky", value: "#7dd3fc", label: "ท้องฟ้า" },
  { name: "Cyan", value: "#67e8f9", label: "น้ำเงินอมเขียว" },
  { name: "Teal", value: "#5eead4", label: "เทา" },
  { name: "Emerald", value: "#6ee7b7", label: "มรกต" },
  { name: "Green", value: "#86efac", label: "เขียว" },
  { name: "Lime", value: "#bef264", label: "เขียวมะนาว" },
  { name: "Yellow", value: "#fde047", label: "เหลือง" },
  { name: "Amber", value: "#fcd34d", label: "อำพัน" },
  { name: "Orange", value: "#fdba74", label: "ส้ม" },
  { name: "Red", value: "#fca5a5", label: "แดง" },
];

// Preset gradients - gradient สวยๆ
export const PRESET_GRADIENTS = [
  {
    name: "Sunset",
    value: "linear-gradient(135deg, #fecaca 0%, #fcd34d 100%)",
    label: "พระอาทิตย์ตก",
  },
  {
    name: "Ocean",
    value: "linear-gradient(135deg, #93c5fd 0%, #c4b5fd 100%)",
    label: "มหาสมุทร",
  },
  {
    name: "Forest",
    value: "linear-gradient(135deg, #86efac 0%, #67e8f9 100%)",
    label: "ป่าไม้",
  },
  {
    name: "Candy",
    value: "linear-gradient(135deg, #fbcfe8 0%, #c4b5fd 100%)",
    label: "ลูกกวาด",
  },
  {
    name: "Aurora",
    value: "linear-gradient(135deg, #a5b4fc 0%, #5eead4 100%)",
    label: "แสงเหนือ",
  },
  {
    name: "Peach",
    value: "linear-gradient(135deg, #fecdd3 0%, #fdba74 100%)",
    label: "พีช",
  },
  {
    name: "Lavender",
    value: "linear-gradient(135deg, #d8b4fe 0%, #fbcfe8 100%)",
    label: "ลาเวนเดอร์",
  },
  {
    name: "Mint",
    value: "linear-gradient(135deg, #6ee7b7 0%, #bef264 100%)",
    label: "มิ้นต์",
  },
];

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  showGradients?: boolean;
}

export function ColorPicker({
  value,
  onChange,
  showGradients = true,
}: ColorPickerProps) {
  const isGradient = value?.includes("gradient");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-3 h-11">
          <div
            className={cn(
              "h-6 w-6 rounded-md border shadow-sm",
              !value &&
                "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800",
            )}
            style={{ background: value || undefined }}
          />
          <span className="text-sm">
            {value ? (isGradient ? "Gradient" : "สีพื้นหลัง") : "เลือกสี"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="start">
        <div className="space-y-4">
          {/* Solid Colors */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">
              🎨 สีพื้น
            </h4>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => onChange(color.value)}
                  className={cn(
                    "h-8 w-8 rounded-lg border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    value === color.value &&
                      "ring-2 ring-primary ring-offset-2",
                    !color.value &&
                      "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800",
                  )}
                  style={{ backgroundColor: color.value || undefined }}
                  title={color.label}
                >
                  {value === color.value && (
                    <Check className="h-4 w-4 mx-auto text-slate-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Gradients */}
          {showGradients && (
            <div>
              <h4 className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Gradient
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_GRADIENTS.map((gradient) => (
                  <button
                    key={gradient.name}
                    onClick={() => onChange(gradient.value)}
                    className={cn(
                      "h-10 w-full rounded-lg border-2 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      value === gradient.value &&
                        "ring-2 ring-primary ring-offset-2",
                    )}
                    style={{ background: gradient.value }}
                    title={gradient.label}
                  >
                    {value === gradient.value && (
                      <Check className="h-4 w-4 mx-auto text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear button */}
          {value && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => onChange("")}
            >
              ล้างสี
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Mini color picker for inline use
export function MiniColorPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (color: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "h-6 w-6 rounded-md border-2 border-white shadow-md transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary",
            !value && "bg-gradient-to-br from-slate-200 to-slate-300",
          )}
          style={{ background: value || undefined }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="grid grid-cols-6 gap-1.5">
          {PRESET_COLORS.slice(0, 12).map((color) => (
            <button
              key={color.name}
              onClick={() => onChange(color.value)}
              className={cn(
                "h-6 w-6 rounded-md border transition-all hover:scale-110 focus:outline-none",
                value === color.value && "ring-2 ring-primary ring-offset-1",
                !color.value && "bg-gradient-to-br from-slate-100 to-slate-200",
              )}
              style={{ backgroundColor: color.value || undefined }}
              title={color.label}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
