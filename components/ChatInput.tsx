"use client"; // 标记为 Client Component

import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea"; // 导入 Textarea 组件
import { Button } from "@/components/ui/button";

export default function ChatInput({
  onSend,
}: {
  onSend: (message: string) => void;
}) {
  const [inputValue, setInputValue] = useState(""); // 输入框内容
  const textareaRef = useRef<HTMLTextAreaElement>(null); // 输入框引用

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
      e.preventDefault(); // 阻止默认行为（如表单提交）
      onSend(inputValue); // 发送消息
      setInputValue(""); // 清空输入框
      textareaRef.current?.focus(); // 自动聚焦输入框
    }
  };

  // 处理发送按钮点击事件
  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue); // 发送消息
      setInputValue(""); // 清空输入框
      textareaRef.current?.focus(); // 自动聚焦输入框
    }
  };

  return (
    <div className="border-t p-4 bg-white">
      {/* 提示文字 */}
      <div className="text-sm text-gray-400 mb-2">
        Enter 发送信息，Shift+Enter 换行
      </div>

      {/* 输入区域 */}
      <div className="flex gap-2 max-w-3xl mx-auto">
        <Textarea
          ref={textareaRef} // 绑定输入框引用
          placeholder="请输入您的问题..."
          className="flex-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown} // 监听键盘事件
          rows={1} // 设置默认行数
        />
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleSend} // 监听按钮点击事件
        >
          发送
        </Button>
      </div>
    </div>
  );
}