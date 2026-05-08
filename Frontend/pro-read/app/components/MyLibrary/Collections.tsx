export default function Collections() {
  return (
    <div className="bg-[#1A1D22] rounded-lg p-4">
      <h3 className="mb-3 font-semibold">Personal Collections</h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#2A2E35] p-3 rounded text-sm">
          Philosophy
        </div>
        <div className="bg-[#2A2E35] p-3 rounded text-sm">
          Art & Design
        </div>
      </div>
    </div>
  );
}