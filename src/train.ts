const { NlpManager } = require("node-nlp");
const managerDomain = new NlpManager({ languages: ["en"], autoSave: false, });
const fs = require("fs");
const files = fs.readdirSync("./src/intents");

// ? off domain
let dataDomain = fs.readFileSync('src/corpus/off.domain.json');
dataDomain = JSON.parse(dataDomain);
// console.log(dataDomain.data.length);
dataDomain.data.map((obj: any) => {
    managerDomain.assignDomain("en", obj.intent, "OffDomain");
})
// ? off domain

// ? intereption domain 
let intereptionDomain = fs.readFileSync('src/corpus/intereption/intereption.json');
intereptionDomain = JSON.parse(intereptionDomain);
intereptionDomain.data.map((obj: any) => {
    managerDomain.assignDomain("en", obj.intent, "IntereptionDomain");
})
// ? intereptions domain


const corpora = [
    'src/corpus/off.domain.json',
    'src/slot-recomendation/recomand.restaurant2.json',
    'src/corpus/intereption/intereption.json'
]
managerDomain.addCorpora(corpora);


for (const file of files) {
    let data = fs.readFileSync(`./src/intents/${file}`);
    data = JSON.parse(data);
    const intent = file.replace(".json", "");

    for (const question of data.questions) {
        managerDomain.addDocument("en", question, intent);
    }

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
    // const { dockStart } = require('@nlpjs/basic');
    const manager = new NlpManager({ languages: ["en"], autoSave: false, });
    // const filename = "find.place.json";
    // const intent = filename.replace(".json", "");

    // let data = fs.readFileSync(`./src/intents/${filename}`);
    // data = JSON.parse(data);


    // for (const question of data.questions) {
    //     manager.addDocument("en", question, intent);
    // }

    // for (const answer of data.answers) {
    //     manager.addAnswer("en", intent, answer);
    // }

    const corpora = [
        'src/find-place/find-place.json'
    ]
    manager.addCorpora(corpora);
    await manager.train();
    manager.save("./src/models/findPlace.nlp");
}

// const nlpRecommend = async () => {
//     const { dockStart } = require('@nlpjs/basic');
//     const manager = new NlpManager({ languages: ["en"], autoSave: false, });
//     const filename = "recomend.place.json";
//     const intent = filename.replace(".json", "");

//     let data = fs.readFileSync(`./src/intents/${filename}`);
//     data = JSON.parse(data);


//     for (const question of data.questions) {
//         manager.addDocument("en", question, intent);
//     }

//     for (const answer of data.answers) {
//         manager.addAnswer("en", intent, answer);
//     }




//     await manager.train();
//     manager.save("./src/models/recomend.nlp");
// }


const nlpRecommendRestaurant = async () => {
    const { dockStart } = require('@nlpjs/basic');

    const filename0 = "recomand.restaurant.json";
    const filename1 = "recomand.restaurant1.json";
    const filename2 = "recomand.restaurant2.json";
    const filename3 = "recomand.restaurant3.json";
    const filename4 = "recomand.movie.json"
    // const filename5 = "gather-preferences-requirements.json";


    // const dock = await dockStart({
    //     settings: {
    //         nlp: {
    //             trainByDomain: true,
    //             forceNER: true,
    //             languages: ['en'],
    //             corpora: [
    //                 `./src/slot-recomendation/${filename0}`,
    //                 `./src/slot-recomendation/${filename1}`,
    //                 `./src/slot-recomendation/${filename2}`,
    //                 `./src/slot-recomendation/${filename3}`,
    //                 `./src/slot-recomendation/${filename4}`,
    //             ]
    //         }
    //     },
    //     use: ['Basic', 'LangEn'],
    // });
    // const manager = dock.get('nlp');


    const corpora = [
        // `./src/slot-recomendation/${filename0}`,
        // `./src/slot-recomendation/${filename1}`,
        `./src/slot-recomendation/${filename2}`,
        `./src/slot-recomendation/${filename3}`,
        // `./src/slot-recomendation/${filename4}`,

    ]
    const manager = new NlpManager({ languages: ["en"], autoSave: false, });
    manager.addCorpora(corpora);
    await manager.train();
    manager.save("./src/models/recomendRestaurant-slot.nlp");
    // manager.registerActionFunction('handleWhatsTimeAction', async (data: any, locale: any) => {
    //     const res = new Date().toLocaleTimeString(locale);
    //     data.context.time = res;
    //     return data;
    // });
}



const nlpTestAction = async () => {

    const { dockStart } = require('@nlpjs/basic');

    const filename0 = "test.json";

    // const dock = await dockStart({
    //     settings: {
    //         nlp: {
    //             forceNER: true,
    //             languages: ['en'],
    //             corpora: [
    //                 `./src/testAction/${filename0}`,
    //             ]
    //         }
    //     },
    //     use: ['Basic', 'LangEn'],
    // });
    // const manager = dock.get('nlp');
    const corpora = [
        `./src/testAction/${filename0}`,
    ]
    const manager = new NlpManager({ languages: ["en"], autoSave: false, });
    manager.addCorpora(corpora);

    await manager.train();

    manager.save('./src/models/actiontest.nlp');


}

const nlpOffDomain = async () => {
    const corpora = [
        'src/corpus/off.domain.json',
    ]
    const manager = new NlpManager({ languages: ["en"], autoSave: false, });
    manager.addCorpora(corpora);
    await manager.train();
    manager.save('./src/models/offDomain.nlp');


}

const nlpIntereption = async () => {
    const corpora = [
        'src/corpus/intereption/intereption.json'
    ]
    const manager = new NlpManager({ languages: ["en"], autoSave: false, });
    manager.addCorpora(corpora);
    await manager.train();

    manager.save('./src/models/intereption.nlp');
}


async function train_save() {
    await nlpFindPlace();
    await nlpRecommendRestaurant();
    await nlpgreeting();
    await nlpTestAction();
    await nlpOffDomain();
    await nlpIntereption();
    await managerDomain.train();
    managerDomain.save("./src/models/domain_0.nlp");
}


train_save();








// for (const intent of data.intent) {
//     managerDomain.assignDomain("en", intent, "OffDomain");
// }



// for (const answer of data.answers) {
//     manager.addAnswer("en", intent, answer);
// }





// const filename1 = "recomand.restaurant1.json";
// const filename2 = "recomand.restaurant2.json";
// const filename3 = "recomand.restaurant3.json";

// const filename4 = "recomand.movie.json"
// const filename5 = "gather-preferences-requirements.json";
// manager.registerActionFunction('handleWhatsTimeAction', async (data: any, locale: any) => {
//     const res = new Date().toLocaleTimeString(locale);
//     data.context.time = res;
//     return data;
// });
// manager.addAction('whatTimeIsIt', 'handleWhatsTimeAction', ['en-US', 'parameter 2'], async (data, locale) => {
//     // Inject a new entitiy into context used for answer generation
//     data.context.time = new Date().toLocaleTimeString(locale);
//     return data;
// });