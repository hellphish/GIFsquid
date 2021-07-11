
GIFSQUID_VERSION = "GIFsquid v0.8b"
//default variables
var giffps = 24;
var gifmem = 1500;
var giffuzz = 0.5;
var gifwidth = 970;
var wideortall = 0;
var gifdithersetting = 0;

var gifdither = "";

var fpsfromcomp = true;
var widthfromcomp = true;


var redlevelsetting = 8;
var greenlevelsetting = 8;
var bluelevelsetting = 4;

var turboMode = false;

//load defaults from user prefs
if (app.settings.haveSetting("gifsquid", "framerate")) {
    giffps = parseInt(app.settings.getSetting("gifsquid", "framerate"));
}
if (app.settings.haveSetting("gifsquid", "memoryLimit")) {
    gifmem = parseInt(app.settings.getSetting("gifsquid", "memoryLimit"));
}
if (app.settings.haveSetting("gifsquid", "fuzz")) {
    giffuzz = parseFloat(app.settings.getSetting("gifsquid", "fuzz"));
}
if (app.settings.haveSetting("gifsquid", "width")) {
    gifwidth = parseInt(app.settings.getSetting("gifsquid", "width"));
}
if (app.settings.haveSetting("gifsquid", "wideortall")) {
    wideortall = parseInt(app.settings.getSetting("gifsquid", "wideortall"));
}

//turbo mode
if (app.settings.haveSetting("gifsquid","turboMode")){
    turboMode = app.settings.getSetting("gifsquid","turboMode");
    if (turboMode=="true") {
        turboMode=true;
    }
    else{turboMode=false;
    }
}

//dither settings
if (app.settings.haveSetting("gifsquid", "ditherpattern")) {
    gifdithersetting = parseInt(app.settings.getSetting("gifsquid", "ditherpattern"));
    //alert(gifdithersetting);
}
if (app.settings.haveSetting("gifsquid", "redlevelsetting")) {
    redlevelsetting = parseInt(app.settings.getSetting("gifsquid", "redlevelsetting"));
}
if (app.settings.haveSetting("gifsquid", "greenlevelsetting")) {
    greenlevelsetting = parseInt(app.settings.getSetting("gifsquid", "greenlevelsetting"));
}
if (app.settings.haveSetting("gifsquid", "bluelevelsetting")) {
    bluelevelsetting = parseInt(app.settings.getSetting("gifsquid", "bluelevelsetting"));
}

//from comp settings these require parsing
if (app.settings.haveSetting("gifsquid","widthfromcomp")) {
    widthfromcomp=app.settings.getSetting("gifsquid","widthfromcomp");
    if (widthfromcomp=="true") {
        widthfromcomp=true;
    } else {
        widthfromcomp=false;
    }
}

if (app.settings.haveSetting("gifsquid","fpsfromcomp")) {
    fpsfromcomp=app.settings.getSetting("gifsquid","fpsfromcomp");
    if (fpsfromcomp=="true") {
        fpsfromcomp=true;
    } else {
        fpsfromcomp=false;
    }
}

//other variables
scriptPath = (new File($.fileName)).parent.fsName;
var squidworkingDir = scriptPath.toString() + "\\GIFsquid\\";  //setting up the path to the final batch

var squidIcon = File(squidworkingDir + "squidicon.png")




//UI code
function myScript(thisObj) {
    function myScript_buildUI(thisObj) {
        var mainPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", GIFSQUID_VERSION, undefined, { resizeable: true });

        res = "Group{orientation:'row',\
            goButton: Button{text:'Squirt GIF',},\
            optionsButton:Button{text:'Options'}}";

        mainPanel.grp = mainPanel.add(res);
        mainPanel.helpgrp = mainPanel.add("group");
        mainPanel.helpgrp.add("iconbutton", undefined, squidIcon, { name: "helpbutton" })
        mainPanel.helpgrp.helpbutton.onClick = helpWindow;
        mainPanel.helpgrp.helpbutton.helptip = "About GIFsquid";
        mainPanel.grp.goButton.helptip = "Render GIF";
        mainPanel.grp.goButton.onClick = ConfirmGif;
        mainPanel.grp.optionsButton.onClick = optionsWindow;
        mainPanel.grp.show();
        mainPanel.layout.layout(true)
        
        return mainPanel;
    }
    var myScriptPal = myScript_buildUI(thisObj);
    if ((myScriptPal != null) && (myScriptPal instanceof Window)) {
        myScriptPal.center();
        myScriptPal.show();
    }
}
myScript(this);

