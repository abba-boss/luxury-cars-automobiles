import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  variant?: 'floating' | 'inline' | 'icon';
  className?: string;
}

const WhatsAppButton = ({
  phoneNumber = '2348012345678',
  message = 'Hello! I am interested in one of your vehicles.',
  variant = 'floating',
  className,
}: WhatsAppButtonProps) => {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-all duration-300 hover:scale-110',
          className
        )}
      >
        <MessageCircle className="w-5 h-5" />
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-all duration-300 hover:scale-[1.02]',
          className
        )}
      >
        <MessageCircle className="w-5 h-5" />
        Chat on WhatsApp
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110',
        className
      )}
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};

export default WhatsAppButton;
