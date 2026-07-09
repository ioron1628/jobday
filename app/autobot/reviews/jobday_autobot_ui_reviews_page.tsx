import React, { useEffect, useState } from 'react';
import { Review } from '../../types/autobot'; // Adjust path as needed

const AutobotReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/autobot/reviews');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Review[] = await response.json();
        setReviews(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleApprove = async (reviewId: string) => {
    console.log(`Approving review ${reviewId}`);
    try {
      const response = await fetch(`/api/autobot/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setReviews(prevReviews => prevReviews.map(r => r.id === reviewId ? { ...r, status: 'approved' } : r));
      alert(`Review ${reviewId} approved!`);
    } catch (err: any) {
      console.error("Failed to approve review:", err);
      alert(`Failed to approve review ${reviewId}: ${err.message}`);
    }
  };

  const handleReject = async (reviewId: string) => {
    console.log(`Rejecting review ${reviewId}`);
    try {
      const response = await fetch(`/api/autobot/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setReviews(prevReviews => prevReviews.map(r => r.id === reviewId ? { ...r, status: 'rejected' } : r));
      alert(`Review ${reviewId} rejected!`);
    } catch (err: any) {
      console.error("Failed to reject review:", err);
      alert(`Failed to reject review ${reviewId}: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">AutoBot Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Task ID: {review.task_id}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Reviewer ID: {review.reviewer_id}</p>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Status: {review.status}</p>
            {review.comments && <p className="text-gray-600 dark:text-gray-400 text-sm">Comments: {review.comments}</p>}
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Created: {new Date(review.created_at).toLocaleString()}</p>
            <div className="mt-4 flex space-x-2">
              {review.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(review.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {reviews.length === 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No reviews found. All tasks are approved or no tasks require review.
        </div>
      )}
    </div>
  );
};

export default AutobotReviews;
