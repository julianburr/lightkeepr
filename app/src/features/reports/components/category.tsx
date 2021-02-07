import { Fragment } from "react";
import styled from "styled-components";

import { Accordion } from "../../../components/accordion";
import { Badge } from "../../../components/badge";
import { Markdown } from "../../../components/markdown";
import { Spacer } from "../../../components/spacer";
import { Heading } from "../../../components/text";

import { Metric } from "./metric";

const Container = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 2.4rem;

  & h3 {
    margin: 0.6rem 0;
  }
`;

const GroupDescriptionContainer = styled.div`
  margin-top: -1.2rem;

  & p {
    font-size: 1.2rem;
    color: #666;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  & > * {
    margin-left: 0.6rem;

    &:first-child {
      margin-left: 0;
    }
  }
`;

export function LighthouseCategory({ data, report, selected, setSelected }) {
  const [manual, notApplicable, informative, passed, others] = data.reduce(
    (all, item) => {
      const audit = report.audits[item.id];
      if (audit.scoreDisplayMode === "manual") {
        all[0].push({ audit, item });
      } else if (audit.scoreDisplayMode === "notApplicable") {
        all[1].push({ audit, item });
      } else if (audit.scoreDisplayMode === "informative") {
        all[2].push({ audit, item });
      } else if (audit.score >= 0.9) {
        all[3].push({ audit, item });
      } else {
        const groupKey = item.group || "__";
        if (!all[4][groupKey]) {
          all[4][groupKey] = [];
        }
        all[4][groupKey].push({ audit, item });
      }
      return all;
    },
    [[], [], [], [], {}]
  );

  return (
    <Container>
      {!!Object.keys(others).length && (
        <>
          {Object.keys(others).map((groupKey) => (
            <Fragment key={groupKey}>
              {report.categoryGroups?.[groupKey]?.title && (
                <Heading level={3}>
                  {report.categoryGroups[groupKey].title}
                </Heading>
              )}
              {report.categoryGroups?.[groupKey]?.description && (
                <GroupDescriptionContainer>
                  <Markdown>
                    {report.categoryGroups[groupKey].description}
                  </Markdown>
                </GroupDescriptionContainer>
              )}
              {others[groupKey].map((props) => (
                <Metric
                  {...props}
                  key={props.audit.id}
                  selected={selected}
                  setSelected={setSelected}
                  failure={props.audit.score < 0.5}
                  warning={props.audit.score >= 0.5}
                />
              ))}
              <Spacer height="1.2rem" />
            </Fragment>
          ))}
        </>
      )}

      {[informative, manual, notApplicable, passed].map((group, index) => {
        if (!group.length) {
          return null;
        }

        const titles = ["Informative", "Manual", "Not applicable", "Passed"];
        const title = titles[index];
        return (
          <Accordion
            key={index}
            Summary={() => (
              <TitleContainer>
                <Heading level={3}>{title}</Heading>
                <Badge>{group.length}</Badge>
              </TitleContainer>
            )}
          >
            {group.map((props) => (
              <Metric
                {...props}
                key={props.audit.id}
                selected={selected}
                setSelected={setSelected}
                neutral
              />
            ))}
            <Spacer height="1.2rem" />
          </Accordion>
        );
      })}
    </Container>
  );
}