function advancedDither() {

    if (app.settings.haveSetting("gifsquid", "redlevelsetting")) {
        redlevelsetting = parseInt(app.settings.getSetting("gifsquid", "redlevelsetting"));
    }
    if (app.settings.haveSetting("gifsquid", "greenlevelsetting")) {
        greenlevelsetting = parseInt(app.settings.getSetting("gifsquid", "greenlevelsetting"));
    }
    if (app.settings.haveSetting("gifsquid", "bluelevelsetting")) {
        bluelevelsetting = parseInt(app.settings.getSetting("gifsquid", "bluelevelsetting"));
    }

    var numColors = 99;
    numColors = redlevelsetting * greenlevelsetting * bluelevelsetting;

    win = new Window("dialog", "Advanced Dither Settings", undefined, { resizeable: true, independent: false, minimizeButton: false, maximizeButton: false, });
    chanPan = win.add("panel", undefined);
    statictext_2 = chanPan.add("statictext", undefined, "Number of colors per channel", { multiline: true });
    changrp = chanPan.add("group", undefined, "undefined");
    redList = changrp.add("dropdownlist", undefined, ["-", "-", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"]);
    redList.selection = redlevelsetting;
    greenList = changrp.add("dropdownlist", undefined, ["-", "-", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"]);
    greenList.selection = greenlevelsetting;
    blueList = changrp.add("dropdownlist", undefined, ["-", "-", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"]);
    blueList.selection = bluelevelsetting;
    statictext_1 = chanPan.add("statictext", undefined, "Red   -   Green   -   Blue");

    presetPanel = win.add("panel", undefined, "Presets");
    presetGrp = presetPanel.add("group", undefined, "Presets");  //preset buttons
    HighButton = presetGrp.add("button", undefined, "High");
    MediumButton = presetGrp.add("button", undefined, "Medium");
    LowButton = presetGrp.add("button", undefined, "Low");

    HighButton.onClick = setHigh;
    MediumButton.onClick = setMedium;
    LowButton.onClick = setLow;

    win.countergrp = win.add("group");   //color counter stuff
    win.countergrp.alignment = "center";
    win.counter = win.countergrp.add("edittext", undefined, numColors.toString(), { readonly: true });
    win.counter.characters = 4;
    win.countergrp.add("statictext", undefined, "total colors (cannot exceed 256)");

    redList.onChange = checkColors;
    greenList.onChange = checkColors;
    blueList.onChange = checkColors;



    function setHigh() {
        redList.selection = 8;
        greenList.selection = 8;
        blueList.selection = 4;
        //checkColors();
    }
    function setMedium() {
        redList.selection = 6;
        greenList.selection = 6;
        blueList.selection = 4;
        //checkColors();
    }
    function setLow() {
        redList.selection = 4;
        greenList.selection = 4;
        blueList.selection = 4;
        //checkColors();
    }

    function checkColors() {
        numColors = parseInt(redList.selection) * parseInt(greenList.selection) * parseInt(blueList.selection);
        win.counter.text = numColors.toString();
        if (numColors > 256) {
            win.ok.enabled = false;
        } else {
            win.ok.enabled = true;
        }
        this.window.layout.layout(true);
    }

    win.buttongrp = win.add("group");
    win.buttongrp.alignment = "right";
    win.ok = win.buttongrp.add("button", undefined, "OK");
    win.buttongrp.add("button", undefined, "Cancel");

    win.center();


    if (win.show() == 1) { //user presses OK
        redlevelsetting = (redList.selection);
        app.settings.saveSetting("gifsquid", "redlevelsetting", redlevelsetting); //setting vars for batchfile, also saving to settings file.

        greenlevelsetting = (greenList.selection);
        app.settings.saveSetting("gifsquid", "greenlevelsetting", greenlevelsetting); //setting vars for batchfile, also saving to settings file.

        bluelevelsetting = (blueList.selection);
        app.settings.saveSetting("gifsquid", "bluelevelsetting", bluelevelsetting); //setting vars for batchfile, also saving to settings file.



    }

}

function helpWindow() {
    var helpWin = new Window("dialog", GIFSQUID_VERSION, undefined, { resizeable: true });
    helpWin.add("statictext", undefined, GIFSQUID_VERSION + " by GunSquid.com \
	30-JUL-2017 \
	\
	", { multiline: true });
    helpWin.show();
}

function optionsWindow() {

    if (app.settings.haveSetting("gifsquid", "ditherpattern")) {
        gifdithersetting = parseInt(app.settings.getSetting("gifsquid", "ditherpattern"));
    }

    if (app.settings.haveSetting("gifsquid", "wideortall")) {
        wideortall = parseInt(app.settings.getSetting("gifsquid", "wideortall"));
    }

    var optWin = new Window("dialog", "GIFsquid Options", undefined, { resizeable: true });


    optWin.fpsgrp = optWin.add("panel",undefined,"Framerate Settings");
    optWin.fpsgrp.toprow=optWin.fpsgrp.add("group");
    optWin.fpsgrp.alignment = "fill";
    optWin.fpsgrp.toprow.alignment = "left";
    optWin.fpsgrp.toprow.add("statictext", undefined, "Desired FPS:");
    var userFps = optWin.fpsgrp.toprow.add("edittext", undefined, giffps);
    userFps.characters = 4;
    userFps.helpTip = "Enter the desired framerate for your GIF";
    //optWin.fpsgrp.toprow.add("statictext", undefined, "Frames per second");
    var fpsCheckbox = optWin.fpsgrp.add("checkbox",undefined,"Use FPS from comp");
    fpsCheckbox.onClick=GhostFpsOptions;
    fpsCheckbox.alignment="left";

   //get options and set checkbox values
    if (fpsfromcomp==true) {
        fpsCheckbox.value=true;
        userFps.enabled=false;
    } else {
        fpsCheckbox.value=false;
        userFps.enabled=true;
    }
    
     function GhostFpsOptions() {
        if (fpsCheckbox.value == false) {
            userFps.enabled = true;
        } else {
            userFps.enabled = false;
        }
        this.window.layout.layout(true);
        
    }

    optWin.memgrp = optWin.add("group");
    optWin.memgrp.alignment = "left";
    optWin.memgrp.add("statictext", undefined, "Memory limit:");
    var userMem = optWin.memgrp.add("edittext", undefined, gifmem);
    userMem.characters = 6;
    userMem.helpTip = "Use this setting to limit how much RAM GIFsquid will use.";
    optWin.memgrp.add("statictext", undefined, "Megabytes");

    optWin.fuzzgrp = optWin.add("panel",undefined,"Compression Settings");
    optWin.fuzzgrp.toprow=optWin.fuzzgrp.add("group");
    optWin.fuzzgrp.alignment = "fill";
    optWin.fuzzgrp.alignChildren = "left";
    optWin.fuzzgrp.toprow.add("statictext", undefined, "Crappiness");
    var userFuzz = optWin.fuzzgrp.toprow.add("edittext", undefined, giffuzz);
    userFuzz.characters = 4;
    userFuzz.helpTip = "Crappiness controls how much artifacting is acceptable. Some crappiness can help smooth the GIF and reduce noise.";
    
    var turboCheckbox = optWin.fuzzgrp.toprow.add("checkbox",undefined,"Turbo Mode")
    turboCheckbox.helpTip = "Sacrifce some quality for faster encoding speed. All options except resizing are ignored."
     if (turboMode==true){
        turboCheckbox.value=true;
    } else {
        turboCheckbox.value=false;
    }
    
    optWin.fuzzgrp.add("statictext", undefined, "The crappier your GIF, the smaller the file will be. Stay between 0.5 and 2.0 for good results.", { multiline: true });

    optWin.widthgrp = optWin.add("group");
    optWin.widthgrp.alignment = "left";
    var resizeCheckbox = optWin.widthgrp.add("checkbox", undefined, "");
    resizeCheckbox.onClick=GhostResizeOptions;
    optWin.widthgrp.add("statictext", undefined, "Resize to");
    var userWidth = optWin.widthgrp.add("edittext", undefined, gifwidth);
    userWidth.characters = 6;
    userWidth.helpTip = "Your GIF will be scaled to this size. Aspect ratio is preserved";
    optWin.widthgrp.add("statictext", undefined, "Pixels");
    wideOrTall = optWin.widthgrp.add("dropdownlist", undefined, ["Wide", "Tall"]);
    wideOrTall.selection = wideortall;
    
     if (widthfromcomp==true) {
        resizeCheckbox.value=false;
        userWidth.enabled = false;
        wideOrTall.enabled = false;
    } else {
        resizeCheckbox.value=true;
        userWidth.enabled = true;
        wideOrTall.enabled = true;
    }
   

    function GhostResizeOptions() {
        if (resizeCheckbox.value == false) {
            userWidth.enabled = false;
            wideOrTall.enabled = false;
        } else {
            userWidth.enabled = true;
            wideOrTall.enabled = true;
        }
        this.window.layout.layout(true);
        
    }

    optWin.dithergrp = optWin.add("group");
    optWin.dithergrp.alignment = "left";
    optWin.dithergrp.add("statictext", undefined, "Dithering Pattern");
    var userDither = optWin.dithergrp.add("dropdownlist", undefined, ["none", "o8x8", "o4x4", "h4x4a", "h6x6a", "h8x8a", "c5x5b", "c5x5w", "c6x6b", "c6x6w"]);
    userDither.selection = gifdithersetting;
    userDither.helpTip = "Select a Dithering Pattern";

    var advButton = optWin.dithergrp.add("button", undefined, "Advanced");
    advButton.onClick = advancedDither;
    advButton.helpTip = "Advanced Dithering Settings";

    optWin.buttongrp = optWin.add("group");
    optWin.buttongrp.alignment = "right";
    optWin.buttongrp.add("button", undefined, "OK");
    optWin.buttongrp.add("button", undefined, "Cancel");
    
    //optWin.show();

    if (optWin.show() == 1) {
        giffps = parseInt(userFps.text);
        app.settings.saveSetting("gifsquid", "framerate", giffps); //setting vars for batchfile, also saving to settings file.

        gifmem = parseInt(userMem.text);
        app.settings.saveSetting("gifsquid", "memoryLimit", gifmem);

        giffuzz = parseFloat(userFuzz.text);
        if (giffuzz <= 0) {
            giffuzz = 0.1;
        }
        app.settings.saveSetting("gifsquid", "fuzz", giffuzz);


        gifwidth = parseInt(userWidth.text);
        if (gifwidth < 1) {
            gifwidth = 1;
        }
        app.settings.saveSetting("gifsquid", "width", gifwidth);

        gifdithersetting = userDither.selection;
        app.settings.saveSetting("gifsquid", "ditherpattern", gifdithersetting.index);

        wideortall = wideOrTall.selection.index;
        app.settings.saveSetting("gifsquid", "wideortall", wideortall);

        //save "from comp settings"
        if (resizeCheckbox.value==true) {
            widthfromcomp=false;
        } else {
            widthfromcomp=true;
        }
        app.settings.saveSetting("gifsquid","widthfromcomp",widthfromcomp);

        if (fpsCheckbox.value==true) {
            fpsfromcomp=true;
        } else {
            fpsfromcomp=false;
        }
        app.settings.saveSetting("gifsquid","fpsfromcomp",fpsfromcomp);

        //save Turbo Mode settings
        if (turboCheckbox.value==true) {
            turboMode=true;
        } else {
            turboMode=false;
        }
        app.settings.saveSetting("gifsquid","turboMode",turboMode);

        gifdither = "-ordered-dither " + gifdithersetting.text + "," + redlevelsetting.text + "," + greenlevelsetting.text + "," + bluelevelsetting.text;
        if (gifdithersetting.text == "none") {
            gifdither = "";
        } else if (!redlevelsetting.text) {
            alert("Please go to the advanced settings and click OK");  //todo: create a globalscope variable to handle this seamlessly
        }
        //alert(gifdither);
        //alert(redlevelsetting);
    }
}




function addCompToQueue() {

    comp = app.project.activeItem;
    rq = app.project.renderQueue;

    if (!(comp instanceof CompItem)) {
        alert("\"" + comp.name + "\"" + " is not a Comp. Select a Comp and try again");
    }


    rq.items.add(comp);
    var lastComp = rq.numItems;
    rq.item(lastComp).outputModule(1).applyTemplate("Lossless");//add to queue

    var oldLocation = rq.item(lastComp).outputModule(1).file; //save current filename
    rq.item(lastComp).outputModule(1).file = new File(app.project.file.parent.toString() + "/" + oldLocation.name);//set path to project path
}

function ConfirmGif() {
    if (app.project.file == null) {
        alert("Please save your project and try again");
        return;
    }
    if (confirm("It may appear that After Effects has crashed, but rendering will continue.\n\nAfter rendering, we compress your GIF in a DOS window. It is fun.\n\nContinue?", false, "Squirt GIF?"))
        // MakeGif();
        try {
            MakeGif()
        }
        catch (err) {
            alert("[debug] SquirtGIF failed with: " + err.message);
        }
}

function MakeGif() {

        
    //alert("Rendering will begin after closing this dialog. It may appear that After Effects has crashed, but rendering will continue. After Rendering is complete, some DOS windows will come up, don't close them.  Converting to GIF takes a long time. When it is done, the output folder will open in explorer")



    //deQueueOthers();
    clearQueue();
    addCompToQueue();

    //alert("calling addComp");
    app.project.renderQueue.render();
    //alert("calling Render");
    runBat();
    //alert("calling runBat");


}

function runBat() {
    var comp = app.project.activeItem;
    var currentOM = app.project.renderQueue.item(app.project.renderQueue.numItems).outputModule(1);
    var sizesetting = "";

    if (wideortall == 0) {
        sizesetting = gifwidth.toString() + "x";
    } else {
        sizesetting = "x" + gifwidth.toString();
    }
    if (widthfromcomp==true) {
        sizesetting = comp.width.toString() + "x";
    }
    
    //turbomode size settings
    if (turboMode==true) {
        if (wideortall == 0) {
        sizesetting = gifwidth.toString() + ":-1";
    } else {
        sizesetting = "-1:" + gifwidth.toString();
    }
    if (widthfromcomp==true) {
        sizesetting = comp.width.toString() + ":-1";
    }
    }
    
    if (fpsfromcomp==true) {
        giffps=Math.round(comp.frameRate);
    }

    aviPath = currentOM.file.fsName;
    pngPath = currentOM.file.parent.fsName;
    gifName = currentOM.file.displayName;
    outPath = pngPath + "\\GIFsquid_Output"
    //var cmd = "\"" +scriptPath.toString() + "\\GIFsquid\\GIFsquid.bat\" " + giffps.toString() + " " + gifmem.toString()+ " " +"\""+pngPath+"\"";
    var cmd = "GIFsquidavi.bat " + giffps.toString() + " " + gifmem.toString() + " " + "\"" + aviPath + "\" " + "\"" + outPath + "\"" + " " + giffuzz.toString() + " "
     + sizesetting + " \"" + gifdither.toString() + "\"" + " \"" + gifName + "\"" + " " + turboMode;
    var workingDir = "\"" + scriptPath.toString() + "\\GIFsquid\\\"";
    var batName = "\\squidyavi.bat";
    var batPath = Folder.appData.fsName.toString() + batName;
    var batFile = new File(batPath);
    batFile.open("w");
    batFile.write("cd\\ \n" + "cd " + workingDir + "\n" + cmd + "\n" + "exit");
    batFile.close();


    batFile.execute();
    //alert(cmd);
    //alert(aviPath);
}

function clearQueue() {

    var rqi = app.project.renderQueue;

    for (var i = 1; i <= rqi.numItems; i++) {
        rqi.item(i).remove();
    }
}

function deQueueOthers() //doesn't work reliably, issues with half-rendered, cancelled items
{
    var rqi = app.project.renderQueue;
    for (var i = 1; i <= rqi.numItems; i++) {
        if (rqi.item(i).render == true) {
            rqi.item(i).render = false;
        }
    }
}


