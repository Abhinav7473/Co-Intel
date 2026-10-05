/** Renders `backtick` spans from the markdown log as code. */
export function Code({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 ? (
          <code key={i} className="rounded bg-sunken px-1 font-mono text-[0.88em]">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}
