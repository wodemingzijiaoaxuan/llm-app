"use client"; // 标记为 Client Component

import { useState, useRef } from "react";
import ChatInput from "@/components/chat/ChatInput";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [inputValue, setInputValue] = useState(""); // 输入框内容
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]); // 消息列表
  const [error, setError] = useState<string | null>(null); // 错误信息
  const textareaRef = useRef<HTMLTextAreaElement>(null); // 输入框引用

  // 处理发送消息
  const handleSend = async () => {
    if (inputValue.trim()) {
      const userMessage = inputValue;
      setMessages((prev) => [...prev, { role: "user", content: userMessage }]); // 添加用户消息
      setInputValue(""); // 清空输入框
      setError(null); // 清空错误提示

      try {
        console.log("发送请求:", userMessage);
        // 调用 FastAPI 后端
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
        },
          body: JSON.stringify({ message: userMessage }), // 确保字段名是 message
        });
        console.log("收到响应状态:", response.status, response.statusText);
        const rawResponse = await response.text();
        console.log("原始响应内容:", rawResponse);


          if (!response.ok) {
          let errorMessage = "API request failed";
          try {
            // 尝试解析错误内容
            const errorText = await response.text(); // 先以文本形式读取
            const errorData = JSON.parse(errorText); // 再尝试解析为 JSON

            // 使用可选链操作符避免访问不存在的字段
            errorMessage = errorData?.detail || errorData?.error || errorText;
          } catch   {
            // 如果解析 JSON 失败，直接使用状态码和文本
            errorMessage = `HTTP error! status: ${response.status}, response: ${rawResponse}`;
          }
          throw new Error(errorMessage);
        }

        const data = JSON.parse(rawResponse);
        console.log("解析后的数据:", data);
        if (data.reply) {
          setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]); // 添加 AI 回复
        }
      } catch (error) {
        console.error("完整错误堆栈:", error);
      if (error instanceof TypeError) {
        setError("网络连接失败，请检查后端服务");
      } else {
        setError(error instanceof Error ? error.message : "未知错误");
      }
    }

      textareaRef.current?.focus(); // 自动聚焦输入框
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
      e.preventDefault(); // 阻止默认行为
      handleSend(); // 发送消息
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 消息容器 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-sm ${
              message.role === "user" ? "bg-blue-100" : "bg-green-100"
            }`}
          >
            <p style={{ whiteSpace: "pre-wrap" }}>{message.content}</p>
          </div>
        ))}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-4 bg-red-100 text-red-600">
          <p>{error}</p>
        </div>
      )}

      {/* 输入区域 */}
      <div className="border-t p-3 bg-white">
         {/* 提示文字 */}
      <div className="text-sm text-gray-400 mb-2">
        Enter 发送信息，Shift+Enter 换行
      </div>
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Textarea
            ref={textareaRef}
            placeholder="请输入您的问题..."
            className="flex-1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSend}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}