const tickTime = 100;
const refreshRate = 16.6666667;

type GameResource = {
    gold: number,
    exp: number,
}

enum EntityType {
    Villager = "villager",
    Mill = "mill",
    Armory = "armory",
    Shop = "shop",
}




class GameEntity {
    quantity: number;
    type: EntityType; 

    profitMapping = {
        "villager" : 1,
        "shop" : 2,
        "armory" : 3,
        "mill": 4
    }

    constructor(type: EntityType){
        this.quantity = 1;
        this.type = type;
        console.log("spawned " + type);
    }

    //Return any values you have generated in this tick
    tick(): GameResource { 
        const generatedResources = {
            gold: this.profitMapping[this.type] * this.quantity,
            exp: 1 * this.quantity
        }
        return generatedResources;
    };
}

class GameInput {
    public inputs: {} = {};

    getInputs() {
        return this.inputs;
    }

    clearInputs() {
        this.inputs = {};
    }

    registerListeners() { 
        document.addEventListener("keydown",(e) => {
            this.inputs[e.key] = true;
        });

        window.addEventListener("click", () => {
            this.inputs['click'] = true;
        });
    };
}
class GameShop {
    costMapping = {
        "villager" : 10,
        "shop" : 50,
        "armory" : 150,
        "mill": 500
    }

    chargeForPurchase(entityType: EntityType, resources: GameResource) : boolean{
        const cost = this.costMapping[entityType];
        console.log("computing cost for.." + entityType + " : " + cost);
        if(resources.gold >= cost){
            resources.gold -= cost;
            this.costMapping[entityType] = this.costMapping[entityType] * 2;
            return true;
        }
        return false; 
    }
    
}
class GameState {

    time: number; //THIS IS THE TIME IN MILISECONDS SINCE THE LAST UPDATE OF STATE
    entities: Record<string, GameEntity>;
    resources: GameResource;
    shop: GameShop;

    constructor(time: number) {
        this.time = time;
        this.shop = new GameShop();
        this.resources = {
            gold: 10,
            exp: 0
        }
        this.entities = {};
    }

    handleInput(input: Record<string, boolean>) {
        for(const event in input){
            if(event == "v"){
                console.log("adding villager..");
                this.addEntity(EntityType.Villager);
            }
            if(event == "s"){
                console.log("adding shop..");
                this.addEntity(EntityType.Shop);
            }
            if(event == "a"){
                console.log("adding arm..");
                this.addEntity(EntityType.Armory);
            }
            if(event == "m"){
                console.log("adding mill..");
                this.addEntity(EntityType.Mill);
            }
        }
    }


    addEntity(entityType: EntityType){

        const didBuyEntity = this.shop.chargeForPurchase(entityType, this.resources);
        if(!didBuyEntity) { return; }

        if(this.entities[entityType]){
            console.log("found entity, adding one.." + JSON.stringify(this.entities[entityType]));
            this.entities[entityType].quantity += 1;
            console.log("found entity, added one.." + JSON.stringify(this.entities[entityType]));
        }else{
            const newEntity : GameEntity = new GameEntity(entityType);
            console.log("spawning new entity.." + JSON.stringify(newEntity));
            this.entities[entityType] = newEntity;
        }
    }

    update() {
        for (const entity in this.entities) {
            const newResources = this.entities[entity].tick();
            this.resources.gold += newResources.gold;
            this.resources.exp += newResources.exp;
        }
        this.drawState();
    };

    drawState(){
        const popCount = {
            "villager": "0",
            "shop": "0",
            "mill": "0",
            "armory" :"0",
        }
        if(this.entities[EntityType.Villager]){
            popCount.villager = this.entities[EntityType.Villager].quantity.toString()
        }
        if(this.entities[EntityType.Shop]){
            popCount.shop = this.entities[EntityType.Shop].quantity.toString()
        }
        if(this.entities[EntityType.Armory]){
            popCount.mill = this.entities[EntityType.Armory].quantity.toString()
        }
        if(this.entities[EntityType.Mill]){
            popCount.armory = this.entities[EntityType.Mill].quantity.toString()
        }
        document.body.innerHTML = "";
        document.body.innerHTML = " <br> \
        <table> \
        <tr>\
            <th>Production</th>\
        </tr>\
        <tr>\
            <td>Villager</td>\
            <td>" + popCount[EntityType.Villager] + " </td>\
        </tr>\
        <tr>\
            <td>Shop</td>\
            <td>" + popCount[EntityType.Shop] + " </td>\
        </tr>\
        <tr>\
            <td>Mill</td>\
            <td>" + popCount[EntityType.Mill] + " </td>\
        </tr>\
        <tr>\
            <td>Armory</td>\
            <td>" + popCount[EntityType.Armory] + " </td>\
        </tr>\
        </table>\
        <br> \
        <br> \
        <b> gold : " + this.resources.gold + " </b> \
        <b> exp : " + this.resources.exp + " </b>\
        <br> \
        <br> \
        <br> \
        <br> \
        <br> \
        <br> \
        <table> \
        <tr>\
            <th>Shop</th>\
            <th>Cost</th>\
            <th>Hotkey</th>\
        </tr>\
        <tr>\
            <td>Villager</td>\
            <td>"+this.shop.costMapping[EntityType.Villager]+"</td>\
            <td>V</td>\
        </tr>\
        <tr>\
            <td>Shop</td>\
            <td>"+this.shop.costMapping[EntityType.Shop]+"</td>\
            <td>S</td>\
        </tr>\
        <tr>\
            <td>Mill</td>\
            <td>"+this.shop.costMapping[EntityType.Mill]+"</td>\
            <td>M</td>\
        </tr>\
        <tr>\
            <td>Armory</td>\
            <td>"+this.shop.costMapping[EntityType.Armory]+"</td>\
            <td>A</td>\
        </tr>\
        </table>";
    }


};

class GameEngine {

    state: GameState;
    input: GameInput;
    running: boolean;

    constructor(state: GameState) {
        this.state = state;
        this.input = new GameInput();
        this.running = true;
        console.log(this);
    }

    initalize() {
        console.log(this);
        this.input.registerListeners();
        setInterval(() => this.run(this), tickTime); 
    }

    run(context) {
        if(!context.running){
            return;
        }
        const input = context.input.getInputs();
        if(input){
            console.log("tick");

            //Update all entities on the screen via input
            state.handleInput(input);

            //Special input case that needs to be handled at the loop level
            if(input['Escape']){
                context.running  = false;
            }

            //Clear out input list
            context.input.clearInputs();
        }

        //Update all entities on the screen via tick
        context.state.update();
    };
}

//TODO: make this DI easier to work with
const state: GameState = new GameState(Date.now());
const engine: GameEngine = new GameEngine(state);
begin(engine);

function begin(engine: GameEngine) {
    engine.initalize();
}