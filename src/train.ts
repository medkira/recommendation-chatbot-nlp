// Let's start with importing `NlpManager` from `node-nlp`. This will be responsible for training, saving, loading and processing.
const { NlpManager } = require("node-nlp");
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

    managerDomain.assignDomain("en", "find.place", "FindPlace");

    // ! test for slot filling 
    managerDomain.assignDomain("en", "recomand.restaurant", "FeaturesGather");
    managerDomain.assignDomain("en", "restaurant.preferences", "FeaturesGather");

    managerDomain.assignDomain("en", "restaurant.recommendation", "slotRecomendation");
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


// model for find place where model help user to find where he want to go
const nlpFindPlace = async () => {
    const { dockStart } = require('@nlpjs/basic');
    const manager = new NlpManager({ languages: ["en"], autoSave: false, });
    const filename = "find.place.json";
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
    manager.save("./src/models/findPlace.nlp");
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


const nlpRecommendRestaurant = async () => {
    const { dockStart } = require('@nlpjs/basic');

    const filename0 = "recomand.restaurant.json";
    const filename1 = "recomand.restaurant1.json";
    const filename2 = "recomand.restaurant2.json";
    const filename3 = "recomand.restaurant3.json";

    const filename4 = "recomand.movie.json"
    const filename5 = "gather-preferences-requirements.json";
    const dock = await dockStart({
        settings: {
            nlp: {
                forceNER: true,
                languages: ['en'],
                corpora: [
                    `./src/slot-recomendation/${filename0}`,
                    `./src/slot-recomendation/${filename1}`,
                    `./src/slot-recomendation/${filename2}`,
                    `./src/slot-recomendation/${filename3}`,
                    `./src/slot-recomendation/${filename4}`,

                ]
            }
        },
        use: ['Basic', 'LangEn'],
    });
    const manager = dock.get('nlp');

    await manager.train();
    manager.save("./src/models/recomendRestaurant-slot.nlp");

}





const nlpTestAction = async () => {

    const { dockStart } = require('@nlpjs/basic');

    const filename0 = "test.json";
    // const filename1 = "recomand.restaurant1.json";
    // const filename2 = "recomand.restaurant2.json";
    // const filename3 = "recomand.restaurant3.json";

    // const filename4 = "recomand.movie.json"
    // const filename5 = "gather-preferences-requirements.json";
    const dock = await dockStart({
        settings: {
            nlp: {
                forceNER: true,
                languages: ['en'],
                corpora: [
                    `./src/testAction/${filename0}`,
                ]
            }
        },
        use: ['Basic', 'LangEn'],
    });
    const manager = dock.get('nlp');

    // manager.registerActionFunction('handleWhatsTimeAction', async (data: any, locale: any) => {
    //     const res = new Date().toLocaleTimeString(locale);
    //     data.context.time = res;
    //     return data;
    // });
    await manager.train();

    // manager.addAction('whatTimeIsIt', 'handleWhatsTimeAction', ['en-US', 'parameter 2'], async (data, locale) => {
    //     // Inject a new entitiy into context used for answer generation
    //     data.context.time = new Date().toLocaleTimeString(locale);
    //     return data;
    // });
    manager.save('./src/models/actiontest.nlp');

    // const res = await manager.process("what time is it ")
    // console.log("res", res.answer);
}




async function train_save() {
    // await nlpRecommend();
    // await nlpFindPlace();
    // await nlpRecommendRestaurant();
    await nlpgreeting();
    await nlpTestAction();
    await managerDomain.train();
    managerDomain.save("./src/models/domain_0.nlp");
}


train_save();


