import { NavigateFunction } from "react-router-dom";
import { ForbiddenError, UnauthorizedError } from "./fetch/errors";

export default function queryRetry(failureCount: number, error: unknown) {
  if (error instanceof UnauthorizedError) {
    if (failureCount > 0) {
      return false;
    }
  } else {
    if (failureCount > 3) {
      return false;
    }
  }
  return true;
}

export function queryFail(error: unknown, navigate?: NavigateFunction) {
  if (error instanceof UnauthorizedError) {
    if (navigate) navigate('/login');
  }
  else if (error instanceof ForbiddenError) {
    if (navigate) navigate('/profile/@me');
  }
}