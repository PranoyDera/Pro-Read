export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#070c18] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Reading History
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white">
          Your reading timeline will appear here.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          We have the route wired up now, and this page is ready for the
          history experience to be built out without breaking sidebar
          navigation.
        </p>
      </div>
    </div>
  );
}
