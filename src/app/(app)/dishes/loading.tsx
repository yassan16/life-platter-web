export default function DishesLoading() {
  return (
    <div className="p-4">
      <div className="w-32 h-7 bg-gray-200 rounded animate-pulse mb-4" />

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
          >
            <div className="flex">
              <div className="w-24 h-24 bg-gray-200 animate-pulse" />
              <div className="flex-1 p-3 space-y-2">
                <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
