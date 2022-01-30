import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";

import { DocsLayout } from "src/layouts/docs";
import { P } from "src/components/text";

import DiverSvg from "src/assets/illustrations/diving-helmet.svg";
import FishSvg from "src/assets/illustrations/fish.svg";
import RocketSvg from "src/assets/icons/website/rocket.svg";
import PotionSvg from "src/assets/icons/website/potion.svg";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.6rem;

  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Wide = styled.a`
  background: var(--sol--color-brand-500);
  transition: background 0.2s;
  border-radius: var(--sol--border-radius-s);
  position: relative;
  overflow: hidden;
  padding: 2.4rem;
  padding: 3.6rem;

  @media (min-width: 580px) {
    padding: 3.6rem 3.6rem 3.6rem 10rem;
  }

  @media (min-width: 800px) {
    grid-column-start: 1;
    grid-column-end: span 2;
    padding: 5.8rem 5.8rem 5.8rem 8rem;
  }

  @media (min-width: 1000px) {
    padding: 5.8rem 5.8rem 5.8rem 20rem;
  }

  h2 {
    font-size: 4.8rem;

    @media (min-width: 800px) {
      font-size: 5.2rem;
    }
  }

  &,
  &:hover,
  &:focus {
    color: var(--sol--color-white);
    text-decoration: none;
  }

  &:hover,
  &:focus {
    background: var(--sol--color-brand-600);
  }
`;

const Small = styled.a`
  background: var(--sol--palette-sand-100);
  transition: background 0.2s;
  border-radius: var(--sol--border-radius-s);
  padding: 2.4rem;

  @media (min-width: 800px) {
    padding: 3.2rem;
  }

  &,
  &:hover,
  &:focus {
    color: inherit;
    text-decoration: none;
  }

  &:hover,
  &:focus {
    background: var(--sol--palette-sand-200);
  }

  h2 {
    font-size: 2.4rem;
    margin: 1.2rem 0 0.6rem;
  }

  svg {
    height: 4rem;
    width: auto;
  }
`;

const Diver = styled(DiverSvg)`
  position: absolute;
  bottom: 0;
  left: -6.4rem;
  height: 14rem;
  width: auto;
  opacity: 0.9;
  display: none;

  @media (min-width: 580px) {
    display: block;
  }

  @media (min-width: 1000px) {
    left: 2.4rem;
  }
`;

const Fish = styled(FishSvg)`
  position: absolute;
  top: -2.4rem;
  right: 1.2rem;
  height: 10rem;
  width: auto;

  @media (min-width: 1000px) {
    right: 5rem;
  }
`;

export default function DocsHomepage() {
  return (
    <DocsLayout>
      <Head>
        <title>Lightkeepr Docs</title>
      </Head>

      <Grid>
        <Link href="/docs/getting-started" passHref>
          <Wide>
            <Diver />
            <Fish />
            <h2>Getting started</h2>
            <P>
              Let's dive in. Everything you need to know to get set up and
              running in minutes. From creating your first team, to adding
              project and team members.
            </P>
          </Wide>
        </Link>
        <Link href="/docs/features" passHref>
          <Small>
            <RocketSvg />
            <h2>Features</h2>
            <P>
              Find help with any of the main features of the Lightkeepr app. How
              do teams work? What are runs and how to reports relate to them?
            </P>
          </Small>
        </Link>
        <Link href="/docs/packages" passHref>
          <Small>
            <PotionSvg />
            <h2>Packages</h2>
            <P>
              Lightkeepr provides a bunch of helper packages to make sending
              reports through as easy as possible. Here you can find the docs on
              those packages.
            </P>
          </Small>
        </Link>
      </Grid>
    </DocsLayout>
  );
}
