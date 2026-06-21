import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  Briefcase, 
  Users, 
  Wallet, 
  Calendar,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  Send
} from 'lucide-react';
import Card from '../../components/ui/Card';
import RiskBadge from '../../components/ui/RiskBadge';
import Tabs from '../../components/ui/Tabs';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import PayrollChart from '../../components/charts/PayrollChart';
import AccountBalanceGauge from '../../components/charts/AccountBalanceGauge';
import { mockProjects, mockPayrollRecords, mockAbnormalWorkers } from '../../data/mockData';
import { formatMoney, formatNumber, formatPercent, formatDate, getAbnormalTypeText, getAbnormalTypeColor } from '../../utils';
import { AbnormalType } from '../../types';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bank_return');
  const [showRectifyModal, setShowRectifyModal] = useState(false);
  const [rectifyTitle, setRectifyTitle] = useState('');
  const [rectifyContent, setRectifyContent] = useState('');
  const [rectifyAssignee, setRectifyAssignee] = useState('');
  const [rectifyDeadline, setRectifyDeadline] = useState('');

  const project = useMemo(() => {
    return mockProjects.find((p) => p.id === id);
  }, [id]);

  const payrollRecords = useMemo(() => {
    return mockPayrollRecords[id || ''] || [];
  }, [id]);

  const abnormalWorkers = useMemo(() => {
    const allWorkers = mockAbnormalWorkers[id || ''] || [];
    if (activeTab === 'all') return allWorkers;
    return allWorkers.filter((w) => w.abnormalType === activeTab);
  }, [id, activeTab]);

  const abnormalStats = useMemo(() => {
    const allWorkers = mockAbnormalWorkers[id || ''] || [];
    return {
      bankReturn: allWorkers.filter((w) => w.abnormalType === 'bank_return').length,
      unconfirmed: allWorkers.filter((w) => w.abnormalType === 'unconfirmed').length,
      consecutiveUnpaid: allWorkers.filter((w) => w.abnormalType === 'consecutive_unpaid').length,
    };
  }, [id]);

  const tabItems = [
    { key: 'bank_return', label: '银行退回', count: abnormalStats.bankReturn },
    { key: 'unconfirmed', label: '工资未确认', count: abnormalStats.unconfirmed },
    { key: 'consecutive_unpaid', label: '连续未发薪', count: abnormalStats.consecutiveUnpaid },
  ];

  const handleGoBack = () => {
    navigate('/');
  };

  const handleSubmitRectify = () => {
    setShowRectifyModal(false);
    setRectifyTitle('');
    setRectifyContent('');
    setRectifyAssignee('');
    setRectifyDeadline('');
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Building2 className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg">项目不存在</p>
        <Button variant="ghost" onClick={handleGoBack} className="mt-4">
          <ArrowLeft className="w-4 h-4" />
          返回风险排行
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回风险排行
        </button>
      </div>

      <Card className="animate-fade-in-up">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-800">{project.name}</h2>
                <RiskBadge level={project.riskLevel} pulse={project.riskLevel === 'high'} size="md" />
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {project.region}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  {project.projectType}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {project.generalContractor}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  最近发薪：{formatDate(project.lastPayrollDate)}
                </span>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowRectifyModal(true)}>
            <Send className="w-4 h-4" />
            下发整改
          </Button>
        </div>

        {project.abnormalIndicators.length > 0 && (
          <div className="mt-5 p-4 rounded-lg bg-risk-highLight/50 border border-risk-high/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-risk-high flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-risk-high">风险预警</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.abnormalIndicators.map((indicator, i) => (
                    <span
                      key={i}
                      className="inline-block px-2.5 py-1 text-xs rounded-full bg-risk-high text-white font-medium"
                    >
                      {indicator}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card title="工资发放趋势" className="animate-fade-in-up stagger-1">
            <PayrollChart data={payrollRecords} />
          </Card>

          <Card title="劳务队伍" className="animate-fade-in-up stagger-2">
            <div className="grid grid-cols-2 gap-3">
              {project.laborTeams.map((team, index) => (
                <div
                  key={team.id}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{team.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                      {team.workType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    <Users className="w-4 h-4" />
                    <span className="font-mono-nums font-medium text-slate-700">{team.workerCount}</span>
                    <span>人</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    负责人：{team.leader} · {team.phone}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card 
            title="异常人员名单" 
            className="animate-fade-in-up stagger-3"
            extra={<Tabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} />}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="pb-3 font-medium">姓名</th>
                    <th className="pb-3 font-medium">身份证号</th>
                    <th className="pb-3 font-medium">所属班组</th>
                    <th className="pb-3 font-medium">异常类型</th>
                    <th className="pb-3 font-medium text-right">异常次数</th>
                    <th className="pb-3 font-medium text-right">涉及金额</th>
                    <th className="pb-3 font-medium text-right">更新时间</th>
                  </tr>
                </thead>
                <tbody>
                  {abnormalWorkers.map((worker) => (
                    <tr key={worker.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 font-medium text-slate-700">{worker.name}</td>
                      <td className="py-3 text-slate-500 font-mono">{worker.idCard}</td>
                      <td className="py-3 text-slate-600">{worker.laborTeam}</td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getAbnormalTypeColor(worker.abnormalType)}`}>
                          {getAbnormalTypeText(worker.abnormalType)}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono-nums text-slate-700">
                        {worker.abnormalCount}次
                      </td>
                      <td className="py-3 text-right font-mono-nums text-slate-700">
                        {formatMoney(worker.amount)}
                      </td>
                      <td className="py-3 text-right text-slate-400 text-xs">
                        {formatDate(worker.lastUpdate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {abnormalWorkers.length === 0 && (
                <div className="py-12 text-center text-slate-400">
                  <UserCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">暂无该类型异常人员</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="专户余额监控" className="animate-fade-in-up stagger-1">
            <AccountBalanceGauge
              balance={project.accountBalance}
              monthlyAverage={project.monthlyAverageSalary}
              monthsAvailable={project.payrollMonthsAvailable}
            />
          </Card>

          <Card title="核心指标" className="animate-fade-in-up stagger-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-slate-600">在场人数</span>
                </div>
                <span className="text-lg font-bold text-slate-800 font-mono-nums">
                  {formatNumber(project.totalWorkers)}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-50 text-green-600">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="text-slate-600">工资确认率</span>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold font-mono-nums ${
                    project.confirmationRate < 70 ? 'text-risk-high' :
                    project.confirmationRate < 85 ? 'text-risk-medium' : 'text-risk-low'
                  }`}>
                    {formatPercent(project.confirmationRate)}
                  </span>
                  <div className="w-20 h-1.5 bg-slate-200 rounded-full mt-1.5 ml-auto">
                    <div 
                      className={`h-full rounded-full ${
                        project.confirmationRate < 70 ? 'bg-risk-high' :
                        project.confirmationRate < 85 ? 'bg-risk-medium' : 'bg-risk-low'
                      }`}
                      style={{ width: `${project.confirmationRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                    <UserX className="w-5 h-5" />
                  </div>
                  <span className="text-slate-600">银行退回人数</span>
                </div>
                <span className={`text-lg font-bold font-mono-nums ${
                  project.bankReturnCount > 10 ? 'text-risk-high' :
                  project.bankReturnCount > 5 ? 'text-risk-medium' : 'text-slate-700'
                }`}>
                  {project.bankReturnCount}人
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-50 text-red-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-slate-600">连续未发薪</span>
                </div>
                <span className={`text-lg font-bold font-mono-nums ${
                  project.consecutiveUnpaidMonths > 0 ? 'text-risk-high' : 'text-risk-low'
                }`}>
                  {project.consecutiveUnpaidMonths}个月
                </span>
              </div>
            </div>
          </Card>

          <Card 
            title="快速判断" 
            className="animate-fade-in-up stagger-3 bg-gradient-to-br from-primary-800 to-primary-900 text-white border-primary-700"
          >
            <div className="space-y-3 text-sm">
              {project.consecutiveUnpaidMonths > 0 ? (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-risk-high flex-shrink-0 mt-0.5" />
                  <p className="text-primary-100">
                    连续<span className="text-white font-bold">{project.consecutiveUnpaidMonths}个月</span>未发工资，属于<span className="text-white font-bold">资金问题</span>，需立即筹措资金补发。
                  </p>
                </div>
              ) : null}
              {project.confirmationRate < 80 ? (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-risk-medium flex-shrink-0 mt-0.5" />
                  <p className="text-primary-100">
                    工资确认率偏低，可能存在<span className="text-white font-bold">资料管理不规范</span>问题，需加强工人信息核验。
                  </p>
                </div>
              ) : null}
              {project.bankReturnCount > 10 ? (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-risk-medium flex-shrink-0 mt-0.5" />
                  <p className="text-primary-100">
                    银行退回人数偏多，建议核实工人<span className="text-white font-bold">银行卡信息</span>是否准确。
                  </p>
                </div>
              ) : null}
              {project.payrollMonthsAvailable < 2 ? (
                <div className="flex items-start gap-2">
                  <Wallet className="w-4 h-4 text-risk-high flex-shrink-0 mt-0.5" />
                  <p className="text-primary-100">
                    专户余额不足<span className="text-white font-bold">2个月</span>，需关注资金进账情况，防范欠薪风险。
                  </p>
                </div>
              ) : null}
              {project.riskLevel === 'low' && (
                <div className="flex items-start gap-2">
                  <UserCheck className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-primary-100">
                    项目运行状况良好，各项指标正常，继续保持。
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showRectifyModal}
        onClose={() => setShowRectifyModal(false)}
        title="下发整改通知"
        width="max-w-xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowRectifyModal(false)}>取消</Button>
            <Button onClick={handleSubmitRectify}>确认下发</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">项目名称</label>
            <input
              type="text"
              value={project.name}
              readOnly
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">整改标题</label>
            <input
              type="text"
              value={rectifyTitle}
              onChange={(e) => setRectifyTitle(e.target.value)}
              placeholder="请输入整改标题"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">整改要求</label>
            <textarea
              value={rectifyContent}
              onChange={(e) => setRectifyContent(e.target.value)}
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
                value={rectifyAssignee}
                onChange={(e) => setRectifyAssignee(e.target.value)}
                placeholder="请输入责任人"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">完成日期</label>
              <input
                type="date"
                value={rectifyDeadline}
                onChange={(e) => setRectifyDeadline(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetail;
