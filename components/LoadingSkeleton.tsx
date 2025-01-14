function SkeletonCard() {
  return (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-4" />
        <div className="flex justify-between items-center">
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
            <div className="h-5 bg-gray-200 rounded w-16" />
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
            <div className="h-5 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
