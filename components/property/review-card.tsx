import { format } from "date-fns";

interface ReviewCardProps {
  review: {
    id: string;
    guestName: string;
    rating: number | null;
    publicReview: string | null;
    source: string;
    channel: string | null;
    submittedAt: Date;
    featured: boolean;
    cleanliness: number | null;
    communication: number | null;
    accuracy: number | null;
    location: number | null;
    checkin: number | null;
    value: number | null;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.guestName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const categories = [
    { name: "Cleanliness", value: review.cleanliness },
    { name: "Communication", value: review.communication },
    { name: "Accuracy", value: review.accuracy },
    { name: "Location", value: review.location },
    { name: "Check-in", value: review.checkin },
    { name: "Value", value: review.value },
  ].filter((cat) => cat.value !== null);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{review.guestName}</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(review.submittedAt), "MMMM yyyy")}
            </p>
          </div>
        </div>

        {/* Rating & Featured */}
        <div className="flex items-center gap-2">
          {review.featured && <span className="text-yellow-400 text-xl">⭐</span>}
          {review.rating && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">
                {review.rating.toFixed(1)}
              </span>
              <span className="text-yellow-400">★</span>
            </div>
          )}
        </div>
      </div>

      {/* Review Text */}
      {review.publicReview && (
        <p className="text-gray-700 mb-4 leading-relaxed">
          {review.publicReview}
        </p>
      )}

      {/* Category Ratings */}
      {categories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{category.name}</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-900">
                  {category.value?.toFixed(1)}
                </span>
                <span className="text-yellow-400 text-xs">★</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Source Badge */}
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {review.source}
        </span>
        {review.channel && (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {review.channel}
          </span>
        )}
      </div>
    </div>
  );
}

