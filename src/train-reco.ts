// const { dockStart } = require('@nlpjs/basic');

// (async () => {
//     const dock = await dockStart({
//         settings: {
//             nlp: {
//                 forceNER: true,
//                 languages: ['en'],
//                 corpora: [
//                     "./src/intents-for-recomendation/recomand.convo.json"
//                 ]
//             }
//         },
//         use: ['Basic', 'BuiltinMicrosoft', 'LangEn'],
//     });

//     // Register Builtins to parse dates automatically
//     const builtin = dock.get('builtin-microsoft');
//     const ner = dock.get('ner');
//     ner.container.register('extract-builtin-??', builtin, true);

//     const manager = dock.get('nlp');

//     // Train the network
//     await manager.train();
//     manager.save();

//     // const context = {};
//     // const result = await manager.process('en', 'I want to travel to Madrid tomorrow', context);
//     // console.log(JSON.stringify(result, null, 2));
//     // const result2 = await manager.process('en', 'From Berlin', context);
//     // console.log(JSON.stringify(result2, null, 2));

// })();



const { containerBootstrap } = require('@nlpjs/core');
const { DomainManager, NluNeural } = require('@nlpjs/nlu');
const { LangEn } = require('@nlpjs/lang-en');
const fs = require('fs');



function addFoodDomain(manager: any) {
    manager.add('food', 'what do I have in my basket', 'order.check');
    manager.add('food', 'check my cart', 'order.check');
    manager.add('food', "show me what I've ordered", 'order.check');
    manager.add('food', "what's in my basket", 'order.check');
    manager.add('food', 'check my order', 'order.check');
    manager.add('food', 'check what I have ordered', 'order.check');
    manager.add('food', 'show my order', 'order.check');
    manager.add('food', 'check my basket', 'order.check');
    manager.add('food', 'how soon will it be delivered', 'order.check_status');
    manager.add('food', 'check the status of my delivery', 'order.check_status');
    manager.add('food', 'when should I expect delivery', 'order.check_status');
    manager.add(
        'food',
        'what is the status of my delivery',
        'order.check_status'
    );
    manager.add('food', 'check my order status', 'order.check_status');
    manager.add('food', 'where is my order', 'order.check_status');
    manager.add('food', 'where is my delivery', 'order.check_status');
    manager.add('food', 'status of my order', 'order.check_status');
}

function addPersonalityDomain(manager: any) {
    manager.add('personality', 'say about you', 'agent.acquaintance');
    manager.add('personality', 'why are you here', 'agent.acquaintance');
    manager.add('personality', 'what is your personality', 'agent.acquaintance');
    manager.add('personality', 'describe yourself', 'agent.acquaintance');
    manager.add('personality', 'tell me about yourself', 'agent.acquaintance');
    manager.add('personality', 'tell me about you', 'agent.acquaintance');
    manager.add('personality', 'what are you', 'agent.acquaintance');
    manager.add('personality', 'who are you', 'agent.acquaintance');
    manager.add('personality', 'talk about yourself', 'agent.acquaintance');
    manager.add('personality', 'your age', 'agent.age');
    manager.add('personality', 'how old is your platform', 'agent.age');
    manager.add('personality', 'how old are you', 'agent.age');
    manager.add('personality', "what's your age", 'agent.age');
    manager.add('personality', "I'd like to know your age", 'agent.age');
    manager.add('personality', 'tell me your age', 'agent.age');
    manager.add('personality', "you're annoying me", 'agent.annoying');
    manager.add('personality', 'you are such annoying', 'agent.annoying');
    manager.add('personality', 'you annoy me', 'agent.annoying');
    manager.add('personality', 'you are annoying', 'agent.annoying');
    manager.add('personality', 'you are irritating', 'agent.annoying');
    manager.add('personality', 'you are annoying me so much', 'agent.annoying');
    manager.add('personality', "you're bad", 'agent.bad');
    manager.add('personality', "you're horrible", 'agent.bad');
    manager.add('personality', "you're useless", 'agent.bad');
    manager.add('personality', "you're waste", 'agent.bad');
    manager.add('personality', "you're the worst", 'agent.bad');
    manager.add('personality', 'you are a lame', 'agent.bad');
    manager.add('personality', 'I hate you', 'agent.bad');
    manager.add('personality', 'be more clever', 'agent.beclever');
    manager.add('personality', 'can you get smarter', 'agent.beclever');
    manager.add('personality', 'you must learn', 'agent.beclever');
    manager.add('personality', 'you must study', 'agent.beclever');
    manager.add('personality', 'be clever', 'agent.beclever');
    manager.add('personality', 'be smart', 'agent.beclever');
    manager.add('personality', 'be smarter', 'agent.beclever');
    manager.add('personality', 'you are looking awesome', 'agent.beautiful');
    manager.add('personality', "you're looking good", 'agent.beautiful');
    manager.add('personality', "you're looking fantastic", 'agent.beautiful');
    manager.add('personality', 'you look greet today', 'agent.beautiful');
    manager.add('personality', "I think you're beautiful", 'agent.beautiful');
    manager.add('personality', 'you look amazing today', 'agent.beautiful');
    manager.add('personality', "you're so beautiful today", 'agent.beautiful');
    manager.add('personality', 'you look very pretty', 'agent.beautiful');
    manager.add('personality', 'you look pretty good', 'agent.beautiful');
    manager.add('personality', 'when is your birthday', 'agent.birthday');
    manager.add('personality', 'when were you born', 'agent.birthday');
    manager.add('personality', 'when do you have birthday', 'agent.birthday');
    manager.add('personality', 'date of your birthday', 'agent.birthday');
}

