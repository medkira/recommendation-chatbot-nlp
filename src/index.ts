// Let's start with importing `NlpManager` from `node-nlp`. This will be responsible for training, saving, loading and processing.
const { NlpManager } = require("node-nlp");
console.log("Starting Chatbot ...");// Creating new Instance of NlpManager class.
const manager = new NlpManager({ languages: ["en"] });

const FeaturesGathermanager = new NlpManager({ languages: ["en"] });
FeaturesGathermanager.load('./src/models/recomendRestaurant-slot.nlp');


const context =
{
    // channel: undefined,
    // app: undefined,
    // from: null,
    // user_name_0: 'mohamed',
    // user_name: 'mohamed',
    // slotFill: undefined,
    // cuisine_0: 'Italian',
    // cuisine: 'Italian',
    // ambiance_0: 'Cozy',
    // ambiance: 'Cozy',
    // location_0: 'Downtown',
    // location: 'Downtown'

}




// Loading a module readline, this will be able to take input from the terminal.
var readline = require("readline");
var rl = readline.createInterface(process.stdin, process.stdout);


console.log("Chatbot started!");
// console.log("hi how i can help you for today");
rl.setPrompt("> ");
rl.prompt();
rl.on("line", async function (line: string) {
    manager.load("./src/models/domain_0.nlp");
    // console.log("chatbot domains", manager.nlp.getDomains());

    const response = await manager.process("en", line);

    const intentDomain = manager.getIntentDomain("en", response.intent);

    console.log("user response intent domain: ", intentDomain);
    if (intentDomain == "recomends") {
        manager.load('./src/models/recomend.nlp');
        const response = await manager.process("en", line);
        console.log(response.answer);

    } else if (intentDomain == "greetings") {
        manager.load('./src/models/greeting.nlp');
        const response = await manager.process("en", line, context);
        console.log(response.answer);

    }
    else if (intentDomain == "FeaturesGather") {
        // manager.load('./src/models/recomendRestaurant-slot.nlp');

        const response = await FeaturesGathermanager.process('en', line, context);
        console.log(response.answer);
        // console.log(response);
    } else {
        // console.log("no model available");
        // // run(line);

        const response = await FeaturesGathermanager.process('en', line, context);
        console.log(response.answer);
    }


    console.log("context: ", context);
    rl.prompt();
}).on("close", function () {
    process.exit(0);
});





// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI("AIzaSyADiwYJ1_yny9JBEMUlQr65QHwU-agSxYg");

// async function run() {
//     // For text-only input, use the gemini-pro model
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     // const prompt = "give me a json file with 50 resturant in tunisie monastire and with 8 attributes with google maps cordinent";
//     // const prompt = "write me a potention conversation between a chat bot recomandation ai and a user and put it json file with question and answers";
//     const prompt = "give me a json list with 10 restaurant in monastir with so many data that i can use in build a recomandation website ";

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     console.log(text);
// }

// run();
