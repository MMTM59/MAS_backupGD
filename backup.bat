@echo off
set script_dir=%~dp0
powershell compress-archive -path 'C:\Users\%username%\AppData\Roaming\RenPy\Monika After Story' -destinationpath %script_dir%backup.zip
set rclone="%~dp0rclone\rclone.exe"
set RCLONE_CONFIG=%~dp0rclone\rclone.conf
%rclone% delete drive:/MASbackup/backup.zip
%rclone% copy --fast-list %script_dir%backup.zip drive:/MASbackup -P
del %script_dir%backup.zip