import { Request, Response } from 'express';
import { Chat, Message } from '../models/Chat';

// @desc    创建新的聊天会话
// @route   POST /api/chats
// @access  Private
export const createChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject } = req.body;
    const userId = (req as any).user.id;

    const chat = await Chat.create({
      userId,
      subject,
    });

    res.status(201).json({ success: true, data: chat });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    获取所有聊天会话（管理员）或用户的聊天会话
// @route   GET /api/chats
// @access  Private
export const getChats = async (req: Request, res: Response): Promise<void> => {
  try {
    let filter = {};

    // 如果不是管理员，只获取该用户的聊天
    if ((req as any).user.role !== 'admin') {
      filter = { userId: (req as any).user.id };
    }

    const chats = await Chat.find(filter)
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, count: chats.length, data: chats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    获取单个聊天会话及其消息
// @route   GET /api/chats/:id
// @access  Private
export const getChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const chat = await Chat.findById(req.params.id).populate('userId', 'name email');

    if (!chat) {
      res.status(404).json({ success: false, error: '未找到聊天会话' });
      return;
    }

    // 验证权限 - 只允许会话所有者和管理员访问
    if ((chat.userId as any)._id.toString() !== (req as any).user.id && (req as any).user.role !== 'admin') {
      res.status(403).json({ success: false, error: '没有访问权限' });
      return;
    }

    // 获取聊天消息
    const messages = await Message.find({ chatId: chat._id })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: { chat, messages } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    发送消息
// @route   POST /api/chats/:id/messages
// @access  Private
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const chatId = req.params.id;
    const userId = (req as any).user.id;

    // 验证聊天会话是否存在
    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.status(404).json({ success: false, error: '未找到聊天会话' });
      return;
    }

    // 验证权限 - 只允许会话所有者和管理员发送消息
    if (chat.userId.toString() !== userId && (req as any).user.role !== 'admin') {
      res.status(403).json({ success: false, error: '没有权限发送消息' });
      return;
    }

    // 处理附件上传
    let attachmentUrl = undefined;
    if (req.file) {
      attachmentUrl = `/uploads/messages/${req.file.filename}`;
    }

    // 创建消息
    const message = await Message.create({
      sender: userId,
      content,
      chatId,
      isAdmin: (req as any).user.role === 'admin',
      attachmentUrl,
    });

    // 更新聊天的最后消息时间
    await Chat.findByIdAndUpdate(chatId, { lastMessage: Date.now() });

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name');

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    更新聊天状态（开启/关闭）
// @route   PUT /api/chats/:id
// @access  Private/Admin
export const updateChatStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    // 仅允许有效的状态值
    if (!['open', 'closed'].includes(status)) {
      res.status(400).json({ success: false, error: '无效的聊天状态' });
      return;
    }

    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!chat) {
      res.status(404).json({ success: false, error: '未找到聊天会话' });
      return;
    }

    res.status(200).json({ success: true, data: chat });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
