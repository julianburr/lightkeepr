import "src/utils/firebase";

import {
  collection,
  getFirestore,
  orderBy,
  query,
  QueryConstraint,
  where,
} from "firebase/firestore";

import { useCollection } from "src/@packages/firebase";
import { Badge } from "src/components/badge";
import { Button } from "src/components/button";
import { Suspense } from "src/components/suspense";
import { usePersistedState } from "src/hooks/use-persisted-state";
import { CommentsSidebar } from "src/sidebars/app/comments";

import CommentSvg from "src/assets/icons/outline/annotation.svg";

const db = getFirestore();

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

type ContentProps = {
  id: string;
  filters: QueryConstraint[];
  relatedFilters?: QueryConstraint[];
  mapComment?: (comment: Comment) => Comment | Promise<Comment>;
};

function Content({ id, filters, relatedFilters, mapComment }: ContentProps) {
  const [showResolved, setShowResolved] = usePersistedState(
    "@lightkeepr/comments/showResolved",
    false
  );

  const comments = useCollection(
    query(
      collection(db, "comments"),
      ...filters,
      ...(showResolved ? [] : [where("resolvedAt", "==", null)]),
      orderBy("createdAt", "asc")
    ),
    { key: `${id}/comments` }
  );

  const relatedComments = useCollection(
    query(
      collection(db, "comments"),
      ...(relatedFilters || []),
      ...(showResolved ? [] : [where("resolvedAt", "==", null)]),
      orderBy("createdAt", "asc")
    ),
    { key: `${id}/relatedComments`, fetch: !!relatedFilters }
  );

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
        relatedComments={relatedComments || []}
        mapComment={mapComment}
      />
    </>
  );
}

export function CommentsButton({
  id,
  filters,
  relatedFilters,
  mapComment,
}: ContentProps) {
  return (
    <>
      <Suspense fallback={<Button icon={<CommentSvg />} />}>
        <Content
          id={id}
          filters={filters}
          relatedFilters={relatedFilters}
          mapComment={mapComment}
        />
      </Suspense>
    </>
  );
}
