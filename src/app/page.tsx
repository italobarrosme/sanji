import { RenderCanvas } from "@/common/components/RenderCanvas";

export default function Home() {
  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-between bg-white">
      <RenderCanvas />
    </main>
  )
}
