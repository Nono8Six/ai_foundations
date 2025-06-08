@echo off
if exist node_modules\.vite (
  rmdir /s /q node_modules\.vite
  echo Removed .vite cache
) else (
  echo .vite cache not found
)

if exist node_modules\.vitest (
  rmdir /s /q node_modules\.vitest
  echo Removed .vitest cache
) else (
  echo .vitest cache not found
)

echo Cleanup complete
pause
