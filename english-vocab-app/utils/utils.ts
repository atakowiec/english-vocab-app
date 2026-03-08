export function levenshtein(first: string, second: string) {
  const matrix = [];

  for (let i = 0; i <= second.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= first.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= second.length; i++) {
    for (let j = 1; j <= first.length; j++) {
      if (second.charAt(i - 1) === first.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[second.length][first.length];
}