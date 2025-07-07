import { Switch } from '@src/components/ui/switch';
import { Badge } from '@src/components/ui/badge';

interface CustomSwitchProps {
  checked: boolean;
  setChecked: (value: boolean) => void;
  leftOptionText: string;
  rightOptionText: string;
}

export const CustomSwitch = ({
  checked,
  setChecked,
  leftOptionText,
  rightOptionText,
}: CustomSwitchProps) => {
  return (
    <div className="my-2 flex items-center justify-center space-x-2">
      <Badge
        variant={checked ? 'secondary' : 'default'}
        onClick={() => setChecked(false)}
        className="cursor-pointer"
      >
        {leftOptionText}
      </Badge>
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        name="CustomSwitch"
      />
      <Badge
        variant={checked ? 'default' : 'secondary'}
        onClick={() => setChecked(true)}
        className="cursor-pointer"
      >
        {rightOptionText}
      </Badge>
    </div>
  );
};
