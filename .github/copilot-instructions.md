# Copilot Instructions for Esycopify

## Project Overview

**Esycopify** เป็น Web Application สำหรับจัดการข้อความเทมเพลต (Template Messages) ในรูปแบบ Kanban Board พัฒนาด้วย Next.js 16 และ React 19 โดยมีความสามารถหลักคือ:

- สร้างและจัดการกระดาน (Boards) หลายกระดาน
- สร้างรายการ (Lists) ภายในกระดานแต่ละอัน
- สร้างการ์ด (Cards) ที่เก็บข้อความเทมเพลต
- รองรับ **Template Variables** ในรูปแบบ `{{variableName}}` ที่ผู้ใช้สามารถกรอกค่าแล้วคัดลอกไปใช้งานได้
- Drag & Drop สำหรับจัดเรียงและย้ายการ์ดระหว่างรายการ

## Tech Stack

### Core Framework

- **Next.js 16** - React Framework with App Router
- **React 19** - UI Library
- **TypeScript** - Type Safety

### Backend & Database

- **Supabase** - Backend-as-a-Service
  - Authentication (Email/Password)
  - PostgreSQL Database
  - Row Level Security (RLS)

### State Management

- **Zustand** - Lightweight state management library

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** (New York style) - UI Component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **next-themes** - Theme switching (Light/Dark mode)

### Drag & Drop

- **@dnd-kit** - Modern drag and drop toolkit
  - `@dnd-kit/core`
  - `@dnd-kit/sortable`
  - `@dnd-kit/utilities`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # หน้าหลัก - Board View (Single Board per User)
│   ├── layout.tsx         # Root layout with header
│   ├── globals.css        # Global styles
│   └── login/
│       └── page.tsx       # หน้า Login/Signup
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── board/             # Board-specific components
│   │   ├── board-canvas.tsx   # Drag & Drop container
│   │   ├── list-column.tsx    # รายการ (List) + Inline Add Card
│   │   └── card-item.tsx      # การ์ดข้อความเทมเพลต
│   ├── theme-provider.tsx # Theme context provider
│   ├── mode-toggle.tsx    # Dark/Light mode toggle
│   └── user-nav.tsx       # User menu (logout)
├── store/
│   └── use-board-store.ts # Zustand store สำหรับจัดการ state
├── lib/
│   └── utils.ts           # Utility functions (cn)
└── utils/
    └── supabase/
        ├── client.ts      # Supabase browser client
        ├── server.ts      # Supabase server client
        └── middleware.ts  # Auth middleware
