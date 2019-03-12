// Backend Call
$(document).ready(function() {
        load_main_table();
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
    var person = person_array;
    for (i in person_array) {
        var person = document.getElementById('table');
        console.log(person)
        person.innerHTML = person_array[i].First;
    }  
} 

// function search_for_individuals_option(FirstName) 
// {
//     $.ajax({
//         type: 'get',            //Request type
//         dataType: 'json',       //Data type - we will use JSON for almost everything 
//         url: '/search_for_individuals_option',   //The server endpoint we are connecting to
//         data: {
//             firstName: FirstName
//         },
//         success: function (data) {
//             console.log(data);
//             insert_into_website_table(data);
//         },        
//     });
// }