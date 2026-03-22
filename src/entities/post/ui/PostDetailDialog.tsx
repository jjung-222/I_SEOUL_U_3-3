import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { useDialogStore } from "../../../shared/model/useDialogStore"
import { usePostStore } from "../model/usePostStore"
import { usePostFilterStore } from "../../../features/post/model/usePostFilterStore"
import { useCommentStore } from "../../comment/model/useCommentStore"
import { deleteCommentFromApi, likeCommentToApi } from "../../comment/api/commentApi"
import { HighlightText } from "../../../shared/ui/HighlightText"
import { Comment, NewComment } from "../../comment/model/types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components"

export const PostDetailDialog = () => {
  const { showPostDetailDialog, setShowPostDetailDialog, setShowAddCommentDialog, setShowEditCommentDialog } = useDialogStore()
  const { selectedPost } = usePostStore()
  const { searchQuery } = usePostFilterStore()
  const { comments, setComments, setNewComment, setSelectedComment } = useCommentStore()

  const postId = selectedPost?.id

  const deleteComment = async (id: number, pId: number) => {
    try {
      await deleteCommentFromApi(id)
      setComments((prev) => ({
        ...prev,
        [pId]: prev[pId].filter((comment: Comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error(error)
    }
  }

  const likeComment = async (id: number, pId: number) => {
    try {
      const data = await likeCommentToApi(id, comments[pId].find((c: Comment) => c.id === id)?.likes || 0)
      setComments((prev) => ({
        ...prev,
        [pId]: prev[pId].map((comment: Comment) => (comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment)),
      }))
    } catch (error) {
      console.error(error)
    }
  }

  const renderComments = () => (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment((prev: NewComment) => ({ ...prev, postId }))
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment: Comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user?.username}:</span>
              <span className="truncate"><HighlightText text={comment.body} highlight={searchQuery} /></span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle><HighlightText text={selectedPost?.title || ""} highlight={searchQuery} /></DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p><HighlightText text={selectedPost?.body || ""} highlight={searchQuery} /></p>
          {postId && renderComments()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
