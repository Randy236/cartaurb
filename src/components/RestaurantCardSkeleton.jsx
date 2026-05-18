export function RestaurantCardSkeleton () {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] card-shadow">
      <div className="aspect-[16/10] animate-pulse bg-gradient-to-br from-white/10 to-white/5" />
      <div className="space-y-3 p-5">
        <div className="h-6 w-2/3 animate-pulse rounded-lg bg-white/10" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-white/5" />
        <div className="h-4 w-4/5 animate-pulse rounded-lg bg-white/5" />
        <div className="flex gap-2 pt-2">
          <div className="h-12 flex-1 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-12 flex-1 animate-pulse rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
  )
}