```

## Database Schema

### Tables

1. **boards** - กระดาน
   - `id` (uuid, PK)
   - `user_id` (uuid, FK -> auth.users)
   - `title` (text)
   - `color` (text) - สีพื้นหลัง (optional)
   - `created_at` (timestamp)

2. **lists** - รายการในกระดาน
   - `id` (uuid, PK)
   - `board_id` (uuid, FK -> boards)
   - `title` (text)
   - `position` (integer)
   - `created_at` (timestamp)

3. **cards** - การ์ดข้อความเทมเพลต
   - `id` (uuid, PK)
   - `list_id` (uuid, FK -> lists)
   - `content` (text) - ข้อความเทมเพลต
   - `position` (integer)
   - `color` (text) - สีพื้นหลัง (optional)
   - `variables` (jsonb) - เก็บค่า variables
   - `created_at` (timestamp)

### Row Level Security

ทุก table มี RLS policies ที่จำกัดให้ผู้ใช้เข้าถึงได้เฉพาะข้อมูลของตนเอง

## Key Features Implementation

### Single Board per User

- ผู้ใช้งาน 1 คนมีบอร์ดเดียว (auto-create เมื่อ login ครั้งแรก)
- ชื่อเริ่มต้น: "เทมเพลตของฉัน"
- ใช้ `fetchOrCreateBoard()` ใน store สำหรับ fetch/create

### Template Variables

การ์ดรองรับ template variables ในรูปแบบ `{{variableName}}`:

```
สวัสดีคุณ {{customerName}},
รหัสส่วนลดของคุณคือ {{discountCode}}
```

เมื่อเปิดการ์ด ระบบจะ:

1. Parse หา variables ด้วย regex: `/\{\{([^}]+)\}\}/g`
2. แสดง input fields สำหรับแต่ละ variable
3. ให้ผู้ใช้กรอกค่าและคัดลอกข้อความที่แทนที่แล้ว

### Variable Insertion (Inline)

เมื่อเพิ่มการ์ดใหม่:

- คลิกปุ่ม "+ ตัวแปร" จะแสดง popover เล็กๆ
- มี 10 ตัวแปรที่ใช้บ่อย: ชื่อ, นามสกุล, บริษัท, วันที่, เวลา, ราคา, จำนวน, เบอร์โทร, อีเมล, ที่อยู่
- สามารถพิมพ์ตัวแปรใหม่ได้
- คลิกเลือกแล้วจะแทรกที่ cursor position

### Quick Copy

- การ์ดที่ไม่มี variables สามารถคลิกเพื่อคัดลอกได้ทันที
- แสดง feedback "คัดลอกแล้ว!" เมื่อคัดลอกสำเร็จ

### Custom Colors

บอร์ดและการ์ดรองรับการเปลี่ยนสีพื้นหลัง:

- **Solid Colors**: 18 สีพื้น (Rose, Pink, Purple, Blue, Green, etc.)
- **Gradients**: 8 gradient สวยๆ (Sunset, Ocean, Forest, Candy, etc.)
- ใช้ `ColorPicker` component สำหรับเลือกสีแบบ full
- ใช้ `MiniColorPicker` สำหรับเลือกสีแบบ inline บนการ์ด

### Drag & Drop

ใช้ @dnd-kit สำหรับ:

- ลาก Lists เพื่อจัดเรียง (horizontal)
- ลาก Cards ภายใน List เดียวกัน (vertical)
- ลาก Cards ไประหว่าง Lists

### UX Design Principles

- **Minimal Popups**: ใช้ inline editing แทน Dialog ที่เป็นไปได้
- **Inline Add**: การเพิ่มรายการ/การ์ดทำแบบ inline (ไม่มี popup)
- **Small Popovers**: ใช้ popover เล็กๆ สำหรับ feature รอง เช่น color picker, variable insertion

## Coding Conventions

### TypeScript

- ใช้ `interface` สำหรับ data models
- ใช้ type inference เมื่อเป็นไปได้
- ไม่ใช้ `any` ยกเว้นจำเป็น

### React Components

- ใช้ functional components เท่านั้น
- ใช้ `"use client"` directive สำหรับ client components
- ใช้ hooks สำหรับ state management

### Styling

- ใช้ Tailwind CSS classes
- ใช้ `cn()` utility สำหรับ conditional classes
- รองรับทั้ง Light และ Dark mode

### Naming Conventions

- Components: PascalCase (`BoardCanvas.tsx`)
- Files: kebab-case (`board-canvas.tsx`)
- Hooks/Stores: camelCase with prefix (`useBoardStore`)
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE

### Imports

- ใช้ `@/` path alias สำหรับ imports
- Group imports: React -> Next -> Third-party -> Local

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Common Tasks

### Adding a new UI component (shadcn/ui)

```bash
npx shadcn@latest add [component-name]
```

### Adding a new page

1. สร้างไฟล์ใน `src/app/[route]/page.tsx`
2. ใช้ `"use client"` ถ้าต้องการ client-side features

### Adding a new store action

1. เพิ่ม method ใน `BoardState` interface
2. Implement ใน Zustand store
3. เรียกใช้ผ่าน `useBoardStore()` hook

### Adding a new database operation

1. ใช้ `supabase.from('table')` methods
2. Handle errors appropriately
3. Update local state หลัง database operation สำเร็จ

## Language

- UI/UX text: Thai (ไทย)
- Code/Comments: English
- Variable names: English

## Testing

- ยังไม่มี test framework ติดตั้ง
- พิจารณาใช้ Vitest + React Testing Library ในอนาคต

## Performance Considerations

- ใช้ `useMemo` สำหรับ computed values ที่ expensive
- ใช้ optimistic updates สำหรับ better UX
- Sort data locally หลังจาก fetch จาก Supabase
