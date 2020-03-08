import productdb, { bulkCreate, getData, createEle } from './Modules.js';

// Create database
let db = productdb("ProductDB", {
    products: `++id, name, seller, price`
});

window.onload = () => {
    textID(userid);
}

function textID(textboxid) {
    getData(db.products, data => {
        textboxid.value = data.id + 1 || 1;
    });
}

// input tags
var userid = document.getElementById('userid');
const proname = document.getElementById('productname');
const seller = document.getElementById('seller');
const price = document.getElementById('price');

// buttons
const btncreat = document.getElementById('btn-create');
const btnread = document.getElementById('btn-read');
const btnupdate = document.getElementById('btn-update');
const btndel = document.getElementById('btn-delete');

// not found div
const notfound = document.getElementById('notfound');

// create event on create button
btncreat.onclick = (event) => {
    let flag = bulkCreate(db.products, {
        name: proname.value,
        seller: seller.value,
        price: price.value
    });
    //console.log(flag);

    proname.value = seller.value = price.value = '';

    getData(db.products, (data) => {
        userid.value = data.id + 1 || 1;
    });

    table();

    // let insertmsg = document.querySelector(".insertmsg");

    // getMsg(flag, insertmsg);
}


// create event on read button
btnread.onclick = table;

// create event on update button
btnupdate.onclick = () => {
    const id = parseInt(userid.value || 0);

    if (id) {
        db.products.update(id, {
            name: proname.value,
            seller: seller.value,
            price: price.value
        }).then((updated) => {
            let get = updated ? `Data updated...!` : `Couldn't update`;
            console.log(get);

            // let get = updated ? true : false;
            // let updatemsg = document.querySelector(".updatemsg");
            // getMsg(get, updatemsg);
            proname.value = seller.value = price.value = '';
        })
    }
}

// create event on delete all button
btndel.onclick = () => {
    db.delete();

    db = productdb("ProductDB", {
        products: `++id, name, seller, price`
    });
    db.open();

    // let deletemsg = document.querySelector(".deletemsg");
    // getMsg(true, deletemsg);

    textID(userid);
    table();
}

function table() {
    const tbody = document.getElementById("tbody");

    while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.firstChild);
    }

    getData(db.products, (data) => {
        if (data) {
            createEle('tr', tbody, tr => {
                for (const value in data) {
                    createEle('td', tr, td => {
                        td.textContent = data.price === data[value] ? `$ ${data[value]}` : data[value];
                    });
                }

                createEle('td', tr, td => {
                    createEle('i', td, i => {
                        i.className += "fas fa-edit btnedit";

                        i.setAttribute('data-id', data.id);
                        i.onclick = editbtn;
                    });
                });
                createEle('td', tr, td => {
                    createEle('i', td, i => {
                        i.className += "fas fa-trash-alt btndelete";
                        i.setAttribute('data-id', data.id);
                        i.onclick = deletebtn;
                    });
                });
            });
        } else {
            notfound.textContent = 'No records found in the Datatbase...!'
        }
    });
}


function editbtn(event) {
    let id = parseInt(event.target.dataset.id);

    db.products.get(id, data => {
        userid.value = data.id || 0;
        proname.value = data.name || '';
        seller.value = data.seller || '';
        price.value = data.price || '';
    });
}

function deletebtn(event) {
    let id = parseInt(event.target.dataset.id);

    db.products.delete(id);
    userid.value -= 1;
    table();
}

// function getMsg(flag, element) {
//     if (flag) {
//         element.className += "movedown";

//         setTimeout(() => {
//             element.classList.forEach(classname => {
//                 classname == "movedown" ? undefined : element.classList.remove("movedown");
//             });
//         }, 4000);
//     }
// }
