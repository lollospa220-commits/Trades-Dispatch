'use client';

import { deleteCustomer } from '@/app/actions/customers';
import { useTransition } from 'react';

export default function DeleteCustomerButton({ id }: { id: string }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm('Eliminare questo cliente?')) {
          start(async () => {
            await deleteCustomer(id);
          });
        }
      }}
      className="text-xs font-semibold text-red-600"
    >
      Elimina
    </button>
  );
}