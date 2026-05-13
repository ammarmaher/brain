/*** Knowledge — top-level tabs for Modules / Analysis Tree / Jobs / Reports ***/
import { useState } from 'react';
import Tabs from '../components/ui/Tabs';
import ModulesTab from './knowledge/ModulesTab';
import AnalysisTreeTab from './knowledge/AnalysisTreeTab';
import JobsTab from './knowledge/JobsTab';
import ReportsTab from './knowledge/ReportsTab';

type TopTab = 'modules' | 'tree' | 'jobs' | 'reports';

export default function Knowledge() {
  const [tab, setTab] = useState<TopTab>('modules');

  return (
    <div className="grid grid-rows-[auto_1fr] gap-4 h-full min-h-0">
      <Tabs
        items={[
          { value: 'modules', label: 'Modules' },
          { value: 'tree', label: 'Analysis Tree' },
          { value: 'jobs', label: 'Jobs' },
          { value: 'reports', label: 'Reports' },
        ]}
        value={tab}
        onChange={(v) => setTab(v as TopTab)}
      />
      <div className="min-h-0 overflow-hidden">
        {tab === 'modules' && <ModulesTab />}
        {tab === 'tree' && <AnalysisTreeTab />}
        {tab === 'jobs' && <JobsTab />}
        {tab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
}
