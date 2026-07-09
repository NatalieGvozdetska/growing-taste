# Product Requirements Document (PRD)
## Project: Growing Taste (AI-Powered Baby Weaning Companion)

---

## 1. Document Control
- **Product Name:** Growing Taste
- **Document Version:** 1.0.0
- **Status:** Draft / Derived from Source Code
- **Target Audience:** Engineering, Product, and Design teams

---

## 2. Product Overview & Vision
Introducing solid foods (weaning) is a critical, complex, and often stressful milestone for parents. Parents must track nutritional balance, monitor potential food allergies, keep gas-prone foods in check, and determine appropriate food textures. 

**Growing Taste** is a mobile-first web companion designed to simplify and de-risk this transition. By combining a structured, nutrition-balanced **Roadmap**, an easy-to-use **Food Intake Log**, and a **Safety-Guarded AI Chat Assistant**, Growing Taste empowers parents to introduce solids confidently, track reactions, and receive professional, tailored guidance in real time.

---

## 3. Core User Experience & Flows

### 3.1. Onboarding & AI Integration
To ensure a personalized experience, users complete a sequential 5-step onboarding flow:
1. **Welcome Screen:** High-level value proposition with clean branding and access to account creation/sign-in.
2. **Email Verification:** Users enter their email address to receive a secure 4-digit code.
3. **Secure Verification:** Inputting a 4-digit confirmation code (simulation default: `4827`) to log in or create an account.
4. **Baby Profile Setup:** Captures crucial parameters for safety checks:
   - **Baby's Name**
   - **Date of Birth (DOB):** Used to calculate age in months to enforce World Health Organization (WHO) safety guidelines.
   - **Feeding Style:** Options include *Purées*, *Baby-led weaning (BLW)*, or a *Mixed approach*.
5. **AI Connection:** Connects a third-party LLM provider for personalized chat and features.
   - **Supported Providers:** Anthropic Claude (Haiku/Sonnet), OpenAI GPT-4 (4o/4o-mini), Google Gemini (Flash/Pro).
   - **API Key Validation:** Simple client-side validation pattern matching known prefix keys (`sk-ant` for Claude, `sk-` for OpenAI, `AIza` for Gemini).
   - **Fallback Option:** Option to skip API key configuration and utilize standard Demo Mode.

---

## 4. Key Functional Features

### 4.1. Personalized Weaning Roadmap (Roadmap Tab)
The Roadmap calculates a dynamic queue of 12 food suggestions split across four weeks, tailored to the baby's profile and logging history.

* **Dynamic Suggestions (Today & Tomorrow):** Highlights the target food to introduce today and the subsequent food for tomorrow. Displays emojis, preparation tips, and key nutrients.
* **Deficit-Balanced Algorithm:** Suggests foods to balance food category representation (Vegetables, Fruits, Carbs, Proteins, Dairy, Allergens). Categories with fewer logged foods are prioritized.
* **Allergen Filtering:** Completely filters out any foods matching the baby's known list of allergies.
* **Risk Sorting:** Secondary sorting pushes lower-risk items to the front, helping parents introduce gentle foods first.
* **Category Balance Chart:** A visual bar chart indicating the proportion of foods logged in each category to encourage diet diversity.

### 4.2. Food Intake Log & AI Enrichment (Log Tab)
An interactive chronological record of all solid foods the baby has tasted.

* **Add/Edit Entry Form:**
  - Auto-suggest search matching predefined database foods (`FOOD_DB`) to quickly populate emojis, category, and nutrients.
  - Interactive dropdowns for Category and **Reaction Tracking** (None, Mild reaction, Strong reaction, Constipation, Diarrhea, Bloating, Spit-up).
  - Optional custom text input for notes.
  - **Duplicate Prevention:** Throws validation errors if parents try to log the same food twice (forces a single-entry-per-food model).
* **Chronological Log Feed:** Lists logged foods with custom color cards based on categories and reaction severity badges.
* **AI Enrichment for Custom Foods:** Allows logging custom/unknown foods not in `FOOD_DB`. The **"Enrich descriptions"** feature triggers an AI prompt (mocked in frontend) that populates detailed descriptions and instructions for non-database items.

### 4.3. Interactive Food Bottom Sheet (Product Sheet)
Clicking on any food inside the Roadmap or Log launches a bottom drawer displaying rich metadata:
* Category badge, risk badge, and a **Gas Risk indicator** (if applicable).
* Detailed description, list of key nutrients, and vitamin breakdown.
* **Safe Preparation Tip:** Handy advice on how to prep or serve the food (e.g., steam size, squishing blueberries).
* **"How to prepare this?" AI Integration:** One-click hand-off that copies a specialized preparation prompt directly into the AI Chat, keeping parents from typing instructions manually.

