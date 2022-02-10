import { deleteDoc, doc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import { IMessage } from "../shared/interfaces";

interface Props extends IMessage {}
export const Message: React.FC<Props> = ({
  edited,
  id,
  message,
  photoURL,
  timestamp,
  user,
}) => {
  const { user: loggedInUser } = useAuthContext();
  const { id: chatId } = useParams() as { id: string };

  const deleteMessage = async () => {
    if (user !== loggedInUser?.email) return;
    await deleteDoc(doc(db, "chats", `${chatId}`, "messages", `${id}`));
    toast("Message Deleted Successfully", { type: "success" });
  };

  return (
    <div
      className={`flex items-center mt-4 ${
        user === loggedInUser?.email ? "" : "self-end"
      }`}
    >
      {user === loggedInUser?.email ? (
        <>
          <div>
            <img
              src={photoURL}
              className="w-6 h-6 rounded-full"
              alt="message user"
            />
          </div>
          <p className="ml-3">{message}</p>
        </>
      ) : (
        <>
          <p className="mr-3">{message}</p>
          <div>
            <img
              src={photoURL}
              className="w-6 h-6 rounded-full"
              alt="message user"
            />
          </div>
        </>
      )}
    </div>
  );
};
