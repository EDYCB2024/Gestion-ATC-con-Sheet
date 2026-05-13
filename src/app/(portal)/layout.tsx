import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ChatBubble } from "@/components/assistant/ChatBubble";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="pl-80 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1">
          {children}
        </main>
      </div>
      <ChatBubble />
    </>
  );
}
