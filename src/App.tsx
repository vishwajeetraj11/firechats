import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Navigate, Route, Routes } from "react-router-dom";
import { ChatMessages } from "./components/ChatMessages";
import { SideBar } from "./components/Sidebar";
import { useAuthContext } from "./contexts/AuthContext";
import { Chat } from "./pages/Chat";
import { Landing } from "./pages/Landing";

export const App = () => {
  const { user } = useAuthContext();

  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="App">
      {user ? (
        <>
          <div className="flex w-screen h-screen overflow-y-hidden">
            <SideBar
              showSidebar={showSidebar}
              setShowSidebar={setShowSidebar}
            />

            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="p-3 lg:hidden">
                <GiHamburgerMenu
                  fill="#111"
                  className="cursor-pointer"
                  onClick={() => setShowSidebar((p) => !p)}
                />
              </div>
              {user && (
                <Routes>
                  <Route path="/chat" element={<Chat />}></Route>
                  <Route path="/chat/:id" element={<ChatMessages />} />
                  <Route
                    path="/"
                    element={<Navigate replace to="/chat" />}
                  ></Route>
                </Routes>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Landing />}></Route>
            <Route path="*" element={<Navigate replace to="/" />}></Route>
          </Routes>
        </>
      )}
    </div>
  );
};
