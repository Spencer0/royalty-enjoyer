var tickTime = 100;
var refreshRate = 16.6666667;
var EntityType;
(function (EntityType) {
    EntityType["Villager"] = "villager";
    EntityType["Mill"] = "mill";
    EntityType["Armory"] = "armory";
    EntityType["Shop"] = "shop";
})(EntityType || (EntityType = {}));
var GameEntity = /** @class */ (function () {
    function GameEntity(type) {
        this.profitMapping = {
            "villager": 1,
            "shop": 2,
            "armory": 3,
            "mill": 4
        };
        this.quantity = 1;
        this.type = type;
        console.log("spawned " + type);
    }
    //Return any values you have generated in this tick
    GameEntity.prototype.tick = function () {
        var generatedResources = {
            gold: this.profitMapping[this.type] * this.quantity,
            exp: 1 * this.quantity
        };
        return generatedResources;
    };
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
    GameInput.prototype.clearInputs = function () {
        this.inputs = {};
    };
    GameInput.prototype.registerListeners = function () {
        var _this = this;
        document.addEventListener("keydown", function (e) {
            _this.inputs[e.key] = true;
        });
        window.addEventListener("click", function () {
            _this.inputs['click'] = true;
        });
    };
    ;
    return GameInput;
}());
var GameShop = /** @class */ (function () {
    function GameShop() {
        this.costMapping = {
            "villager": 10,
            "shop": 50,
            "armory": 150,
            "mill": 500
        };
    }
    GameShop.prototype.chargeForPurchase = function (entityType, resources) {
        var cost = this.costMapping[entityType];
        console.log("computing cost for.." + entityType + " : " + cost);
        if (resources.gold >= cost) {
            resources.gold -= cost;
            this.costMapping[entityType] = this.costMapping[entityType] * 2;
            return true;
        }
        return false;
    };
    return GameShop;
}());
var GameState = /** @class */ (function () {
    function GameState(time) {
        this.time = time;
        this.shop = new GameShop();
        this.resources = {
            gold: 10,
            exp: 0
        };
        this.entities = {};
    }
    GameState.prototype.handleInput = function (input) {
        for (var event_1 in input) {
            if (event_1 == "v") {
                console.log("adding villager..");
                this.addEntity(EntityType.Villager);
            }
            if (event_1 == "s") {
                console.log("adding shop..");
                this.addEntity(EntityType.Shop);
            }
            if (event_1 == "a") {
                console.log("adding arm..");
                this.addEntity(EntityType.Armory);
            }
            if (event_1 == "m") {
                console.log("adding mill..");
                this.addEntity(EntityType.Mill);
            }
        }
    };
    GameState.prototype.addEntity = function (entityType) {
        var didBuyEntity = this.shop.chargeForPurchase(entityType, this.resources);
        if (!didBuyEntity) {
            return;
        }
        if (this.entities[entityType]) {
            console.log("found entity, adding one.." + JSON.stringify(this.entities[entityType]));
            this.entities[entityType].quantity += 1;
            console.log("found entity, added one.." + JSON.stringify(this.entities[entityType]));
        }
        else {
            var newEntity = new GameEntity(entityType);
            console.log("spawning new entity.." + JSON.stringify(newEntity));
            this.entities[entityType] = newEntity;
        }
    };
    GameState.prototype.update = function () {
        for (var entity in this.entities) {
            var newResources = this.entities[entity].tick();
            this.resources.gold += newResources.gold;
            this.resources.exp += newResources.exp;
        }
        this.drawState();
    };
    ;
    GameState.prototype.drawState = function () {
        var popCount = {
            "villager": "0",
            "shop": "0",
            "mill": "0",
            "armory": "0"
        };
        if (this.entities[EntityType.Villager]) {
            popCount.villager = this.entities[EntityType.Villager].quantity.toString();
        }
        if (this.entities[EntityType.Shop]) {
            popCount.shop = this.entities[EntityType.Shop].quantity.toString();
        }
        if (this.entities[EntityType.Armory]) {
            popCount.mill = this.entities[EntityType.Armory].quantity.toString();
        }
        if (this.entities[EntityType.Mill]) {
            popCount.armory = this.entities[EntityType.Mill].quantity.toString();
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
            <td>" + this.shop.costMapping[EntityType.Villager] + "</td>\
            <td>V</td>\
        </tr>\
        <tr>\
            <td>Shop</td>\
            <td>" + this.shop.costMapping[EntityType.Shop] + "</td>\
            <td>S</td>\
        </tr>\
        <tr>\
            <td>Mill</td>\
            <td>" + this.shop.costMapping[EntityType.Mill] + "</td>\
            <td>M</td>\
        </tr>\
        <tr>\
            <td>Armory</td>\
            <td>" + this.shop.costMapping[EntityType.Armory] + "</td>\
            <td>A</td>\
        </tr>\
        </table>";
    };
    return GameState;
}());
;
var GameEngine = /** @class */ (function () {
    function GameEngine(state) {
        this.state = state;
        this.input = new GameInput();
        this.running = true;
        console.log(this);
    }
    GameEngine.prototype.initalize = function () {
        var _this = this;
        console.log(this);
        this.input.registerListeners();
        setInterval(function () { return _this.run(_this); }, tickTime);
    };
    GameEngine.prototype.run = function (context) {
        if (!context.running) {
            return;
        }
        var input = context.input.getInputs();
        if (input) {
            console.log("tick");
            //Update all entities on the screen via input
            state.handleInput(input);
            //Special input case that needs to be handled at the loop level
            if (input['Escape']) {
                context.running = false;
            }
            //Clear out input list
            context.input.clearInputs();
        }
        //Update all entities on the screen via tick
        context.state.update();
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
