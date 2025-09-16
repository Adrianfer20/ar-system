import { useState } from 'react';
import toast from 'react-hot-toast';

interface UseFormHandlerOptions<T> {
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: () => void;
  successMessage?: string;
}

export const useFormHandler = <T>({ onSubmit, onSuccess, successMessage }: UseFormHandlerOptions<T>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: T) => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(data);
      if (successMessage) toast.success(successMessage);
      onSuccess?.();
    } catch (err: any) {
      const message = err?.message || 'Error desconocido';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, error };
};