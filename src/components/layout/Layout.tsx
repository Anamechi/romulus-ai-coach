import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
// ChatbotWidget hidden 2026-09-30 during Supabase cutover (bot prompt is stale: old $27/$297 offers, no current spine). Restore this import and the widget below after the bot is rebuilt on the new spine + an OpenAI key is set.
// import { ChatbotWidget } from "@/components/ChatbotWidget";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      {/* <ChatbotWidget />  hidden 2026-09-30 during cutover — restore after bot rebuild */}
    </div>
  );
}
