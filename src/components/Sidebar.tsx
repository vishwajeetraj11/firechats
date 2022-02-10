import classNames from "classnames";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useAuthContext } from "../contexts/AuthContext";
import { auth, db } from "../services/firebase";
import { IChat } from "../shared/interfaces";
import { useClickOutside } from "./../hooks/useClickOutside";
import { ChatCard } from "./ChatCard";
import { Modal } from "./Modal";

interface Props {
  // Show menu (for small screen only)
  showSidebar: boolean;
  setShowSidebar?: Dispatch<SetStateAction<boolean>>;
}

export const SideBar: React.FC<Props> = ({ showSidebar, setShowSidebar }) => {
  let classes = classNames(
    "absolute lg:static inset-0 transform duration-300 lg:relative lg:translate-x-0 bg-white flex flex-col flex-shrink-0 w-72 text-sm text-gray-700 border-r border-gray-100 lg:shadow-none justify-items-start h-screen bg-slate-100",
    {
      "-translate-x-full ease-out shadow-none": !showSidebar,
      "translate-x-0 ease-in shadow-xl": showSidebar,
    }
  );
  const ref = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>;

  let ready = false;
  useClickOutside(ref, () => {
    if (ready && showSidebar && setShowSidebar) setShowSidebar(false);
  });
  const { user } = useAuthContext();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [chats, setChats] = useState<IChat[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setTimeout(() => (ready = true), 300);
  });

  useEffect(() => {
    // (async () => {
    //   const chatSnapshot = await getDocs(
    //     query(
    //       collection(db, "chats"),
    //       where("users", "array-contains", `${user?.email}`)
    //     )
    //   );
    //   const chats = [] as any;
    //   chatSnapshot.forEach((doc) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     chats.push({
    //       id: doc.id,
    //       ...doc.data(),
    //     });
    //   });
    // })();

    const unsub = onSnapshot(
      query(
        collection(db, "chats"),
        where("users", "array-contains", `${user?.email}`)
      ),
      (docs) => {
        const chats = [] as any;
        docs.forEach((doc) => {
          chats.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setChats(chats);
      }
    );
    return unsub;
  }, [user?.email]);

  return (
    <>
      <div className={classes} style={{ zIndex: 1 }} ref={ref}>
        {/* extra space */}
        <div className="mt-8 mx-8">
          <p className="text-xl font-semibold">Chats</p>
          <div>
            {chats.length > 0 ? (
              chats.map((chat) => (
                <ChatCard key={chat.id} id={chat.id} users={chat.users} />
              ))
            ) : (
              <p>No Chat Exists</p>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-grow flex-shrink" />

        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="rounded-md bg-gray-400 mx-8 mb-6 text-white py-4 text-lg"
        >
          New Chat
        </button>

        <div className="flex items-center mx-8 my-4 mt-1">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              className="w-12 h-12 rounded-full"
              alt={`${user.displayName} Profile`}
            />
          )}
          <p className="ml-4 text-lg">{user?.displayName}</p>
          <div className="ml-5 rounded-md cursor-pointer">
            <AiOutlineLogout size={20} onClick={() => auth.signOut()} />
          </div>
        </div>
        <Modal
          isOpen={isSearchModalOpen}
          title="Search Users"
          onClose={() => setIsSearchModalOpen(false)}
          chats={chats}
        />
      </div>
    </>
  );
};
