import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import { IUser } from "../shared/interfaces";

interface Props {
  users: [string, string];
  id: string;
}

export const ChatCard: React.FC<Props> = ({ users, id }) => {
  const { user } = useAuthContext();
  const [otherUser, setOtherUser] = useState<IUser>();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const otherUserEmail = users.find((email) => email !== user?.email);
      const otherUserDoc = await getDoc(doc(db, "users", `${otherUserEmail}`));
      setOtherUser(otherUserDoc.data() as IUser);
    })();
  }, [user?.email, users]);

  return (
    <div
      onClick={() => navigate(`/chat/${id}`)}
      className="flex items-center mt-4 cursor-pointer hover:bg-gray-300 rounded-md px-2 py-2"
    >
      <img
        src={otherUser?.photo}
        className="w-12 h-12 rounded-full"
        alt={`${otherUser?.name} Profile`}
      />
      <p className="ml-4 text-lg">{otherUser?.name} </p>
    </div>
  );
};
