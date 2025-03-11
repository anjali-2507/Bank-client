import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

function BankerDashboard() {
    const { user, logout } = useContext(AuthContext);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await api.get('/accounts');
                setAccounts(response.data);
            } catch (error) {
                setError('Failed to fetch accounts');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const viewTransactions = async (accountId) => {
        try {
            setLoading(true);

            // Get account details
            const accountRes = await api.get(`/accounts/${accountId}`);
            setSelectedAccount(accountRes.data);

            // Get transactions
            const transactionsRes = await api.get(`/transactions/account/${accountId}`);
            setTransactions(transactionsRes.data);
        } catch (error) {
            setError('Failed to fetch transactions');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const backToAccounts = () => {
        setSelectedAccount(null);
        setTransactions([]);
    };

    if (loading && accounts.length === 0) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <h2>Banker Dashboard - {user.fullName}</h2>
                <button onClick={logout}>Logout</button>
            </nav>

            {selectedAccount ? (
                <div className="account-details">
                    <button onClick={backToAccounts} className="back-button">
                        Back to Accounts
                    </button>

                    <h3>Account Details</h3>
                    <p>Account Number: {selectedAccount.accountNumber}</p>
                    <p>Customer: {selectedAccount.fullName}</p>
                    <p>Email: {selectedAccount.email}</p>
                    <p>Balance: ${parseFloat(selectedAccount.balance).toFixed(2)}</p>

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
                </div>
            ) : (
                <div className="accounts-list">
                    <h3>Customer Accounts</h3>
                    {accounts.length === 0 ? (
                        <p>No accounts found</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Account Number</th>
                                    <th>Customer Name</th>
                                    <th>Balance</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((account) => (
                                    <tr key={account.id}>
                                        <td>{account.accountNumber}</td>
                                        <td>{account.fullName}</td>
                                        <td>${parseFloat(account.balance).toFixed(2)}</td>
                                        <td>
                                            <button onClick={() => viewTransactions(account.id)}>
                                                View Transactions
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default BankerDashboard; 