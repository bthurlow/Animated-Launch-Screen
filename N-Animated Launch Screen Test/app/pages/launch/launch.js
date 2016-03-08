var helpers = require('~/utils/widgets/helper');
var observable = require("data/observable");
var enums = require("ui/enums");

var img;
var animationComplete = false;

var loadedObservable = new observable.Observable({
    loaded: false
});

function doNavigation(){
    loadedObservable.removeEventListener(observable.Observable.propertyChangeEvent);
    var navigationEntry = {
        moduleName: "/navigation/navigation",
        animated: true,
        clearHistory:true,
        transition: {name:"slideLeft"}
    };
    helpers.navigate(navigationEntry);
}

exports.onPageLoaded = function(args){
    //console.log("onPageLoaded");
    var page = args.object;
    var loader = page.getViewById("launchLoader");
    img = page.getViewById("launchImage");
    
    //console.log(img);
    
    loadedObservable.addEventListener(observable.Observable.propertyChangeEvent, function (pcd) {
        console.log(pcd.eventName.toString() + " " + pcd.propertyName.toString() + " " + pcd.value.toString());
        if(pcd.propertyName.toString() === "loaded"){
            if(pcd.value && animationComplete){
                doNavigation();
            }
        }
    });
    
    setTimeout(function(){
        loadedObservable.set("loaded",true);
    },6000);
    
    
    //img.animate({ opacity: 0 })
    //
    img.animate({
        translate: {x:0, y:2000},
        opacity: 0
    })
    .then(function () { return img.animate({ opacity: 1 }); })
    //.then(function () { return img.animate({ translate: { x: 100, y: 100 } }); })
    //.then(function () { return img.animate({ translate: { x: -100, y: -100 } }); })
    .then(function () { return img.animate({ translate: { x: 0, y: 0 }, duration: 3000, curve: enums.AnimationCurve.spring }); })
    .then(function () { return img.animate({ delay: 1000, scale: { x: 3, y: 3 } }); })
    .then(function () { return img.animate({ scale: { x: 1, y: 1 } }); })
    //.then(function () { return img.animate({ scale: { x: 1, y: 1 }, duration: 500 }); })
    .then(function () { return img.animate({ scale: { x: 3, y: 3 } }); })
    .then(function () { return img.animate({ scale: { x: 1, y: 1 } }); })
    //.then(function () { return img.animate({ rotate: 180 }); })
    //.then(function () { return img.animate({ rotate: 0 }); })
    .then(function () { 
        loader.busy = true;
        animationComplete = true;
        console.log("Animation finished"); 
        if(loadedObservable.get("loaded")){
            doNavigation();
        }
    })
    .catch(function (e) { console.log(e.message); });
};