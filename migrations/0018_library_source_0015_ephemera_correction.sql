-- TurtleBlockAI Library Sources: correct entry 15 ephemera participants
-- Source basis: Commander clarification, 2026-09-24.
-- No external lookup used.

PRAGMA foreign_keys = ON;

UPDATE library_physical_copies
SET provenance_note =
  'Photographed copy bears a handwritten inscription reading “To Steve,” followed by a signature placed above the printed author name Elwyn Berlekamp and dated January 13, 2001. The user clarified that Steve was the original owner of the book and that the enclosed handwritten January 2001 Dots-and-Boxes game sheet records a game between author Elwyn Berlekamp and Steve, the original owner. The sheet is labeled “Simultaneous Exhibition,” notes 36 dots, and includes player/color annotations.',
    ephemera_json =
  '[{"type":"handwritten_game_sheet","date_text":"January 2001","title_or_label":"Simultaneous Exhibition","details":["36 dots","partially completed Dots-and-Boxes game"],"participants":[{"name":"Elwyn Berlekamp","role":"author and player"},{"name":"Steve","role":"original owner and player"}],"relationship_note":"Game sheet records Elwyn Berlekamp versus Steve, the original owner to whom the book is inscribed.","event_location":"unknown","provenance_basis":"user clarification"}]',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'library-copy-0015-01';

UPDATE library_sources
SET notes =
  'Copyright page states copyright 2000 by A K Peters, Ltd. Cataloging data identifies game theory and Dots-and-boxes as subjects. This photographed physical copy has additional artifact value: its title page bears a handwritten “To Steve” inscription, a signature above the printed author name Elwyn Berlekamp, and the date January 13, 2001. The signature is recorded as visible but not independently authenticated. The user clarified that Steve was the original owner and that the enclosed handwritten January 2001 Dots-and-Boxes game sheet records a game between Elwyn Berlekamp and Steve. The sheet is labeled “Simultaneous Exhibition” and notes 36 dots; event location remains unknown.',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'library-source-0015';
