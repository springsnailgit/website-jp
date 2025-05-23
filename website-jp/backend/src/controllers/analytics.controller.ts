import { Request, Response } from 'express';
import { PageView, Visit } from '../models/Analytics';

// @desc    记录访问信息
// @route   POST /api/analytics/visits
// @access  Public
export const recordVisit = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      visitorId,
      page,
      duration,
      referrer,
      userAgent,
      deviceType,
      country,
      language,
    } = req.body;

    // 获取客户端IP地址
    const ipAddress = req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection as any)?.socket?.remoteAddress;

    // 创建访问记录
    const visit = await Visit.create({
      visitorId,
      page,
      duration: duration || 0,
      referrer,
      userAgent,
      deviceType,
      country,
      language,
      ipAddress,
    });

    // 更新页面浏览统计
    const pageView = await PageView.findOne({ path: page });

    if (pageView) {
      // 更新现有页面浏览记录
      const newCount = pageView.count + 1;
      const newAverageDuration = (pageView.averageDuration * pageView.count + duration) / newCount;

      await PageView.findByIdAndUpdate(
        pageView._id,
        {
          count: newCount,
          averageDuration: newAverageDuration
        }
      );
    } else {
      // 创建新的页面浏览记录
      await PageView.create({
        path: page,
        count: 1,
        averageDuration: duration || 0
      });
    }

    res.status(201).json({ success: true, data: visit });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    获取访问统计数据
// @route   GET /api/analytics/stats
// @access  Private/Admin
export const getAnalyticsStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // 获取总访问量
    const totalVisits = await Visit.countDocuments();

    // 获取页面浏览排行
    const topPages = await PageView.find().sort({ count: -1 }).limit(10);

    // 获取设备类型分布
    const deviceStats = await Visit.aggregate([
      {
        $group: {
          _id: '$deviceType',
          count: { $sum: 1 }
        }
      }
    ]);

    // 获取国家分布
    const countryStats = await Visit.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // 获取7天访问趋势
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const dailyVisits = await Visit.aggregate([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // 格式化日期数据
    const dailyVisitStats = dailyVisits.map(item => {
      const date = new Date(item._id.year, item._id.month - 1, item._id.day);
      return {
        date: date.toISOString().split('T')[0],
        count: item.count
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totalVisits,
        topPages,
        deviceStats,
        countryStats,
        dailyVisitStats
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    获取指定时间范围的访问数据（用于导出）
// @route   GET /api/analytics/export
// @access  Private/Admin
export const exportAnalyticsData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ success: false, error: '请提供开始和结束日期' });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // 设置结束日期为当天的结束时间
    end.setHours(23, 59, 59, 999);

    const visits = await Visit.find({
      timestamp: {
        $gte: start,
        $lte: end
      }
    }).sort({ timestamp: 1 });

    res.status(200).json({ success: true, count: visits.length, data: visits });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
