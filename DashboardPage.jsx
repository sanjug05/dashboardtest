import OverviewCards from '../components/Dashboard/OverviewCards';
import AnalyticsDashboard from '../components/Dashboard/AnalyticsDashboard';
import KPI1 from '../components/KPICards/KPI1';
import KPI2 from '../components/KPICards/KPI2';
import KPI3 from '../components/KPICards/KPI3';
import KPI4 from '../components/KPICards/KPI4';
import { KPI5, KPI6, KPI7, KPI8, KPI9, KPI10, KPI11 } from '../components/KPICards/KPIs5to11';

const PAGE_MAP = {
  dashboard: null,
  kpi1: KPI1,
  kpi2: KPI2,
  kpi3: KPI3,
  kpi4: KPI4,
  kpi5: KPI5,
  kpi6: KPI6,
  kpi7: KPI7,
  kpi8: KPI8,
  kpi9: KPI9,
  kpi10: KPI10,
  kpi11: KPI11,
  analytics: null,
};

const DashboardPage = ({ activePage }) => {
  if (activePage === 'analytics') {
    return (
      <div>
        <AnalyticsDashboard />
      </div>
    );
  }

  if (activePage !== 'dashboard' && PAGE_MAP[activePage]) {
    const Component = PAGE_MAP[activePage];
    return (
      <div>
        <Component />
      </div>
    );
  }

  // Full dashboard view
  return (
    <div>
      <OverviewCards />
      <AnalyticsDashboard />
      <KPI1 />
      <KPI2 />
      <KPI3 />
      <KPI4 />
      <KPI5 />
      <KPI6 />
      <KPI7 />
      <KPI8 />
      <KPI9 />
      <KPI10 />
      <KPI11 />
    </div>
  );
};

export default DashboardPage;
