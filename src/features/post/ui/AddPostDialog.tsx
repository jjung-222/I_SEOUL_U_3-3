import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../components"
import { useDialogStore } from "../../../shared/model/useDialogStore"
import { usePostStore } from "../../../entities/post/model/usePostStore"
import { addPostToApi } from "../../../entities/post/api/postApi"

export const AddPostDialog = () => {
  const { showAddDialog, setShowAddDialog } = useDialogStore()
  const { newPost, setNewPost, posts, setPosts } = usePostStore()

  const addPost = async () => {
    try {
      const data = await addPostToApi(newPost)
      setPosts([data, ...posts])
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
          <Textarea rows={30} placeholder="내용" value={newPost.body} onChange={(e) => setNewPost({ ...newPost, body: e.target.value })} />
          <Input type="number" placeholder="사용자 ID" value={newPost.userId} onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })} />
          <Button onClick={addPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
