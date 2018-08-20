import axios from 'axios';
import { key, proxy} from '../config';


export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        
        let res;
        try {
            // res = await axios(`./api/search.json`);
            // http://food2fork.com/api/search?key=7f4f3e0e9c1bc688d1c6c60714af937f&q=pizza
             res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
        } catch (error) {

            //  console.log(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            // res = await axios(`./api/search.json`);
            console.log(error);
            
        }
        this.result = res.data.recipes;
    }
}

