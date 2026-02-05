export async function diffContents(left, right) {
  const { diffLines } = await import("diff");
  const diff = diffLines(left, right);
  return diff
    .map((part) => {
      const prefix = part.added ? "+ " : part.removed ? "- " : "  ";
      return part.value
        .split("\n")
        .map((line) => (line ? prefix + line : ""))
        .join("\n");
    })
    .join("");
}
