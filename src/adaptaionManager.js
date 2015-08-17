/**
 * @classdesc
 * AdaptationManager
 * 
 * @class AdaptationManager
 * @this {AdaptationManager}
 * @author sogimu@nxt.ru Aleksandr Lizin aka sogimu
 * @version 0.1
 *
 */

(function(namespace) {
    var AdaptationManager = function() {

        var me = {};

        me._core = {};

        // me._possible_steps = [32, 64, 128, 256, 512, 1024];
        // me._possible_steps = [10, 20, 50, 80, 100, 150, 200];
        me._possible_steps = [0,
 10,
 20,
 30,
 40,
 50,
 60,
 70,
 80,
 90,
 100,
 110,
 120,
 130,
 140,
 150,
 160,
 170,
 180,
 190,
 200,
 210,
 220,
 230,
 240,
 250,
 260,
 270,
 280,
 290,
 300,
 310,
 320,
 330,
 340,
 350,
 360,
 370,
 380,
 390,
 400,
 410,
 420,
 430,
 440,
 450,
 460,
 470,
 480,
 490,
 500,
 510,
 520,
 530,
 540,
 550,
 560,
 570,
 580,
 590,
 600,
 610,
 620,
 630,
 640,
 650,
 660,
 670,
 680,
 690,
 700,
 710,
 720,
 730,
 740,
 750,
 760,
 770,
 780,
 790,
 800,
 810,
 820,
 830,
 840,
 850,
 860,
 870,
 880,
 890,
 900,
 910,
 920,
 930,
 940,
 950,
 960,
 970,
 980,
 990]
        me._current_steps_index = 0;

        me._onPostDrawFuncIndex = -1;
        me._onCameraChangeStartFuncIndex = -1;
        me._onCameraChangeEndFuncIndex = -1;

        me.init = function(core) {
            me._core = core;

            me._onPostDrawFuncIndex = me._core.onPostDraw.add(function(fps) {
                me.do(fps);
            });

            me._onCameraChangeStartFuncIndex = me._core.onCameraChangeStart.add(function() {
                // me.pause(true);

            });

            me._onCameraChangeEndFuncIndex = me._core.onCameraChangeEnd.add(function() {
                // me.pause(false);
            });

        };

        // me.setPossibleSteps = function(possible_steps) {
        //     me._possible_steps = possible_steps;
        // };

        me.run = function(flag) {
            if(flag) {
                me._core.onPostDraw.start(me._onPostDrawFuncIndex);
                me._core.onCameraChangeStart.start(me._onCameraChangeEndFuncIndex);
                me._core.onCameraChangeEnd.start(me._onCameraChangeStartFuncIndex);

            } else {
                me._core.onPostDraw.stop(me._onPostDrawFuncIndex);
                me._core.onCameraChangeStart.stop(me._onCameraChangeEndFuncIndex);
                me._core.onCameraChangeEnd.stop(me._onCameraChangeStartFuncIndex);
               
            }

        };

        me.pause = function(flag) {
            if(flag) {
                me._core.onCameraChangeStart.stop(me._onCameraChangeEndFuncIndex);
                me._core.onPostDraw.stop(me._onPostDrawFuncIndex);
             

            } else {
                me._core.onCameraChangeStart.start(me._onCameraChangeEndFuncIndex);
                me._core.onPostDraw.start(me._onPostDrawFuncIndex);

            }

        };

        me.getNearestSurroundingsPossibleStep = function(steps) {
            var delta = me._possible_steps[1] - me._possible_steps[0];
            var direction = (steps - me.getSteps()) > 0 ? 1 : -1;

            for(var adaptationStep = me._current_steps_index; adaptationStep<me._possible_steps.length; adaptationStep+=direction) {
                if(Math.abs(me._possible_steps[adaptationStep] - steps) <= delta) {
                    if(steps > me._possible_steps[adaptationStep]) {
                        return [adaptationStep, adaptationStep+1];

                    }

                    if(steps > me._possible_steps[adaptationStep]) {
                        return [adaptationStep-1, adaptationStep];

                    }

                    if(steps == me._possible_steps[adaptationStep]) {
                        return [adaptationStep-1, adaptationStep+1];

                    }
                }
            };

            return me._possible_steps.length;
        };

        me.decreaseSteps = function() {
            var nearestSurroundingsPossibleSteps = me.getNearestSurroundingsPossibleStep(me._core.getSteps());

            me._current_steps_index = nearestSurroundingsPossibleSteps[0];
        };

        me.increaseSteps = function() {
            var nearestSurroundingsPossibleSteps = me.getNearestSurroundingsPossibleStep(me._core.getSteps());

            me._current_steps_index = nearestSurroundingsPossibleSteps[1];
        };

        me.getSteps = function() {
            return me._possible_steps[me._current_steps_index];
        };

        me.isRun = function() {
            var isRunOnPostDraw = me._core.onPostDraw.IsRun(me._onPostDrawFuncIndex)
            var isRunOnCameraChangeStart = me._core.onCameraChangeStart.IsRun(me._onCameraChangeEndFuncIndex);
            var isRunOnCameraChangeEnd = me._core.onCameraChangeEnd.IsRun(me._onCameraChangeStartFuncIndex);

            return isRunOnPostDraw && isRunOnCameraChangeStart && isRunOnCameraChangeEnd;
        };

        me.isPause = function() {
            var isRunOnPostDraw = me._core.onPostDraw.IsRun(me._onPostDrawFuncIndex)
            var isRunOnCameraChangeStart = me._core.onCameraChangeStart.IsRun(me._onCameraChangeEndFuncIndex);
            var isRunOnCameraChangeEnd = me._core.onCameraChangeEnd.IsRun(me._onCameraChangeStartFuncIndex);

            return !isRunOnPostDraw && !isRunOnCameraChangeStart && isRunOnCameraChangeEnd;
        };

        me._numberOfChanges = 0;

        me.do = function(fps) {

            if( fps < 10 && me._current_steps_index > 0 ) {
                me._numberOfChanges--;
                // console.log(me._numberOfChanges, "< 15");
                if(me._numberOfChanges == -5) {
                    me.decreaseSteps();
                    console.log("FPS: " + fps + ", Number of steps: " + me.getSteps() );
                    me._numberOfChanges = 0;

                    me._core.setSteps( me.getSteps() );            
                }


            } else if( fps > 30 && me._current_steps_index < me._possible_steps.length-1 ) {
                me._numberOfChanges++;
                // console.log(me._numberOfChanges, "> 40");
                if(me._numberOfChanges == 3) {
                    me.increaseSteps();
                    console.log("FPS: " + fps + ", Number of steps: " + me.getSteps() );
                    me._numberOfChanges = 0;
                    me._core.setSteps( me.getSteps() );
                }

            }

        };

        return me;

    };

    namespace.AdaptationManager = AdaptationManager;

})(window.VRC);