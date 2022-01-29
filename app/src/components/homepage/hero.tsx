import styled from "styled-components";

import LighthouseSvg from "src/assets/illustrations/lighthouse.svg";
import MountainsSvg from "src/assets/illustrations/mountains.svg";
import WavesSvg from "src/assets/illustrations/waves.svg";

const Container = styled.div`
  overflow: hidden;
  position: relative;
  z-index: 1;
  margin-top: -6.8rem;
  width: 100%;
  background: #c7e9ff;
  background: linear-gradient(
    180deg,
    #c7e9ff 0%,
    #a3e6f2 30%,
    #65e0db 80%,
    #65e0db 100%
  );
`;

const Ocean = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 9rem;
  background: #18cefb;
  background: linear-gradient(180deg, #18cefb 0%, #4a97f6 100%);

  @media (min-width: 1050px) {
    height: 16rem;
  }
`;

const Mountains = styled(MountainsSvg)`
  position: absolute;
  bottom: 9rem;
  left: 14rem;
  width: 80rem;
  height: auto;

  @media (min-width: 1050px) {
    bottom: 16rem;
  }
`;

const Waves = styled(WavesSvg)`
  position: absolute;
  bottom: 0;
  right: 0;
  height: 6rem;
  width: auto;

  @media (min-width: 1050px) {
    height: 10rem;
  }
`;

const Lighthouse = styled(LighthouseSvg)`
  height: 35rem;
  width: auto;
  position: absolute;
  bottom: -0.6rem;
  left: -4rem;

  @media (min-width: 1050px) {
    height: 58rem;
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 104rem;
  padding: 8rem 2.4rem 40rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (min-width: 1050px) {
    align-items: flex-end;
    padding: 14rem 2.4rem 37rem;
  }
`;

const Heading = styled.h1`
  font-size: 3.8rem;
  font-weight: 400;
  line-height: 1.1;
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 55rem;

  @media (min-width: 800px) {
    font-size: 5.2rem;
    max-width: 62rem;
  }

  @media (min-width: 1050px) {
    font-size: 6.2rem;
    max-width: 72rem;
    text-align: right;
  }
`;

export function Hero() {
  return (
    <Container>
      <Ocean />
      <Mountains />
      <Waves />

      <Lighthouse />

      <Content>
        <Heading>
          Keeping track &amp; taking advantage of Lighthouse reports made easy
        </Heading>
      </Content>
    </Container>
  );
}
