import { Button } from '@src/components/ui/button';
import { useTranslation } from 'react-i18next';

interface LoginButtonProps {
  onClick: () => void;
}

export const LoginButton = ({ onClick }: LoginButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      className="flex h-auto w-auto flex-row items-center rounded-full bg-[#1DB954] px-2 py-2 text-white shadow-md hover:bg-[#13af4a] sm:px-3 sm:py-2.5"
      onClick={onClick}
    >
      <img
        src="/techIcons/Spotify-Mark-white.png"
        alt="Spotify-icon"
        className="h-[35px] sm:h-[55px]"
      />
      <span className="mr-2 ml-1 text-xl font-normal text-white sm:ml-2 sm:text-3xl">
        {t('login_page.button')}
      </span>
    </Button>
  );
};
