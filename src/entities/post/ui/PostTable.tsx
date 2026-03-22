import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { usePostStore } from "../model/usePostStore"
import { usePostFilterStore } from "../../../features/post/model/usePostFilterStore"
import { useDialogStore } from "../../../shared/model/useDialogStore"
import { HighlightText } from "../../../shared/ui/HighlightText"
import { deletePostFromApi } from "../api/postApi"
import { fetchCommentsFromApi } from "../../comment/api/commentApi"
import { fetchUserByIdFromApi } from "../../user/api/userApi"
import { useCommentStore } from "../../comment/model/useCommentStore"
import { useUserStore } from "../../user/model/useUserStore"
import { Post } from "../model/types"
import { User } from "../../user/model/types"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components"

export const PostTable = ({ updateURL }: { updateURL: () => void }) => {
  const { posts, setPosts, setSelectedPost } = usePostStore()
  const { searchQuery, selectedTag, setSelectedTag } = usePostFilterStore()
  const { setShowPostDetailDialog, setShowEditDialog, setShowUserModal } = useDialogStore()
  const { setComments } = useCommentStore()
  const { setSelectedUser } = useUserStore()

  const openPostDetail = async (post: Post) => {
    setSelectedPost(post)
    try {
      const data = await fetchCommentsFromApi(post.id)
      setComments((prev) => ({ ...prev, [post.id]: data.comments }))
    } catch (error) {
      console.error(error)
    }
    setShowPostDetailDialog(true)
  }

  const deletePost = async (id: number) => {
    try {
      await deletePostFromApi(id)
      setPosts((prev: Post[]) => prev.filter((post: Post) => post.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const openUserModal = async (user: User) => {
    try {
      const userData = await fetchUserByIdFromApi(user.id)
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div><HighlightText text={post.title} highlight={searchQuery} /></div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        setSelectedTag(tag)
                        updateURL()
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => openUserModal(post.author)}>
                <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post)
                    setShowEditDialog(true)
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
