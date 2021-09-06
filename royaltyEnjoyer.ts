const tickTime = 8.33333333;
const refreshRate = 16.6666667;

class GameEntity {
    tick() { };
}

class GameInput {

    public inputs: {} = {};

    getInputs() {
        return this.inputs;
    }

    registerListeners() { 
        document.addEventListener("keydown",(e) => {
            this.inputs[e.key] = true;
        });
        window.addEventListener("click", () => {
            this.inputs['exit'] = true;
          });
    };
}

class GameState {

    time: number; //THIS IS THE TIME IN MILISECONDS SINCE THE LAST UPDATE OF STATE
    entities: GameEntity[] = [];

    constructor(time: number) {
        this.time = time;
    }

    handleInput(input: {}) {
        console.log("State handling input...");
    }

    update() {
        for (const entity of this.entities) {
            entity.tick();
        }
    };
};
class GameEngine {

    state: GameState;
    input: GameInput;

    constructor(state: GameState) {
        this.state = state;
        this.input = new GameInput();
    }

    initalize() {
        this.input.registerListeners();
        setInterval(this.run, tickTime); 
    }

    run() {
        let running: boolean = true;
        while(running){
            console.trace("tick");
            if(this.input.inputs){
                const input = this.input.getInputs();
                state.handleInput(input);
                if(input['exit']){
                    running  = false;
                }
                this.input.inputs = {};
            }
            this.state.update();
        }
    };
}




//TODO: make this DI easier to work with
const state: GameState = new GameState(Date.now());
const engine: GameEngine = new GameEngine(state);
begin(engine);

function begin(engine: GameEngine) {
    engine.initalize();
}