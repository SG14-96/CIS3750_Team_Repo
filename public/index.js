// Backend Call
let CurrGroup = null;
let selectBody = null;
let searchBody = null;
$(document).ready(function() {
        load_main_table();

        // Testing the baod

        // ***********************************************
        // search_for_individuals_option("Samuel");

        // Testing general search
        // generic_search("allan denis");

        // Testing update    
        // update_on_row_select("David_Apramian", false);

        // download_csv();

        // ***********************************************
});

    //Load the main page of the website
function load_main_table() 
{
    var number_people = 10;
    var sortBy = "firstName";
    // Call the table, toggle the sort by
    //  what the user wants to sort the table by
    $.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/getSalaryInformation',   //The server endpoint we are connecting to 
        data: {   
            sortBy: sortBy,
            count: number_people
        },
        success: function (data) {
            CurrGroup = data
            insert_into_website_table(CurrGroup,10);
        },        
    });
}

function insert_into_website_table(person,tableSize)
{
    i = 0;
    let table = document.getElementById('records');
    for (obj in person) {
        if(i >= person.length || i === tableSize) {
            break;
        }
        let btm = document.createElement("input");
        btm.setAttribute('type','checkbox');
        btm.onclick = selectedRow;
        btm.checked = person[obj].selected;
        let row = table.insertRow(-1);
        row.insertCell(0).appendChild(btm);

        fullName = person[obj].firstLast.split('_');
        row.insertCell(1).innerHTML = fullName.join(" ");
        row.insertCell(2).innerHTML = person[obj].employer;
        sectorName = person[obj].sector.split('_');
        row.insertCell(3).innerHTML = sectorName.join(" ");
        
        row.insertCell(4).innerHTML = person[obj].salary;  
        row.insertCell(5).innerHTML = person[obj].province;
        row.insertCell(6).innerHTML = person[obj].year;
        //person.innerHTML = person_array[i].First;
        i++;
    }
    //let size = Object.keys(person).length;
    document.getElementById('totalPages').innerHTML = 10;


} 
function selectedRow() {
    if(selectBody === null) {
        selectBody = document.createElement("tbody");
        selectBody.id = "records";
    }
    if(this.checked === true) {
    let row = document.createElement('tr');
        row = this.parentNode.parentNode.cloneNode(true);
        row.firstChild.firstChild.onclick = selectedRow;
        selectBody.appendChild(row);
        //update_on_row_select(this.parentNode.parentNode.cells[1],true);

    }
    else {
        let row = selectBody.rows;
        for(let i = 0; i < row.length; i ++) {
            if(this.parentNode.parentNode.cells[1].innerHTML === row[i].cells[1].innerHTML) {
                console.log('test');
                selectBody.removeChild(row[i]);
                //update_on_row_select(this.parentNode.parentNode.cells[1],false);
            }
        }
    }

}
function newTbody(currPage) {
    let i = 0;
    let table = document.getElementById('records');

    let newTbody = document.createElement('TBODY');
    newTbody.id = "records";


    for (obj in CurrGroup) {
            if(i >= CurrGroup.length || i === currPage) {
                break;
            }
            let btm = document.createElement("input");
            btm.setAttribute('type','checkbox');
            btm.onclick = selectedRow;
            btm.checked = CurrGroup[obj].selected;
            let row = newTbody.insertRow(-1);
            row.insertCell(0).appendChild(btm);

            fullName = CurrGroup[obj].firstLast.split('_');
            row.insertCell(1).innerHTML = fullName.join(" ");
            row.insertCell(2).innerHTML = CurrGroup[obj].employer;
            sectorName = CurrGroup[obj].sector.split('_');
            row.insertCell(3).innerHTML = sectorName.join(" ");
            
            row.insertCell(4).innerHTML = CurrGroup[obj].salary;  
            row.insertCell(5).innerHTML = CurrGroup[obj].province;
            row.insertCell(6).innerHTML = CurrGroup[obj].year;
            //person.innerHTML = person_array[i].First;
        i++;
    }
    table.parentNode.replaceChild(newTbody,table);

    

}
function paging(newPage) {
    selectVal = document.getElementById('inputGroupSelect');
    currSize = parseInt(selectVal[selectVal.selectedIndex].value);
    dbSize = currSize * newPage;
    $.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/getSalaryInformation',   //The server endpoint we are connecting to 
        data: {   
            sortBy: "firstName",
            count: dbSize
        },
        success: function (data) {
            let i = 0;
            CurrGroup = [];
            //console.log(data)
            for (obj in data) {
                if(i >= (dbSize - currSize) ) {
                    CurrGroup.push(data[obj]);
                }
                i++;
            }
            newTbody(currSize);
        },        
    });

}
$('#Salary-tab').click(function(e) {
    selectVal = document.getElementById('inputGroupSelect');
    currSize = parseInt(selectVal[selectVal.selectedIndex].value);
    newTbody(currSize);
});
$('#selected-tab').click(function(e) {
    if(selectBody === null) {
        selectBody = document.createElement('TBODY');
        selectBody.id = "records";
    }
    let table = document.getElementById('records');
    table.parentNode.replaceChild(selectBody,table);
});
$('#search-tab').click(function(e) {
    if(searchBody === null) {
        searchBody = document.createElement('TBODY');
        searchBody.id = "records";
    }
    let table = document.getElementById('records');
    table.parentNode.replaceChild(searchBody,table);
});

