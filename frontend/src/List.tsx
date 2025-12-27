
class listItem{
    name: string;
    calories: number;
    id: number;

    constructor(name: string, calories: number, id: number){
        this.name = name;
        this.calories = calories;
        this.id = id;
    }

}

interface listProps{
    itemList: listItem[];
    category?: string;

}

function List(props: listProps){



    const {category = "Default List", itemList } = props;

    const lowCalFruits = itemList.filter(fruit => fruit.calories >= 100);

    const listItems = lowCalFruits.map((lowCalFruit) =>
        <li key={lowCalFruit.name}>

            <b>{lowCalFruit.name}: &nbsp;
                {lowCalFruit.calories}</b>
        </li>)


    return (
        <div className={category}>
            <h2>{category}</h2>
            <ol>
                {listItems}
            </ol>
        </div> 
    );

}

export default List;