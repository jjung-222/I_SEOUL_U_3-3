import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"

// Stores
import { usePostFilterStore } from "../features/post/model/usePostFilterStore"
import { usePostStore } from "../entities/post/model/usePostStore"
import { useDialogStore } from "../shared/model/useDialogStore"
import { useTagStore } from "../entities/tag/model/useTagStore"

// APIs
import { fetchPostsFromApi, fetchPostsBySearchFromApi, fetchPostsByTagFromApi } from "../entities/post/api/postApi"
import { fetchUsersFromApi } from "../entities/user/api/userApi"
import { fetchTagsFromApi } from "../entities/tag/api/tagApi"

// Types
import { Post } from "../entities/post/model/types"
import { User } from "../entities/user/model/types"

// Components
import { Button, Card, CardContent, CardHeader, CardTitle } from "../components"
import { PostSearchFilter } from "../features/post/ui/PostSearchFilter"
import { PostTable } from "../entities/post/ui/PostTable"
import { PostPagination } from "../features/post/ui/PostPagination"
import { AddPostDialog } from "../features/post/ui/AddPostDialog"
import { EditPostDialog } from "../features/post/ui/EditPostDialog"
import { AddCommentDialog } from "../features/comment/ui/AddCommentDialog"
import { EditCommentDialog } from "../features/comment/ui/EditCommentDialog"
import { PostDetailDialog } from "../entities/post/ui/PostDetailDialog"
import { UserDetailModal } from "../entities/user/ui/UserDetailModal"

const PostsManager = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { skip, limit, searchQuery, sortBy, sortOrder, selectedTag, setFilters } = usePostFilterStore()
  const { setPosts, setTotal, loading, setLoading } = usePostStore()
  const { setShowAddDialog } = useDialogStore()
  const { setTags } = useTagStore()

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await fetchTagsFromApi()
        setTags(data)
      } catch (error) {
        console.error("태그 가져오기 오류:", error)
      }
    }
    fetchTags()
  }, [setTags])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setFilters({
      skip: parseInt(params.get("skip") || "0"),
      limit: parseInt(params.get("limit") || "10"),
      searchQuery: params.get("search") || "",
      sortBy: params.get("sortBy") || "",
      sortOrder: params.get("sortOrder") || "asc",
      selectedTag: params.get("tag") || "",
    })
  }, [location.search, setFilters])

  const fetchPosts = () => {
    setLoading(true)
    Promise.all([fetchPostsFromApi(limit, skip), fetchUsersFromApi()])
      .then(([postsData, usersData]) => {
        const postsWithUsers = postsData.posts.map((post: Post) => ({
          ...post,
          author: usersData.users.find((user: User) => user.id === post.userId),
        }))
        setPosts(postsWithUsers)
        setTotal(postsData.total)
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }

  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([
        fetchPostsByTagFromApi(tag),
        fetchUsersFromApi(),
      ])
      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const data = await fetchPostsBySearchFromApi(searchQuery)
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostSearchFilter onSearch={searchPosts} />
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : <PostTable updateURL={updateURL} />}
          <PostPagination />
        </div>
      </CardContent>
      <AddPostDialog />
      <EditPostDialog />
      <AddCommentDialog />
      <EditCommentDialog />
      <PostDetailDialog />
      <UserDetailModal />
    </Card>
  )
}

export default PostsManager
