import React, { useState } from "react";
import useComment from "../hooks/useComment";

import LeftArr from "../assets/LeftArr.svg";

function CommentSection({ taskId }: { taskId: number }) {
  const { comments, loading, error, createComment } = useComment({ taskId });
  const [newCommentText, setNewCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [wrongInput, setWrongInput] = useState<boolean>(false);
  const [wrongReplyInput, setWrongReplyInput] = useState<boolean>(false);

  const handleSubmitComment = async () => {
    if (!newCommentText.trim()) {
      setWrongInput(true);
      return;
    }

    try {
      await createComment(newCommentText, null);
      setNewCommentText("");
    } catch (err) {
      console.error("Failed to submit comment:", err);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      setWrongReplyInput(true);
      return;
    }

    try {
      await createComment(replyText, replyingTo);
      setReplyText("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Failed to submit reply:", err);
    }
  };

  const handleReplyClick = (commentId: number) => {
    setReplyingTo(commentId);
    setReplyText("");
    setWrongReplyInput(false);
  };

  if (loading) return <div>კომენტარები იტვირთება...</div>;
  if (error)
    return <div>შეცდომა კომენტარების ჩატვირთვისას: {error.message}</div>;

  return (
    <div className="comments-section w-full">
      <div className="comment-form mb-8">
        <div className="flex items-center h-[135px] relative">
          <textarea
            value={newCommentText}
            onChange={(e) => {
              setWrongInput(false);
              setNewCommentText(e.target.value);
            }}
            placeholder="დაწერე კომენტარი"
            className={`w-full resize-none h-full font-firago text-[14px] py-[18px] px-5 rounded-md border focus:outline-none ${
              wrongInput ? "border-customRed" : "border-gray-200"
            } `}
          />
          <button
            onClick={handleSubmitComment}
            className="absolute font-firago font-normal bottom-[15px] right-[20px] bg-primary hover:bg-secondary cursor-pointer text-white px-5 py-2 rounded-[20px] text-[16px]"
          >
            დაკომენტარება
          </button>
        </div>
      </div>

      <div className="font-firago">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-medium">კომენტარები</h3>
          <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {comments.reduce(
              (count, e) =>
                e.sub_comments ? count + 1 + e.sub_comments.length : count + 1,
              0
            )}
          </div>
        </div>

        {comments.length === 0 ? (
          <p>კომენტარები ჯერ არ არის</p>
        ) : (
          <div className="flex flex-col gap-[38px] space-y-4 mt-[40px]">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="flex items-start gap-3 mb-2">
                  {comment.author_avatar && (
                    <img
                      src={comment.author_avatar}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-bold mb-1">
                      {comment.author_nickname || "Anonymous"}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">{comment.text}</p>
                    <button
                      onClick={() => handleReplyClick(comment.id)}
                      className="text-primary hover:text-secondary cursor-pointer text-xs flex items-center gap-1"
                    >
                      <img src={LeftArr} height={16} width={16} />
                      უპასუხე
                    </button>
                  </div>
                </div>
                {replyingTo === comment.id && (
                  <div className="reply-form mt-2 ml-12">
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => {
                          setWrongReplyInput(false);
                          setReplyText(e.target.value);
                        }}
                        placeholder="დაწერე პასუხი..."
                        className={`w-full resize-none h-[80px] font-firago text-[14px] py-[12px] px-4 rounded-md border focus:outline-none ${
                          wrongReplyInput
                            ? "border-customRed"
                            : "border-gray-200"
                        }`}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="text-gray-500 cursor-pointer px-4 py-1 rounded-[20px] text-sm"
                        >
                          გაუქმება
                        </button>
                        <button
                          onClick={handleSubmitReply}
                          className="bg-primary hover:bg-secondary cursor-pointer text-white px-4 py-1 rounded-[20px] text-sm"
                        >
                          პასუხი
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {comment.sub_comments && comment.sub_comments.length > 0 && (
                  <div className="flex flex-col gap-[10px] pl-12 space-y-4 mt-5">
                    {comment.sub_comments.map((subComment) => (
                      <div
                        key={subComment.id}
                        className="flex items-start gap-3"
                      >
                        {subComment.author_avatar && (
                          <img
                            src={subComment.author_avatar}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-bold mb-1">
                            {subComment.author_nickname || "Anonymous"}
                          </p>
                          <p className="text-sm text-gray-700">
                            {subComment.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
