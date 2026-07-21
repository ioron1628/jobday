import PodcastDetailPage from "@/app/podcast/[id]/page";
import { podcastEpisodes } from "@/lib/podcast";

export const dynamic = "force-static";

export function generateStaticParams() {
  return podcastEpisodes.map((episode) => ({ slug: episode.id }));
}

export default async function EpisodeDetailAliasPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return PodcastDetailPage({ params: Promise.resolve({ id: slug }) });
}
