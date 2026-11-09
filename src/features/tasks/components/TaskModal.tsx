import {
  CalendarOutlined, CheckSquareFilled, DeleteOutlined, HistoryOutlined,
  PlusOutlined, UserOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Modal, Popconfirm, Select } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { BOARD_COLUMNS, getTeam, PRIORITIES } from '../config/board';
import { useAuth } from '../../auth/hooks/useAuth';
import type { Task, TaskInput, TaskPriority, TaskStatus } from '../model/task';

type FormData = {
  title: string; description: string; priority: TaskPriority;
  status: TaskStatus; dueDate: Dayjs; assignee?: string;
};

export function TaskModal({ open, task, initialStatus, defaultAssignee, onSave, onDelete, onClose }: {
  open: boolean; task: Task | null; initialStatus: TaskStatus; defaultAssignee?: string;
  onSave: (input: TaskInput, id?: string) => void;
  onDelete: (id: string) => void; onClose: () => void;
}) {
  const [form] = Form.useForm<FormData>();
  const { user } = useAuth();
  useEffect(() => {
    if (!open) return;
    if (task) {
      form.setFieldsValue({ title: task.title, description: task.description, priority: task.priority,
        status: task.status, dueDate: dayjs(task.dueDate), assignee: task.assignee });
    } else {
      form.resetFields();
      form.setFieldsValue({ priority: 'medium', status: initialStatus, dueDate: dayjs().add(3, 'day'), assignee: defaultAssignee });
    }
  }, [open, task, initialStatus, defaultAssignee, form]);

  const submit = (values: FormData) => {
    onSave({ title: values.title.trim(), description: values.description.trim(),
      priority: values.priority, status: values.status, dueDate: values.dueDate.format('YYYY-MM-DD'),
      assignee: values.assignee || undefined }, task?.id);
    form.resetFields();
    onClose();
  };
  const removeTask = () => { if (task) { onDelete(task.id); onClose(); } };

  return <Modal
    open={open} onCancel={onClose} title={<div className="jira-modal-topline"><CheckSquareFilled className="jira-modal-issue-icon" /><span>Tasklane / {task?.code ?? 'New issue'}</span></div>}
    className="jira-issue-modal" width={1100} centered styles={{ body: { padding: 0 } }}
    footer={<div className="jira-modal-footer">
      {task ? <Popconfirm title="Delete this issue?" description="This action cannot be undone." okText="Delete" okButtonProps={{ danger: true }} onConfirm={removeTask}>
        <Button danger type="text" icon={<DeleteOutlined />}>Delete issue</Button>
      </Popconfirm> : <span />}
      <span className="jira-modal-footer-spacer" />
      <Button onClick={onClose}>Cancel</Button>
      <Button type="primary" onClick={() => form.submit()}>{task ? 'Save changes' : 'Create issue'}</Button>
    </div>}
  >
    <Form form={form} layout="vertical" onFinish={submit} requiredMark={false} className="jira-modal-form">
      <div className="jira-modal-main">
        <div className="jira-modal-left">
          <Form.Item name="title" className="jira-modal-title-field" rules={[{ required: true, whitespace: true, message: 'Title is required' }, { max: 100, message: 'Maximum 100 characters' }]}>
            <Input maxLength={100} aria-label="Issue title" placeholder="Issue title" />
          </Form.Item>
          <div className="jira-modal-mini-actions"><span className="jira-modal-type-pill"><CheckSquareFilled /> Task</span><span className="jira-modal-type-pill"><PlusOutlined /> Work item</span></div>
          <h3 className="jira-modal-section-title">Key details</h3>
          <Form.Item name="description" label="Description" rules={[{ required: true, whitespace: true, message: 'Description is required' }]}>
            <Input.TextArea rows={6} maxLength={1200} showCount placeholder="Add a description..." />
          </Form.Item>
          <section className="jira-modal-activity">
            <h3>Activity</h3>
            <div className="jira-activity-tabs"><span className="active">History</span></div>
            {task ? <div className="jira-activity-row"><HistoryOutlined /><div><strong>Issue created</strong><small>{dayjs(task.createdAt).format('DD MMM YYYY, HH:mm')}</small></div></div> : <div className="jira-activity-hint">Your new issue will appear on the board after you create it.</div>}
            {task && task.updatedAt !== task.createdAt && <div className="jira-activity-row"><HistoryOutlined /><div><strong>Last updated</strong><small>{dayjs(task.updatedAt).format('DD MMM YYYY, HH:mm')}</small></div></div>}
          </section>
        </div>
        <aside className="jira-modal-right">
          <div className="jira-details-head"><span>Issue status</span><Form.Item name="status" rules={[{ required: true, message: 'Select a status' }]}><Select aria-label="Status" options={BOARD_COLUMNS.map(col => ({ value: col.key, label: col.title }))} /></Form.Item></div>
          <div className="jira-details-box">
            <h3>Details</h3>
            <Form.Item name="assignee" label={<><UserOutlined /> Assignee</>}><Select allowClear showSearch optionFilterProp="label" placeholder="Unassigned" options={getTeam(user).map(person => ({ value: person.name, label: person.name }))} /></Form.Item>
            <Form.Item name="priority" label="Priority" rules={[{ required: true, message: 'Select a priority' }]}><Select options={PRIORITIES.map(p => ({ value: p.value, label: p.label }))} /></Form.Item>
            <Form.Item name="dueDate" label={<><CalendarOutlined /> Due date</>} rules={[{ required: true, message: 'Select a due date' }]}><DatePicker className="full-width" format="DD MMM YYYY" /></Form.Item>
          </div>
          <div className="jira-details-box jira-context-box"><h3>Project</h3><div className="jira-detail-static"><span>Project</span><strong>Tasklane Software</strong></div><div className="jira-detail-static"><span>Issue type</span><strong>Task</strong></div><div className="jira-detail-static"><span>Issue key</span><strong>{task?.code ?? 'Assigned on creation'}</strong></div></div>
          <p className="jira-details-note">Tasks are stored locally in this browser. Changes are visible immediately on the board.</p>
        </aside>
      </div>
    </Form>
  </Modal>;
}
