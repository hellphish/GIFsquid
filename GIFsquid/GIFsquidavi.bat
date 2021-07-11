cls
@echo off
REM mode con: cols=80 lines=40
SETLOCAL

ansicon.exe -p

if not "%1"=="" goto param

:INTERACTIVE
set "giffps=24"
set "gifmem=2000"
set "inputpath=frames"
set "outputpath=output"
set /P giffps="Enter desired FPS (default 24): "
set /P gifmem="Enter max RAM usage in MB eg enter '3000' to use 3 Gigabytes of RAM (default 2000): "

if giffps==NUL set giffps=24
if gifmem==NUL set gifmem=2000
if inputpath==NUL set "inputpath=frames"
if outputpath==NUL set "outputpath=output"
goto make

:PARAM
set giffps=%1
set gifmem=%2
set "inputpath=%3"
set "outputpath=%4"
set giffuzz=%5
set gifsize=%6
set ditherSettings=%7
set ditherSettings=%ditherSettings:"=%
set gifname=%8
set turbo=%9
set palette=%appdata%/palette.png

@echo off
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"

set "fullstamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"



:MAKE
REM cls
REM if not exist %outputpath%\NUL echo output folder does not exist, creating
if not exist %outputpath%\ (mkdir %outputpath%)
REM echo Creating GIF at %giffps% frames per second. Max memory consumption %gifmem% MB
echo.
type squidpicdots.ans
echo.
echo Pre-cleaning
@echo off
del %localappdata%\Temp\magick* > NUL
if %turbo%==true goto turbo
if %turbo%==lesinski goto LESINSKI

echo Squirting GIF (this could take a while)
bin\convert +repage -fuzz %giffuzz%%% -delay 1x%giffps% -limit memory %gifmem%MB -loop 0 %inputpath%[%gifsize%] %ditherSettings% -layers OptimizeTransparency %outputpath%/%gifname%-%fullstamp%.gif 2>> %programdata%\GIFsquid.log
%SystemRoot%\explorer.exe "%outputpath%"
goto done

:TURBO
echo Generating palette
echo.
echo off
bin\ffmpeg -v quiet -i %inputpath% -vf "fps=10,palettegen=stats_mode=diff" -y %palette%
echo Squirting GIF (TURBO MODE ENGAGED)
echo.
echo off
bin\ffmpeg -v quiet -i %inputpath% -i %palette% -lavfi "scale=%gifsize%:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3" -y %outputpath%/%gifname%-%fullstamp%.gif

%SystemRoot%\explorer.exe "%outputpath%"
goto done

:LESINSKI
echo Lesinski Compression Activated!
echo.
echo off
if not exist %outputpath%\PNG (mkdir %outputpath%\PNG)
bin\ffmpeg -i %inputpath% %outputpath%/PNG/frame%%04d.png
bin\gifski --fps %giffps% -o %outputpath%/%gifname%-%fullstamp%.gif %outputpath%/PNG/frame*.png
goto done

:DONE
Echo GIF is all done!
Echo Mopping up the mess!
del %localappdata%\Temp\magick*
echo.
REM del /f /s /q %inputpath%
