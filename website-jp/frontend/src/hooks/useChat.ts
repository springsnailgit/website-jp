'use client';

import { API_BASE_URL, STORAGE_KEYS } from '@/config';
import { ApiError, get, post } from '@/utils/api';
import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Message {
    id: string;
    sender: 'user' | 'admin';
    content: string;
    timestamp: Date;
}

interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: string;
    chatId: string | null;
}

interface UseChatReturn extends ChatState {
    sendMessage: (content: string) => Promise<void>;
    socket: Socket | null;
}

/**
 * 聊天功能Hook
 * 处理聊天初始化、消息发送和接收
 */
export const useChat = (userId: string): UseChatReturn => {
    const [state, setState] = useState<ChatState>({
        messages: [],
        isLoading: true,
        error: '',
        chatId: null
    });
    const [socket, setSocket] = useState<Socket | null>(null);

    // 设置错误状态
    const setError = useCallback((errorMessage: string) => {
        setState(prev => ({ ...prev, error: errorMessage }));
    }, []);

    // 连接到Socket.io服务器
    useEffect(() => {
        const newSocket = io(API_BASE_URL);
        setSocket(newSocket);

        // 清理函数
        return () => {
            newSocket.disconnect();
        };
    }, []);

    // 初始化聊天
    useEffect(() => {
        if (!socket || !userId) return;

        setState(prev => ({ ...prev, isLoading: true }));

        // 创建或获取现有聊天会话
        const initializeChat = async () => {
            try {
                const token = localStorage.getItem(STORAGE_KEYS.token);
                if (!token) {
                    setState(prev => ({
                        ...prev,
                        isLoading: false,
                        error: '需要登录才能使用客服系统'
                    }));
                    return;
                }

                // 获取或创建聊天会话
                const chatResponse = await get(`api/chats/user/${userId}`, { withAuth: true });
                const chatId = chatResponse.data?.chatId;

                if (!chatId) {
                    throw new Error('无法获取聊天会话ID');
                }

                // 加载历史消息
                const messagesResponse = await get(`api/chats/${chatId}/messages`, { withAuth: true });

                setState(prev => ({
                    ...prev,
                    messages: messagesResponse.data?.messages || [],
                    chatId,
                    isLoading: false
                }));

                // 加入聊天室
                socket.emit('join_chat', { chatId });
            } catch (err: any) {
                const errorMessage = err instanceof ApiError
                    ? err.message
                    : '聊天初始化错误';

                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: errorMessage
                }));
                console.error('聊天初始化错误:', err);
            }
        };

        initializeChat();
    }, [socket, userId]);

    // 监听接收的消息
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (data: { message: Message }) => {
            setState(prev => ({
                ...prev,
                messages: [...prev.messages, data.message]
            }));
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket]);

    // 发送消息
    const sendMessage = useCallback(async (content: string) => {
        if (!socket || !state.chatId || !content.trim()) return;

        try {
            const token = localStorage.getItem(STORAGE_KEYS.token);
            if (!token) {
                setError('需要登录才能发送消息');
                return;
            }

            const messageData = {
                chatId: state.chatId,
                content,
                sender: 'user',
            };

            // 发送消息到服务器
            const response = await post(
                `api/chats/${state.chatId}/messages`,
                messageData,
                { withAuth: true }
            );

            if (!response.data?.message) {
                throw new Error('服务器未返回消息数据');
            }

            // 使用Socket.io发送消息
            socket.emit('send_message', {
                chatId: state.chatId,
                message: response.data.message,
            });

            // 更新本地消息列表
            setState(prev => ({
                ...prev,
                messages: [...prev.messages, response.data.message]
            }));
        } catch (err: any) {
            const errorMessage = err instanceof ApiError
                ? err.message
                : '发送消息错误';

            setError(errorMessage);
            console.error('发送消息错误:', err);
        }
    }, [socket, state.chatId, setError]);

    return {
        ...state,
        sendMessage,
        socket
    };
};

export default useChat;
