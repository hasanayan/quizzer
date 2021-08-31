import { useIsPermitted } from "hooks/use-is-permitted";
import { FC } from "react";

export const Bouncer: FC<{ permission: string }> = ({
  permission,
  children,
}) => {
  const isPermitted = useIsPermitted(permission);

  if (isPermitted !== true) return null;
  else return <>{children}</>;
};
