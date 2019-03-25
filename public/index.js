// Backend Call
let currGroup = null;
let salaryGroup = null;
let selectGroup = [];
let searchGroup = [];
let currTab = 0;
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
            salaryGroup = data
            currGroup = salaryGroup;
            insert_into_website_table(10);
        },        
    });
}

function insert_into_website_table(tableSize)
{
    i = 0;
    let table = document.getElementById('records');
    for (obj in salaryGroup) {
        if(i >= salaryGroup.length || i === tableSize) {
            break;
        }
        let btm = document.createElement("input");
        btm.setAttribute('type','checkbox');
        btm.onclick = selectedRow;
        
        btm.checked = JSON.parse(salaryGroup[obj].selected);
        if(btm.checked === true) {
            btm.checked = false;
            salaryGroup[obj].selected = false;
            update_on_row_select(salaryGroup[obj].firstLast,'false');
        }
        let row = table.insertRow(-1);
        row.insertCell(0).appendChild(btm);

        fullName = salaryGroup[obj].firstLast.split('_');
        row.insertCell(1).innerHTML = fullName.join(" ");
        row.insertCell(2).innerHTML = salaryGroup[obj].employer;
        sectorName = salaryGroup[obj].sector.split('_');
        row.insertCell(3).innerHTML = sectorName.join(" ");
        
        row.insertCell(4).innerHTML = salaryGroup[obj].salary;  
        row.insertCell(5).innerHTML = salaryGroup[obj].province;
        row.insertCell(6).innerHTML = salaryGroup[obj].year;
        //salaryGroup.innerHTML = person_array[i].First;
        i++;
    }
    //let size = Object.keys(salaryGroup).length;
    document.getElementById('totalPages').innerHTML = 10;

} 
function selectedRow() {
    let name = this.parentNode.parentNode.cells[1].innerHTML;
    
    name = name.split(" ");
    name = name.join("_");
    for(obj in currGroup) {
        if(name === currGroup[obj].firstLast) {
            currGroup[obj].selected = this.checked;
            if(currGroup[obj].selected === true) {
                let str = JSON.stringify(currGroup[obj]);
                salaryGroup[obj].selected = true;
                selectGroup.push(JSON.parse(str));
                update_on_row_select(name,'true');
            }
            else {
                for(let i = 0; i < selectGroup.length; i ++) {
                    if(name === selectGroup[i].firstLast) {
                        selectGroup.splice(i,1);
                        update_on_row_select(name,'false');
                    }
                }
            }

        }
    }
    console.log(selectGroup)
}
function newTbody(currPage,group) {
    let i = 0;
    let table = document.getElementById('records');

    let newTbody = document.createElement('TBODY');
    newTbody.id = "records";


    for (obj in group) {
            if(i >= group.length || i === currPage) {
                break;
            }
            let btm = document.createElement("input");
            btm.setAttribute('type','checkbox');
            btm.onclick = selectedRow;
            btm.checked = JSON.parse(group[obj].selected);
            let row = newTbody.insertRow(-1);
            row.insertCell(0).appendChild(btm);

            fullName = group[obj].firstLast.split('_');
            row.insertCell(1).innerHTML = fullName.join(" ");
            row.insertCell(2).innerHTML = group[obj].employer;
            sectorName = group[obj].sector.split('_');
            row.insertCell(3).innerHTML = sectorName.join(" ");
            
            row.insertCell(4).innerHTML = group[obj].salary;  
            row.insertCell(5).innerHTML = group[obj].province;
            row.insertCell(6).innerHTML = group[obj].year;
            //person.innerHTML = person_array[i].First;
        i++;
    }
    table.parentNode.replaceChild(newTbody,table);


}
function paging(newPage) {
    selectVal = document.getElementById('inputGroupSelect');
    currSize = parseInt(selectVal[selectVal.selectedIndex].value);
    dbSize = currSize * newPage;
    if(currTab == 0) {
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
                let tempGroup = [];
                //console.log(data)
                for (obj in data) {
                    if(i >= (dbSize - currSize) ) {
                        tempGroup.push(data[obj]);
                    }
                    i++;
                }
                currGroup = tempGroup;
                newTbody(currSize,currGroup);
            },        
        });
    }
    else {
        let i = 0;
        let tempGroup = []
        for(obj in currGroup) {
            if(i >= currSize * (newPage - 1)) {
                console.log(obj)
                tempGroup.push(currGroup[obj]);
            }
            i++;
        }
        newTbody(currSize,tempGroup);
    }

}
$('#Salary-tab').click(function(e) {
    e.preventDefault();
    selectVal = document.getElementById('inputGroupSelect');
    currSize = parseInt(selectVal[selectVal.selectedIndex].value);
    currGroup = salaryGroup;
    currTab = 0;
    newTbody(currSize,salaryGroup);
});
$('#selected-tab').click(function(e) {
    e.preventDefault();
    selectVal = document.getElementById('inputGroupSelect');
    currSize = parseInt(selectVal[selectVal.selectedIndex].value);
    currGroup = selectGroup;
    currTab = 1;
    newTbody(currSize,selectGroup);
});
$('#search-tab').click(function(e) {
    e.preventDefault();
    selectVal = document.getElementById('inputGroupSelect');
    currSize = parseInt(selectVal[selectVal.selectedIndex].value);
    currGroup = searchBody;
    currTab = 2;
    newTbody(currSize,searchBody);
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
    let currPage = document.getElementById('currPage').innerHTML;
    if(currPage === document.getElementById('totalPages').innerHTML) {
        return;
    }
    currPage = parseInt(currPage);
    nextPage = currPage + 1;
    document.getElementById('currPage').innerHTML = nextPage;
    paging(nextPage);
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
            currGroup = data
            paging(currPage,document.getElementsByTagName('tabs').id);
            document.getElementById('totalPages').innerHTML = Math.ceil(100 / currTableSize);
        },        
    });
    
});
$('#downloadTable').click(function(e) {
    download_csv();
});
$("#genSearch").click(function(e) {
    toSearch = document.getElementById('genSearchVal');
    currPage = document.getElementById('currPage').innerHTML;
    if(toSearch.value === '') {
        paging(parseInt(currPage),currTab);
    }
    else {
        currGroup = generic_search(toSearch.value);
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
            currGroup = data;
            salaryGroup = currGroup;
            // Ajax will return a json to the front end with the search results
            // [] will return if no results are found
            newTbody(currTableSize, currGroup);
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
            console.log(data);
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