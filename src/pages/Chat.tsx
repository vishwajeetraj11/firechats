import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [showSidebar, setShowSidebar] = useState(false);

  if (!user) {
    navigate("/");
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      {" "}
      Please select a chat to start chatting
    </div>
  );
};
