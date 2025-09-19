import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNewChat } from "@/lib/chatApi";
import { useDispatch } from "react-redux";
import { setNewChat, setSelectedChatId } from "@/store/slices/chatSlice";

export default function CreateChatModal({ open, onClose }) {
  const [title, setTitle] = React.useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (title.trim()) {
        setTitle("");
      }
      const chatResponse = await createNewChat(title);

      dispatch(setNewChat(chatResponse.chat));
      dispatch(setSelectedChatId(chatResponse.chat._id));
      onClose();
      // console.log("chat response", chatResponse);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              placeholder="Chat Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <DialogFooter>
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
