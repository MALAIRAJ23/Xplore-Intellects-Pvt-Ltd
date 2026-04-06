function TaskStatusBadge({ status }) {
  const normalized = status || 'Pending';

  const className =
    normalized === 'Completed'
      ? 'status-completed'
      : normalized === 'In Progress'
        ? 'status-progress'
        : 'status-pending';

  return <span className={`status-pill ${className}`}>{normalized}</span>;
}

export default TaskStatusBadge;
