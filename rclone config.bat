@echo off
curl https://downloads.rclone.org/rclone-current-windows-amd64.zip --output rclone.zip
powershell expand-archive -path rclone.zip -force
del rclone.zip
for /r %%a in (rclone.exe) do (
  copy %%a rclone /Y
)
type null > rclone\rclone.conf
set rclone="rclone\rclone.exe"
set RCLONE_CONFIG=rclone\rclone.conf
%rclone% config