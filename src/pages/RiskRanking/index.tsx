import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Building2, TrendingDown, Users, Search, Eye, ArrowUpDown } from 'lucide-react';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Select from '../../components/ui/Select';
import RiskBadge from '../../components/ui/RiskBadge';
import Button from '../../components/ui/Button';
import { mockProjects, regions, projectTypes, generalContractors } from '../../data/mockData';
import { formatMoney, formatPercent, formatNumber } from '../../utils';
import { Project } from '../../types';

const RiskRanking = () => {
  const navigate = useNavigate();
  const [region, setRegion] = useState('全部地区');
  const [projectType, setProjectType] = useState('全部类型');
  const [contractor, setContractor] = useState('全部总包单位');
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState('riskLevel');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredProjects = useMemo(() => {
    let result = [...mockProjects];
    
    if (region !== '全部地区') {
      result = result.filter((p) => p.region === region);
    }
    if (projectType !== '全部类型') {
      result = result.filter((p) => p.projectType === projectType);
    }
    if (contractor !== '全部总包单位') {
      result = result.filter((p) => p.generalContractor === contractor);
    }
    if (searchText) {
      const keyword = searchText.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(keyword) || p.generalContractor.toLowerCase().includes(keyword)
      );
    }
    
    const riskWeight = { high: 3, medium: 2, low: 1 };
    result.sort((a, b) => {
      let compareValue = 0;
      switch (sortField) {
        case 'riskLevel':
          compareValue = riskWeight[a.riskLevel] - riskWeight[b.riskLevel];
          break;
        case 'balance':
          compareValue = a.accountBalance - b.accountBalance;
          break;
        case 'confirmationRate':
          compareValue = a.confirmationRate - b.confirmationRate;
          break;
        default:
          compareValue = 0;
      }
      return sortOrder === 'desc' ? -compareValue : compareValue;
    });
    
    return result;
  }, [region, projectType, contractor, searchText, sortField, sortOrder]);

  const stats = useMemo(() => {
    const total = mockProjects.length;
    const high = mockProjects.filter((p) => p.riskLevel === 'high').length;
    const medium = mockProjects.filter((p) => p.riskLevel === 'medium').length;
    const low = mockProjects.filter((p) => p.riskLevel === 'low').length;
    return { total, high, medium, low };
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleViewDetail = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">风险排行</h2>
          <p className="text-sm text-slate-500 mt-1">实时监控各项目工资专户风险状况</p>
        </div>
        <div className="text-sm text-slate-400">
          数据更新时间：2026-05-30 10:30
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="项目总数"
          value={stats.total}
          subtitle="个在建项目"
          icon={Building2}
          color="blue"
          delay={0}
        />
        <StatCard
          title="高风险项目"
          value={stats.high}
          subtitle="需立即关注"
          icon={AlertTriangle}
          color="red"
          delay={50}
        />
        <StatCard
          title="中风险项目"
          value={stats.medium}
          subtitle="需持续跟踪"
          icon={TrendingDown}
          color="orange"
          delay={100}
        />
        <StatCard
          title="低风险项目"
          value={stats.low}
          subtitle="运行正常"
          icon={Users}
          color="green"
          delay={150}
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label="地区"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              options={regions.map((r) => ({ value: r, label: r }))}
              className="w-36"
            />
            <Select
              label="项目类型"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              options={projectTypes.map((t) => ({ value: t, label: t }))}
              className="w-40"
            />
            <Select
              label="总包单位"
              value={contractor}
              onChange={(e) => setContractor(e.target.value)}
              options={generalContractors.map((g) => ({ value: g, label: g }))}
              className="w-56"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索项目名称、总包单位..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="pb-3 pl-2 pr-4 font-medium w-16">排名</th>
                <th className="pb-3 px-4 font-medium min-w-[220px]">
                  <button 
                    className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    项目名称
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="pb-3 px-4 font-medium w-28">地区</th>
                <th className="pb-3 px-4 font-medium w-28">
                  <button 
                    className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                    onClick={() => handleSort('riskLevel')}
                  >
                    风险等级
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="pb-3 px-4 font-medium w-32">
                  <button 
                    className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                    onClick={() => handleSort('balance')}
                  >
                    专户余额
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="pb-3 px-4 font-medium w-28">在场人数</th>
                <th className="pb-3 px-4 font-medium w-28">
                  <button 
                    className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                    onClick={() => handleSort('confirmationRate')}
                  >
                    确认率
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="pb-3 px-4 font-medium min-w-[200px]">异常指标</th>
                <th className="pb-3 px-4 font-medium w-24 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, index) => (
                <tr
                  key={project.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors group"
                >
                  <td className="py-4 pl-2 pr-4">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      index < 3 
                        ? 'bg-risk-high text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-slate-800">{project.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{project.generalContractor}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-600">{project.region}</td>
                  <td className="py-4 px-4">
                    <RiskBadge level={project.riskLevel} pulse={project.riskLevel === 'high'} />
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-mono-nums font-medium ${
                      project.payrollMonthsAvailable < 1.5 ? 'text-risk-high' :
                      project.payrollMonthsAvailable < 3 ? 'text-risk-medium' : 'text-slate-700'
                    }`}>
                      {formatMoney(project.accountBalance)}
                    </span>
                    <div className="text-xs text-slate-400">
                      可发 {project.payrollMonthsAvailable.toFixed(1)} 个月
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-mono-nums">
                    {formatNumber(project.totalWorkers)}人
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            project.confirmationRate < 70 ? 'bg-risk-high' :
                            project.confirmationRate < 85 ? 'bg-risk-medium' : 'bg-risk-low'
                          }`}
                          style={{ width: `${project.confirmationRate}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-mono-nums ${
                        project.confirmationRate < 70 ? 'text-risk-high' :
                        project.confirmationRate < 85 ? 'text-risk-medium' : 'text-slate-600'
                      }`}>
                        {formatPercent(project.confirmationRate)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {project.abnormalIndicators.length > 0 ? (
                        project.abnormalIndicators.map((indicator, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-0.5 text-xs rounded bg-risk-highLight text-risk-high"
                          >
                            {indicator}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">无异常</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetail(project.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-4 h-4" />
                      详情
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProjects.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>暂无符合条件的项目</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RiskRanking;
