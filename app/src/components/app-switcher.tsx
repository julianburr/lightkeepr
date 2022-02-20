import { useRouter } from "next/router";
import styled from "styled-components";

import FirstAidKitSvg from "src/assets/illustrations/first-aid-kit.svg";
import LighthouseSvg from "src/assets/illustrations/lighthouse.svg";
import MountainsSvg from "src/assets/illustrations/mountains.svg";
import TrolleySvg from "src/assets/illustrations/trolley.svg";

const Container = styled.ul`
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Item = styled.li<{
  background?: string;
  active?: boolean;
  disabled?: boolean;
}>`
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  overflow: hidden;

  a {
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    padding: 1.6rem;
    border-radius: var(--sol--border-radius-s);
    width: 100%;
    font: inherit;
    font-family: "Playfair Display";
    color: inherit;
    pointer-events: ${(props) => (props.disabled ? "none" : "all")};
    background: ${(props) => props.background};
    filter: ${(props) => (props.active ? `grayscale(0)` : `grayscale(1)`)};
    transition: filter 0.2s;

    &:hover,
    &:focus {
      color: inherit;
      text-decoration: none;
      filter: grayscale(0);
    }
  }
`;

const Soon = styled.span`
  display: inline-block;
  font-size: 1rem;
  padding: 0.2rem 0.4rem;
  margin: 0.1rem 0.6rem 0;
  vertical-align: middle;
  background: rgba(0, 0, 0, 0.05);
`;

const Lighthouse = styled(LighthouseSvg)`
  position: absolute;
  top: 0.4rem;
  right: 0;
  height: 5.4rem;
  width: auto;
  transform: scaleX(-1);
`;

const Mountains = styled(MountainsSvg)`
  position: absolute;
  bottom: -0.9rem;
  right: 0;
  width: 16rem;
  height: auto;
  opacity: 0.2;
`;

const Trolley = styled(TrolleySvg)`
  position: absolute;
  bottom: 0;
  height: 4.2rem;
  width: auto;
  right: 0.8rem;
  transform: scaleX(-1);
`;

const FirstAidKit = styled(FirstAidKitSvg)`
  position: absolute;
  top: 0.6rem;
  height: 4.2rem;
  width: auto;
  right: 0.8rem;
`;

export function AppSwitcher() {
  const router = useRouter();
  const href = router.asPath?.startsWith("/app") ? "/app" : "/docs";
  return (
    <Container>
      <Item active background="#e4f3fd">
        {/* eslint-disable-next-line */}
        <a href={href} target="_blank">
          <span>Lightkeepr</span>
          <Mountains />
          <Lighthouse />
        </a>
      </Item>
      <Item disabled background="#f5ede1">
        <a href="#soon">
          <span>Bundlekeepr</span>
          <Soon>Coming soon</Soon>
          <Trolley />
        </a>
      </Item>
      <Item disabled background="#f4dee6">
        <a href="#soon">
          <span>Upkeepr</span>
          <Soon>Coming soon</Soon>
          <FirstAidKit />
        </a>
      </Item>
    </Container>
  );
}
