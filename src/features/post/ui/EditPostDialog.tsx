import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../components"
import { useDialogStore } from "../../../shared/model/useDialogStore"
import { usePostStore } from "../../../entities/post/model/usePostStore"
import { updatePostToApi } from "../../../entities/post/api/postApi"

export const EditPostDialog = () => {
  const { showEditDialog, setShowEditDialog } = useDialogStore()
  const { selectedPost, setSelectedPost, posts, setPosts } = usePostStore()

  const updatePost = async () => {
    try {
      const data = await updatePostToApi(selectedPost)
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={selectedPost?.title || ""} onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })} />
          <Textarea rows={15} placeholder="내용" value={selectedPost?.body || ""} onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })} />
          <Button onClick={updatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
