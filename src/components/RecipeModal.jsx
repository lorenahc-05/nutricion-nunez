import './RecipeModal.css'

export default function RecipeModal({ plato, onClose }) {
  const ingredientes = plato.ingredientes?.split(',').map(i => i.trim()).filter(Boolean) || []
  const pasos = plato.elaboracion?.split('.').map(p => p.trim()).filter(Boolean) || []

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-back" onClick={onClose}>
            <i className="ti ti-arrow-left" />
            <span>Volver</span>
          </button>
          <h3>{plato.nombre}</h3>
        </div>
        <div className="modal-body">
          {ingredientes.length > 0 && (
            <div className="modal-section">
              <h4>Ingredientes</h4>
              {ingredientes.map((ing, i) => (
                <div key={i} className="ingredient-row">
                  <i className="ti ti-circle-check" />
                  <span>{ing}</span>
                </div>
              ))}
            </div>
          )}
          {pasos.length > 0 && (
            <div className="modal-section">
              <h4>Elaboración</h4>
              {pasos.map((paso, i) => (
                <div key={i} className="step-row">
                  <div className="step-num">{i + 1}</div>
                  <p>{paso}</p>
                </div>
              ))}
            </div>
          )}
          {plato.nota && (
            <div className="nota-box">
              <strong>Nota:</strong> {plato.nota}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}