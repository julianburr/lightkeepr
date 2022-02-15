import { ComponentProps } from "react";

import { Badge } from "src/components/badge";
import { Button } from "src/components/button";
import { Comment } from "src/components/comment";
import { CommentsSidebar } from "src/components/comments-sidebar";
import { Popout } from "src/components/popout";

import CommentSvg from "src/assets/icons/outline/annotation.svg";

type Reaction = {
  type: string;
  reactionBy: any;
  reactionAt: any;
};

type Comment = {
  id?: string;
  content: string;
  createdBy: any;
  createdAt: any;
  reactions: Reaction[];
  resolvedBy?: any;
  resolvedAt?: any;
  thread?: Omit<Comment, "id" | "thread" | "resolvedBy" | "resolvedAt">[];
  project?: any;
  run?: any;
  report?: any;
  reportName?: boolean;
  audit?: any;
};

type CommentsPopoutProps = Omit<
  ComponentProps<typeof Popout>,
  "Content" | "children"
> & {
  comments: Comment[];
  relatedComments: Comment[];
  onComment?: (comment: Comment) => any;
  children?: ComponentProps<typeof Popout>["children"];
};

export function CommentsPopout({
  comments,
  relatedComments,
  onComment,
}: CommentsPopoutProps) {
  return (
    <>
      <Button
        icon={<CommentSvg />}
        badge={<Badge intent="primary" count={comments.length} />}
        onClick={() => {
          const event = new CustomEvent("toggleMobileMenu:comments");
          window.document.body.dispatchEvent(event);
        }}
      />
      <CommentsSidebar
        comments={comments}
        relatedComments={relatedComments}
        onComment={onComment}
      />
    </>
  );
}