### 4.4. Safety-Guarded AI Assistant (AI Chat Tab)
A conversational interface powered by the connected LLM model. It is configured with a heavy system prompt containing strict medical, safety, and operational boundaries.

#### System Prompt Safety Guardrails:
1. **WHO Solid Food Compliance:** Warns or flags when attempting to guide solids for babies under 6 months old.
2. **Allergy Guardrails:** Under no circumstances should the AI suggest foods derived from the baby's known allergy list.
3. **Past Reaction Awareness:** Acknowledges past negative reactions and appends clear warning side-notes when discussing these foods.
4. **Allergen Spacing Rule:** Ensures proposed food schedules separate new high-risk allergens by at least 3 days.
5. **Age-Appropriate Textures:** Mandatory output requirement to detail (a) cooking method, (b) approximate cooking time, and (c) appropriate target texture based on the baby's exact age in months.
6. **Symptom Reasoner:** Guides parents through non-allergic cosmetic causes (e.g., acid skin rashes, carotene coloring) before diagnosing allergic/immune reactions.
7. **Gas Risk Awareness:** Advises minimal portions and slow escalation for gas-prone foods like broccoli, cauliflower, or lentils.
8. **Scope Limit:** Rejects questions unrelated to infant weaning, nutrition, and child health.

#### Chat Performance Optimizations:
* **Background Summarizer:** Silently sends older messages to the Anthropic API (via `claude-haiku-3-5-20241022`) every 10 turns to build a sliding context summary. This keeps token usage lean while retaining context.
* **Prompt Caching:** Employs Claude's cache control header (`anthropic-beta: prompt-caching-2024-07-31` and `cache_control: { type: "ephemeral" }`) to reduce latency and costs on repetitive system prompts.
* **Quick Chips:** Quick-tap chips for common parent concerns ("What should we try next?", "Why the red cheeks?", "Could this cause gas?").

### 4.5. Profile & Allergy Management (Profile Tab)
The settings dashboard representing the baby's metadata.
* **Age Calculation Display:** Translates date of birth into user-friendly tags (e.g., "7 months", "1y 2m").
* **WHO Warning Banner:** Displays a yellow notice if the baby is under 6 months old ("WHO recommends starting solids at 6 months").
* **Feeding Style Selector:** Toggle between Purées, BLW, and Mixed.
* **Allergy Selector:** Multiselect buttons for top common allergens (Egg, Peanut, Wheat, Dairy, Soy, Fish, Sesame, Tree nuts).
* **Family Allergy History Toggle:** Flags if siblings or parents suffer from severe allergies, which triggers cautious advice banners.

---

## 5. Technical Architecture & Data Model

### 5.1. Tech Stack
* **Framework:** React 19 + Vite (built as a single-page client application)
* **Styling:** Neumorphic design scheme custom-coded with inline CSS values (Soft peach, white, and orange shadow themes).
* **Icons:** `lucide-react`
* **Local Persistence:** Chat logs and summaries are stored in the browser's `localStorage` (`gt_chat_messages`, `gt_chat_summary`).

### 5.2. Static Database (Core Data Objects)
```typescript
interface FoodItem {
  food: string;
  emoji: string;
  category: 'vegetable' | 'fruit' | 'carb' | 'protein' | 'dairy' | 'allergen';
  risk: 'low' | 'medium' | 'high';
  gasRisk: boolean;
  tip: string;
  nutrients: string[];
  vitamins: string[];
  desc: string;
}
```

### 5.3. User State Schema
```typescript
interface BabyProfile {
  name: string;
  dob: string;       // DD/MM/YYYY
  feedingStyle: 'puree' | 'blw' | 'mixed';
  allergies: string[];
  familyAllergy: boolean;
}

interface LogEntry {
  id: number;
  date: string;       // YYYY-MM-DD
  food: string;
  emoji: string;
  category: string;
  reaction: 'none' | 'mild' | 'strong' | 'constipation' | 'diarrhea' | 'bloating' | 'spitup';
  notes: string;
  isUnknown?: boolean;
  enrichedDescription?: string;
}
```

---

## 6. Future Enhancements & Product Backlog
1. **Real-time Server Syncing:** Transition from simple `localStorage` state persistence to a backend database solution (e.g., Supabase or Firebase).
2. **True AI Enrichment Integrations:** Wire up the custom food description enrichment feature to active backend API endpoints rather than utilizing mock placeholders.
3. **Allergen Alert Notification:** Push notifications or alerts if a parent logs multiple potential allergens within a 3-day window.
4. **Exportable PDF Report:** Generate a compressed PDF of the food log and reaction history to easily share with pediatricians during check-ups.
