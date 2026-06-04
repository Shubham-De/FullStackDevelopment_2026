import { client } from "./client.js";

// This is the shape of a comment we send to the frontend
export type CommentData = {
  id: number;
  postId: number;
  parentId: number | null;
  author: string;
  content: string;
  createdAt: string; // ISO string so it's easy to send as JSON
  children: CommentData[]; // nested replies
};

// Get all comments for a specific post, organized into a tree structure
export async function getCommentsForPost(postId: number) {
  // 1. Fetch all comments for this post from the database
  const allComments = await client.db.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" }, // oldest first
  });

  // 2. Convert each database comment into our CommentData shape
  const commentList: CommentData[] = allComments.map((comment) => ({
    id: comment.id,
    postId: comment.postId,
    parentId: comment.parentId,
    author: comment.author,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    children: [], // we'll fill this in below
  }));

  // 3. Build a tree: put child comments inside their parent's "children" array
  //    We use a Map to quickly look up comments by their id
  const commentMap = new Map<number, CommentData>();
  for (const comment of commentList) {
    commentMap.set(comment.id, comment);
  }

  // 4. The "roots" are comments that have no parent (top-level comments)
  const rootComments: CommentData[] = [];

  for (const comment of commentList) {
    if (comment.parentId === null) {
      // This is a top-level comment
      rootComments.push(comment);
    } else {
      // This is a reply - find its parent and add it to the parent's children
      const parentComment = commentMap.get(comment.parentId);
      if (parentComment) {
        parentComment.children.push(comment);
      }
    }
  }

  return rootComments;
}

// Create a new comment (or reply if parentId is provided)
export async function createComment(
  postId: number,
  author: string,
  content: string,
  parentId?: number | null,
) {
  const newComment = await client.db.comment.create({
    data: {
      postId,
      author,
      content,
      parentId: parentId ?? null, // null means top-level comment
    },
  });

  // Return the comment in our CommentData shape
  return {
    id: newComment.id,
    postId: newComment.postId,
    parentId: newComment.parentId,
    author: newComment.author,
    content: newComment.content,
    createdAt: newComment.createdAt.toISOString(),
    children: [], // new comment has no replies yet
  } as CommentData;
}
