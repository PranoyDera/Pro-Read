import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export default function JoinCircleSection() {
  return (
    <section className="relative overflow-hidden rounded-[26px] border border-white/8 bg-[linear-gradient(135deg,#7375ef_0%,#6564eb_52%,#7d79f4_100%)] mx-6 px-6 py-12 shadow-[0_24px_60px_rgba(49,52,133,0.35)] md:px-10">
      <div className="absolute right-[-8%] bottom-[-48%] h-72 w-96 rounded-full bg-white/12 blur-2xl" />
      <div className="absolute left-[-10%] bottom-[-42%] h-64 w-[70%] rounded-full bg-[#8792ff]/28 blur-2xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="[font-family:'Times New Roman',_serif] text-4xl font-semibold text-white md:text-5xl">
          Join the Circle
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-indigo-50/88 md:text-base">
          Become part of our exclusive community of readers and writers. Get
          weekly curated stories, early access to new features, and join live
          literary discussions.
        </p>

        <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-full bg-black/10 p-2 backdrop-blur md:flex-row">
          <Input
            type="email"
            placeholder="your@email.com"
            className="h-12 rounded-full border-0 bg-white px-5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-white/50"
          />
          <Button className="h-12 rounded-full bg-[#141827] px-7 text-sm font-semibold text-white hover:bg-[#0d1120]">
            Subscribe
          </Button>
        </div>

        <p className="mt-4 text-xs text-indigo-100/75">
          Join over 250,000 bibliophiles worldwide.
        </p>
      </div>
    </section>
  );
}
