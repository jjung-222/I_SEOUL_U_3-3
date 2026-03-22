import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../components"
import { useDialogStore } from "../../../shared/model/useDialogStore"
import { useCommentStore } from "../../../entities/comment/model/useCommentStore"
import { addCommentToApi } from "../../../entities/comment/api/commentApi"

export const AddCommentDialog = () => {
  const { showAddCommentDialog, setShowAddCommentDialog } = useDialogStore()
  const { newComment, setNewComment, setComments } = useCommentStore()

  const addComment = async () => {
    try {
      const data = await addCommentToApi(newComment)
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={newComment.body} onChange={(e) => setNewComment({ ...newComment, body: e.target.value })} />
          <Button onClick={addComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
