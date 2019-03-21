// Backend Call
CurrGroup = null;
$(document).ready(function() {
        load_main_table();
        console.log("test");
        $('#salaryTable').DataTable();
        // search_for_individuals_option("Samuel");
});

function load_main_table() 
{
    $.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/getSalaryInformation',   //The server endpoint we are connecting to 
        data: {},
        success: function (data) {
            CurrGroup = data
            insert_into_website_table(CurrGroup,10);
        },        
    });
}

function insert_into_website_table(person,tableSize)
{
    let table = document.getElementById('salaryTable');
    for (i = 0; i < tableSize; i ++) {
        if(i >= person.length) {
            break;
        }
        let btm = document.createElement("input");
        btm.setAttribute('type','checkbox');
        btm.onclick = selectedRow;
        let row = table.insertRow(-1);
        row.insertCell(0).appendChild(btm);

        fullName = person[i].firstLast.split('_');
        row.insertCell(1).innerHTML = fullName.join(" ");
        row.insertCell(2).innerHTML = person[i].employer;
        sectorName = person[i].sector.split('_');
        row.insertCell(3).innerHTML = sectorName.join(" ");
        
        row.insertCell(4).innerHTML = person[i].salary;  
        row.insertCell(5).innerHTML = person[i].province;
        row.insertCell(6).innerHTML = person[i].year;
        //person.innerHTML = person_array[i].First;
    }
    document.getElementById('currPos').innerHTML = '0 - 10 of ' + person.length;
    document.getElementById('currPos').name = '10';
    pageTable = document.getElementById('tablePaging');
    prev = document.createElement('LI');
    link = document.createElement('A');

    link.className = 'page-link';
    link.innerHTML =  'Previous';
    prev.className ='page-item';
    prev.appendChild(link);

    pageTable.appendChild(prev);
    pages = Math.ceil(person.length/tableSize);
    console.log(Math.ceil(person.length/tableSize));
    for(i = 0; i < pages; i ++) {
        prev = document.createElement('LI');
        link = document.createElement('A');
    
        link.className = 'page-link';
        link.innerHTML =  i;
        prev.className ='page-item';
        prev.appendChild(link);
    
        pageTable.appendChild(prev);
    }

} 
function selectedRow() {
    console.log("lol");
}

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
            insert_into_website_table(data);
        },        
    });
}