// (async () => {
//     const container = await containerBootstrap();
//     container.use(NluNeural);
//     container.use(LangEn);
//     // Set trainByDomain to true to train by domain
//     const manager = new DomainManager({ container, trainByDomain: true });
//     addFoodDomain(manager);
//     addPersonalityDomain(manager);
//     await manager.train();
//     // manager.save();
//     const actual = await manager.process('when should I');
//     console.log(manager);

//     // 4. Serialize intents and entities
//     const jsonData = await manager.toJSON();
//     // 5. Save intents and entities to a JSON file



//     // try {
//     //     fs.writeFile('./src/test.json', jsonData);
//     //     console.log('JSON data saved successfully');
//     // } catch (err) {
//     //     console.error('Error saving JSON data:', err);
//     // }

//     // fs.writeFile('./src/test.json', jsonData, (err: any) => {
//     //     if (err) {
//     //         console.error('Error saving JSON data:', err);
//     //     } else {
//     //         console.log('JSON data saved successfully');
//     //     }
//     // });
// })();

const createObjectManager = async () => {
    const container = await containerBootstrap();
    container.use(NluNeural);
    container.use(LangEn);
    // Set trainByDomain to true to train by domain
    const manager = new DomainManager({ container, trainByDomain: true });
    addFoodDomain(manager);
    addPersonalityDomain(manager);
    await manager.train();

    // manager.save();
    // const actual = await manager.process('when should I');
    // console.log(manager);


    const jsonData = await manager.toJSON();



    return manager;
};


// createObjectManager().then((manager) => {
//     manager.process('when should I').then((text: string) => { console.log(text) });
// })


(async () => {
    const manager = await createObjectManager();
    const text = await manager.process('when should I');
    console.log(text);
})();

// const { dockStart } = require('@nlpjs/basic');

// (async () => {
//     const filename0 = "test.json";
//     const dock = await dockStart({
//         settings: {
//             nlp: {
//                 executeActionsBeforeAnswers: true,

//                 languages: ['en'],
//                 corpora: [
//                     `./src/testAction/${filename0}`,
//                 ],
//             }
//         },
//         use: ['Basic', 'LangEn'],
//     });
//     const TestAction = dock.get('nlp');
//     // await TestAction.train();


//     TestAction.registerActionFunction('handleWhatsTimeAction', async (data: any, locale: any) => {
//         console.log("i am working")
//         const res = new Date().toLocaleTimeString(locale);
//         data.context.time = res;
//         return data;
//     });
//     TestAction.save('./src/models/actiontest.nlp');
//     let context = {};
//     let response = await TestAction.process('en', "what time is it", context);
//     response = await TestAction.process('en', "japan", context);

//     console.log(response);
// })();



// (async () => {
//     const { dockStart } = require('@nlpjs/basic');
//     const filename0 = "test.json";
//     const dock = await dockStart({
//         settings: {
//             nlp: {
//                 languages: ['en'],
//                 corpora: [
//                     `./src/testAction/${filename0}`,
//                 ],
//             }
//         },
//         use: ['Basic', 'LangEn'],
//     });
//     console.log("i am")
//     const TestAction = await dock.get('nlp');
//     console.log("TestAction", TestAction)
//     // // await TestAction.train();
//     await TestAction.load(`./src/testAction/${filename0}`);

//     // TestAction.registerActionFunction('handleWhatsTimeAction', async (data: any, locale: any) => {
//     //     console.log("i am working")
//     //     const res = new Date().toLocaleTimeString(locale);
//     //     data.context.time = res;
//     //     return data;
//     // });
//     // TestAction.save('./src/models/actiontest.nlp');
//     let context = {};
//     let response = await TestAction.process('en', "what time is it", context);
//     response = await TestAction.process('en', "japan", context);

//     console.log(response);
// })();