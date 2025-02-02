import "../Modal/style.css";

const PasswordModal = ({ onClose }) => {
  const handleSetPassword = () => {
    const password = document.getElementById("password").value;
    localStorage.setItem("illusion--password", password);

    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="modal-title">Введіть пароль</h2>
        <div className="modal-match-info">
          <div className="modal-input-container">
            <input
              className=""
              type="password"
              name="password"
              id="password"
              placeholder="Ваш пароль"
            />
          </div>
        </div>
        <div className="modal-buttons">
          <button className="modal-save-btn" onClick={handleSetPassword}>
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
