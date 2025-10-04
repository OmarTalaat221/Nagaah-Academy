import styled from "styled-components";

export const FriendsContainer = styled.div`
  display: flex;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

export const FriendList = styled.div`
  flex: 1;
  border-right: 1px solid #ddd;
  overflow-y: auto;
`;

export const FriendItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#f0f0f0" : "inherit")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  color: ${(props) => (props.active ? "#333" : "#666")};
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export const ChatArea = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
`;

export const ChatHeader = styled.div`
  padding: 15px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
`;

export const ChatTitle = styled.h2`
  flex: 1;
  margin: 0;
  text-align: center;
`;

export const ChatContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
  overflow-y: auto;
`;

export const MessageList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const MessageItem = styled.li`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  background-color: ${(props) => (props.sent ? "#DCF8C6" : "#FFFFFF")};
  align-self: ${(props) => (props.sent ? "flex-end" : "flex-start")};
  max-width: 70%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const MessageText = styled.div`
  word-wrap: break-word;
`;

export const InputContainer = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  background-color: #f5f5f5;
`;

export const MessageInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
`;

export const SendButton = styled.button`
  background-color: #128c7e;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  margin-left: 10px;
  font-size: 14px;
  cursor: pointer;
`;

export const SearchInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
`;
