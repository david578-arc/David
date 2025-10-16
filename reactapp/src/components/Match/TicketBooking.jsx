import React, { useMemo, useState } from 'react';
import './TicketBooking.css';

const TicketBooking = ({ token, matchId }) => {
  const [quantity, setQuantity] = useState(1);
  const [seatCategory, setSeatCategory] = useState('GENERAL');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const pricePerSeat = useMemo(() => (seatCategory === 'VIP' ? 1500 : 500), [seatCategory]);
  const amount = useMemo(() => pricePerSeat * quantity, [pricePerSeat, quantity]);

  const book = async () => {
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ matchId, quantity, seatCategory })
      });
      if (!res.ok) throw new Error('Failed to book ticket');
      setMessage('Ticket reserved. Proceed to payment.');
    } catch (e) {
      setMessage(e.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const payWithStripe = async () => {
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount, currency: 'INR', successUrl: window.location.origin + '/payment-success', cancelUrl: window.location.origin + '/payment-cancel' })
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error || 'Failed to start checkout');
      window.location.href = data.checkoutUrl;
    } catch (e) {
      setMessage(e.message || 'Payment init failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-booking card">
      <div className="tb-header">
        <h4>Tickets</h4>
        <div className="tb-amount">₹ {amount.toLocaleString('en-IN')}</div>
      </div>
      <div className="tb-row">
        <label>Category</label>
        <select value={seatCategory} onChange={(e) => setSeatCategory(e.target.value)} className="tb-select">
          <option value="GENERAL">General</option>
          <option value="VIP">VIP</option>
        </select>
      </div>
      <div className="tb-row">
        <label>Quantity</label>
        <input className="tb-input" type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value || 1, 10))} />
      </div>
      <div className="tb-actions">
        <button className="btn ghost" onClick={book} disabled={loading}>Reserve</button>
        <button className="btn primary" onClick={payWithStripe} disabled={loading}>
          {loading ? 'Processing…' : 'Pay with Stripe'}
        </button>
      </div>
      {message && <div className="status-message">{message}</div>}
    </div>
  );
};

export default TicketBooking;


