BEGIN;

INSERT INTO noteful_notes (note_name, content, folder_id)
VALUES
('Dog','I love dogs', 1),
('Cats','I love cats', 1),
('Pigs','I love pigs', 1),
('Birds','I love birds', 2),
('Bears','I love bears', 2),
('Horse','I love horse', 2),
('Tigers','I love tigers', 3),
('Wolves','I love wolves', 3),
('Lions','I love lions', 3);


COMMIT;