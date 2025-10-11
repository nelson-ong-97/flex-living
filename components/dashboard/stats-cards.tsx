"use client";

interface StatsCardsProps {
  stats: {
    totalReviews: number;
    approvedReviews: number;
    pendingReviews: number;
    featuredReviews: number;
    averageRating: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      icon: "📊",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Approved",
      value: stats.approvedReviews,
      icon: "✅",
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Pending",
      value: stats.pendingReviews,
      icon: "⏳",
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      title: "Featured",
      value: stats.featuredReviews,
      icon: "⭐",
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      icon: "📈",
      color: "bg-indigo-50 text-indigo-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.color} rounded-lg p-6 shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">{card.title}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
            <div className="text-4xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

