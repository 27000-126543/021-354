import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  Clock, 
  User, 
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  AlertTriangle,
  Plus
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import RiskBadge from '../../components/ui/RiskBadge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { mockRectifications, mockProjects } from '../../data/mockData';
import { 
  formatDate, 
  getRectificationStatusText, 
  getRectificationStatusColor,
  getDaysRemaining 
} from '../../utils';
import { Rectification, RectificationStatus } from '../../types';

const RectificationPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRectification, setSelectedRectification] = useState<Rectification | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  const filteredRectifications = useMemo(() => {
    if (activeTab === 'all') return mockRectifications;
    return mockRectifications.filter((r) => r.status === activeTab);
  }, [activeTab]);

  const stats = useMemo(() => {
    const pending = mockRectifications.filter((r) => r.status === 'pending').length;
    const inProgress = mockRectifications.filter((r) => r.status === 'in_progress').length;
    const reviewed = mockRectifications.filter((r) => r.status === 'reviewed').length;
    const closed = mockRectifications.filter((r) => r.status === 'closed').length;
    return { total: mockRectifications.length, pending, inProgress, reviewed, closed };
  }, []);

  const tabItems = [
    { key: 'all', label: '全部', count: stats.total },
    { key: 'pending', label: '待整改', count: stats.pending },
    { key: 'in_progress', label: '整改中', count: stats.inProgress },
    { key: 'reviewed', label: '已复核', count: stats.reviewed },
    { key: 'closed', label: '已关闭', count: stats.closed },
  ];

  const handleViewDetail = (rectification: Rectification) => {
    setSelectedRectification(rectification);
    setShowDetailModal(true);
    setReviewComment('');
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleReviewPass = () => {
    setShowDetailModal(false);
    setSelectedRectification(null);
  };

  const handleReviewReject = () => {
    setShowDetailModal(false);
    setSelectedRectification(null);
  };

  const getStatusColor = (status: RectificationStatus) => {
    const map = {
      pending: 'from-red-500 to-red-600',
      in_progress: 'from-orange-500 to-orange-600',
      reviewed: 'from-blue-500 to-blue-600',
      closed: 'from-green-500 to-green-600',
    };
    return map[status];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">整改跟进</h2>
          <p className="text-sm text-slate-500 mt-1">跟踪整改进度，闭环管理风险问题</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}>
          <Plus className="w-4 h-4" />
          新建整改
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '待整改', value: stats.pending, color: 'red', icon: AlertTriangle },
          { label: '整改中', value: stats.inProgress, color: 'orange', icon: Clock },
          { label: '已复核', value: stats.reviewed, color: 'blue', icon: Eye },
          { label: '已关闭', value: stats.closed, color: 'green', icon: CheckCircle },
        ].map((item, index) => {
          const Icon = item.icon;
          const colorClasses = {
            red: 'from-red-500 to-red-600 bg-red-50 text-red-600',
            orange: 'from-orange-500 to-orange-600 bg-orange-50 text-orange-600',
            blue: 'from-blue-500 to-blue-600 bg-blue-50 text-blue-600',
            green: 'from-green-500 to-green-600 bg-green-50 text-green-600',
          };
          return (
            <Card key={item.label} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-1.5 text-2xl font-bold text-slate-800 font-mono-nums">
                    {item.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[item.color as keyof typeof colorClasses].split(' ').slice(2).join(' ')}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${colorClasses[item.color as keyof typeof colorClasses].split(' ').slice(0, 2).join(' ')}`}></div>
            </Card>
          );
        })}
      </div>

      <Card 
        noPadding
        className="animate-fade-in-up"
        style={{ animationDelay: '200ms' }}
      >
        <div className="p-5 border-b border-slate-100">
          <Tabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} />
        </div>
        
        <div className="divide-y divide-slate-100">
          {filteredRectifications.map((rectification, index) => {
            const isExpanded = expandedId === rectification.id;
            const daysRemaining = getDaysRemaining(rectification.deadline);
            const isUrgent = daysRemaining <= 3 && rectification.status !== 'closed';
            
            return (
              <div
                key={rectification.id}
                className="hover:bg-slate-50 transition-colors"
                style={{ animationDelay: `${(index + 3) * 50}ms` }}
              >
                <div 
                  className="p-5 cursor-pointer"
                  onClick={() => handleToggleExpand(rectification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-10 rounded-full bg-gradient-to-b ${getStatusColor(rectification.status)}`}></div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-800 truncate">{rectification.title}</h4>
                            <RiskBadge level={rectification.level} size="sm" />
                          </div>
                          <p 
                            className="text-sm text-slate-500 mt-1 cursor-pointer hover:text-primary-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProject(rectification.projectId);
                            }}
                          >
                            {rectification.projectName}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-3 ml-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          责任人：{rectification.assignee}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          截止：{rectification.deadline}
                        </span>
                        {isUrgent && (
                          <span className="flex items-center gap-1 text-risk-high font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            剩余{daysRemaining}天
                          </span>
                        )}
                        <span className={`ml-auto px-2.5 py-0.5 rounded-full text-xs font-medium ${getRectificationStatusColor(rectification.status)}`}>
                          {getRectificationStatusText(rectification.status)}
                        </span>
                      </div>
                    </div>
                    
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors ml-4">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="px-5 pb-5 ml-4">
                    <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">整改要求</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{rectification.content}</p>
                      </div>
                      
                      {rectification.handleDescription && (
                        <div className="pt-3 border-t border-slate-200">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-3.5 h-3.5 text-primary-500" />
                            <p className="text-xs text-slate-400">处理说明</p>
                            <span className="text-xs text-slate-400 ml-auto">
                              {rectification.handler} · {rectification.handleDate}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed pl-5">
                            {rectification.handleDescription}
                          </p>
                        </div>
                      )}
                      
                      {rectification.reviewComment && (
                        <div className="pt-3 border-t border-slate-200">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                            <p className="text-xs text-slate-400">复核意见</p>
                            <span className="text-xs text-slate-400 ml-auto">
                              {rectification.reviewer} · {rectification.reviewDate}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed pl-5">
                            {rectification.reviewComment}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <span className="text-xs text-slate-400">
                          创建时间：{rectification.createdAt}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetail(rectification);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                            查看详情
                          </Button>
                          {rectification.status === 'in_progress' && (
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetail(rectification);
                              }}
                            >
                              <CheckCircle className="w-4 h-4" />
                              复核
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {filteredRectifications.length === 0 && (
          <div className="py-16 text-center text-slate-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>暂无整改记录</p>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="整改详情"
        width="max-w-2xl"
        footer={
          selectedRectification?.status === 'in_progress' ? (
            <>
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>关闭</Button>
              <Button variant="danger" onClick={handleReviewReject}>
                <XCircle className="w-4 h-4" />
                驳回重改
              </Button>
              <Button onClick={handleReviewPass}>
                <CheckCircle className="w-4 h-4" />
                复核通过
              </Button>
            </>
          ) : (
            <Button onClick={() => setShowDetailModal(false)}>关闭</Button>
          )
        }
      >
        {selectedRectification && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <RiskBadge level={selectedRectification.level} />
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRectificationStatusColor(selectedRectification.status)}`}>
                  {getRectificationStatusText(selectedRectification.status)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">{selectedRectification.title}</h3>
              <p 
                className="text-sm text-primary-600 mt-1 cursor-pointer hover:underline"
                onClick={() => handleViewProject(selectedRectification.projectId)}
              >
                {selectedRectification.projectName}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs text-slate-400">责任人</p>
                <p className="text-sm font-medium text-slate-700 mt-1">{selectedRectification.assignee}</p>
                <p className="text-xs text-slate-400 mt-0.5">{selectedRectification.assignDepartment}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">截止日期</p>
                <p className="text-sm font-medium text-slate-700 mt-1">{selectedRectification.deadline}</p>
                <p className="text-xs text-risk-high mt-0.5">
                  剩余 {getDaysRemaining(selectedRectification.deadline)} 天
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">创建时间</p>
                <p className="text-sm font-medium text-slate-700 mt-1">{selectedRectification.createdAt.split(' ')[0]}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <div className="w-1 h-4 bg-primary-500 rounded-full"></div>
                整改要求
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed pl-3">
                {selectedRectification.content}
              </p>
            </div>

            {selectedRectification.handleDescription && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <div className="w-1 h-4 bg-risk-medium rounded-full"></div>
                  处理说明
                </h4>
                <div className="pl-3">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedRectification.handleDescription}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    处理人：{selectedRectification.handler} · {selectedRectification.handleDate}
                  </p>
                </div>
              </div>
            )}

            {selectedRectification.status === 'in_progress' && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-700 mb-2">复核意见</h4>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="请输入复核意见..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none bg-white"
                />
              </div>
            )}

            {selectedRectification.reviewComment && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <div className="w-1 h-4 bg-risk-low rounded-full"></div>
                  复核意见
                </h4>
                <div className="pl-3">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedRectification.reviewComment}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    复核人：{selectedRectification.reviewer} · {selectedRectification.reviewDate}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="新建整改通知"
        width="max-w-xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowNewModal(false)}>取消</Button>
            <Button onClick={() => setShowNewModal(false)}>确认创建</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">关联项目</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">请选择项目</option>
              {mockProjects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">整改标题</label>
            <input
              type="text"
              placeholder="请输入整改标题"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">风险等级</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="high">高风险</option>
              <option value="medium">中风险</option>
              <option value="low">低风险</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">整改要求</label>
            <textarea
              placeholder="请详细描述整改要求..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">责任人</label>
              <input
                type="text"
                placeholder="请输入责任人"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">完成日期</label>
              <input
                type="date"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RectificationPage;
