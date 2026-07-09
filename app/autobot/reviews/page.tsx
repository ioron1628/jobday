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
    return NextResponse.json({ error: "Review not found or no changes" }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}

export async function DELETE_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Review deleted successfully" }, { status: 204 });
}
