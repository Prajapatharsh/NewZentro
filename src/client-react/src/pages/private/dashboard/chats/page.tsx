import React, { useState } from "react";
import { useGetAllChatsQuery } from "@/store/apis/ChatApi";
import CustomLoader from "@/components/feedback/CustomLoader";

const AdminChatsPage = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const { data: chats, isLoading } = useGetAllChatsQuery("OPEN");

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <h2 className="font-bold text-xl mb-6 text-gray-800">Support Chats</h2>

        {isLoading ? (
          <CustomLoader />
        ) : chats?.chats?.length === 0 ? (
          <div className="text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center">No open chats</div>
        ) : (
          <ul className="space-y-3">
            {chats?.chats?.map((chat: any) => (
              <li
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  activeChatId === chat.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white border border-gray-100 hover:border-indigo-300 hover:shadow-sm"
                }`}
              >
                <div className="font-bold">Chat #{chat.id.substring(0, 8)}</div>
                <div className={`text-xs mt-1 ${activeChatId === chat.id ? "text-indigo-100" : "text-gray-500"}`}>
                   Status: {chat.status}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-1 bg-white flex items-center justify-center text-gray-400">
        {activeChatId ? (
          <div className="text-indigo-600 font-medium animate-pulse">Loading conversation...</div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">💬</div>
            <span>Select a chat to start responding</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatsPage;
