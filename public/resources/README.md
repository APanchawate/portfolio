# Portfolio resource files

Place the final, user-supplied files here using these exact names:

- `cv.pdf` — CV, with separate View and Download actions.
- `enterprise-test-management.pdf` — final presentation PDF.
- `enterprise-test-management.pptx` — optional original PowerPoint download.

These are served at `/portfolio/resources/<filename>` with the current Vite base path. Do not put `public` in the URL. Reload the page after adding files; the cards automatically check availability. Rebuild before any future publication so the files are included in `dist/resources/`.

Missing files show clear availability messages without broken or disabled document links. If one format becomes unavailable, the other remains accessible. No CV or presentation content is generated. Available PDFs are checked for a `%PDF-` signature; optional PPTX files are checked for a ZIP container signature. These checks guard against missing-file HTML fallbacks, not document-content validation.

The current `enterprise-test-management.pptx` is the user-supplied seven-slide `Akshay_Panchawate_Portfolio_Presentation.pptx`, including its dedicated AI-assisted delivery slide. The older served deck was replaced with that supplied file without editing slide contents. The matching `Akshay_Panchawate_Portfolio_Presentation.pdf` is now copied unchanged to `public/resources/enterprise-test-management.pdf`. Its seven pages include the AI-assisted delivery slide on page 6. All View Presentation links use this PDF; Professional Resources also offers a separate Download PowerPoint action.
