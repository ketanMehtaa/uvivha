interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className = "" }: ShimmerProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
    </div>
  );
}

export function FormShimmer() {
  return (
    <div className="space-y-6">
      {/* Name field shimmer */}
      <div>
        <div className="h-5 w-20 mb-2">
          <Shimmer className="h-full" />
        </div>
        <Shimmer className="h-10" />
      </div>

      {/* Password field shimmer */}
      <div>
        <div className="h-5 w-20 mb-2">
          <Shimmer className="h-full" />
        </div>
        <Shimmer className="h-10" />
      </div>

      {/* Email field shimmer */}
      <div>
        <div className="h-5 w-20 mb-2">
          <Shimmer className="h-full" />
        </div>
        <Shimmer className="h-10" />
      </div>

      {/* Gender field shimmer */}
      <div>
        <div className="h-5 w-20 mb-2">
          <Shimmer className="h-full" />
        </div>
        <Shimmer className="h-10" />
      </div>

      {/* Birth Date field shimmer */}
      <div>
        <div className="h-5 w-20 mb-2">
          <Shimmer className="h-full" />
        </div>
        <Shimmer className="h-10" />
      </div>

      {/* Location field shimmer */}
      <div>
        <div className="h-5 w-20 mb-2">
          <Shimmer className="h-full" />
        </div>
        <Shimmer className="h-10" />
      </div>

      {/* Bio field shimmer */}
      <div>
        <div className="h-5 w-20 mb-2">
          <Shimmer className="h-full" />
        </div>
        <Shimmer className="h-24" />
      </div>

      {/* Caste field shimmer */}
      <div>
        <div className="h-5 w-20 mb-2">
          <Shimmer className="h-full" />
        </div>
        <Shimmer className="h-10" />
      </div>

      {/* Buttons shimmer */}
      <div className="flex justify-between pt-4">
        <Shimmer className="h-10 w-24" />
        <Shimmer className="h-10 w-24" />
      </div>
    </div>
  );
} 