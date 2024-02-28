// Let's start with importing `NlpManager` from `node-nlp`. This will be responsible for training, saving, loading and processing.
// const { NlpManager } = require("node-nlp");
const { NlpManager, } = require("node-nlp");

console.log("Starting Chatbot ...");// Creating new Instance of NlpManager class.
const manager = new NlpManager({ languages: ["en"] });

const FeaturesGathermanager = new NlpManager({ languages: ["en"] });
FeaturesGathermanager.load('./src/models/recomendRestaurant-slot.nlp');


const FindPlaceModel = new NlpManager({ languages: ["en"] });
FindPlaceModel.load('./src/models/findPlace.nlp');

const TestAction = new NlpManager({ languages: ["en"], executeActionsBeforeAnswers: true });
TestAction.load('./src/models/actiontest.nlp');


const context =
{
    // channel: undefined,
    // app: undefined,
    // from: null,
    // user_name_0: 'mohamed',
    user_name: 'mohamed',
    // slotFill: undefined,
    // cuisine_0: 'Italian',
    // cuisine: 'Italian',
    // ambiance_0: 'Cozy',
    // ambiance: 'Cozy',
    // location_0: 'Downtown',
    // location: 'Downtown'
    // time: '11:17:37 PM'

}




// Loading a module readline, this will be able to take input from the terminal.
var readline = require("readline");
var rl = readline.createInterface(process.stdin, process.stdout);


console.log("Chatbot started!");
// console.log("hi how i can help you for today");z
rl.setPrompt("> ");
rl.prompt();
rl.on("line", async function (line: string) {
    if (line.trim() === "close") {
        rl.close();
        return;
    }


    // manager.load("./src/models/domain_0.nlp");
    // console.log("chatbot domains", manager.nlp.getDomains());

    // const response = await manager.process("en", line);
    // console.log("RESPONSE", response)
    // const intentDomain = manager.getIntentDomain("en", response.intent);

    // console.log("user response intent domain: ", intentDomain);
    TestAction.addAction('whatTimeIsIt', 'handleWhatsTimeAction', [], async (data: any, locale: any) => {
        console.log(data.context.entities?.cuntry?.option ?? "")
        console.log("i am working");
        const res = new Date().toLocaleTimeString((data.context.entities?.cuntry?.option ?? "en-US"));
        data.context.time = res;
        // data.context.test = data.context.cuntry;

        // console.log("DATA", data)
        console.log(data)
        // console.log("we can do anything here");
        return data;
    });


    if (true) {
        const response = await TestAction.process('en', line, context);

        const actions = await TestAction.getActions("whatTimeIsIt")
        // console.log(actions)
        // console.log("--------------------------------------------------------------------------------------------------------")
        console.log(response.answer);
    }
    // if (intentDomain == "recomends") {
    //     manager.load('./src/models/recomend.nlp');
    //     const response = await manager.process("en", line);
    //     console.log(response.answer);

    // } else if (intentDomain == "greetings") {
    //     manager.load('./src/models/greeting.nlp');
    //     const response = await manager.process("en", line, context);
    //     console.log(response.answer);

    // }
    // else if (intentDomain == "FeaturesGather") {
    //     // manager.load('./src/models/recomendRestaurant-slot.nlp');

    //     const response = await FeaturesGathermanager.process('en', line, context);
    //     console.log(response.answer);
    //     // console.log(response);
    // } else if (intentDomain == "FindPlace") {
    //     const response = await FindPlaceModel.process('en', line, context);
    //     console.log(response.answer);
    // } else {
    //     console.log("no model available");

    //     const response = await FeaturesGathermanager.process('en', line, context);
    //     console.log(response.answer);
    // }


    // console.log("context: ", context);
    rl.prompt();
}).on("close", function () {
    process.exit(0);
});

