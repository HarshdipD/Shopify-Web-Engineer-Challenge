/*
SHOPIFY WEB ENGINEER CHALLENGE
Author: Harshdip Singh Deogan
File - script.js
Highlights:
	- Project created using HTML, CSS, JavaScript, jQuery
	- No CSS framework used
	- Works as required by the challege
	- Fade in animation for results
	- Responsive design
*/

//Function to add/remove favourties by clicking on stars
function star(i)
{
	console.log("star " + i + " clicked!");
	// i is the index of the item in the data.json
	// stars are defined in the local storage "fav". JSON object (array), or null
	let stars = localStorage.getItem("fav");
	if (!stars)			// if no stars at all
	{
		localStorage.setItem("fav", "[" + i + "]");							// initiate storage
		$("#star" + i).attr("style", "font-size: 20px; color:#408c43;");	//change color
	}
	else if (JSON.parse(stars).indexOf(i) > -1)				// the item is starred => unstar
	{
		stars = JSON.parse(stars);							// string => object (array)
		stars.splice(stars.indexOf(i), 1);					// remove the item from star
		localStorage.setItem("fav", JSON.stringify(stars));	// write in local storage
		$("#star" + i).attr("style", "font-size: 20px;");	// uncolour star
	}
	else
	{
		stars = JSON.parse(stars);
		stars.push(i);										// add the item to star
		localStorage.setItem("fav", JSON.stringify(stars));
		$("#star" + i).attr("style", "font-size: 20px; color:#408c43;");
	}
	displayFavourites();									//Display updated favourites list
};

//This function displays list items that are favourited
function displayFavourites()
{
	var url = "data.json";
	$("#saved_items").empty();
	if (!localStorage.getItem("fav"))
	{
		console.log("Nothing to show!");
	}
	else
	{
		$.getJSON(url, function(response)		// since stars are indexes, we'll need the actual data
		{
			var star_content = '';
			if(response.length)
			{
				//convert the local storage to an object (array)
				//for each array item (map function), return the html string
				$('#saved_items').append(JSON.parse(localStorage.getItem("fav")).map(i => '<div class="row"><div class="column fade-in"><div><p class="star_button" onclick="star('+i+')"><a class="material-icons" id="star'+i+'" style="font-size: 20px;color:#408c43;">star</a></p>'+response[i].title+'</div></div><div class="column fade-in"><div>'+new DOMParser().parseFromString(response[i].body, "text/html").documentElement.textContent+'</div></div></div>'));
			}
		});
		console.log("Star data published!" + localStorage.getItem("fav"));
	}
}

//On Page Load
$(document).ready(function()
{
	//****************INPUT BOX*****************//
	//On pressing enter key
	$( "input" ).on({
		'keypress': function(e){
			if(e.which == 13)
			{
				searchData();
				console.log("Enter key pressed");
			}
		},
	});
	//**********************************************//

	//Display existing favourites, if any
	displayFavourites();

	$("p.search_button").on( "click", searchData);	//When search button is pressed

	//Function to display data with keywords matching the user input
	function searchData()
	{
		var inputValue = $("#term").val();
		if(inputValue.trim() == '')					//If the input box is empty, clear data
		{
			clearAll();
			return;
		}

		//else search for data from data.json
		else
		{
			var key = $("#term").val().toLowerCase();
			console.log("Performing search result with " + key + "...");
			var url = "data.json";

			$.getJSON(url, function(response)
			{
				if(response.length)
				{
					$('#table_item').empty();	//Empty the div that will display the data
					var content = '';
					for(var i = 0; i < response.length; i++)
					{

						if((response[i].keywords).indexOf(key) != -1)
						{
							content += '<div class="row"><div class="column fade-in"><div>';
							//Add star to favourite
							var star = (!localStorage.getItem("fav") || JSON.parse(localStorage.getItem("fav")).indexOf(i) === -1) ? "" : "color:#408c43;"
							content += '<p class="star_button" onclick="star('+i+')"><a class="material-icons" id="star'+i+'" style="font-size: 20px;'+star+'">star</a></p>';
							content += response[i].title;   //Add title of result from JSON data
							content += '</div></div><div class="column fade-in"><div>';
							content += new DOMParser().parseFromString(response[i].body, "text/html").documentElement.textContent;
							content += '</div></div></div>';
						}
					}
					if(content == '')	//If no data found
					{
						console.log("No data found!");
					}
					else
					{
						$('#table_item').append(content);	//Display data on page
						console.log("Search data published!");
					}
				}
			});
		}   
	}

	//Function to clear all data when input box is cleared
	function clearAll()
	{
		$('#table_item').empty();
	}
});