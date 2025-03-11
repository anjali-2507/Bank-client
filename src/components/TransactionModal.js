import React, { useState } from 'react';

function TransactionModal({ type, balance, onSubmit, onClose }) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        onSubmit(parseFloat(amount), description);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>{type === 'deposit' ? 'Make a Deposit' : 'Make a Withdrawal'}</h3>
                <p>Current Balance: ${parseFloat(balance).toFixed(2)}</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Amount:</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description (optional):</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TransactionModal; 