#!/bin/bash
mysql -u lucvan5_lab -pmd.CR8%O0vIt -D lucvan5_lab << EOF
ALTER TABLE users ADD COLUMN disabled TINYINT(1) DEFAULT 0;
DESCRIBE users;
SELECT id, name, email, role, clinic_id, disabled FROM users;
EOF
