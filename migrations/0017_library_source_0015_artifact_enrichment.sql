-- TurtleBlockAI Library Sources: enrich entry 15 physical-copy provenance
-- Source basis: Commander-provided photographs of the signed physical copy and enclosed game sheet, 2026-09-24.
-- No external bibliographic lookup used.

PRAGMA foreign_keys = ON;

ALTER TABLE library_physical_copies ADD COLUMN inscriptions_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE library_physical_copies ADD COLUMN ephemera_json TEXT NOT NULL DEFAULT '[]';

UPDATE library_physical_copies
SET provenance_note =
  'Photographed copy bears a handwritten inscription reading “To Steve,” followed by a signature placed above the printed author name Elwyn Berlekamp and dated January 13, 2001. This records the visible inscription but does not independently authenticate the signature. The copy also contains a loose handwritten Dots-and-Boxes game sheet dated January 2001, labeled “Simultaneous Exhibition,” with 36 dots and player/color annotations; the sheet includes the name Steve, but its author and event location are not established from the supplied photographs.',
    ownership_marks_json =
  '["Handwritten inscription: To Steve","Signature above printed author name Elwyn Berlekamp","Handwritten date January 13, 2001","Loose handwritten Dots-and-Boxes game sheet dated January 2001"]',
    inscriptions_json =
  '[{"text":"To Steve","signature_visible":true,"signature_attribution":"Elwyn Berlekamp","attribution_basis":"signature appears immediately above the printed author name on the title page","authentication_status":"not_independently_authenticated","date":"2001-01-13"}]',
    ephemera_json =
  '[{"type":"handwritten_game_sheet","date_text":"January 2001","title_or_label":"Simultaneous Exhibition","details":["36 dots","name Steve","1st player Black or Blue","2nd player Red","partially completed Dots-and-Boxes game"],"authorship":"unknown","event_location":"unknown"}]',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'library-copy-0015-01';

UPDATE library_sources
SET notes =
  'Copyright page states copyright 2000 by A K Peters, Ltd. Cataloging data identifies game theory and Dots-and-boxes as subjects. This photographed physical copy has additional artifact value: its title page bears a handwritten “To Steve” inscription, a signature above the printed author name Elwyn Berlekamp, and the date January 13, 2001. The signature is recorded as visible but not independently authenticated. The copy also contains a loose handwritten Dots-and-Boxes game sheet dated January 2001, labeled “Simultaneous Exhibition,” with 36 dots and player/color annotations; authorship and event location are not established from the supplied photographs.',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'library-source-0015';
