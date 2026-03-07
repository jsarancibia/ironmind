import { ChatWindow } from '@/components/ChatWindow';

export default function Home() {
  return (
    <main className="h-screen w-full bg-[#0a0a0f]">
      <div className="h-full max-w-4xl mx-auto border-x border-blue-500/20">
        <ChatWindow />
      </div>
    </main>
  );
}
