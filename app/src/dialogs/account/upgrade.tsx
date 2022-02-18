import styled from "styled-components";

import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { Dialog, DialogPassthroughProps } from "src/components/dialog";
import { P } from "src/components/text";
import { useAuthUser } from "src/hooks/use-auth-user";

import FishSvg from "src/assets/illustrations/fish.svg";
import SeaweedSvg from "src/assets/illustrations/seaweed.svg";
import TreasureSvg from "src/assets/illustrations/treasure.svg";

const Hero = styled.div`
  height: 16rem;

  @media (min-width: 500px) {
    height: 12rem;
  }
`;

const Inner = styled.div`
  background: linear-gradient(180deg, #18cefb 69.72%, #4a97f6 161.09%);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 20rem;
  overflow: hidden;

  @media (min-width: 500px) {
    height: 15rem;
  }
`;

const Treasure = styled(TreasureSvg)`
  position: absolute;
  bottom: -6.5rem;
  right: -1rem;
  height: auto;
  width: 22rem;
  opacity: 0.8;

  @media (min-width: 500px) {
    width: 24rem;
  }
`;

const Fish = styled(FishSvg)`
  position: absolute;
  bottom: 4rem;
  left: 18%;
  height: 9rem;
  width: auto;
  opacity: 0.8;

  @media (min-width: 500px) {
    bottom: -2rem;
  }
`;

const Seaweed = styled(SeaweedSvg)`
  position: absolute;
  bottom: -1rem;
  left: -2rem;
  height: 15rem;
  width: auto;
  opacity: 0.8;
`;

export function UpgradeDialog({ onClose }: DialogPassthroughProps) {
  const authUser = useAuthUser();
  return (
    <Dialog
      width="50rem"
      title="Upgrade to premium plan"
      actions={
        ["owner", "billing"].includes(authUser.teamRole!) ? (
          <ButtonBar
            right={
              <>
                <Button intent="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  intent="primary"
                  href={`/app/${authUser.team!.id}/billing`}
                  target="_blank"
                >
                  Upgrade
                </Button>
              </>
            }
          />
        ) : (
          <ButtonBar
            right={
              <Button intent="ghost" onClick={onClose}>
                Cancel
              </Button>
            }
          />
        )
      }
    >
      <Hero>
        <Inner>
          <Treasure />
          <Seaweed />
          <Fish />
        </Inner>
      </Hero>
      <P>
        You need to upgrade your team to the premium subscription before you can
        use this feature. Learn more{" "}
        <a href="/pricing" target="_blank">
          about the plans &amp; pricing
        </a>
        .
      </P>
    </Dialog>
  );
}
