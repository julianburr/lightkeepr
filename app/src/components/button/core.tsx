import {
  DetailedHTMLProps,
  PropsWithChildren,
  ButtonHTMLAttributes,
  forwardRef,
  Ref,
  useState,
  useCallback,
} from "react";
import Link, { LinkProps } from "next/link";

type AnchorTagProps = PropsWithChildren<LinkProps>;

type ButtonTagProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type CoreButtonProps = AnchorTagProps | ButtonTagProps;

export const CoreButton = forwardRef(function CoreButton(
  props: CoreButtonProps,
  ref: Ref<any>
) {
  // "Smart" loading state handler, whenever an aysnc function is passed into
  // the `onClick` prop
  const [loading, setLoading] = useState(false);
  const onClick = "onClick" in props ? props.onClick : undefined;
  const handleClick = useCallback(
    async (e) => {
      if (onClick) {
        setLoading(true);
        await onClick(e);
        setLoading(false);
      }
    },
    [onClick]
  );

  if ("href" in props) {
    // It's a link, disguised as a button
    return (
      <Link {...props}>
        <a ref={ref}>{props.children}</a>
      </Link>
    );
  }

  // It's a button
  return (
    <button
      ref={ref}
      {...(props as ButtonTagProps)}
      onClick={handleClick}
      disabled={loading || props.disabled}
    />
  );
});
