import {
  Megaphone,
  Code,
  Wrench,
  ListMusic,
  Music,
  Users,
  Star,
} from 'lucide-react';
import { Card, CardContent } from '@src/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@src/components/ui/collapsible';
import { useState } from 'react';
import { ExpandButton } from '@src/components/atoms/ExpandButton/ExpandButton';
import { StandardLink } from '@src/components/atoms/StandardLink/StandardLink';
import { TechStackContent } from '@src/components/templates/TechStackContent/TechStackContent';
import { Trans, useTranslation } from 'react-i18next';
import { useThemeMode } from '@src/zustand/themeStore';
import { cn } from '@src/lib/utils';

export const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center max-sm:p-0 sm:p-0 sm:pb-2">
        <div className="mx-4 mb-8 max-w-160">
          <h2 className="my-2 text-center text-2xl font-semibold sm:text-3xl">
            {t('about_page.features.title')}
          </h2>
          <div className="mt-2" />
          <div className="space-y-2">
            <CustomListItem
              text={t('about_page.features.matching')}
              Icon={<ListMusic className="h-8 w-8 text-blue-500" />}
            />
            <CustomListItem
              text={t('about_page.features.festivals')}
              Icon={<Music className="h-8 w-8 text-red-500" />}
            />
            <CustomListItem
              text={t('about_page.features.artists')}
              Icon={<Users className="h-8 w-8 text-purple-500" />}
            />
            <CustomListItem
              text={
                <Trans
                  i18nKey="about_page.features.code"
                  components={{ Link: <StandardLink /> }}
                />
              }
              Icon={<Code className="h-8 w-8 text-green-500" />}
            />
            <CustomListItem
              text={
                <Trans
                  i18nKey="about_page.features.storybook"
                  components={{ Link: <StandardLink /> }}
                />
              }
              Icon={<Wrench className="h-8 w-8 text-yellow-500" />}
            />
          </div>
        </div>
        <CollapsibleCard title={t('about_page.tech_stack.title')}>
          <TechStackContent />
        </CollapsibleCard>
        <CollapsibleCard title={t('about_page.support.title')}>
          <div className="flex w-full max-w-120 flex-col items-center justify-center py-2">
            <div className="space-y-2">
              <CustomListItem
                text={t('about_page.support.share')}
                Icon={<Megaphone className="h-8 w-8 text-blue-600" />}
              />
              <CustomListItem
                text={
                  <Trans
                    i18nKey="about_page.support.code"
                    components={{
                      StarIcon: (
                        <Star className="inline-block h-5 w-5 align-middle" />
                      ),
                      Link: <StandardLink />,
                    }}
                  />
                }
                Icon={<Star className="h-8 w-8 text-yellow-500" />}
              />
            </div>
          </div>
        </CollapsibleCard>
        <CollapsibleCard title={t('about_page.disclaimer.title')}>
          <div className="flex w-full max-w-120 flex-col items-center justify-center py-2">
            <p className="text-center">{t('about_page.disclaimer.text')}</p>
          </div>
        </CollapsibleCard>
        <div className="mt-6 max-lg:w-100 max-sm:w-full sm:mb-2 lg:w-full lg:max-w-100">
          <Card className="flex w-full max-w-150 flex-col items-center justify-center px-0 py-2 max-sm:max-w-full max-sm:rounded-none">
            <CardContent className="flex w-full flex-col items-center justify-center">
              <h3 className="text-center text-xl font-semibold">
                {t('about_page.creator.title')}
              </h3>
              <div
                className={cn(
                  'mx-0 my-2 flex w-full flex-col items-center justify-center',
                )}
              >
                <img
                  src="/creator_image_cropped.jpg"
                  className="w-full max-w-100 px-4"
                  alt="Creator"
                />
              </div>
              <p className="text-center text-lg">
                {t('about_page.creator.text')}
              </p>
              <div className="my-2 flex space-x-4">
                <a
                  href="https://www.linkedin.com/in/oskar-asplin-22796314a"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon />
                </a>
                <a
                  href="https://github.com/OskarAsplin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

const CollapsibleCard = ({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mx-4 mb-4 max-lg:max-w-650 max-sm:w-full lg:max-w-250">
      <Card className="flex flex-col items-center justify-center py-1 max-sm:w-full max-sm:rounded-none max-sm:px-4 sm:min-w-100 sm:px-6">
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger className="mx-auto flex w-80 cursor-pointer flex-row items-center justify-between p-2">
            <ExpandButton expanded={expanded} />
            <h3 className="text-xl font-semibold">{title}</h3>
            <ExpandButton expanded={expanded} />
          </CollapsibleTrigger>
          <CollapsibleContent>{children}</CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

interface CustomListItemProps {
  text: string | React.ReactNode;
  Icon: React.ReactElement;
}

const CustomListItem = ({ text, Icon }: CustomListItemProps) => (
  <div className="flex items-center space-x-6 py-2">
    <div className="flex-shrink-0">{Icon}</div>
    <div className="flex-1">{text}</div>
  </div>
);

const GithubIcon = () => {
  const themeMode = useThemeMode();
  const isLightMode = themeMode === 'light';

  return (
    <img
      src={`/techIcons/GitHub-Mark${isLightMode ? '-white' : ''}.png`}
      alt="GitHub"
      className="h-10 w-10"
    />
  );
};

const LinkedInIcon = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2867b2]">
    <img
      src="/techIcons/LinkedIn-Bug.png"
      alt="LinkedIn"
      className="mb-0.5 ml-0.5 h-4.5 w-4.5"
    />
  </div>
);
