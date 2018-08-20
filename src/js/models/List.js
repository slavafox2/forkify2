import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items =[];
    };

    addItem(count, unit, ingredient){
         const items = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(items);
        return items;
    };

    deleteItem(id){
        const ind = this.items.findIndex(el => el.id === id);
        this.items.splice(ind, 1);
    };
    
    updateItem(id, newCount){
        this.items.find(el => el.id === id).count = newCount;
    };
}