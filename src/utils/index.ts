import { RiskLevel, RectificationStatus, AbnormalType } from '../types';

export const formatMoney = (amount: number): string => {
  if (amount >= 10000) {
    return (amount / 10000).toFixed(2) + '万元';
  }
  return amount.toLocaleString('zh-CN') + '元';
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN');
};

export const formatPercent = (num: number): string => {
  return num.toFixed(1) + '%';
};

export const formatDate = (dateStr: string): string => {
  return dateStr;
};

export const getRiskLevelText = (level: RiskLevel): string => {
  const map = {
    high: '高风险',
    medium: '中风险',
    low: '低风险',
  };
  return map[level];
};

export const getRiskLevelColor = (level: RiskLevel): string => {
  const map = {
    high: 'text-risk-high bg-risk-highLight',
    medium: 'text-risk-medium bg-risk-mediumLight',
    low: 'text-risk-low bg-risk-lowLight',
  };
  return map[level];
};

export const getRiskLevelDotColor = (level: RiskLevel): string => {
  const map = {
    high: 'bg-risk-high',
    medium: 'bg-risk-medium',
    low: 'bg-risk-low',
  };
  return map[level];
};

export const getRectificationStatusText = (status: RectificationStatus): string => {
  const map = {
    pending: '待整改',
    in_progress: '整改中',
    reviewed: '已复核',
    closed: '已关闭',
  };
  return map[status];
};

export const getRectificationStatusColor = (status: RectificationStatus): string => {
  const map = {
    pending: 'text-risk-high bg-risk-highLight',
    in_progress: 'text-risk-medium bg-risk-mediumLight',
    reviewed: 'text-primary-600 bg-primary-50',
    closed: 'text-risk-low bg-risk-lowLight',
  };
  return map[status];
};

export const getAbnormalTypeText = (type: AbnormalType): string => {
  const map = {
    bank_return: '银行退回',
    unconfirmed: '工资未确认',
    consecutive_unpaid: '连续未发薪',
  };
  return map[type];
};

export const getAbnormalTypeColor = (type: AbnormalType): string => {
  const map = {
    bank_return: 'text-risk-medium bg-risk-mediumLight',
    unconfirmed: 'text-primary-600 bg-primary-50',
    consecutive_unpaid: 'text-risk-high bg-risk-highLight',
  };
  return map[type];
};

export const maskIdCard = (idCard: string): string => {
  return idCard;
};

export const getDaysRemaining = (deadline: string): number => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
