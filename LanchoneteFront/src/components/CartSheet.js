import React from 'react';
import { Sheet } from './ui';
import CartContent from './CartContent';

export default function CartSheet({ onSend, onClose }) {
  return (
    <Sheet onClose={onClose}>
      <CartContent onSend={onSend} />
    </Sheet>
  );
}
