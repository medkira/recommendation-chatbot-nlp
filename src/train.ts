const { NlpManager } = require("node-nlp");
const DomainManager = new NlpManager({ languages: ["en"], autoSave: false, });
const fs = require("fs");
const files = fs.readdirSync("./src/intents");


// ? Domain manager classifies user input into a domain. Depending on that domain, we start the specific model.
// ? enhance accurcy of understanding what user want.
const nlpDomainManager = async () => {
    // ? assign  off domain To DomainManager model
    let dataDomain = fs.readFileSync('src/corpus/off-domain/off.domain.json');
    dataDomain = JSON.parse(dataDomain);
    // console.log(dataDomain.data.length);
    dataDomain.data.map((obj: any) => {
        DomainManager.assignDomain("en", obj.intent, "OffDomain");
    })
    // ? off domain

    // ? assign  Interruption domain  To DomainManager model
    let InterruptionDomain = fs.readFileSync('src/corpus/interruption/intereption.json');
    InterruptionDomain = JSON.parse(InterruptionDomain);
    InterruptionDomain.data.map((obj: any) => {
        DomainManager.assignDomain("en", obj.intent, "InterruptionDomain");
    })
    // ? Interruptions domain



    // ?    ? assign  featureGather : restaurant domain  To DomainManager model
    let FeaturesGatherDomain = fs.readFileSync('src/corpus/interruption/intereption.json');
    FeaturesGatherDomain = JSON.parse(FeaturesGatherDomain);

    FeaturesGatherDomain.data.map((obj: any) => {
        DomainManager.assignDomain("en", obj.intent, "FeaturesGather");
    })
    // ? featureGather : restaurant domain


    // add utterances/ user inputs of each domain to domain manger
    const corpora = [
        'src/corpus/off-domain/off.domain.json',
        'src/corpus/interruption/intereption.json',
        './src/corpus/slot-recomendation/recomand.restaurant.json',
    ]
    DomainManager.addCorpora(corpora);


    // ? this code add  random phrases and words that could help and enhance
    // ? the domain manager(nlu-model) detect questions related to FeaturesGather
    for (const file of files) {
        let data = fs.readFileSync(`./src/intents/${file}`);
        data = JSON.parse(data);
        const intent = file.replace(".json", "");

        for (const question of data.questions) {
            DomainManager.addDocument("en", question, intent);
        }

    }
    DomainManager.assignDomain("en", "restaurant.preferences", "FeaturesGather");
    // ?                              intent                    domain


    await DomainManager.train();
    DomainManager.save("./src/models/domain_0.nlp");
}


// model for find place where model help user to find where he want to go 
const nlpFindPlace = async () => {
    const manager = new NlpManager({ languages: ["en"], autoSave: false, });

    const corpora = [
        'src/corpus/find-place/find-place.json'
    ]
    manager.addCorpora(corpora);
    await manager.train();
    manager.save("./src/models/findPlace.nlp");
}


const nlpRecommendRestaurant = async () => {

    const filename0 = "recomand.restaurant.json";


    const corpora = [
        `./src/corpus/slot-recomendation/${filename0}`,

    ]
    const manager = new NlpManager({ languages: ["en"], autoSave: false, });
    manager.addCorpora(corpora);
    await manager.train();
    manager.save("./src/models/recomendRestaurant-slot.nlp");

}


const nlpOffDomain = async () => {
    const corpora = [
        'src/corpus/off-domain/off.domain.json',
    ]
    const manager = new NlpManager({ languages: ["en"], autoSave: false, });
    manager.addCorpora(corpora);
    await manager.train();
    manager.save('./src/models/offDomain.nlp');

}

const nlpInterruption = async () => {
    const corpora = [
        'src/corpus/interruption/intereption.json'
    ]
    const manager = new NlpManager({ languages: ["en"], autoSave: false, });
    manager.addCorpora(corpora);
    await manager.train();

    manager.save('./src/models/Interruption.nlp');
}


async function train_save() {
    await nlpDomainManager()
    await nlpFindPlace();
    await nlpRecommendRestaurant();
    await nlpOffDomain();
    await nlpInterruption();
}


train_save();


