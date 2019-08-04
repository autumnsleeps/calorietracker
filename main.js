//Storage Controller
const StorageCtrl = (function(){
    return{
        storeItem: function(item){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];

                items.push(item);

                localStorage.setItem('items',JSON.stringify(items));
            }
            else{
                items = JSON.parse(localStorage.getItem('items'));

                items.push(item);

                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }
            else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            
            items.forEach((item, index) => {
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            
            items.forEach((item, index) => {
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();


//Item Controller
const ItemCtrl = (function(){
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure/State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0 
    }

    return{
        logData: function(){
            //Just for testing
            return data;
        },
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            //Create ID
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }
            else{
                ID = 0;
            }
            //Calories to number
            calories = parseInt(calories);

            //Create new item
            newItem = new Item(ID, name, calories);
            //Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id){
            let found;
            data.items.forEach(item => {
                if(item.id === id){
                    found = item;
                }
            });

            return found;
        },
        updateItem: function(name, calories){
            //Calories to number
            calories = parseInt(calories);
            let found;
            
            data.items.forEach(item => {
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            //Get ids
            ids = data.items.map((item) => {
                return item.id;
            });

            //Get index
            const index = ids.indexOf(id);

            //Remove item from array
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(item => {
                total += item.calories;
            });

            //Set total calories in data structure
            data.totalCalories = total;

            //Return total
            return data.totalCalories;

        }
    }
})();

//UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
    }

    return{
        populateItemList: function(items){
            let html = '';
            items.forEach(item => {
                html += `
                    <li id="item-${item.id}" class="collection-item">
                        <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    </li>
                `;
            });

            //Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput:function(){
            return{
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value   
            }
        },
        addListItem: function(item){
            //Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            //Add ID
            li.id = `item-${item.id}`;

            li.innerHTML = `
                <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            //Insert item
            document.querySelector(UISelectors.itemList).appendChild(li);
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn node lists into array
            listItems = Array.from(listItems);

            listItems.forEach(listItem => {
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                        <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `;
                }
            })
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;

            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach(item => {
                item.remove();
            });
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

//Main App Controller
const App = (function(ItemCtrl,StorageCtrl,UICtrl){
    //Load event listener
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress', e => {
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });

        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //Update item detail event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //Delete button event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Clear all the items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
        
    }

    const itemAddSubmit = function(e){
        //Get form input from UIController
        const input = UICtrl.getItemInput();

        //Check for name and calories
        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            UICtrl.addListItem(newItem);

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Store in localStorage
            StorageCtrl.storeItem(newItem);

            //Clear input field
            UICtrl.clearInput();
        }

        e.preventDefault();
    }  
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            const listId = e.target.parentElement.parentElement.id;
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);
            const itemToEdit = ItemCtrl.getItemById(id);
            ItemCtrl.setCurrentItem(itemToEdit);
            UICtrl.addItemToForm();
        }
        e.prevenDefault();
    }

    //Update item detail
    const itemUpdateSubmit = function(e){
        //Get item input
        const input = UICtrl.getItemInput();

        //Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update UI 
        UICtrl.updateListItem(updatedItem);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Update localStorage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    const itemDeleteSubmit = function(e){
        //Get current item id
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Delete from localStorage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();
        
        e.preventDefault();
    }

    const clearAllItemsClick = function(){
        //Delete all items from data structure
        ItemCtrl.clearAllItems();

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Remove all the items from UI
        UICtrl.removeItems();

        //Clear from localStorage
        StorageCtrl.clearItemsFromStorage();

        //Hide the ul
        UICtrl.hideList();
        
    }

    return{
        init: function(){
            //Set initial state
            UICtrl.clearEditState();

            //Fetch items from data structure
            const items = ItemCtrl.getItems();

            //Check if any items
            if(items.length === 0){
                UICtrl.hideList();
            }
            else{
                //Populate list with items
                UICtrl.populateItemList(items);
            }

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            
            //Load all event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl,StorageCtrl,UICtrl);

App.init();
