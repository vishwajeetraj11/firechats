import { Dialog, Transition } from "@headlessui/react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { Formik } from "formik";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useAuthContext } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import { IChat, IUser } from "../shared/interfaces";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  chats: IChat[];
}

const ValidationSchema = Yup.object().shape({
  user: Yup.string().required("Please enter something to search."),
});

export const Modal: React.FC<Props> = ({ title, isOpen, onClose, chats }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>(users);
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const { user } = useAuthContext();

  useEffect(() => {
    (async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const users = [] as any;
      usersSnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        users.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUsers(users);
    })();
  }, [user?.email]);

  const createChat = async () => {
    if (!selectedUser)
      return toast("Please select a user from suggestions", { type: "info" });
    let chatExistsFlag = false;
    chats.forEach((chat) => {
      if (!!chat.users.find((email) => email === selectedUser.email)) {
        chatExistsFlag = true;
      }
    });

    if (!chatExistsFlag) {
      await addDoc(collection(db, `chats`), {
        users: [selectedUser.email, user?.email],
      });
      toast("Chat Created.", { type: "success" });
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={onClose}
        >
          <div className="min-h-screen px-4 text-center">
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

            {/* This element is to trick the browser into centering the modal contents. */}
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
              <div
                style={{ minHeight: "500px" }}
                className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
              >
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>

                <div className="mt-2">
                  <Formik
                    initialValues={{
                      user: "",
                    }}
                    // validateOnChange={false}
                    // validateOnBlur={false}
                    // validateOnMount={false}
                    validationSchema={ValidationSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      setSubmitting(true);
                    }}
                  >
                    {({
                      values,
                      errors,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      setFieldValue,
                    }) => (
                      <div className="">
                        <form className="flex flex-col" onSubmit={handleSubmit}>
                          <label htmlFor="email-address" className="sr-only">
                            Email address
                          </label>
                          <input
                            id="user"
                            onChange={(e) => {
                              const filteredUsers = users.filter(
                                (user) =>
                                  user?.name
                                    ?.toLowerCase()
                                    .indexOf(e.target.value.toLowerCase()) > -1
                              );
                              setFilteredUsers(filteredUsers);
                              setFieldValue("user", e.target.value);
                            }}
                            value={values.user}
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                          />
                          <p className="text-rose-600 text-xs mt-1">
                            {errors.user}
                          </p>
                        </form>
                      </div>
                    )}
                  </Formik>
                  <div className="mt-3">
                    {filteredUsers.map((user) => (
                      <div
                        onClick={() => setSelectedUser(user)}
                        className={`${
                          selectedUser?.id === user.id
                            ? "border-indigo-600 "
                            : ""
                        }border border-gray-300 hover:border-indigo-600 cursor-pointer rounded-sm px-4 py-2 flex items-center rounded-lg overflow-hidden mt-3`}
                        key={user.id}
                      >
                        <div>
                          <img
                            src={user.photo}
                            className="w-10 h-10 rounded-full"
                            alt={`${user.name} Profile`}
                          />
                        </div>
                        <p className="text-sm ml-4">{user.name}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={createChat}
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    >
                      Create Chat
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

/*
 <form onSubmit={onSubmit}>
                    <label htmlFor="email-address" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      onChange={(e) => setInput(e.target.value)}
                      value={input}
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Email address"
                    />
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={() => null}
                      >
                        Create Chat
                      </button>
                    </div>
                  </form>
*/
