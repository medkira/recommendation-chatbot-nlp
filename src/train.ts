// Let's start with importing `NlpManager` from `node-nlp`. This will be responsible for training, saving, loading and processing.
const { NlpManager, Nlp } = require("node-nlp");
// Creating new Instance of NlpManager class.
const managerDomain = new NlpManager({ languages: ["en"], autoSave: false, });
const fs = require("fs");// Let's read all our intents files in the folder intents
const files = fs.readdirSync("./src/intents");// Looping through the files and Parsing the string to object and passing it to manager instance to train and process it.



for (const file of files) {
    let data = fs.readFileSync(`./src/intents/${file}`);
    data = JSON.parse(data);
    const intent = file.replace(".json", "");
    // console.log(intent);

    for (const question of data.questions) {
        managerDomain.addDocument("en", question, intent);
    }

    // for (const answer of data.answers) {
    //     manager.addAnswer("en", intent, answer);
    // }


    // todo: i need a function that loop throw the folder of the domain and extract the folder name(domain )
    // todo: and extract the file names(intents name)
    // todo: then call the assignDomain function and  inject it with the (local, intent, domain) 
    managerDomain.assignDomain("en", "greetings.bye", "greetings");
    managerDomain.assignDomain("en", "greetings.hello", "greetings");

    managerDomain.assignDomain("en", "recomend.place", "recomends");

    managerDomain.assignDomain("en", "user.name", "FeaturesGather");


    // ! test for slot filling 
    // managerDomain.assignDomain("en", "restaurant.recommendation", "slotRecomendation");

    managerDomain.assignDomain("en", "restaurant.preferences", "FeaturesGather");

}

const nlpRecommend = async () => {
    const { dockStart } = require('@nlpjs/basic');
    const manager = new NlpManager({ languages: ["en"], autoSave: false, });
    const filename = "recomend.place.json";
    const intent = filename.replace(".json", "");

    let data = fs.readFileSync(`./src/intents/${filename}`);
    data = JSON.parse(data);


    for (const question of data.questions) {
        manager.addDocument("en", question, intent);
    }

    for (const answer of data.answers) {
        manager.addAnswer("en", intent, answer);
    }




    await manager.train();
    manager.save("./src/models/recomend.nlp");
}

const nlpgreeting = async () => {
    // todo: the manger here is just an abstrection of the name nlp model
    // todo: so i need to create a new NlpManager instence evrey i call the class (trainModel)
    const manager = new NlpManager({ languages: ["en"], autoSave: false, });

    // todo: this need to be a method that extract the files(intents) from the folder(domain)
    // todo: a loop that extract the file names(intents)
    const filenames = ["greetings.bye.json", "greetings.hello.json"];


    // todo: this need to be method : i dont know what i shoud call it exactly.
    for (const file of filenames) {
        const intent = file.replace(".json", "");
        let data = fs.readFileSync(`./src/intents/${file}`);
        data = JSON.parse(data);

        for (const question of data.questions) {
            manager.addDocument("en", question, intent);
        }

        for (const answer of data.answers) {
            manager.addAnswer("en", intent, answer);
        }
    }


    await manager.train();
    manager.save("./src/models/greeting.nlp");
}


const nlpRecommendRestaurant = async () => {

    const { dockStart } = require('@nlpjs/basic');

    const filename = "recomand.restaurant.json";
    const filename2 = "gather-name.json";
    const filename3 = "gather-preferences-requirements.json";
    // const manager = new NlpManager({
    //     languages: ["en"], corpora: [
    //         `./src/slot-recomendation/${filename}`
    //     ],  use: ['Basic', 'LangEn'],
    // });
    const dock = await dockStart({
        settings: {
            nlp: {
                forceNER: true,
                languages: ['en'],
                corpora: [
                    `./src/slot-recomendation/${filename}`,
                    `./src/slot-name-gather/${filename2}`,
                    `./src/slot-preferences-requirements/${filename3}`,

                ]
            }
        },
        use: ['Basic', 'LangEn'],
    });
    const manager = dock.get('nlp');
    // let data = fs.readFileSync(`./src/slot-recomendation/${filename}`);
    // data = JSON.parse(data);

    // await manager.nlp.addData(data.data, "en", { "name": "slot-recomendation" });

    await manager.train();
    manager.save("./src/models/recomendRestaurant-slot.nlp");


    // (async () => {

    //     let text = await manager.process('i prefer italian cuisine');
    //     console.log(text.answer);
    //     text = await manager.process('i prefer cozy ambiance');
    //     console.log(text);

    // })();
}


async function train_save() {
    await nlpRecommend();
    await nlpRecommendRestaurant();
    await nlpgreeting();
    await managerDomain.train();
    managerDomain.save("./src/models/domain_0.nlp");
}


train_save();


