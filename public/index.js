// Backend Call
$(document).ready(function() {
        load_main_table();
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
            insert_into_website_table(data);
        },        
    });
}

function insert_into_website_table(person_array)
{
    console.log("iNSERT INTO THE TABLE"); 
    console.log(person_array);
    let person = person_array;
    let table = document.getElementById('salaryTable');;
    for (i in person_array) {
        let btm = document.createElement("input");
        btm.setAttribute('type','checkbox');
        btm.onclick = selectedRow;
        let row = table.insertRow(-1);
        row.insertCell(0).appendChild(btm);
        row.insertCell(1).innerHTML = person[i].FirstName +" "+ person[i].LastName;
        row.insertCell(2).innerHTML = person[i].Sector;
        if(person[i]['Salary Paid'] === undefined) {
            row.insertCell(3).innerHTML = person[i].SalaryPaid;  
        }
        else {
            row.insertCell(3).innerHTML = person[i]['Salary Paid'];
        }
        row.insertCell(4).innerHTML = "Province"
        row.insertCell(5).innerHTML = person[i]['Calendar Year']
        //person.innerHTML = person_array[i].First;
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