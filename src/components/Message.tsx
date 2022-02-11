import { Dialog, Transition } from "@headlessui/react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { Fragment, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import { formatDate } from "../shared/formatDate";
import { IMessage } from "../shared/interfaces";
import { MessageMenu } from "./MessageMenu";

interface Props extends IMessage {
  timestamp: any;
}
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

  const editedMessage = useRef<HTMLInputElement>(null);

  const [showModal, setShowModal] = useState<boolean>(false);

  const deleteMessage = async () => {
    if (user !== loggedInUser?.email) return;
    toast("Message Deleted Successfully", { type: "success" });
    await deleteDoc(doc(db, "chats", `${chatId}`, "messages", `${id}`));
  };

  const editMessage = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (user !== loggedInUser?.email) return;
    toast("Message Edited Successfully", { type: "success" });
    await updateDoc(doc(db, "chats", `${chatId}`, "messages", `${id}`), {
      message: editedMessage?.current?.value,
      edited: true,
    });
    closeModal();
  };

  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  return (
    <>
      <div
        // onMouseEnter={() => setShowMenu(true)}
        // onMouseLeave={() => setShowMenu(false)}
        className={`flex items-center pt-4 ${
          user === loggedInUser?.email ? "self-end" : ""
        }`}
      >
        <div className="flex items-center pt-4">
          {user === loggedInUser?.email ? (
            <>
              <div className="flex flex-col mr-3">
                <p className="text-right">{message}</p>
                {edited && (
                  <span
                    style={{ fontSize: 10 }}
                    className="self-end text-slate-400"
                  >
                    Edited
                  </span>
                )}
                {timestamp && (
                  <span
                    style={{ fontSize: 10 }}
                    className="self-end text-slate-400"
                  >
                    {timestamp?.seconds &&
                      formatDate(new Date(timestamp.seconds * 1000))}
                  </span>
                )}
              </div>
              <div>
                <img
                  src={photoURL}
                  className="w-6 h-6 rounded-full"
                  alt="message user"
                />
              </div>
              <MessageMenu onEdit={openModal} onDelete={deleteMessage} />
            </>
          ) : (
            <>
              <div>
                <img
                  src={photoURL}
                  className="w-6 h-6 rounded-full"
                  alt="message user"
                />
              </div>
              <div className="ml-3 flex flex-col">
                <p>{message}</p>
                {edited && (
                  <span style={{ fontSize: 10 }} className="text-slate-400">
                    Edited
                  </span>
                )}
                {timestamp && (
                  <span style={{ fontSize: 10 }} className=" text-slate-400">
                    {timestamp?.seconds &&
                      formatDate(new Date(timestamp.seconds * 1000))}
                  </span>
                )}
              </div>
            </>
          )}

          <Transition appear show={showModal} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={closeModal}
            >
              <div className="min-h-screen px-4 text-center backdrop-blur-sm">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0" />
                </Transition.Child>
                <span
                  className="inline-block h-screen align-middle"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-xl">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6"
                    >
                      Edit your message
                    </Dialog.Title>
                    <form>
                      <div className="mt-2">
                        <input
                          className="border w-full p-5 border-blue-600 outline-none bg-white/10 rounded-xl backdrop-filter backdrop-blur-2xl bg-opacity-10 focus-visible:ring-blue-900"
                          placeholder="Your edited message"
                          ref={editedMessage}
                          defaultValue={message}
                        />
                      </div>

                      <div className="mt-4">
                        <button
                          type="submit"
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-xl hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          onClick={editMessage}
                        >
                          Edit message
                        </button>
                      </div>
                    </form>
                  </div>
                </Transition.Child>{" "}
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>
    </>
  );
};
