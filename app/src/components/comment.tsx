import "src/utils/firebase";

import dayjs from "dayjs";
import {
  collection,
  deleteDoc,
  doc,
  documentId,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { SetStateAction, useCallback, useMemo } from "react";
import { Dispatch } from "react";
import styled from "styled-components";

import { useCollection } from "src/@packages/firebase";
import { ActionMenu } from "src/components/action-menu";
import { Avatar } from "src/components/avatar";
import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { Markdown } from "src/components/markdown";
import { Spacer } from "src/components/spacer";
import { Small } from "src/components/text";
import { useConfirmationDialog } from "src/dialogs/confirm";
import { useAuthUser } from "src/hooks/use-auth-user";

import CheckSvg from "src/assets/icons/outline/check.svg";
import DotsSvg from "src/assets/icons/outline/dots-vertical.svg";

import { Tooltip } from "./tooltip";

const db = getFirestore();

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  padding: 0.8rem;
  border: 0 none;
  border-radius: 0.3rem;
  position: relative;
  background: transparent;
  text-align: left;
  cursor: pointer;

  p {
    margin: 0;
  }

  &:hover,
  &:focus-within {
    background: var(--sol--palette-sand-50);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  margin: 0.2rem 0 0;
  position: relative;
  width: 100%;
  font-family: "Playfair Display";
`;

const Actions = styled.div`
  position: absolute;
  top: -0.3rem;
  right: 0.4rem;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 1;

  ${Container}:hover &,
  ${Container}:focus-within & {
    opacity: 1;
    z-index: 100;
  }

  &:before {
    content: " ";
    position: absolute;
    z-index: 0;
    right: 0;
    left: 0;
    top: 0.3rem;
    bottom: -0.6rem;
    background: var(--sol--palette-sand-50);
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--sol--palette-sand-50) 10%,
      var(--sol--palette-sand-50) 100%
    );
  }

  button {
    height: 2.4rem;
    width: 2.4rem;
  }
`;

type CommentProps = {
  comment: any;
  index?: number;
  thread?: string;
  threadComment?: any;
  setThread: Dispatch<SetStateAction<string | undefined>>;
};

export function Comment({
  comment,
  index,
  thread,
  threadComment,
  setThread,
}: CommentProps) {
  const confirmationDialog = useConfirmationDialog();

  const authUser = useAuthUser();
  const users = useCollection(
    query(
      collection(db, "users"),
      where(documentId(), "in", authUser.team?.users || [])
    ),
    { key: `${authUser?.team?.id}/users` }
  );

  const createdBy = users.find?.(
    (user: any) => user.id === comment.createdBy?.id
  );

  const resolveComment = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (comment.id) {
        if (thread) {
          setThread(undefined);
        }
        return updateDoc(doc(db, "comments", comment.id), {
          resolvedAt: new Date(),
          resolvedBy: doc(db, "users", authUser.uid!),
        });
      }
    },
    [comment.id, thread]
  );

  const unresolveComment = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (comment.id) {
        return updateDoc(doc(db, "comments", comment.id), {
          resolvedAt: new Date(),
          resolvedBy: doc(db, "users", authUser.uid!),
        });
      }
    },
    [comment.id]
  );

  const deleteComment = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (thread || comment.id) {
        return confirmationDialog.open({
          message:
            "Are you sure you want to delete your comment? This cannot be reverted.",
          confirmLabel: "Delete comment",
          intent: "danger",
          onConfirm: () =>
            comment.id
              ? deleteDoc(doc(db, "comments", comment.id))
              : updateDoc(doc(db, "comments", threadComment.id), {
                  thread: [
                    ...((threadComment.thread || []) as any[]).filter(
                      (_: any, i) => i + 1 !== index
                    ),
                  ],
                }),
        });
      }
    },
    [comment.id, thread, index, threadComment]
  );

  const actions = useMemo(() => {
    let actions: any[] = [];

    if (!thread) {
      actions.push({
        label: "Respond",
        onClick: () => setThread(comment.id),
      });
    }

    if (comment.createdBy?.id === authUser.uid) {
      actions = actions.concat([
        {
          label: "Delete",
          intent: "danger",
          onClick: deleteComment,
        },
      ]);
    }

    return actions;
  }, [comment]);

  return (
    <Container
      onClick={comment.id ? () => setThread(comment.id) : undefined}
      tabIndex={0}
    >
      <Avatar name={createdBy?.name} />
      <Content>
        <Title>
          <Small>{createdBy?.name}</Small>
          <Small grey>
            — {dayjs.unix(comment.createdAt?.seconds).fromNow()}
          </Small>
        </Title>

        <Actions>
          <ButtonBar
            right={
              <>
                {comment.id && (
                  <Tooltip
                    content={
                      comment.resolvedAt
                        ? "Mark as unresolved"
                        : "Mark as resolved"
                    }
                  >
                    {(props) => (
                      <Button
                        {...props}
                        size="small"
                        icon={<CheckSvg />}
                        intent={comment.resolvedAt ? "primary" : "secondary"}
                        onClick={
                          comment.resolvedAt ? unresolveComment : resolveComment
                        }
                      />
                    )}
                  </Tooltip>
                )}
                {actions.length > 0 && (
                  <ActionMenu placement="bottom-end" items={actions}>
                    {(props) => (
                      <Button {...props} size="small" icon={<DotsSvg />} />
                    )}
                  </ActionMenu>
                )}
              </>
            }
          />
        </Actions>

        <Markdown>{comment.content}</Markdown>

        {!thread && comment.thread?.length > 0 && (
          <>
            <Spacer h=".3rem" />
            <Small grey>
              {comment.thread.length} response
              {comment.thread.length !== 1 && "s"}
            </Small>
          </>
        )}
      </Content>
    </Container>
  );
}
