-- TurtleBlockAI Library Sources: entry 20
-- Source basis: Commander-provided photographs of physical copy, 2026-09-24.
-- No external bibliographic lookup used.

PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO library_sources (
  id, entry_number, title, subtitle, canonical_work_title, author_display, contributors_json,
  original_publication_year, edition_year, chronology_year, chronology_basis,
  edition_label, printing_label, publisher, imprint, publication_place,
  isbn, lccn, lc_classification, dewey_classification,
  subjects_json, tags_json, contents_json, notes, metadata_provenance_json
) VALUES (
  'library-source-0020', 20,
  'American Favorite Ballads',
  'Tunes and Songs as Sung by Pete Seeger',
  'American Favorite Ballads: Tunes and Songs as Sung by Pete Seeger',
  'Pete Seeger',
  '[{"name":"Irwin Silber","role":"edited for publication"},{"name":"Ethel Raim","role":"edited for publication; music transcribed and edited by"},{"name":"Daryl Heymann","role":"editorial assistant"},{"name":"Moses Asch","role":"illustrations selected by / from collection of"}]',
  1961, 1961, 1961, 'original_publication_year',
  NULL,
  '19th printing, February 1968',
  'Oak Publications',
  'A Division of Embassy Music Sales Corp.',
  'New York, New York',
  NULL,
  'M 61-1008',
  NULL,
  NULL,
  '["American folk songs","Ballads","Songbook","Music transcription","Folk music"]',
  '["Pete Seeger","folk music","ballads","American songs","songbook","Oak Publications","music","oral tradition","popular culture"]',
  '["Alabama Bound","Aunt Rhody","Barbara Allen","Big Rock Candy Mountain","Blow the Man Down","Blue-Tail Fly","Buffalo Gals","Buffalo Skinners","Camptown Races","Careless Love","Cielito Lindo","Cindy","Clementine","Come All You Fair and Tender Ladies","Crawdad","Cumberland Gap","Darling Corey","Deep Blue Sea","Devil and the Farmer''s Wife","Devilish Mary","Dink''s Song","Down in the Valley","Erie Canal","Farmer Is The Man, The","Fillimeeooreeray","Four Nights Drunk","Fox, The","Frankie and Johnny","Froggie Went A-Courtin''","Hammer Song","Hard Traveling","Hold The Fort","Home on the Range","House of the Rising Sun","I Never Will Marry","I Ride An Old Paint","Irene Goodnight","Jesse James","Joe Bowers","John Brown''s Body","John Henry","Joshua Fought the Battle of Jericho","Keeper, The","Kisses Sweeter Than Wine","Little Girl","Michael Row The Boat Ashore","Midnight Special","My Horses Ain''t Hungry","New River Train","Oh, Mary Don''t You Weep","Oh Susanna","Old Dan Tucker","Old Joe Clark","On Top of Old Smoky","Passing Through","Pick A Bale of Cotton","Putting on the Style","Que Bonita Bandera","Reuben James","Riddle Song","Rye Whiskey","Sally Ann","Shenandoah","Skip To My Lou","So Long, It''s Been Good To Know You","Solidarity","Sometimes I Feel Like A Motherless Child","Stagolee","Strangest Dream","Streets of Laredo","Study War No More","Swanee River","Swing Low, Sweet Chariot","This Land Is Your Land","Twelve Gates to the City","Wabash Cannonball","Water Is Wide, The","Wayfaring Stranger","We Shall Not Be Moved","When I First Came To This Land","Which Side Are You On?","Who''s Gonna Shoe Your Pretty Little Foot?","Yankee Doodle","Young Man Who Wouldn''t Hoe Corn"]',
  'Copyright 1961 Oak Publications. The photographed copy states 1st printing April 1961 and lists successive printings through the 19th printing, February 1968; this physical copy is treated as the 19th printing based on the complete printing history shown. Cover price $1.95. Edited for publication by Irwin Silber and Ethel Raim; editorial assistant Daryl Heymann; music transcribed and edited by Ethel Raim; illustrations selected by and from the collection of Moses Asch, with additional illustrations from the New York Public Library and the Library of Congress.',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);

INSERT OR IGNORE INTO library_physical_copies (
  id, source_id, copy_number, format, isbn, provenance_note,
  ownership_marks_json, current_status, verification_status,
  inscriptions_json, ephemera_json, metadata_provenance_json
) VALUES (
  'library-copy-0020-01',
  'library-source-0020',
  1,
  'paperback songbook',
  NULL,
  'Photographed physical copy of American Favorite Ballads: Tunes and Songs as Sung by Pete Seeger. Copy shows substantial edge and spine wear and is being kept in a clear protective sleeve.',
  '[]',
  'currently_owned',
  'physical_copy_photographed',
  '[]',
  '[]',
  '{"basis":"user_photographed_physical_copy","captured_date":"2026-09-24","external_lookup":false}'
);
