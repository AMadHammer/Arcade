//enable to see text that displays helpful info
var DEBUG_MODE = true;


var gameProperties = {
    screenWidth: 800,
    screenHeight: 600,

    delayToStartLevel: 3,
    padding: 30, //put on the side of the screen to make the sprite look like they are not teleporting.
};

var graphicAssets = {
    ship:{URL:'assets/ship.png', name:'ship'},
    bullet:{URL:'assets/bullet.png', name:'bullet'},    
    
    asteroidLarge:{URL:'assets/asteroidLarge.png', name:'asteroidLarge'},
    asteroidMedium:{URL:'assets/asteroidMedium.png', name:'asteroidMedium'},
    asteroidSmall:{URL:'assets/asteroidSmall.png', name:'asteroidSmall'},
};

var soundAssets = {
    fire:{URL:['assets/fire.m4a', 'assets/fire.ogg'], name:'fire'},
    destroyed:{URL:['assets/destroyed.m4a', 'assets/destroyed.ogg'], name:'destroyed'},
};

var shipProperties = {
    startX: gameProperties.screenWidth * 0.5,
    startY: gameProperties.screenHeight * 0.5,
    acceleration: 300,
    drag: 150, //200
    maxVelocity: 300,
    angularVelocity: 200, //ship turn speed 
    startingLives: 10, //3
    timeToReset: 3,
    blinkDelay: 0.2,
};

var bulletProperties = {
    speed: 400,
    interval: 150,
    lifeSpan: 2000,
    maxCount: 3,
}

var asteroidProperties = {
    startingAsteroids: 4,
    maxAsteroids: 20,
    incrementAsteroids: 2,
    
    asteroidLarge: { minVelocity: 50, maxVelocity: 150, minAngularVelocity: 0, maxAngularVelocity: 200, score: 20, nextSize: graphicAssets.asteroidMedium.name, pieces: 2 },
    asteroidMedium: { minVelocity: 50, maxVelocity: 200, minAngularVelocity: 0, maxAngularVelocity: 200, score: 50, nextSize: graphicAssets.asteroidSmall.name, pieces: 2 },
    asteroidSmall: { minVelocity: 50, maxVelocity: 300, minAngularVelocity: 0, maxAngularVelocity: 200, score: 100 },
};

var fontAssets = {
    counterFontStyle:{font: '20px Arial', fill: '#FFFFFF', align: 'center'},
}
