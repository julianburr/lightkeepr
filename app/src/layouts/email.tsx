import {
  Mjml,
  MjmlHead,
  MjmlTitle,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlImage,
  MjmlText,
  MjmlStyle,
} from "mjml-react";
import { PropsWithChildren } from "react";

import { tokens } from "src/theme/tokens";
import { getBase64Url } from "src/utils/node/files";

type EmailLayoutProps = PropsWithChildren<{
  title: string;
}>;

export function EmailLayout({ title, children }: EmailLayoutProps) {
  return (
    <Mjml lang="en">
      <MjmlHead>
        <MjmlTitle>{title}</MjmlTitle>
        <MjmlStyle>
          {`
            a {
              color: ${tokens.color.brand[600]};
            }
          `}
        </MjmlStyle>
      </MjmlHead>
      <MjmlBody width={500} backgroundColor="#f8f8f8">
        <MjmlSection paddingTop={50} paddingBottom={20}>
          <MjmlColumn>
            <MjmlImage
              src={getBase64Url("src/assets/logo.png")}
              height={70}
              width={70}
            />
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection backgroundColor="#fff" padding={24}>
          <MjmlColumn>{children}</MjmlColumn>
        </MjmlSection>

        <MjmlSection>
          <MjmlColumn>
            <MjmlText
              fontSize={14}
              fontWeight={300}
              lineHeight="1.4"
              color="#ccc"
              align="center"
            >
              &copy; {new Date().getFullYear()} —{" "}
              <a href="https://lightkeepr.vercel.app">Lightkeepr</a> by Julian
              Burr
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  );
}
