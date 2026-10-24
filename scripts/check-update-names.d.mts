export function updateFileUrls(yaml: string): string[];

export function missingUpdateFiles(releaseDir: string): string[];

export function assetsToRemove(
  assetNames: string[],
  manifests: Array<{ name: string; yaml: string }>
): string[];
