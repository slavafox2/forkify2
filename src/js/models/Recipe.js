import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        let res;
        try {
            // const res = await axios(`./api/recipe36453.json`);
            res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`); // http://food2fork.com/api/get?key=7f4f3e0e9c1bc688d1c6c60714af937f&rId=36453
            
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (error) {
            console.log(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            // res = await axios(`./api/recipe36453.json`);
            console.log('ошибка загрузки из recipe.js');
            console.log(error);
        }

    }

    calcTime() {
        //assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }


    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']

        let newIngredients = this.ingredients.map(el => {
            // 1) uniform units
            let ingredient = el.toLowerCase();            
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, units[i]);
            });
            
            // 2) remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            // 3) parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ')
            const unitIndex = arrIng.findIndex(el => units.includes(el));

            let objIng;            
            if (unitIndex > -1) {

                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                }else{
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {

                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex === -1) {

                objIng = {
                    count: 1,
                    unit: '',
                    ingredient    //ingredient: ingredient
                }
            }
            return objIng;

        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        
        //ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings /  this.servings);
        });
        this.servings = newServings;
    }

}