console.log('This is an exame');

const endpoint = 'https://gist.githubusercontent.com/Pinois/93afbc4a061352a0c70331ca4a16bb99/raw/6da767327041de13693181c2cb09459b0a3657a1/topics.json'; 

// fetch the api url
const myPromise = fetch(endpoint);

// get all necessary element from html by query selector
const nexTtopicList = document.querySelector('.new_topic_list');
const pastTopicList = document.querySelector('.past_topic_list');
const body = document.querySelector('body');

// function to handle when there is something wrong with promise
function handleError(err) {
    console.log('Oh no!');
    console.log(err);
}
// a go() function to run when we want to display the data from api url into html
async function go() {

    let response = await myPromise;
    let data = await response.json();
    
    let topics = [];

    console.log(data);
    const handleClick = e => {
        if (e.target.closest('button.archive')) {
            const button = e.target.closest('button.archive');
            const id = button.dataset.id;
            updateTopic(id);
        }
    }
    // inner html of new topics if there is nothing on topic.discussedOn
    function showTopics(topicsList) {
        let myTopics = topicsList;

        // using only itinerary
        console.log('TopicList',topicsList);
        // const newhHtml = myTopics.map(topic => {
        
        // return `${topic.discussedOn === '' ? `
        // <li class="list-group-item">
        //         <button class="btn archive" data-id="${topic.id}">
        //         🧺
        //         </button>
        //         <p class="title">${topic.title}</p>
        //         <div class="votes">
        //             <div>
        //                 <button type="button" class="btn upvotes">
        //                 👍
        //                 </button>
        //                 <span>${topic.upvotes}<span>
        //             </div>
        //             <div>
        //                 <button type="button" class="btn downvotes">
        //                 👎
        //                 </button>
        //                 <span>${topic.downvotes}<span>
        //             </div>
        //         </div>
        //     </li>` : `
        //     <li class="list-group-item">
        //         <button class="btn delete">
        //             ❌
        //         </button>
        //         <p class="title">${topic.title}</p>
        //         <div class="votes">
        //             <div>
        //               <span>${topic.discussedOn}<span>
        //             </div>
        //         </div>
        //     </li>`}  
        // `;

        // This is better
        const newhHtml = myTopics.map(topic => {
            if(topic.discussedOn == '') {
                console.log("Discusse",`${topic.discussedOn} is not discussed`);
            
            return `
                <li class="list-group-item">
                    <button class="btn archive" data-id="${topic.id}">
                    🧺
                    </button>
                    <p class="title">${topic.title}</p>
                    <div class="votes">
                        <div>
                            <button type="button" class="btn upvotes">
                            👍
                            </button>
                            <span>${topic.upvotes}<span>
                        </div>
                        <div>
                            <button type="button" class="btn downvotes">
                            👎
                            </button>
                            <span>${topic.downvotes}<span>
                        </div>
                    </div>
                </li>
            `;
            }  
        }).join('');
    nexTtopicList.innerHTML = newhHtml;
    nexTtopicList.addEventListener('click', handleClick);
    // inner html of past topics if there is something on topic.discussedOn
    const pasthHtml = myTopics.map(topic => {
        if(topic.discussedOn !== '') {
            console.log(`${topic.discussedOn} is discussed`);
            return `
            <li class="list-group-item">
                <button class="btn delete">
                ❌
                </button>
                <p class="title">${topic.title}</p>
                <div class="votes">
                    <div>
                        <span>${topic.discussedOn}<span>
                    </div>
                </div>
            </li>
        `; 
        }  
    }).join('');

    pastTopicList.innerHTML = pasthHtml;
    nexTtopicList.dispatchEvent(new CustomEvent('pleaseUpdateTheTopicList'));
}

// LocalStirage function

const initLocalStorage = () => {
    let stringFromLS = localStorage.getItem('topics');
    let lsItems = JSON.parse(stringFromLS);
    if (lsItems) {
        topics = lsItems;
    } 
    // used fetch here. or data
    topics = data;

    // launch a custom event,
    showTopics(topics);
    updateLocalStorage();
};

// we want to update the local storage each time we update, delete or add an attribute
const updateLocalStorage = () => {
    localStorage.setItem('topics', JSON.stringify(topics));
};
initLocalStorage();

    const updateTopic = idFromArchiveBtn => {
        
        // const topic = topics.find(topic => topic.id === idFromArchiveBtn.id);
        const topic = topics.find(topic => topic.id === idFromArchiveBtn);
        console.log("found topic",topic);
        topic.discussedOn = Date.now();
        nexTtopicList.dispatchEvent(new CustomEvent('pleaseUpdateTheTopicList'));
    };

    nexTtopicList.addEventListener('click', handleClick);
}

go().catch(handleError);
  
