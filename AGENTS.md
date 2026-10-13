<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep portfolio presentation styles and typography roles in `src/styles.css` so the visual direction remains consistent.
- Use original pixel SVG artwork for decorative stickers; uploaded screenshots are references, not page assets.
- Preserve owner-provided portfolio content, navigation, links, and media during presentation changes; never substitute invented projects or generated images for originals.
- Keep recovered portfolio text in a local content module and original media in asset pointers, so presentation changes cannot replace the owner's source material.
- Keep structured academic records in `src/lib/education.ts` and render them through the dedicated Education section, so course status and credential links stay independently testable.
- Register reusable Interests uploads through descriptively named asset pointers and `src/lib/interests-assets.ts`, so importing media does not prematurely change the gallery presentation.
- Keep the animated greeting's full text in the layout and accessible labels, revealing characters after hydration and skipping motion when requested, to avoid layout shifts and preserve readability.
- The cinematic intro is archived in `src/archive/intro/` (not imported anywhere); see its README to restore.
- Keep contact submission and its success-only origami animation in `src/components/contact-form.tsx`; retaining the form during folding preserves the visual transition and user input on failed sends.
