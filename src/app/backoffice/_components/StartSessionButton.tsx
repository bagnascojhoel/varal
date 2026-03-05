'use client';

interface Props {
  selectedCount: number;
  loading: boolean;
  onSubmit: () => Promise<void>;
}

export function StartSessionButton({
  selectedCount,
  loading,
  onSubmit,
}: Props) {
  const isDisabled = selectedCount === 0 || loading;

  const handleClick = async () => {
    if (isDisabled) return;
    await onSubmit();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        w-full min-h-11 px-4 py-3
        rounded-2xl font-semibold
        glass
        transition-all duration-200
        ${
          isDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'opacity-100 hover:opacity-90 active:scale-95'
        }
      `}
    >
      {loading ? 'Iniciando...' : 'Iniciar Sessão'}
    </button>
  );
}
