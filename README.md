# GIFsquid
a simple After Effects script to export high quality GIFs

Licensed under GPL 3.0. I happily accept pull requests

# Requirements
FFmpeg and ImageMagick binaries need to be in the GIFsquid/bin directory.
THESE ARE NOT INCLUDED

# Installation
Unarchive the entire repo into your ScriptUI Panels folder. Pay attention to ther requirements above

# Old readme.txt
GIFsquid v0.8
by hellphish (c) GunSquid.com

HOW TO INSTALL:

1. Close After Effects

2. Unzip this file to the the "ScriptUI Panels" folder.
On After Effects 2015 this is usually at C:\Program Files\Adobe\Adobe After Effects CC 2015.3\Support Files\Scripts\ScriptUI Panels

3. Open After Effects

4. Go to "Edit->Preferences->General..." and make sure "Allow Scripts to Write Files and Access Network" is checked. (not required if upgrading)



HOW TO USE:

Open GIFsquid from the "Window" menu in AE.
Click on "options" to select options.

Desired FPS:
 frames per second of your GIF. Not all numbers are valid.

Memory limit:
 Does Photoshop get crashy on you? This might be for you.

Crapiness:
 is used to adjust how much artifacting is acceptable.
Lower numbers for Crapiness produce better looking, but larger files.

Turbo Mode:
Sacrifices quality in exchange for faster encoding speed. Using Turbo mode
causes GIFsquid to ignore all settings except for "Resize to".

Resize to:
 Adjusts the size of your gif! Or not, it doesn't matter!

Dithering Pattern:
 Which dithering pattern to use. 
 Advanced options let you pick how many colors per channel (R,G,B)
	The defaults are similar to a perceptual palette. (8 reds, 8 greens, 4 blues)
	For more information visit http://www.imagemagick.org/Usage/bugs/ordered-dither/

WARNINGS/KNOWN ISSUES:

Save your After Effects project to a folder, not the root level of a drive.

ie. don't save to c:\project.aep
	save to c:\folder\project.aep
	
Don't use any special characters in the name of your comp. This can result in errors.
