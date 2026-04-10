'use client';

import useChat, { Message } from '@/hooks/useChat';
import { memo, useEffect, useRef, useState } from 'react';

interface ChatProps {
    userId: string;
    userName: string;
}

/**
 * 消息气泡组件
 */
const MessageBubble = memo(({ message }: { message: Message }) => {
    const isUser = message.sender === 'user';
    const timestamp = new Date(message.timestamp).toLocaleTimeString();

    return (
        <div className={`mb-3 ${isUser ? 'text-right' : 'text-left'}`}>
            <div
                className={`inline-block p-3 rounded-lg ${isUser
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-white border border-gray-200'
                    }`}
            >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs text-gray-500 mt-1 block">
                    {timestamp}
                </span>
            </div>
        </div>
    );
});

MessageBubble.displayName = 'MessageBubble';

/**
 * 聊天组件 - 提供实时聊天功能
 */
const Chat = memo(({ userId, userName }: ChatProps) => {
    const { messages, isLoading, error, sendMessage } = useChat(userId);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 自动滚动到最新消息
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 处理发送消息
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        await sendMessage(newMessage);
        setNewMessage('');
    };

    // 处理按Enter键发送
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    // 加载状态
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    // 错误状态
    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded">
                <p>{error}</p>
                {error.includes('登录') && (
                    <a href="/login" className="text-primary-600 underline">
                        点击此处登录
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md">
            {/* 聊天头部 */}
            <div className="bg-primary-500 text-white p-3 rounded-t-lg">
                <h2 className="font-medium">在线客服</h2>
                <p className="text-sm">您好，{userName}! 有什么可以帮到您的?</p>
            </div>

            {/* 消息列表 */}
            <div className="p-4 h-80 overflow-y-auto bg-gray-50">
                {messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        <p>开始您的询问吧</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 消息输入 */}
            <div className="p-3 border-t">
                <div className="flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="输入您的消息..."
                        className="flex-1 border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onKeyDown={handleKeyDown}
                        aria-label="聊天消息输入框"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-primary-500 text-white px-4 py-2 rounded-r-md hover:bg-primary-600 transition-colors"
                        aria-label="发送消息"
                    >
                        发送
                    </button>
                </div>
            </div>
        </div>
    );
});

Chat.displayName = 'Chat';

export default Chat;
