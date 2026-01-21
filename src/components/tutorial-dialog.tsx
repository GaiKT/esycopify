"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Plus,
  Variable,
  Copy,
  Palette,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MousePointerClick,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TUTORIAL_STEPS = [
  {
    title: "ยินดีต้อนรับสู่ Esycopify! 🎉",
    description:
      "แอพจัดการข้อความเทมเพลต ช่วยให้คุณเก็บข้อความที่ใช้บ่อยและคัดลอกได้ง่ายๆ",
    icon: Sparkles,
    tips: [
      "เหมาะสำหรับตอบแชทลูกค้า",
      "เก็บรหัสส่วนลด ข้อความโปรโมชัน",
      "บันทึกข้อความที่ใช้ซ้ำบ่อยๆ",
    ],
  },
  {
    title: "สร้างรายการ (List)",
    description:
      "จัดกลุ่มการ์ดเทมเพลตตามหมวดหมู่ เช่น ทักทาย, ตอบคำถาม, ส่วนลด",
    icon: Plus,
    tips: [
      "กดปุ่ม '+ เพิ่มรายการ' ท้ายสุด",
      "พิมพ์ชื่อรายการแล้วกด Enter",
      "สร้างได้หลายรายการตามต้องการ",
    ],
  },
  {
    title: "สร้างการ์ดเทมเพลต",
    description: "เพิ่มข้อความเทมเพลตในแต่ละรายการ",
    icon: Plus,
    tips: [
      "กดปุ่ม '+ เพิ่มเทมเพลต' ในแต่ละรายการ",
      "พิมพ์ข้อความที่ต้องการเก็บ",
      "กด 'เพิ่ม' เพื่อบันทึก",
    ],
  },
  {
    title: "ใช้ตัวแปร {{variable}}",
    description:
      "แทรกตัวแปรในข้อความ เพื่อเปลี่ยนค่าได้ก่อนคัดลอก เช่น ชื่อลูกค้า, ราคา",
    icon: Variable,
    tips: [
      "กดปุ่ม '+ ตัวแปร' ขณะเพิ่มการ์ด",
      "เลือกตัวแปรที่ต้องการ หรือพิมพ์เอง",
      "ตัวอย่าง: สวัสดีคุณ {{ชื่อ}}",
    ],
  },
  {
    title: "คัดลอกข้อความ",
    description: "คลิกการ์ดเพื่อคัดลอกข้อความไปใช้งานได้ทันที",
    icon: Copy,
    tips: [
      "การ์ดไม่มีตัวแปร → คลิกเพื่อคัดลอกเลย",
      "การ์ดมีตัวแปร → กรอกค่าแล้วคัดลอก",
      "จะมีข้อความ 'คัดลอกแล้ว!' แสดงเมื่อสำเร็จ",
    ],
  },
  {
    title: "ลากจัดเรียง (Drag & Drop)",
    description: "จัดเรียงรายการและการ์ดตามต้องการด้วยการลาก",
    icon: GripVertical,
    tips: [
      "ลากไอคอน ⋮⋮ เพื่อย้ายรายการ",
      "ลากการ์ดเพื่อจัดเรียงหรือย้ายข้ามรายการ",
      "ตำแหน่งจะบันทึกอัตโนมัติ",
    ],
  },
  {
    title: "เปลี่ยนสี",
    description: "ตกแต่งบอร์ดและการ์ดด้วยสีสันสวยงาม",
    icon: Palette,
    tips: [
      "กดไอคอน 🎨 ที่ header เพื่อเปลี่ยนสีบอร์ด",
      "กดไอคอน 🎨 บนการ์ดเพื่อเปลี่ยนสีการ์ด",
      "มีทั้งสีพื้นและ gradient ให้เลือก",
    ],
  },
];

interface TutorialDialogProps {
  showOnFirstVisit?: boolean;
}

export function TutorialDialog({
  showOnFirstVisit = true,
}: TutorialDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Check if first visit
  useEffect(() => {
    if (showOnFirstVisit) {
      const hasSeenTutorial = localStorage.getItem("esycopify-tutorial-seen");
      if (!hasSeenTutorial) {
        setOpen(true);
        localStorage.setItem("esycopify-tutorial-seen", "true");
      }
    }
  }, [showOnFirstVisit]);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setOpen(false);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setCurrentStep(0);
    }
  };

  const step = TUTORIAL_STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          title="วิธีใช้งาน"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
              <StepIcon className="h-5 w-5 text-purple-500" />
            </div>
            {step.title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-muted-foreground text-base">{step.description}</p>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-4 space-y-2">
            {step.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <MousePointerClick className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 pt-2">
            {TUTORIAL_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentStep
                    ? "bg-purple-500 w-6"
                    : "bg-slate-300 dark:bg-slate-600 hover:bg-purple-300",
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            ย้อนกลับ
          </Button>

          <span className="text-sm text-muted-foreground">
            {currentStep + 1} / {TUTORIAL_STEPS.length}
          </span>

          <Button
            onClick={handleNext}
            className="gap-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            {currentStep === TUTORIAL_STEPS.length - 1 ? (
              "เริ่มใช้งาน"
            ) : (
              <>
                ถัดไป
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
