@echo off
REM Cleanup script to remove dev/test/example files from the repo root.
REM Run this from cmd.exe. It will attempt to delete files; make sure you have backups if needed.

echo Deleting backend/test_signup.js
ndel /Q "c:\Users\ishit\OneDrive\Desktop\New folder\clubflow-blue\backend\test_signup.js"
echo Deleting backend/run_signup.js
ndel /Q "c:\Users\ishit\OneDrive\Desktop\New folder\clubflow-blue\backend\run_signup.js"
echo Deleting backend/test_user.json
ndel /Q "c:\Users\ishit\OneDrive\Desktop\New folder\clubflow-blue\backend\test_user.json"
echo Deleting backend/.env.example
ndel /Q "c:\Users\ishit\OneDrive\Desktop\New folder\clubflow-blue\backend\.env.example"
echo Deleting bun.lockb (if present)
ndel /Q "c:\Users\ishit\OneDrive\Desktop\New folder\clubflow-blue\bun.lockb"
echo Done.
pause