// Compute the range of all Dff values.
export function minmax (data) {
  // First compute the min/max of each sequence.
  const minmaxes = data.map(d => [Math.min.apply(null, d), Math.max.apply(null, d)]);

  // Then get the min-min and the max-max.
  return [
    Math.min.apply(null, minmaxes.map(d => d[0])),
    Math.max.apply(null, minmaxes.map(d => d[1]))
  ];
}
