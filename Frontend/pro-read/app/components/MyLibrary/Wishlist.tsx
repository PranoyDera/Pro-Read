export default function Wishlist() {
  return (
    <div className="bg-[#1A1D22] rounded-lg p-4">
      <h3 className="mb-3 font-semibold">Wishlist</h3>

      {["Quantum Realities", "Metaphysics of Presence"].map((item, i) => (
        <div key={i} className="flex justify-between text-sm py-1">
          <span>{item}</span>
          <span className="text-gray-400">→</span>
        </div>
      ))}
    </div>
  );
}