@echo off
set script_dir=%~dp0
cd %script_dir%..
cd..
cd..
cd..
cd..
cd..
powershell compress-archive -path '%cd%\AppData\Roaming\RenPy\Monika After Story' -destinationpath %script_dir%backup.zip
set rclone="%~dp0rclone\rclone.exe"
set RCLONE_CONFIG=%~dp0rclone\rclone.conf
%rclone% delete gdrive:/MASbackup/backup.zip
%rclone% copy --fast-list %script_dir%backup.zip gdrive:/MASbackup -P
del %script_dir%backup.zip