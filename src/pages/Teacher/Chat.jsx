import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router";
import { GrSend } from "react-icons/gr";
import {
  ref,
  push,
  serverTimestamp,
  onValue,
  query,
  orderByChild,
  update,
  off,
} from "firebase/database";
import { rtdb } from "../../firebase";
import "./style.css";

const MESSAGE_STATUS = {
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
};

const Chat = () => {
  const userData = JSON.parse(localStorage.getItem("NagahUser"));
  const teacherData = useLocation();
  const data = teacherData?.state?.TeacherData?.[0];

  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData || !data) return;

    const chatId = [userData.student_id, data.teacher_id].sort().join("_");
    const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
    const messagesQuery = query(messagesRef, orderByChild("timestamp"));

    const unsubscribe = onValue(
      messagesQuery,
      (snapshot) => {
        const messageList = [];

        snapshot.forEach((childSnapshot) => {
          const msg = childSnapshot.val();
          const message = {
            id: childSnapshot.key,
            ...msg,
          };

          if (message.sender !== userData.student_id && !message.read) {
            update(childSnapshot.ref, {
              read: true,
              status: MESSAGE_STATUS.READ,
            });
          }

          if (
            message.sender == userData.student_id &&
            message.status == MESSAGE_STATUS.SENT
          ) {
            update(childSnapshot.ref, {
              status: MESSAGE_STATUS.DELIVERED,
            });
          }

          messageList.push(message);
        });

        messageList.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        setMessages(messageList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );

    return () => {
      off(messagesRef);
    };
  }, [userData, data]);

  const sendMessage = async () => {
    const trimmedText = inputText.trim();
    if (!trimmedText) return;

    setInputText(""); // Optimistic UI
    const chatId = [userData?.student_id, data.teacher_id].sort().join("_");

    const newMessage = {
      text: trimmedText,
      sender: userData?.student_id,
      receiver: data.teacher_id,
      timestamp: serverTimestamp(),
      status: MESSAGE_STATUS.SENT,
      read: false,
    };

    try {
      const messageRef = await push(
        ref(rtdb, `chats/${chatId}/messages`),
        newMessage
      );
      await update(messageRef, { id: messageRef.key });

      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollTop = flatListRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error("Failed to send message:", error);
      setInputText(trimmedText);
    }
  };

  const handleEnterSendMessage = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat_page">
      <div className="chat_container">
        <div className="chat_header">
          <img src={data?.teacher_img} alt="" />
          <p>{data?.teacher_name}</p>
        </div>

        <div className="chat_body" ref={flatListRef}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.sender === userData.student_id ? "sent" : "received"
                }
              >
                <p>{msg.text}</p>
              </div>
            ))
          )}
        </div>

        <div className="chat_input">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleEnterSendMessage}
            placeholder="اكتب رسالتك..."
          />
          <button className="send_message_btn" onClick={sendMessage}>
            {}
            ارسال
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
