import Modal from './Modal';
export default function ConfirmDialog({ title = 'Confirm action', message, onCancel, onConfirm }) {
  return <Modal title={title} onClose={onCancel}>
    <div className="confirm-body"><p>{message}</p><div className="modal-actions">
      <button className="outline-button" onClick={onCancel}>Cancel</button>
      <button className="danger-button" onClick={onConfirm}>Delete</button>
    </div></div>
  </Modal>;
}
