import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import Compiler from "../components/Compiler";
import Chat from "../components/Chat";
import VideoCall from "../components/VideoCall";
import Buttons from "../components/Buttons";
import UserList from "../components/UserList";

import { useSocket } from "../context/socketContext";

const Room = () => {
  const { id: roomId } = useParams();
  const location = useLocation();
  const { name } = location.state || {};
  const [users, setUsers] = useState([]);
  const [code, setCode] = useState(""); // Shared code state
  const { socket } = useSocket();

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  useEffect(() => {
    if (socket && name) {
      socket.emit("join-room", { roomId, userName: name });

      const handleRoomData = (updatedUsers) => {
        setUsers(updatedUsers.map((user) => user.name));
      };

      socket.on("room-data", handleRoomData);

      return () => {
        socket.off("room-data", handleRoomData);
        socket.off("new-peer"); // Ensure all listeners are removed
        socket.removeAllListeners();
      };
    }
  }, [socket, roomId, name]);

  return (
    <div className="h-screen w-full p-4 bg-gray-100 flex flex-col overflow-hidden">
      {/* Project Name */}
      <div className="text-center mb-2 border-b-2 border-gray-800 pb-2">
        <h1 className="text-3xl font-bold">Code-2-Share</h1>
      </div>

      {/* User List */}
      <div className="flex justify-center mb-2 border-b-2 border-gray-800 pb-2">
        <UserList users={users} />
      </div>

      {/* Main Layout */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Upper Section: Code Editor and Chat */}
        <div className="flex-grow grid grid-cols-1 sm:grid-cols-12 gap-2 overflow-hidden">
          {/* Code Editor */}
          <div className="rounded sm:col-span-8 border-2 border-gray-700 overflow-hidden">
            <div className="h-full w-full">
              <CodeEditor roomId={roomId} onCodeChange={setCode} />
            </div>
          </div>

          {/* Chat Component */}
          <div className="rounded sm:col-span-4 border-2 border-gray-700 overflow-hidden">
            <div className="h-full w-full">
              <Chat roomId={roomId} name={name} />
              {/* <Compiler code={code} /> */}
            </div>
          </div>
        </div>

        {/* Lower Section: Buttons and Video */}
        <div className="flex gap-1 mt-2 ">
          {/* Buttons Component */}
          <div className="flex flex-col items-center justify-start border-2 border-gray-700 p-2">
            <Buttons
              roomId={roomId}
              isVideoOn={isVideoOn}
              setIsVideoOn={setIsVideoOn}
              isMicOn={isMicOn}
              setIsMicOn={setIsMicOn}
            />
          </div>

          {/* Video Component */}
          <div className="flex-grow border-2 border-gray-700 p-2 overflow-auto">
            <VideoCall users={users} isVideoOn={isVideoOn} isMicOn={isMicOn} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