$('#prevPage').click(function(e) {
    let currPage = document.getElementById('currPage').innerHTML;
    if(currPage === '1') {
        return;
    }
    currPage = parseInt(currPage);
    
    document.getElementById('currPage').innerHTML = currPage - 1;
    paging(currPage - 1)

});
$('#nextPage').click(function(e) {
    currPage = document.getElementById('currPage').innerHTML;
    if(currPage === document.getElementById('totalPages').innerHTML) {
        return;
    }
    currPage = parseInt(currPage);
    nextPage = currPage + 1;
    document.getElementById('currPage').innerHTML = nextPage;
    paging(nextPage)
});
$("#inputGroupSelect").change(function(e) {
    let selectSize = document.getElementById('inputGroupSelect');
    let currTableSize = parseInt(selectSize[selectSize.selectedIndex].value);
    let currPage = document.getElementById('currPage').innerHTML;
    currPage = parseInt(currPage);
    $.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/getSalaryInformation',   //The server endpoint we are connecting to 
        data: {   
            sortBy: "firstName",
            count: currTableSize
        },
        success: function (data) {
            CurrGroup = data
            paging(currPage);
            document.getElementById('totalPages').innerHTML = Math.ceil(100 / currTableSize);
        },        
    });
    
});
$('#downloadTable').click(function(e) {
    let table = document.getElementById('records');
    console.log(table);
});
$("#genSearch").click(function(e) {
    toSearch = document.getElementById('genSearchVal');
    currPage = document.getElementById('currPage').innerHTML;
    if(toSearch.value === '') {
        paging(parseInt(currPage));
    }
    else {
        CurrGroup = generic_search(toSearch.value);
    }

    
});
$("#AdvanceSearchBtm").click(function(e) {
    


});
// The user will insert a generic search
// This function will pass one string, with no spaces to backend
// Ajax will return a json to the front end with the search results

function generic_search(uesrSearchVal) 
{
    console.log("general");
    let selectSize = document.getElementById('inputGroupSelect');
    let currTableSize = parseInt(selectSize[selectSize.selectedIndex].value);

    $.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/search',   //The server endpoint we are connecting to
        data: {
            searchVal: uesrSearchVal
        },
        success: function (data) {
            CurrGroup = data;
            // Ajax will return a json to the front end with the search results
            // [] will return if no results are found
            newTbody(currTableSize)
            // insert_into_search_table(data);
        },       
    });
}

function update_on_row_select(person_name, action) {
    // person name will be First Last, spaces = "_", caps on first letter
    $.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/update_record_select',   //The server endpoint we are connecting to
        data: {

            //Person to be updated
            toUpdate: person_name,
            //action, true when they select, faLse when they unselect
            select: action
        },
        success: function (data) {
            console.log("Done");
        },        
    }); 
}

function download_csv() {
    // person name will be First Last, spaces = "_", caps on first letter
    $.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/download_csv',   //The server endpoint we are connecting to
        data: {},
        success: function (data) {
            console.log(data);
        },        
    }); 
}