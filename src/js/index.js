import Search from './models/Search';
import List from './models/List';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, rednerLoader, clearLoader } from './views/base';
import Likes from './models/Likes';


/**
 *  GLOBAL object state of the app
* - Search object, - Current recipe obj, - Shopping list obj, - Liked  recipes
 */

const state = {};

/*
*Global SEARCH
*/
const controlSearch = async () => {

    const query = searchView.getInput();
    if ('pizza') {
        // if (query) {

        state.search = new Search(query);
        //UI
        searchView.clearInput();
        searchView.clearResults();
        rednerLoader(elements.searchRes);
        try {
            await state.search.getResults();
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            console.log(error);
        }
    }
};
elements.searchForm.addEventListener('click', (even) => {
    even.preventDefault();
    controlSearch();
});
elements.searchResPages.addEventListener('click', event => {
    const btn = event.target.closest('.btn-inline');
    if (btn) {
        let goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    };

});

/*
*Global  RECIPE controller
*/
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    if (id) {
        // prepare UI for changes 
        recipeView.clearRecipe();
        rednerLoader(elements.recipe);

        // highlight selecting
        if (state.search) { searchView.highlightSelected(id); }
        //create new recipe object
        state.recipe = new Recipe(id);
        try {
            // get recipe data    and parse ingredients    
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            clearLoader()
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        } catch (error) {
            console.log(error);
            alert('my Error processing recipe ' + error);
        }
    }
};


/*
*Global  LIST controller
*/
const controlList = () => {
    //create a new list if htre in none yet
    if (!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        //delete from state
        state.list.deleteItem(id);
        //delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateItem(id, val);
    }
});


//for testing
// elements.searchForm.addEventListener('click', (even) => {
//     even.preventDefault();
//     window.r = state.recipe;
// });

// window.addEventListener('hashchange', controlRecipe)
['hashchange', 'load'].forEach(event => { window.addEventListener(event, controlRecipe) });


/*
* LIKEs controller
*/
const controlLike = () => {

    if (!state.likes) state.likes = new Likes();

    const currentId = state.recipe.id;
    if (!state.likes.isLiked(currentId)) {
        //add like to the state    
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img)

        //toggle the like button
        likesView.toggleLikeBtn(true);

        // add like to UI list
        likesView.renderLike(newLike);

    } else {
        state.likes.deleteLike(currentId);

        //toggle the like button
        likesView.toggleLikeBtn(false);

        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());

};

// read data from storage
window.addEventListener('load', () => {

    state.likes = new Likes();

    state.likes.readStorage();

    likesView.toggleLikeMenu(state.likes.getNumLikes());

    state.likes.likes.forEach(el => likesView.renderLike(el));

});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {

    if (e.target.matches('.btn-decrease, .btn-decrease * ')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredintes(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase * ')) {

        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredintes(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }

});
