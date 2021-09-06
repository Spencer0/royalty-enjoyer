var tickTime = 8.33333333;
var refreshRate = 16.6666667;
var GameEntity = /** @class */ (function () {
    function GameEntity() {
    }
    GameEntity.prototype.tick = function () { };
    ;
    return GameEntity;
}());
var GameInput = /** @class */ (function () {
    function GameInput() {
        this.inputs = {};
    }
    GameInput.prototype.getInputs = function () {
        return this.inputs;
    };
    GameInput.prototype.registerListeners = function () {
        var _this = this;
        document.addEventListener("keydown", function (e) {
            _this.inputs[e.key] = true;
        });
        window.addEventListener("click", function () {
            _this.inputs['exit'] = true;
        });
    };
    ;
    return GameInput;
}());
var GameState = /** @class */ (function () {
    function GameState(time) {
        this.entities = [];
        this.time = time;
    }
    GameState.prototype.handleInput = function (input) {
        console.log("State handling input...");
    };
    GameState.prototype.update = function () {
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            entity.tick();
        }
    };
    ;
    return GameState;
}());
;
var GameEngine = /** @class */ (function () {
    function GameEngine(state) {
        this.state = state;
        this.input = new GameInput();
    }
    GameEngine.prototype.initalize = function () {
        this.input.registerListeners();
        setInterval(this.run, tickTime);
    };
    GameEngine.prototype.run = function () {
        var running = true;
        while (running) {
            console.trace("tick");
            if (this.input.inputs) {
                var input = this.input.getInputs();
                state.handleInput(input);
                if (input['exit']) {
                    running = false;
                }
                this.input.inputs = {};
            }
            this.state.update();
        }
    };
    ;
    return GameEngine;
}());
//TODO: make this DI easier to work with
var state = new GameState(Date.now());
var engine = new GameEngine(state);
begin(engine);
function begin(engine) {
    engine.initalize();
}
