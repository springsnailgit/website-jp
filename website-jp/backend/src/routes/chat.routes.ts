import express from 'express';
import { createChat, getChat, getChats, sendMessage, updateChatStatus } from '../controllers/chat.controller';
import { authorize, protect } from '../middleware/auth';
import { uploadMessageAttachment } from '../middleware/upload';

const router = express.Router();

router.route('/')
  .get(protect, getChats)
  .post(protect, createChat);

router.route('/:id')
  .get(protect, getChat)
  .put(protect, authorize('admin'), updateChatStatus);

router.post('/:id/messages', protect, uploadMessageAttachment, sendMessage);

export default router;
