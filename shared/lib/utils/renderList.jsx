export default function renderList(propsList, renderer) {
  return propsList.reduce((pre, cur, idx) => [ ...pre, renderer(cur, idx)], []);
}
