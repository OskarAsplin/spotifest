import { Sheet, SheetContent } from '@src/components/ui/sheet';
import { Button } from '@src/components/ui/button';

interface CustomDrawerProps {
  open: boolean;
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
  items: { Icon: React.ReactNode; label: string; onClick: () => void }[];
}

export const CustomDrawer = ({ open, onClose, items }: CustomDrawerProps) => (
  <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose({} as any)}>
    <SheetContent side="right" className="w-[250px]">
      <nav className="mt-4 flex flex-col space-y-2">
        {items.map(({ Icon, label, onClick }) => (
          <Button
            key={label}
            variant="ghost"
            className="h-auto justify-start px-4 py-3"
            onClick={() => {
              onClick();
              onClose({} as any);
            }}
          >
            <span className="mr-3 flex-shrink-0">{Icon}</span>
            <span>{label}</span>
          </Button>
        ))}
      </nav>
    </SheetContent>
  </Sheet>
);
