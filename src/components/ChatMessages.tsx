import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { useAuthContext } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import { IMessage } from "../shared/interfaces";
import { Message } from "./Message";

interface Props {}

const ValidationSchema = Yup.object().shape({
  message: Yup.string().required("Please add text to send."),
});

export const ChatMessages: React.FC<Props> = () => {
  const { id } = useParams() as { id: string };
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // (async () => {
    //   // Get All Messages
    //   const q = query(collection(db, "chats", id, "messages"));

    //   const querySnapshot = await getDocs(q);
    //   const messages = [] as any;
    //   querySnapshot.forEach((doc) => {
    //     messages.push({
    //       id: doc.id,
    //       ...doc.data(),
    //     });
    //   });
    //   setMessages(messages);
    // })();
    // query(
    //   collection(db, "chats"),
    //   where("users", "array-contains", `${user?.email}`)
    // )
    const unsub = onSnapshot(
      query(
        collection(db, "chats", id, "messages"),
        orderBy("timestamp", "desc"),
        limit(25)
      ),
      (docs) => {
        const messages = [] as any;
        docs.forEach((doc) => {
          messages.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setMessages(messages.reverse());
        scrollToBottom();
      }
    );
    return unsub;
  }, [id]);

  const scrollToBottom = () => {
    messagesContainerRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      {/* <div>Chat Header</div> */}

      <div className="flex-1 mx-2 pb-5 pr-4 overflow-y-auto">
        <div
          ref={messagesContainerRef}
          className="flex flex-col flex-1 overflow-y-auto"
          style={{ minHeight: "90vh" }}
        >
          {messages.map((message) => (
            <Message key={message.id} {...message} />
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <Formik
          initialValues={{
            message: "",
          }}
          // validateOnChange={false}
          // validateOnBlur={false}
          // validateOnMount={false}
          validationSchema={ValidationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            await addDoc(collection(db, "chats", id, "messages"), {
              timestamp: serverTimestamp(),
              message: values.message,
              user: user?.email,
              photoURL: user?.photoURL,
              edited: false,
            });
            setSubmitting(true);
            resetForm();
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
              <form
                className="flex flex-row mx-2 items-start"
                onSubmit={handleSubmit}
              >
                <div className="flex-1">
                  <input
                    id="message"
                    onChange={handleChange}
                    value={values.message}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Message"
                  />
                  <p className="text-rose-600 text-xs mt-1 h-5">
                    {errors.message}
                  </p>
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="px-4 py-2"
                >
                  <RiSendPlaneFill size={20} />
                </button>
              </form>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};
