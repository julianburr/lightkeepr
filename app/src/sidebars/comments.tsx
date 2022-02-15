import "src/utils/firebase";

import {
  addDoc,
  collection,
  doc,
  documentId,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { createFocusTrap } from "focus-trap";
import {
  useCallback,
  useMemo,
  useState,
  useRef,
  Ref,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { RefObject } from "react";
import styled from "styled-components";

import { useCollection } from "src/@packages/firebase";
import { CheckboxInput } from "src/components/checkbox-input";
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
  padding: 2.4rem 0 0;

  [data-active="true"] > & {
    box-shadow: 0 0 1.8rem rgba(0, 0, 0, 0.1);
    transform: translateX(0);
  }
`;

const WrapHeading = styled.div`
  padding: 0 2.4rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  && label {
    font-size: 1.2rem;
    min-height: 0;
    padding: 0;

    span:last-child {
      margin: 0.1rem 0 0;
    }
  }
`;

const WrapComments = styled.div`
  padding: 0 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const WrapInput = styled.div`
  padding: 1.6rem 2.4rem 2.4rem;
  background: #fff;
  position: sticky;
  bottom: 0;
`;

const Emtpty = styled.div`
  padding: 0 2.4rem;
`;

type ContentProps = {
  comments?: any[];
  relatedComments?: any[];
  mapComment?: (comment: any) => any;
  showResolved?: boolean;
  setShowResolved?: Dispatch<SetStateAction<boolean>>;
  active: boolean;
  backdropRef: RefObject<HTMLDivElement | undefined>;
  menuRef: RefObject<HTMLMenuElement | undefined>;
  loading?: boolean;
};

function Content({
  comments,
  relatedComments,
  mapComment,
  showResolved,
  setShowResolved,
  active,
  backdropRef,
  loading,
}: ContentProps) {
  const authUser = useAuthUser();
  const users = useCollection(
    query(
      collection(db, "users"),
      where(documentId(), "in", authUser.team?.users || [])
    ),
    { key: `${authUser?.team?.id}/users` }
  );

  // Trap focus within the sidebar
  useEffect(() => {
    if (backdropRef.current && active) {
      const trap = createFocusTrap(backdropRef.current);
      trap.activate();
      return () => {
        trap.deactivate();
      };
    }
  }, [active]);

  const [submitCount, setSubmitCount] = useState(0);
  const [thread, setThread] = useState<string>();

  const inputRef = useRef<HTMLDivElement>();

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
    async (value) => {
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

      const mapped = mapComment?.(comment) || comment;
      const subscriptions = authUser?.user?.subscriptions || [];

      if (thread) {
        updateDoc(doc(db, "comments", threadComment.id), {
          thread: [...(threadComment.thread || []), mapped],
        }).then(() => {
          const commentRef = doc(db, "comments", threadComment.id);

          // Add user subscription to thread comment
          updateDoc(doc(db, "users", authUser.uid!), {
            subscriptions: subscriptions.concat(commentRef),
          });

          // TODO: Send notifications to everyone subscribed to thread comment
          // or the base record
        });
      } else {
        addDoc(collection(db, "comments"), mapped).then((added) => {
          const commentRef = doc(db, "comments", added.id);

          // Add user subscription to comment
          updateDoc(doc(db, "users", authUser.uid!), {
            subscriptions: subscriptions.concat(commentRef),
          });

          // TODO: Send notifications to everyone subscribed to the base record
        });
      }

      // HACK: the submit count is used as key on the input, which will reset
      // it. After resetting, we want to re-focus the input so the user can keep
      // typing to add another comment
      setSubmitCount((count) => count + 1);
      (
        inputRef?.current?.querySelector?.(
          '[role="combobox"]'
        ) as HTMLDivElement
      )?.focus?.();
    },
    [thread, threadComment]
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <>
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
                users={users}
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
                <CheckboxInput
                  name="showResolved"
                  label="Show resolved"
                  value={showResolved}
                  onChange={setShowResolved}
                />
              </WrapHeading>
              <Spacer h=".3rem" />
              <WrapComments>
                {comments.map((item: any) => (
                  <Comment
                    key={item?.id}
                    comment={item}
                    thread={thread}
                    setThread={setThread}
                    users={users}
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
                    users={users}
                  />
                ))}
              </WrapComments>
            </>
          )}
        </>
      )}

      <Spacer h=".8rem" />
      <Suspense fallback={null}>
        <WrapInput key={submitCount} ref={inputRef as Ref<HTMLDivElement>}>
          <RichTextInput
            placeholder="Comment or mention others with @"
            onEnter={handleEnter}
          />
        </WrapInput>
      </Suspense>
    </>
  );
}

type CommentsSidebarProps = Omit<
  ContentProps,
  "active" | "backdropRef" | "menuRef"
>;

export function CommentsSidebar(props: CommentsSidebarProps) {
  const { active, backdropRef, menuRef } = useSidebarState("comments");
  return (
    <Container data-active={active} ref={backdropRef as any}>
      <Inner ref={menuRef as any} tabIndex={0}>
        <Suspense fallback={<Loader />}>
          <Content
            {...props}
            active={active}
            backdropRef={backdropRef}
            menuRef={menuRef}
          />
        </Suspense>
      </Inner>
    </Container>
  );
}
