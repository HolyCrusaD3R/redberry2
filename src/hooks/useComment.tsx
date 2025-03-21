import { useState, useEffect } from "react";
import apiKey from "../keys/apiKey";

interface Comment {
  id: number;
  text: string;
  task_id: number;
  parent_id: number | null;
  author_avatar?: string;
  author_nickname?: string;
  sub_comments?: Comment[];
}

interface UseCommentProps {
  taskId: number | null;
}

export default function useComment({ taskId }: UseCommentProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const token = apiKey;

  useEffect(() => {
    async function fetchComments() {
      if (!taskId) return;

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://momentum.redberryinternship.ge/api/tasks/${taskId}/comments`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch comments");
        }

        const json = await res.json();
        setComments(json);
      } catch (err: any) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [taskId]);

  const createComment = async (
    text: string,
    parentId: number | null = null
  ): Promise<Comment | null> => {
    if (!taskId) return null;

    try {
      setLoading(true);
      setError(null);

      const requestBody: { text: string; parent_id?: number } = {
        text,
      };

      if (parentId !== null) {
        requestBody.parent_id = parentId;
      }

      const res = await fetch(
        `https://momentum.redberryinternship.ge/api/tasks/${taskId}/comments`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create comment");
      }

      const newComment = await res.json();

      setComments((prevComments) => {
        if (parentId) {
          return prevComments.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                sub_comments: [...(comment.sub_comments || []), newComment],
              };
            }
            return comment;
          });
        } else {
          return [...prevComments, newComment];
        }
      });

      return newComment;
    } catch (err: any) {
      console.error(err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    comments,
    loading,
    error,
    createComment,
  };
}
