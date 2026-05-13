/*** Pipeline state machine - 14 nodes + qa_failed branch back to coding ***/
/*** Used to render the visual flow and to gate which actions are allowed ***/

export type PipelineState =
  | 'received'
  | 'l1_drafting'
  | 'l1_review'
  | 'l2_drafting'
  | 'l2_review'
  | 'l3_drafting'
  | 'l3_review'
  | 'scenarios_pending'
  | 'scenarios_ready'
  | 'coding'
  | 'qa_pending'
  | 'qa_passed'
  | 'qa_failed'
  | 'ready_to_push'
  | 'completed';

export interface StateNode {
  id: PipelineState;
  label: string;
  row: number;
  col: number;
  group: 'L1' | 'L2' | 'L3' | 'scenarios' | 'coding' | 'qa' | 'ship' | 'start';
}

/*** Layout: 4 rows x 4 cols, branch row hosts qa_failed ***/
export const NODES: StateNode[] = [
  { id: 'received', label: 'Received', row: 0, col: 0, group: 'start' },
  { id: 'l1_drafting', label: 'L1 Drafting', row: 0, col: 1, group: 'L1' },
  { id: 'l1_review', label: 'L1 Review', row: 0, col: 2, group: 'L1' },
  { id: 'l2_drafting', label: 'L2 Drafting', row: 0, col: 3, group: 'L2' },

  { id: 'l2_review', label: 'L2 Review', row: 1, col: 0, group: 'L2' },
  { id: 'l3_drafting', label: 'L3 Drafting', row: 1, col: 1, group: 'L3' },
  { id: 'l3_review', label: 'L3 Review', row: 1, col: 2, group: 'L3' },
  { id: 'scenarios_pending', label: 'Scenarios Pending', row: 1, col: 3, group: 'scenarios' },

  { id: 'scenarios_ready', label: 'Scenarios Ready', row: 2, col: 0, group: 'scenarios' },
  { id: 'coding', label: 'Coding', row: 2, col: 1, group: 'coding' },
  { id: 'qa_pending', label: 'QA Pending', row: 2, col: 2, group: 'qa' },
  { id: 'qa_passed', label: 'QA Passed', row: 2, col: 3, group: 'qa' },

  { id: 'qa_failed', label: 'QA Failed', row: 3, col: 1, group: 'qa' },
  { id: 'ready_to_push', label: 'Ready to Push', row: 3, col: 2, group: 'ship' },
  { id: 'completed', label: 'Completed', row: 3, col: 3, group: 'ship' },
];

/*** Linear ordering of states for "is past?" comparisons ***/
export const ORDER: PipelineState[] = [
  'received',
  'l1_drafting',
  'l1_review',
  'l2_drafting',
  'l2_review',
  'l3_drafting',
  'l3_review',
  'scenarios_pending',
  'scenarios_ready',
  'coding',
  'qa_pending',
  'qa_passed',
  'ready_to_push',
  'completed',
];

export interface Edge {
  from: PipelineState;
  to: PipelineState;
  branch?: boolean;
}

export const EDGES: Edge[] = [
  { from: 'received', to: 'l1_drafting' },
  { from: 'l1_drafting', to: 'l1_review' },
  { from: 'l1_review', to: 'l2_drafting' },
  { from: 'l2_drafting', to: 'l2_review' },
  { from: 'l2_review', to: 'l3_drafting' },
  { from: 'l3_drafting', to: 'l3_review' },
  { from: 'l3_review', to: 'scenarios_pending' },
  { from: 'scenarios_pending', to: 'scenarios_ready' },
  { from: 'scenarios_ready', to: 'coding' },
  { from: 'coding', to: 'qa_pending' },
  { from: 'qa_pending', to: 'qa_passed' },
  { from: 'qa_pending', to: 'qa_failed', branch: true },
  { from: 'qa_failed', to: 'coding', branch: true },
  { from: 'qa_passed', to: 'ready_to_push' },
  { from: 'ready_to_push', to: 'completed' },
];

export type NodeStatus = 'past' | 'current' | 'future' | 'blocked';

export function classifyState(
  current: string,
  blockers: unknown[],
  node: PipelineState
): NodeStatus {
  const cur = current.toLowerCase() as PipelineState;
  if (node === cur) {
    if (blockers && blockers.length > 0) return 'blocked';
    return 'current';
  }
  /*** branch row only "current" if explicit ***/
  if (node === 'qa_failed') return 'future';
  const curIdx = ORDER.indexOf(cur);
  const nodeIdx = ORDER.indexOf(node);
  if (curIdx === -1 || nodeIdx === -1) return 'future';
  return nodeIdx < curIdx ? 'past' : 'future';
}

/*** Action -> required current state(s) for the action to be allowed ***/
export const ACTION_GUARDS: Record<string, PipelineState[]> = {
  approveL1: ['l1_review'],
  rejectL1: ['l1_review'],
  approveL2: ['l2_review'],
  rejectL2: ['l2_review'],
  approveL3: ['l3_review'],
  rejectL3: ['l3_review'],
  sendScenarios: ['l3_review', 'scenarios_pending'],
  submitQa: ['coding'],
  requestPush: ['qa_passed'],
};

export function isAllowed(action: keyof typeof ACTION_GUARDS, currentState: string): boolean {
  const cur = currentState.toLowerCase();
  return ACTION_GUARDS[action]?.includes(cur as PipelineState) ?? false;
}
