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

type ScoreObj = {
  performance?: number;
  accessibility?: number;
  ["best-practices"]?: number;
  seo?: number;
  pwa?: number;
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
          const hasRun = !!scoreValue || scoreValue === 0;
          const score = hasRun ? Math.round(scoreValue * 100) : 0;

          const baseScoreValue = base?.[item.id as keyof ScoreObj];
          const baseHasRun = !!baseScoreValue || baseScoreValue === 0;
          const baseScore = baseHasRun ? Math.round(baseScoreValue * 100) : 0;

          const diff = hasRun && baseHasRun ? score - baseScore : undefined;

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
                  value={score}
                  diff={diff}
                  hasRun={hasRun}
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

        const hasRun = !!scoreValue || scoreValue === 0;
        const score = hasRun ? Math.round(scoreValue * 100) : 0;

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
                value={score}
                hasRun={hasRun}
                active={router.query.category === item.id}
              />
            </a>
          </Link>
        );
      })}
    </Container>
  );
}
