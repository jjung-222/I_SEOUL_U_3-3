import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../components"
import { useDialogStore } from "../../../shared/model/useDialogStore"
import { useCommentStore } from "../../../entities/comment/model/useCommentStore"
import { updateCommentToApi } from "../../../entities/comment/api/commentApi"

export const EditCommentDialog = () => {
  const { showEditCommentDialog, setShowEditCommentDialog } = useDialogStore()
  const { selectedComment, setSelectedComment, setComments } = useCommentStore()

  const updateComment = async () => {
    try {
      const data = await updateCommentToApi(selectedComment)
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={selectedComment?.body || ""} onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })} />
          <Button onClick={updateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
