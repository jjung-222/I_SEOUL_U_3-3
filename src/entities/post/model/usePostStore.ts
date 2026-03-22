import { create } from "zustand"
import { Post, NewPost } from "./types"

interface PostState {
  posts: Post[]
  total: number
  selectedPost: Post | null
  newPost: NewPost
  loading: boolean
  setPosts: (updater: Post[] | ((prev: Post[]) => Post[])) => void
  setTotal: (total: number) => void
  setSelectedPost: (post: Post | null) => void
  setNewPost: (updater: NewPost | ((prev: NewPost) => NewPost)) => void
  setLoading: (loading: boolean) => void
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  total: 0,
  selectedPost: null,
  newPost: { title: "", body: "", userId: 1 },
  loading: false,

  setPosts: (updater) =>
    set((state) => ({
      posts: typeof updater === "function" ? updater(state.posts) : updater,
    })),

  setTotal: (total) => set({ total }),
  setSelectedPost: (post) => set({ selectedPost: post }),

  setNewPost: (updater) =>
    set((state) => ({
      newPost: typeof updater === "function" ? updater(state.newPost) : updater,
    })),

  setLoading: (loading) => set({ loading }),
}))
