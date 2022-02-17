import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

import { Score } from "src/components/score";
import { CATEGORIES } from "src/utils/audits";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.4rem 1.2rem;
  font-family: "Playfair Display";
  text-align: center;
  margin: 1.2rem 0;
  padding: 1.2rem 0 1.6rem;
  background: #fff;
  z-index: 10;

  a {
    color: inherit;

    &:hover,
    &:focus {
      color: inherit;
      text-decoration: none;
    }
  }
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 400;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
`;

type ScoreValue = number | null | { passed: number; total: number };

type ScoreObj = {
  performance?: ScoreValue;
  accessibility?: ScoreValue;
  ["best-practices"]?: ScoreValue;
  seo?: ScoreValue;
  pwa?: ScoreValue;
};

type ReportScoresProps = {
  scores: ScoreObj | ScoreObj[];
};

export function ReportScores({ scores }: ReportScoresProps) {
  const router = useRouter();

  if (Array.isArray(scores)) {
    const [base, compare] = scores;
    return (
      <Container>
        {CATEGORIES.map((item) => {
          const { category, ...q } = router.query;

          const scoreValue = compare?.[item.id as keyof ScoreObj];
          const baseScoreValue = base?.[item.id as keyof ScoreObj];

          return (
            <Link
              key={item.id}
              href={{
                query: {
                  ...q,
                  ...(category === item.id ? {} : { category: item.id }),
                },
              }}
            >
              <a>
                <Label>{item.label}</Label>
                <Score
                  value={scoreValue}
                  baseValue={baseScoreValue}
                  active={router.query.category === item.id}
                />
              </a>
            </Link>
          );
        })}
      </Container>
    );
  }

  return (
    <Container>
      {CATEGORIES.map((item) => {
        const { category, ...q } = router.query;

        const scoreValue = scores?.[item.id as keyof ScoreObj];

        return (
          <Link
            key={item.id}
            href={{
              query: {
                ...q,
                ...(category === item.id ? {} : { category: item.id }),
              },
            }}
          >
            <a>
              <Label>{item.label}</Label>
              <Score
                value={scoreValue}
                active={router.query.category === item.id}
              />
            </a>
          </Link>
        );
      })}
    </Container>
  );
}
