import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import TransactionModal from './TransactionModal';

function CustomerDashboard() {
    const { user, logout } = useContext(AuthContext);
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accountRes = await api.get('/accounts/me');
                const transactionsRes = await api.get('/transactions/me');

                setAccount(accountRes.data);
                setTransactions(transactionsRes.data);
            } catch (error) {
                setError('Failed to fetch data');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const openModal = (type) => {
        setTransactionType(type);
        setModalOpen(true);
    };

    const handleTransaction = async (amount, description) => {
        try {
            const endpoint = transactionType === 'deposit' ? '/transactions/deposit' : '/transactions/withdraw';
            const response = await api.post(endpoint, { amount, description });

            // Update account balance
            setAccount({ ...account, balance: response.data.balance });

            // Fetch updated transactions
            const transactionsRes = await api.get('/transactions/me');
            setTransactions(transactionsRes.data);

            setModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || `Failed to ${transactionType}`);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <h2>Welcome, {user.fullName}</h2>
                <button onClick={logout}>Logout</button>
            </nav>

            <div className="account-info">
                <h3>Account Information</h3>
                <div className="account-number">
                    Account Number: {account.accountNumber}
                </div>
                <div className="account-balance">
                    ${parseFloat(account.balance).toFixed(2)}
                </div>
                <div className="transaction-buttons">
                    <button onClick={() => openModal('deposit')}>
                        <i className="fas fa-plus"></i> Deposit
                    </button>
                    <button onClick={() => openModal('withdraw')}>
                        <i className="fas fa-minus"></i> Withdraw
                    </button>
                </div>
            </div>

            <div className="transactions-list">
                <h3>Transaction History</h3>
                {transactions.length === 0 ? (
                    <p>No transactions found</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Balance</th>
                                <th>Description</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className={transaction.type}>{transaction.type}</td>
                                    <td>${parseFloat(transaction.amount).toFixed(2)}</td>
                                    <td>${parseFloat(transaction.balance).toFixed(2)}</td>
                                    <td>{transaction.description}</td>
                                    <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {modalOpen && (
                <TransactionModal
                    type={transactionType}
                    balance={account.balance}
                    onSubmit={handleTransaction}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
}

export default CustomerDashboard; 