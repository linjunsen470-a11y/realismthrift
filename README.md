<div align="center">
<img width="1200" height="475" alt="RealismThrift Banner" src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80" />
</div>

# RealismThrift Export Co., Ltd

RealismThrift is a premier wholesale supplier of high-quality second-hand clothes, shoes, and bags from China. With over 12 years of experience and a 15,000 m² sorting facility, we service 1,200+ wholesale buyers across 110+ countries.

## 🌍 Global Presence
- **Market Reach**: Africa, Southeast Asia, Middle East, Europe, and South America.
- **Capacity**: Processing 500+ tonnes of A-Grade merchandise monthly.
- **Network**: Direct sourcing from first-tier cities like Beijing, Shanghai, and Guangzhou.

## 🚀 Technical Stack
This digital platform is built with modern web technologies to ensure a premium inquiry and browsing experience:
- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Animations**: Motion (Frame Motion)
- **Form Handling**: React Hook Form + Resend (Inquiry integration)

## 🛠️ Development Setup

### Prerequisites
- **Node.js** (LTS version)
- **pnpm** (preferred) or npm

### Installation
1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```

2. Configuration:
   Create a `.env.local` file and set the following (see `.env.example`):
   ```env
   GEMINI_API_KEY=your_api_key_here
   RESEND_API_KEY=your_resend_api_key_here
   ```

3. Run locally:
   ```bash
   pnpm dev
   ```

4. Build for production:
   ```bash
   pnpm build
   ```

## 📂 Project Structure
- `app/`: Next.js pages and API routes.
- `components/`: Modular UI components (InquiryForm, ProductCards, etc.).
- `data/`: `siteData.ts` contains the core business data and catalog.
- `public/`: Static assets and images.
- `original_pages/`: Audit files from the original platform.

## 🤝 Professional Service Network
For a detailed breakdown of our sourcing, quality control, and logistics operations, please refer to [AGENTS.MD](AGENTS.MD).

---
© 2026 RealismThrift Export Co., Ltd. All Rights Reserved.
