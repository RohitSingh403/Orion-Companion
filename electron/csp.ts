export const DEV_SCRIPT_SRC = "script-src 'self' 'unsafe-inline' 'unsafe-eval'";
export const PRODUCTION_SCRIPT_SRC = "script-src 'self'";

export function productionDocumentPolicy(policy: string) {
  if (!policy.includes(DEV_SCRIPT_SRC)) return policy;
  return policy.replace(DEV_SCRIPT_SRC, PRODUCTION_SCRIPT_SRC);
}
