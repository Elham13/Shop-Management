
const productdb = (dbname, table) => {
    // Creating database
    const db = new Dexie(dbname);

    db.version(1).stores(table);

    db.open();
    return db;
}

// insert function
const bulkCreate = (dbTable, data) => {
    let flag = empty(data);
    if (flag) {
        dbTable.bulkAdd([data]);
        console.log("Data inserted successfully...!");
    } else {
        console.log('Please provide data...!');
    }
    return flag;
}

// check textbox validation
const empty = object => {
    let flag = false;

    for (const value in object) {
        if (object[value] != "" && object.hasOwnProperty(value)) {
            flag = true;
        } else {
            flag = false;
        }
    }
    return flag;
}

// get data from database
const getData = (dbtable, fn) => {
    let index = 0;
    let obj = {};

    dbtable.count((count) => {
        if (count) {
            dbtable.each(table => {
                obj = SortObj(table);
                fn(obj, index++);
            });
        } else {
            fn(0);
        }
    });
}

// Sort the table data (id must be in the first)
const SortObj = sortobj => {
    let obj = {};

    obj = {
        id: sortobj.id,
        name: sortobj.name,
        seller: sortobj.seller,
        price: sortobj.price
    }
    return obj;
}

// Create dynamic elements
const createEle = (tagName, appendTo, fn) => {
    const element = document.createElement(tagName);
    if (appendTo) appendTo.appendChild(element);
    if (fn) fn(element);
}

export default productdb;
export {
    bulkCreate,
    getData,
    createEle
}