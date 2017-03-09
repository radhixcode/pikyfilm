var imageFormatOk;
var imageSizeOk;

// Radhika Sivarajan
//Function to display the image.
function readFile(input) {

    // If the input is a file. Set path to the src of image tag id for displaying image. 
    if (input.files && input.files[0]) {

        var reader = new FileReader();
        
        reader.onload = function () {
            $('#image').attr('src', reader.result);         
        }        
        reader.readAsDataURL(input.files[0]);
    }
}

// While uploading the image.
$("#input-picture").change(function(){

	$('.message').removeClass("error").html("Format (.jpg, .png, .jpeg, .gif, .bmp) | Size max 2MB");
    
    // Get the file name and take the format (letters after '.') and convert to uppercase   
    var imageName = $("#input-picture").val();
    var extension = imageName.split('.').pop().toUpperCase();

    //If the format is not PNG JPG or JPEG and file name is empty throw an error message
    if((imageName.length < 1)||(extension!="PNG" && extension!="JPG" && extension!="JPEG" && extension!="GIF" && extension!="BMP")) {
        imageFormatOk = 0;
        $('.message').addClass("error").html("Image format should be in PNG, JPG, JPEG, GIF or BMP");
    }
    //If image in desired format check the size.
    else {
        imageFormatOk = 1;

        // If size is below 2MB (2e+6MB) call function to read the file, else throw error message.
        if ((this.files[0].size)<2e+6) {
        	imageSizeOk = 1;
        	readFile(this);        	
        }else{
        	imageSizeOk = 0;
        	$('.message').addClass("error").html("Size should be less than 2MB");
        }  
    }

});

// When click submit button sent the image for further functions
$("#submit-pic").on("click", function(event){
	
	event.preventDefault();

	var imageName = $("#input-picture").val();

    //If the image selected and in correct format and size then submit the form.
	if(imageName){	
	    if(imageFormatOk === 1 && imageSizeOk === 1) {
	        $('.message').removeClass("error").html("Sending...");
	        // $("#image-form").submit();
	    }
    }else{
    	$('.message').addClass("error").html("Upload an image");
    }

});

// Erin Glabe
// function to take the birth year and request movies from that year
function movieQuery(year) {

    // url for tmdb api that requests the top movies from a year -- inserts the given year
    var tmdbURL = "https://api.themoviedb.org/3/discover/movie?primary_release_year=" + year + "&page=1&include_video=false&include_adult=false&sort_by=popularity.desc&language=en-US&api_key=bc03fb2028c35ec867a969e54345b8a6";
    // we will use a movie counter to keep track of which response we are on
    var movieCounter = 0;

    // ajax call #1 to get the main information
    $.ajax({
        url: tmdbURL,
        method: "GET"
    }).done(function(tmdbData) {

        // ajax call #2 needed to retrieve movie poster base url, not given in first request
        $.ajax({
            url: "https://api.themoviedb.org/3/configuration?api_key=bc03fb2028c35ec867a969e54345b8a6",
            method: "GET"
        }).done(function(tmdbIMG){

            // loops through the five responses that we want
            for (var i = 0; i < 5; i++) {

                // value used from movie div ids
                movieCounter++;

                // creates a div, names it based on the movieCounter value, appends it into the html
                var movie = $("<div>")
                movie.addClass("movieDiv clearfix");
                movie.attr("id", "movie-num-" + movieCounter);
                $("#movie-display").append(movie);

                // check if the response.doc[i] object exists
                if(tmdbData.results[i] !== undefined){  

                    // If there is a title... appends it to the appropriate div
                    if (tmdbData.results[i].title !== null) {
                        $("#movie-num-" + movieCounter)
                            .append("<h2>" + tmdbData.results[i].title + "</h2>");
                    }

                    // If there is a movie poster... appends it to the appropriate div
                    if (tmdbData.results[i].poster_path !== null) {
                        $("#movie-num-" + movieCounter)
                            // the base url and size data are pulled from the second ajax request
                            .append("<img class='pull-left movie-image' src=" + tmdbIMG.images.base_url + "w185" + tmdbData.results[i].poster_path + ">");
                    }

                    // If there is a release date... appends it to the appropriate div
                    if (tmdbData.results[i].release_date !== null) {
                        $("#movie-num-" + movieCounter)
                            .append("<p><strong>Release Date: </strong>" + tmdbData.results[i].release_date + "</p>");
                    } 

                    // If there is an overview... appends it to the appropriate div
                    if (tmdbData.results[i].overview !== null) {
                        $("#movie-num-" + movieCounter)
                            .append("<p><strong>Overview : </strong>" + tmdbData.results[i].overview + "</p>");
                    }                                         
                }  
                $("#movie-display").append('<hr>');                 
            }

        });

    }); 

}

movieQuery(1990);