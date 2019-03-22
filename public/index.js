// Backend Call
CurrGroup = null;
$(document).ready(function() {
        load_main_table();
        // search_for_individuals_option("Samuel");
});

    //Load the main page of the website
function load_main_table() 
{
    var number_people = 10;
    var sortBy = "firstName";
    // Call the table, toggle the sort partBY function by
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
    let size = Object.keys(person).length;
    document.getElementById('totalPages').innerHTML = Math.ceil(size/tableSize);


} 
function selectedRow() {
    console.log("lol");
}
function newPage(currPage,selectedPage) {
    let i = 0;
    let table = document.getElementById('records');
    let selectSize = document.getElementById('inputGroupSelect');
    let currTableSize = parseInt(selectSize[selectSize.selectedIndex].value);
    let beginIndex = currPage * currTableSize;

    let newTbody = document.createElement('TBODY');
    newTbody.id = "records";

    let tableSize = selectedPage * currTableSize;

    for (obj in CurrGroup) {
        if( i >= beginIndex) {
            if(i >= CurrGroup.length || i === tableSize) {
                break;
            }
            let btm = document.createElement("input");
            btm.setAttribute('type','checkbox');
            btm.onclick = selectedRow;
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
        }
        i++;
    }
    table.parentNode.replaceChild(newTbody,table);

    

}
$('#Salary-tab').click(function(e) {
    //insert_into_website_table(CurrGroup,document.getElementById('currPos').name);
});
$('#selected-tab').click(function(e) {
    console.log("yay")
});
$('#selected-tab').click(function(e) {
    console.log("yay")
});
$('#prevPage').click(function(e) {
    currPage = document.getElementById('currPage').innerHTML;
    if(currPage === '1') {
        return;
    }
    currPage = parseInt(currPage);
    
    document.getElementById('currPage').innerHTML = currPage - 1;
    newPage(currPage - 2,currPage - 1)

});
$('#nextPage').click(function(e) {
    currPage = document.getElementById('currPage').innerHTML;
    if(currPage === document.getElementById('totalPages').innerHTML) {
        return;
    }
    currPage = parseInt(currPage);
    nextPage = currPage + 1;
    document.getElementById('currPage').innerHTML = nextPage;
    newPage(currPage,nextPage)
});
$("#inputGroupSelect").change(function(e) {
    let selectSize = document.getElementById('inputGroupSelect');
    let currTableSize = parseInt(selectSize[selectSize.selectedIndex].value);
    let totalPage = document.getElementById('totalPages');
    let currentPage = parseInt(document.getElementById('currPage').innerHTML);
    
    totalPage.innerHTML = Math.ceil(Object.keys(CurrGroup).length/currTableSize);

    newPage(currentPage - 1,currentPage);
});
// The user will insert a generic search
// This function will pass one string, with no spaces to backend
// Ajax will return a json to the front end with the search results

function generic_search(general_search) 
{
    var general_search = 'search_bar';

    // TODO: Change all spaces in the string in generic_search to '_'

    $.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/search_for_individuals_option',   //The server endpoint we are connecting to
        data: {
            general_search: general_search
        },
        success: function (data) {
            // Ajax will return a json to the front end with the search results
            // [] will return if no results are found
            console.log(data);
            // insert_into_search_table(data);
        },        
    });
}