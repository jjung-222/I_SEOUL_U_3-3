import { create } from "zustand"
import { Comment, NewComment } from "./types"

interface CommentState {
  comments: Record<number, Comment[]>
  selectedComment: Comment | null
  newComment: NewComment
  setComments: (updater: Record<number, Comment[]> | ((prev: Record<number, Comment[]>) => Record<number, Comment[]>)) => void
  setSelectedComment: (comment: Comment | null) => void
  setNewComment: (updater: NewComment | ((prev: NewComment) => NewComment)) => void
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: {},
  selectedComment: null,
  newComment: { body: "", postId: null, userId: 1 },

  setComments: (updater) =>
    set((state) => ({
      comments: typeof updater === "function" ? updater(state.comments) : updater,
    })),

  setSelectedComment: (comment) => set({ selectedComment: comment }),

  setNewComment: (updater) =>
    set((state) => ({
      newComment: typeof updater === "function" ? updater(state.newComment) : updater,
    })),
}))
