const { NlpManager, } = require("node-nlp");

console.log("Starting Chatbot ...");

// ? Domain manager classifies user input into a domain. Depending on that domain, we start the specific model.
// ? enhance accurcy of understanding what user want.
const DomainManager = new NlpManager({ languages: ["en"] });

// ? we can get this context from database and inject it into the models
// ? e.g :  in off domain model => intent of greeting.hello will ge slot filled with user_name entitie
const context =
{
    // channel: undefined,
    // app: undefined,
    // from: null,
    // user_name: '',
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


var readline = require("readline");
var rl = readline.createInterface(process.stdin, process.stdout);


console.log("Chatbot started!");
rl.setPrompt("> ");
rl.prompt();
rl.on("line", async function (line: string) {
    if (line.trim() === "close") {
        rl.close();
        return;
    }

    DomainManager.load("./src/models/domain_0.nlp");
    // console.log("chatbot domains", DomainManager.nlp.getDomains());
    const response = await DomainManager.process("en", line);
    // console.log("RESPONSE", response)
    const intentDomain = DomainManager.getIntentDomain("en", response.intent);

    console.log("user response intent domain: ", intentDomain);


    if (intentDomain == "FeaturesGather") {
        const FeaturesGathermanager = new NlpManager({ languages: ["en"] });
        FeaturesGathermanager.load('./src/models/recomendRestaurant-slot.nlp');
        const response = await FeaturesGathermanager.process('en', line, context);
        console.log(response.answer);

    } else if (intentDomain == "InterruptionDomain") {

        // ? Interruption model is useful when user response with unexpected response 
        // ? e.g : we expect user to give use his age but he response recommend me restaurent
        const InterruptionModel = new NlpManager({ languages: ["en"] });

        InterruptionModel.load('./src/models/interruption.nlp');

        // ? this action : to change the conversation context from recommendation normal e.g to recommend something hala
        // ? **conversation context in the same model**
        InterruptionModel.addAction('halal.restaurant.preferences', 'changeContext', [], async (data: any) => {
            if (data.context && data.context.slotFill) {
                data.context.slotFill = {
                    localeIso2: 'en',
                    intent: data.intent,
                    entities: data.context.slotFill.entities, // ? here happen the change
                    // answer: undefined,
                    // srcAnswer: undefined,
                    // currentSlot: 'cuisine'
                };
            }
            return data;
        });

        const response = await InterruptionModel.process("en", line, context);
        console.log(response.answer);


    } else if (intentDomain == "OffDomain") {
        const manager = new NlpManager({ languages: ["en"] });
        manager.load('./src/models/offDomain.nlp');
        const response = await manager.process("en", line, context);
        console.log(response.answer);

    } else {
        /// extreme case if domain manager returns default domain! we can use AI API like google gemini
    }

    // console.log("context: ", context);
    rl.prompt();
}).on("close", function () {
    process.exit(0);
});

