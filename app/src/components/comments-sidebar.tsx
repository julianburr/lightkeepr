import "src/utils/firebase";

import { doc, getFirestore } from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { Comment } from "src/components/comment";
import { Loader } from "src/components/loader";
import { Menu } from "src/components/menu";
import { RichTextInput } from "src/components/rich-text-input";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { GroupHeading, P } from "src/components/text";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useSidebarState } from "src/hooks/use-sidebar-state";

import ArrowLeftSvg from "src/assets/icons/outline/arrow-left.svg";

const db = getFirestore();

const Container = styled.div`
  height: 100%;
  flex-shrink: 0;
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0);
  pointer-events: none;
  transition: background 0.2s, backdrop-filter 0.2s;

  &[data-active="true"] {
    opacity: 1;
    pointer-events: all;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(0.2rem);
  }
`;

const Inner = styled.menu`
  height: 100%;
  width: calc(100% - 2.4rem);
  max-width: 35rem;
  background: #fff;
  transform: translateX(100%);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: auto;
  padding: 2.4rem 0;

  [data-active="true"] > & {
    box-shadow: 0 0 1.8rem rgba(0, 0, 0, 0.1);
    transform: translateX(0);
  }
`;

const WrapHeading = styled.div`
  padding: 0 2.4rem;
`;

const WrapComments = styled.div`
  padding: 0 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const WrapInput = styled.div`
  padding: 1.6rem 2.4rem 2.4rem;
`;

const Emtpty = styled.div`
  padding: 0 2.4rem;
`;

type CommentsSidebarProps = {
  comments?: any[];
  relatedComments?: any[];
  onComment?: (comment: any) => any;
};

export function CommentsSidebar({
  comments,
  relatedComments,
  onComment,
}: CommentsSidebarProps) {
  const authUser = useAuthUser();
  const { active, backdropRef, menuRef } = useSidebarState("comments");

  const [submitCount, setSubmitCount] = useState(0);
  const [thread, setThread] = useState<string>();

  const threadComments = useMemo(() => {
    if (thread) {
      const comment = comments
        ?.concat(relatedComments)
        .find((c) => c.id === thread);
      return [comment, ...(comment.thread || [])];
    }
  }, [comments, relatedComments, thread]);
  const threadComment = threadComments?.[0];

  const handleEnter = useCallback(
    (value) => {
      const now = new Date();
      const userRef = doc(db, "users", authUser.uid!);
      const comment = {
        content: value,
        createdAt: now,
        createdBy: userRef,
        lastUpdatedAt: now,
        lastUpdatedBy: userRef,
        resolvedAt: null,
        resolvedBy: null,
        project: null,
        run: null,
        report: null,
        reportName: null,
        audit: null,
        reactions: [],
      };

      if (thread) {
        onComment?.({
          ...threadComment,
          thread: [...(threadComment.thread || []), comment],
        });
      } else {
        onComment?.(comment);
      }
      setSubmitCount((count) => count + 1);
    },
    [thread, threadComment]
  );

  return (
    <Container data-active={active} ref={backdropRef as any}>
      <Inner ref={menuRef as any}>
        <Suspense fallback={<Loader />}>
          {!comments?.length && !relatedComments?.length && (
            <Emtpty>
              <P>No comments found!</P>
            </Emtpty>
          )}

          {thread ? (
            <>
              <WrapHeading>
                <Menu
                  items={[
                    {
                      isBacklink: true,
                      icon: <ArrowLeftSvg />,
                      label: "Back to comments",
                      onClick: () => setThread(undefined),
                    },
                  ]}
                />
              </WrapHeading>
              <Spacer h="1.6rem" />

              <WrapHeading>
                <GroupHeading>Thread</GroupHeading>
              </WrapHeading>
              <Spacer h=".3rem" />
              <WrapComments>
                {threadComments?.map?.((item: any, index) => (
                  <Comment
                    key={`thread--${index}`}
                    comment={item}
                    index={index}
                    thread={thread}
                    threadComment={threadComment}
                    setThread={setThread}
                  />
                ))}
              </WrapComments>
            </>
          ) : (
            <>
              {!!comments?.length && (
                <>
                  <WrapHeading>
                    <GroupHeading>Main comments</GroupHeading>
                  </WrapHeading>
                  <Spacer h=".3rem" />
                  <WrapComments>
                    {comments.map((item: any) => (
                      <Comment
                        key={item?.id}
                        comment={item}
                        thread={thread}
                        setThread={setThread}
                      />
                    ))}
                  </WrapComments>
                </>
              )}

              {!!relatedComments?.length && (
                <>
                  {!!comments?.length && <Spacer h="1.6rem" />}
                  <WrapHeading>
                    <GroupHeading>Related comments</GroupHeading>
                  </WrapHeading>
                  <Spacer h=".3rem" />
                  <WrapComments>
                    {relatedComments.map((item: any) => (
                      <Comment
                        key={item?.id}
                        comment={item}
                        thread={thread}
                        setThread={setThread}
                      />
                    ))}
                  </WrapComments>
                </>
              )}
            </>
          )}

          <Spacer h=".8rem" />
          <Suspense fallback={null}>
            <WrapInput key={submitCount}>
              <RichTextInput
                placeholder="Comment or mention others with @"
                onEnter={handleEnter}
              />
            </WrapInput>
          </Suspense>
        </Suspense>
      </Inner>
    </Container>
  );
}
