interface Props {
  postId: number;
}

export const CommentSection = ({ postId }: Props) => {
  return <div>Comments for post {postId} will go here.</div>;
};
