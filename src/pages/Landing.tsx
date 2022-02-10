import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ImFire } from "react-icons/im";
import { SiFirebase } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { GoogleIcon } from "../components/SVGs";
import { auth, db } from "../services/firebase";

const provider = new GoogleAuthProvider();

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const onLogin = () => {
    signInWithPopup(auth, provider)
      .then(async ({ user }) => {
        const userId = user.uid;

        const userInDB = await getDoc(doc(db, "users", `${user.email}`));

        if (!userInDB.exists()) {
          await setDoc(
            doc(db, "users", `${user.email}`),
            {
              name: user.displayName,
              email: user.email,
              photo: user.photoURL,
              lastSeen: serverTimestamp(),
            },
            { merge: true }
          );
        }
        if (userId) {
          navigate(`/chat/`);
        }

        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;
        // The signed-in user info.
        // const user = result.user;
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <ImFire fill="#FFCB33" size={50} />
            <SiFirebase fill="#F58523" size={20} />
          </div>
          <p className="font-semibold text-2xl ml-4">Firechats</p>
        </div>
        <button
          className="flex items-center mt-10 py-5 px-10 shadow-xl rounded-lg hover:shadow-lg transition-all duration-400 transform hover:-translate-y-0.5 active:shadow-md"
          onClick={onLogin}
        >
          <GoogleIcon height={20} width={20} />
          <p className="ml-3 text-md">Sign In with Google</p>
        </button>
      </div>
    </div>
  );
};
