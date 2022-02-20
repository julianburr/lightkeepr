import { AppSwitcher } from "src/components/app-switcher";
import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { Dialog, DialogPassthroughProps } from "src/components/dialog";

export function AppSwitcherDialog({ onClose }: DialogPassthroughProps) {
  return (
    <Dialog
      title="App switcher"
      width="35rem"
      actions={
        <ButtonBar
          right={
            <Button intent="ghost" onClick={onClose}>
              Cancel
            </Button>
          }
        />
      }
    >
      <AppSwitcher />
    </Dialog>
  );
}
