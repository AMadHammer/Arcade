
/////////////////////////////
/////////////////////////////
//listen to your own head and do what you want to do
/////////////////////////////
/////////////////////////////



var gameState = function (game){
    this.shipSprite;
    this.shipIsInvulnerable;
    
    this.key_left;
    this.key_right;
    this.key_thrust;
    this.key_fire;
    
    this.bulletGroup;
    
    this.asteroidGroup;
    
    this.tf_lives;
    
    this.tf_score;
    
    this.sndDestroyed;
    this.sndFire;
};

gameState.prototype = {
    
    preload: function () {
        if(!DEBUG_MODE)
        {
            game.load.image(graphicAssets.asteroidLarge.name, graphicAssets.asteroidLarge.URL);
            game.load.image(graphicAssets.asteroidMedium.name, graphicAssets.asteroidMedium.URL);
            game.load.image(graphicAssets.asteroidSmall.name, graphicAssets.asteroidSmall.URL);
            
            game.load.image(graphicAssets.bullet.name, graphicAssets.bullet.URL);
            game.load.image(graphicAssets.ship.name, graphicAssets.ship.URL);
            
            game.load.audio(soundAssets.destroyed.name, soundAssets.destroyed.URL);
            game.load.audio(soundAssets.fire.name, soundAssets.fire.URL);
        }else{
            game.load.image(DebugGraphicAssets.asteroidLarge.name, DebugGraphicAssets.asteroidLarge.URL);
            game.load.image(DebugGraphicAssets.asteroidMedium.name, DebugGraphicAssets.asteroidMedium.URL);
            game.load.image(DebugGraphicAssets.asteroidSmall.name, DebugGraphicAssets.asteroidSmall.URL);
            
            game.load.image(DebugGraphicAssets.bullet.name, DebugGraphicAssets.bullet.URL);
            game.load.image(DebugGraphicAssets.ship.name, DebugGraphicAssets.ship.URL);

            game.load.audio(soundAssets.destroyed.name, soundAssets.destroyed.URL);
            game.load.audio(soundAssets.fire.name, soundAssets.fire.URL);
        }
    },

    init: function () {
        this.bulletInterval = 0;
        this.asteroidsCount = asteroidProperties.startingAsteroids;
        this.shipLives = shipProperties.startingLives;
        this.shipIsInvulnerable = false;
        this.score = 0;
    },
    
    create: function () {
        this.initGraphics();
        this.initSounds();
        this.initPhysics();

        initGamepad(this);
        initKeyboard(this);

        this.resetAsteroids();
    },

    update: function () {
        this.checkPlayerInput();
        this.checkBoundaries(this.shipSprite);
        this.bulletGroup.forEachExists(this.checkBoundaries, this);
        this.asteroidGroup.forEachExists(this.checkBoundaries, this);
        
        game.physics.arcade.overlap(this.bulletGroup, this.asteroidGroup, this.asteroidCollision, null, this);
        
        if (!this.shipIsInvulnerable) {
            game.physics.arcade.overlap(this.shipSprite, this.asteroidGroup, this.asteroidCollision, null, this);
        }
    },
    
    addPadCallbacks: function(pad, text, index) {
        pad.addCallbacks(this, {
            onConnect: function(){
                text.setText('Last activity pad '+index+': Connected');
            },
            onDisconnect: function(){
                text.setText('Last activity pad '+index+': Disconnected');
            },
            onDown: function(buttonCode, value){
                text.setText('Last activity pad '+index+': buttonCode: '+buttonCode+' | value: '+value);
            },
            onUp: function(buttonCode, value){
                text.setText('Last activity pad '+index+': buttonCode: '+buttonCode+' | value: '+value);
            },
            onAxis: function(pad, axis, value) {
                text.setText('Last activity pad '+pad.index+': axis '+axis+': '+value);
            },
            onFloat: function(buttonCode, value) {
                text.setText('Last activity pad '+index+': buttonCode: '+buttonCode+' | value (float): '+value);
            }
        });
    },
    
    initGraphics: function () {
        this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
        this.shipSprite.angle = -90;
        this.shipSprite.anchor.set(0.5, 0.5);
        
        this.bulletGroup = game.add.group();
        this.asteroidGroup = game.add.group();
        
        this.tf_lives = game.add.text(20, 10, shipProperties.startingLives, fontAssets.counterFontStyle);
        
        this.tf_score = game.add.text(gameProperties.screenWidth - 20, 10, "0", fontAssets.counterFontStyle);
        this.tf_score.align = 'right';
        this.tf_score.anchor.set(1, 0);
    },
    
    initSounds: function () {
        this.sndDestroyed = game.add.audio(soundAssets.destroyed.name);
        this.sndFire = game.add.audio(soundAssets.fire.name);
    },
    
    initPhysics: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
        this.shipSprite.body.drag.set(shipProperties.drag);
        this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);
        
        this.bulletGroup.enableBody = true;
        this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.bulletGroup.createMultiple(bulletProperties.maxCount, graphicAssets.bullet.name);
        this.bulletGroup.setAll('anchor.x', 0.5);
        this.bulletGroup.setAll('anchor.y', 0.5);
        this.bulletGroup.setAll('lifespan', bulletProperties.lifeSpan);
        
        this.asteroidGroup.enableBody = true;
        this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
    },

    checkPlayerInput: function () {
        if (this.key_left.isDown 
            || (game.input.gamepad.pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT) 
                && game.input.gamepad.pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT).isDown)) {
            this.shipSprite.body.angularVelocity = -shipProperties.angularVelocity;
        } else if (this.key_right.isDown 
            || (game.input.gamepad.pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT))
                && game.input.gamepad.pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT).isDown) {
            this.shipSprite.body.angularVelocity = shipProperties.angularVelocity;
        } else {
            this.shipSprite.body.angularVelocity = 0;
        }
        
        if (this.key_thrust.isDown 
            || (game.input.gamepad.pad1.getButton(Phaser.Gamepad.XBOX360_B) 
            && game.input.gamepad.pad1.getButton(Phaser.Gamepad.XBOX360_B).isDown)
        || (game.input.gamepad.pad1.getButton(Phaser.Gamepad.XBOX360_X) 
            && game.input.gamepad.pad1.getButton(Phaser.Gamepad.XBOX360_X).isDown)
        || (game.input.gamepad.pad1.getButton(7) 
            && game.input.gamepad.pad1.getButton(7).isDown)
        || (game.input.gamepad.pad1.getButton(4) 
            && game.input.gamepad.pad1.getButton(4).isDown)
        || (game.input.gamepad.pad1.getButton(5) 
            && game.input.gamepad.pad1.getButton(5).isDown)
        || (game.input.gamepad.pad1.getButton(6) 
            && game.input.gamepad.pad1.getButton(6).isDown)) {
            game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, shipProperties.acceleration, this.shipSprite.body.acceleration);
        } else {
            this.shipSprite.body.acceleration.set(0);
        }
        
        if (this.key_fire.isDown 
            ||(game.input.gamepad.pad1.getButton(Phaser.Gamepad.XBOX360_A)
            &&game.input.gamepad.pad1.getButton(Phaser.Gamepad.XBOX360_A).isDown)) {
            this.fire();
        }
    },
    
    checkBoundaries: function (sprite) {
        if (sprite.x + gameProperties.padding < 0) {
            sprite.x = game.width + gameProperties.padding;
        } else if (sprite.x - gameProperties.padding> game.width) {
            sprite.x = -gameProperties.padding;
        } 

        if (sprite.y + gameProperties.padding < 0) {
            sprite.y = game.height + gameProperties.padding;
        } else if (sprite.y - gameProperties.padding> game.height) {
            sprite.y = -gameProperties.padding;
        }
    },
    
    fire: function () {
        if(!this.shipSprite.alive)
            {
                return;
            }
        if (game.time.now > this.bulletInterval) {
            var bullet = this.bulletGroup.getFirstExists(false);
            
            if (bullet) {
                this.sndFire.play();
                var length = this.shipSprite.width * 0.5;
                var x = this.shipSprite.x + (Math.cos(this.shipSprite.rotation) * length);
                var y = this.shipSprite.y + (Math.sin(this.shipSprite.rotation) * length);
                
                bullet.reset(x, y);
                bullet.lifespan = bulletProperties.lifeSpan;
                bullet.rotation = this.shipSprite.rotation;
                
                game.physics.arcade.velocityFromRotation(this.shipSprite.rotation, bulletProperties.speed, bullet.body.velocity);
                this.bulletInterval = game.time.now + bulletProperties.interval;
            }
        }
    },
    
    createAsteroid: function (x, y, size, pieces, angle) {
        if (pieces === undefined) { pieces = 1; }
        if (angle === undefined) {
            angle = null;
        } else if (angle) {
            angle = game.math.radToDeg(angle);
        }
        
        for (var i=0; i<pieces; i++) {
            var asteroid = this.asteroidGroup.create(x, y, size);
            asteroid.anchor.set(0.5, 0.5);
            asteroid.body.angularVelocity = game.rnd.integerInRange(asteroidProperties[size].minAngularVelocity, asteroidProperties[size].maxAngularVelocity);

            var randomAngle;
            if (angle) {
                randomAngle = game.math.degToRad(game.rnd.integerInRange(
                    angle - (asteroidProperties.sprayAngle / 2), angle + (asteroidProperties.sprayAngle / 2)));
            } else {
                randomAngle = game.math.degToRad(game.rnd.angle()); 
            }
            
            var randomVelocity = game.rnd.integerInRange(asteroidProperties[size].minVelocity, asteroidProperties[size].maxVelocity);

            game.physics.arcade.velocityFromRotation(randomAngle, randomVelocity, asteroid.body.velocity);
        }
    },
    
    resetAsteroids: function () {
        for (var i=0; i < this.asteroidsCount; i++ ) {
            var side = Math.round(Math.random());
            var x;
            var y;
            
            if (side) {
                x = Math.round(Math.random()) * gameProperties.screenWidth;
                y = Math.random() * gameProperties.screenHeight;
            } else {
                x = Math.random() * gameProperties.screenWidth;
                y = Math.round(Math.random()) * gameProperties.screenWidth;
            }
            
            this.createAsteroid(x, y, graphicAssets.asteroidLarge.name);
        }
    },
    
    asteroidCollision: function (target, asteroid) {
        // Occasionally child asteroids will collide with ship on creation.
        // This is a workaround.
        if (target.key == graphicAssets.ship.name && this.shipIsInvulnerable) {
            return;
        }

        this.sndDestroyed.play();

        var targetAngle = null;
        if (target.key == graphicAssets.bullet.name) {
            targetAngle = target.body.angle;
        }
        
        target.kill();
        asteroid.kill();
        
        if (target.key == graphicAssets.ship.name) {
            this.shipIsInvulnerable = true;
            this.destroyShip();
        }
        
        if (asteroidProperties[asteroid.key].nextSize) {
            this.createAsteroid(asteroid.x, asteroid.y, asteroidProperties[asteroid.key].nextSize, asteroidProperties[asteroid.key].pieces, targetAngle);
        }

        this.updateScore(asteroidProperties[asteroid.key].score);
        
        if (!this.asteroidGroup.countLiving()) {
            game.time.events.add(Phaser.Timer.SECOND * gameProperties.delayToStartLevel, this.nextLevel, this);
        }
    },
    
    destroyShip: function () {
        this.shipLives --;
        this.tf_lives.text = this.shipLives;

        if (this.shipLives) {
            game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.resetShip, this);
        } else {
            game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.endGame, this);
        }
    },
    
    resetShip: function () {
        this.shipIsInvulnerable = true;
        this.shipSprite.reset(shipProperties.startX, shipProperties.startY);
        this.shipSprite.angle = -90;
        
        game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.shipReady, this);
        game.time.events.repeat(Phaser.Timer.SECOND * shipProperties.blinkDelay, shipProperties.timeToReset / shipProperties.blinkDelay, this.shipBlink, this);
    },
    
    shipReady: function () {
        this.shipIsInvulnerable = false;
        this.shipSprite.visible = true;
    },
    
    shipBlink: function () {
        this.shipSprite.visible = !this.shipSprite.visible;
    },
    
    updateScore: function (score) {
        this.score += score;
        this.tf_score.text = this.score;
    },
    
    nextLevel: function () {
        this.asteroidGroup.removeAll(true);
        
        if (this.asteroidsCount < asteroidProperties.maxAsteroids) {
            this.asteroidsCount += asteroidProperties.incrementAsteroids;
        }
        
        this.resetAsteroids();
    },

    endGame: function(){       
        //PLACEHOLDER_NAME
        if(username) {SubmitScore(username, this.score);}
        else{SubmitScore(PLACEHOLDER_NAME, this.score);}
        game.state.start(states.scoreScreen);
    },
};
