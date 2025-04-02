import '../styles/Alert.css'

export default function Alert({ isOpen, onClose, children }) {
    if (!isOpen) 
        return null;

    return (
        <div className = "alert-overlay">
            <div className = "alert-content">
                <div className = "alert-details">
                    {children}
                </div>
                <div className = "alert-button">
                    <button onClick = {onClose}>OK</button>
                </div>
            </div>
            
        </div>
    );
};