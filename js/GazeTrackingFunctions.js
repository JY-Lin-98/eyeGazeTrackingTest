var calibrationEnd = false;
var gazeTrackingEnd = false;

//设置取眼动数据的频率，一秒x帧（帧数要能够被1000整除）
var gazeFrequency = 25
var ifGetData = false

//如果想要一开始就启动眼动便取消注释这段代码
// window.onload = function () 
// {
//     StartTracking(); 
// }


//调用此函数来开启眼动并且进行各项初始化
function StartTracking() 
{
    GazeCloudAPI.StartEyeTracking();
    localStorage.clear();
}

//调用此函数来结束眼动、存储数据并且清除localsorage
function StopTracking() {
    GazeCloudAPI.StopEyeTracking()
    gazeTrackingEnd = true;
    //从localstorage里拿到所有眼动数据并存到Blob类文件对象中，存到txt文件里并下载
    let data = JSON.stringify(localStorage, null, 4);
    let blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    let url = URL.createObjectURL(blob);
    let gazeFile = document.createElement('a');
    gazeFile.href = url;
    var currentTime = new Date();
    gazeFile.download = currentTime.toString(); // 用当前时间来命名文件，也可根据需要来自定义存储文件的命名格式  
    gazeFile.click();
    //清除localstorage
    localStorage.clear();
}

function GetGazeData(GazeData) 
{
    //存储眼动结果到LocalStorage
    if (calibrationEnd && gazeTrackingEnd == false && ifGetData) {
        //数据存储格式，[TimeStamp], [GazeX, GazeY, HeadX, HeadY, HeadZ, Yaw, Pitch, Roll]
        localStorage.setItem(GazeData.time, GazeData.GazeX.toString() + ',' + GazeData.GazeY.toString() + ',' + GazeData.HeadX.toString() + ',' + GazeData.HeadY.toString() + ',' + GazeData.HeadZ.toString() + ',' + GazeData.HeadYaw.toString() + ',' + GazeData.HeadPitch.toString() + ',' + GazeData.HeadRoll.toString());
        ifGetData = false;
    }
}

window.addEventListener("load", function () {
    GazeCloudAPI.OnCalibrationComplete = function () 
    {
        console.log('gaze Calibration Complete');
        calibrationEnd = true;
    }
    GazeCloudAPI.OnCamDenied = function () { console.log('camera  access denied') }
    GazeCloudAPI.OnError = function (msg) { console.log('err: ' + msg) }
    GazeCloudAPI.UseClickRecalibration = true;
    GazeCloudAPI.OnResult = GetGazeData;
});

//调整眼动数据采集的频率
window.setInterval(function(){
    if (calibrationEnd && gazeTrackingEnd == false)
    {
        ifGetData = true;   
    }
},1000/gazeFrequency);
