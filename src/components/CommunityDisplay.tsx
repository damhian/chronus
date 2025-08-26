import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

interface Props {
  communityId: number;
}

interface PostWithCommunity extends Post {
  communities: {
    name: string;
  };
}

interface community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export const fetchCommunityPost = async (
  communityId: number,
): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as PostWithCommunity[];
};

const fetchCommunityById = async (communityId: number): Promise<community> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("id", communityId)
    .single();

  if (error) throw new Error(error.message);
  return data as community;
};

export const CommunityDisplay = ({ communityId }: Props) => {
  const {
    data: postsData,
    error: postsError,
    isLoading: postsIsLoading,
  } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  const {
    data: communityData,
    error: communityError,
    isLoading: communityIsLoading,
  } = useQuery<community, Error>({
    queryKey: ["community", communityId],
    queryFn: () => fetchCommunityById(communityId),
  });

  if (postsIsLoading || communityIsLoading)
    return <div className="text-center py-4">Loading communities...</div>;
  if (postsError)
    return (
      <div className="text-center text-red-500 py-4">
        Error: {postsError.message}
      </div>
    );

  if (communityError)
    return (
      <div className="text-center text-red-500 py-4">
        Error: {communityError.message}
      </div>
    );

  return (
    <div>
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {(postsData && postsData[0]?.communities?.name) || communityData?.name}{" "}
        Community Posts
      </h2>

      {postsData && postsData.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {postsData.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10">
          No posts in this community yet.
        </p>
      )}
    </div>
  );
};
