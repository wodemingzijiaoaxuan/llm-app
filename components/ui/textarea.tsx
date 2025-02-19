//多行输入框
// textarea.tsx
// Compare this snippet from input.tsx:
import { cn } from "@/lib/utils"; 
import { TextareaHTMLAttributes, forwardRef, useEffect, useRef } from "react";

// 添加额外属性到 TextareaProps 接口
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  // 添加一个可选的自定义属性
  customProp?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 动态调整高度
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [value]);

    return (
      <textarea
        ref={(node) => {
          if (ref) {
            if (typeof ref === "function") ref(node);
            else ref.current = node;
          }
          textareaRef.current = node;
        }}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
          className
        )}
        value={value}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

// 确保正确导出 Textarea 组件
export { Textarea };