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

type CommentsButtonProps = {
  id: string;
  filters: QueryConstraint[];
  relatedFilters?: QueryConstraint[];
  mapComment?: (comment: Comment) => Comment | Promise<Comment>;
};

export function CommentsButton({
  id,
  filters,
  relatedFilters,
  mapComment,
}: CommentsButtonProps) {
  const [showResolved, setShowResolved] = usePersistedState(
    "@lightkeepr/comments/showResolved",
    false
  );

  // Load main comments based on given filters, we don't want to use
  // suspense here, because we want to show the loading state within
  // the sidebar instead
  const { data: comments, loading: commentsLoading } = useCollection(
    query(
      collection(db, "comments"),
      ...filters,
      ...(showResolved ? [] : [where("resolvedAt", "==", null)]),
      orderBy("createdAt", "asc")
    ),
    {
      key: showResolved ? `${id}/comments/all` : `${id}/comments/unresolved`,
      suspense: false,
    }
  );

  // Load any additional related comments, which can be useful e.g. to see all
  // unresolved comments in a project
  const { data: relatedComments, loading: relatedLoading } = useCollection(
    query(
      collection(db, "comments"),
      ...(relatedFilters || []),
      ...(showResolved ? [] : [where("resolvedAt", "==", null)]),
      orderBy("createdAt", "asc")
    ),
    {
      key: showResolved
        ? `${id}/relatedComments/all`
        : `${id}/relatedComments/unresolved`,
      fetch: !!relatedFilters,
      suspense: false,
    }
  );

  return (
    <>
      <Button
        icon={<CommentSvg />}
        badge={
          <Badge
            intent="primary"
            count={comments?.filter?.((c: any) => !c.resolvedAt)?.length}
          />
        }
        onClick={() => {
          const event = new CustomEvent("toggleMobileMenu:comments");
          window.document.body.dispatchEvent(event);
        }}
      />
      <Suspense fallback={null}>
        <CommentsSidebar
          comments={comments || []}
          relatedComments={relatedComments || []}
          mapComment={mapComment}
          showResolved={showResolved}
          setShowResolved={setShowResolved}
          loading={commentsLoading || relatedLoading}
        />
      </Suspense>
    </>
  );
}
