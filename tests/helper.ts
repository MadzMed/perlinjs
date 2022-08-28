export function comparePerm(array: number[], array2: number[]): boolean {
  if (array.length === array2.length) {
    return array.sort().join(',') === array2.sort().join(',')
  }
  return false
}
